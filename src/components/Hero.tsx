import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import { PlaceholderVideoNote } from "@/components/ui/Placeholder";
import { useIsMobile } from "@/hooks/useIsMobile";

// BASE_URL is "/" locally but "/bob-cafe/" on GitHub Pages — prefix every
// public/ asset reference with it so paths resolve under either.
const HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}media/hero.mp4`;

// Mobile renders the hero as a scrubbed frame sequence instead of a <video>.
// A <video> only repaints on scroll if it was ever unlocked with play(),
// and that unlock is gated behind each browser/OS's autoplay policy (which
// can silently refuse it — e.g. iOS Low Power Mode blocks autoplay even
// when muted) — no amount of priming/retrying guarantees it fires on every
// device. A canvas drawing preloaded images calls no autoplay-gated API at
// all, so it can't get stuck on one frame for that reason on any platform.
const FRAME_COUNT = 96;
const HERO_FRAME_SRC = (i: number) =>
  `${import.meta.env.BASE_URL}media/hero-mobile-frames/frame-${String(i + 1).padStart(3, "0")}.jpg`;

// How many extra viewport-heights of scroll the pinned effect spans, on top
// of the 1 viewport-height the section occupies at rest.
const SCROLL_SPAN_VH = 250;

function drawFrameOnCanvas(
  canvas: HTMLCanvasElement | null,
  images: HTMLImageElement[],
  loaded: boolean[],
  index: number,
) {
  if (!canvas || !images.length) return;

  let idx = index;
  while (idx > 0 && !loaded[idx]) idx--;
  if (!loaded[idx]) {
    idx = index;
    while (idx < images.length - 1 && !loaded[idx]) idx++;
  }
  if (!loaded[idx]) return;

  const img = images[idx];
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (!displayWidth || !displayHeight) return;

  const targetW = Math.round(displayWidth * dpr);
  const targetH = Math.round(displayHeight * dpr);
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Mimic CSS object-fit: cover, centered.
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = displayWidth / displayHeight;
  let drawWidth: number;
  let drawHeight: number;
  if (imgAspect > canvasAspect) {
    drawHeight = displayHeight;
    drawWidth = drawHeight * imgAspect;
  } else {
    drawWidth = displayWidth;
    drawHeight = drawWidth / imgAspect;
  }
  const offsetX = (displayWidth - drawWidth) / 2;
  const offsetY = (displayHeight - drawHeight) / 2;

  ctx.clearRect(0, 0, displayWidth, displayHeight);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

export function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const framesLoadedRef = useRef<boolean[]>([]);
  const lastFrameIndexRef = useRef(0);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLAnchorElement>(null);
  const reserveBtnRef = useRef<HTMLAnchorElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    setMediaReady(false);
    setMediaFailed(false);
  }, [isMobile]);

  // Desktop: scroll-scrubbed <video>.
  useEffect(() => {
    if (isMobile) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const primeState = video as HTMLVideoElement & {
      _priming?: boolean;
      _primeVideo?: () => void;
    };

    // Keeping the video technically "playing" at rate 0 (instead of
    // pausing) keeps the decode/paint pipeline alive so scroll-driven
    // currentTime updates keep rendering instead of freezing on one frame.
    const primeVideo = () => {
      if (primeState._priming || !video.paused) return;
      primeState._priming = true;
      video
        .play()
        .then(() => {
          video.playbackRate = 0;
        })
        .catch(() => {
          primeState._priming = false;
        });
    };

    primeState._primeVideo = primeVideo;

    const onLoaded = () => {
      setMediaReady(true);
      primeVideo();
    };
    const onError = () => setMediaFailed(true);

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);

    // If the video came from disk/back-forward cache, metadata can already
    // be available by the time this effect runs — the event already fired
    // and this listener missed it, so check readyState directly too.
    if (video.readyState >= 1) onLoaded();

    const failTimer = window.setTimeout(() => {
      if (video.readyState === 0) onError();
    }, 2500);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
      window.clearTimeout(failTimer);
    };
  }, [isMobile]);

  // Mobile: preload the frame sequence and paint frame 0 as soon as it's in.
  useEffect(() => {
    if (!isMobile) return;
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    framesRef.current = images;
    framesLoadedRef.current = loaded;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = HERO_FRAME_SRC(i);
      img.onload = () => {
        if (cancelled) return;
        loaded[i] = true;
        if (i === 0) {
          setMediaReady(true);
          drawFrameOnCanvas(canvasRef.current, images, loaded, 0);
        }
      };
      img.onerror = () => {
        if (cancelled || i !== 0) return;
        setMediaFailed(true);
      };
      images.push(img);
    }

    const failTimer = window.setTimeout(() => {
      if (!loaded[0]) setMediaFailed(true);
    }, 3000);

    const onResize = () => {
      drawFrameOnCanvas(
        canvasRef.current,
        framesRef.current,
        framesLoadedRef.current,
        lastFrameIndexRef.current,
      );
    };
    // A plain window "resize" listener can miss or lag the layout changes
    // mobile browsers make when their address bar collapses/expands mid-
    // scroll — a ResizeObserver on the canvas itself reacts to the actual
    // box size changing, regardless of what caused it.
    let resizeObserver: ResizeObserver | undefined;
    if (canvasRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(canvasRef.current);
    }
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(failTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      resizeObserver?.disconnect();
    };
  }, [isMobile]);

  // Scroll-driven progress. This intentionally does NOT use GSAP
  // ScrollTrigger's pin: JS-driven pinning (position: fixed + a spacer
  // element) has a long history of glitching on mobile browsers, especially
  // combined with their dynamic address bars and a smooth-scroll library.
  // Native CSS `position: sticky` (in the JSX below) is universally
  // supported and never needs JS to hold its position, so progress here is
  // just plain math derived from where the sticky track currently sits —
  // no pin/refresh machinery that can desync on a given device.
  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    const fallback = fallbackRef.current;
    const cue = scrollCueRef.current;
    const titleText = titleTextRef.current;
    const menuBtn = menuBtnRef.current;
    const reserveBtn = reserveBtnRef.current;
    const bottomFade = bottomFadeRef.current;
    if (!track) return;

    const reduced = prefersReducedMotion();

    if (cue) {
      gsap.to(cue, {
        y: 10,
        opacity: 0.4,
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    if (reduced) {
      return () => {
        gsap.killTweensOf(cue);
      };
    }

    // Reveal window: as the video reaches its own "BOB'S CAFÉ" title
    // moment, our overlay title fades and the two CTAs part ways (menu up,
    // reserve down) to frame the video's own typography.
    const REVEAL_START = 0.36;
    const REVEAL_END = 0.58;
    const REVEAL_SPAN = REVEAL_END - REVEAL_START;
    const DEPLOY_DISTANCE = 220;

    let smoothProgress = 0;

    const update = () => {
      const rect = track.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const totalScrollable = track.offsetHeight - viewportH;
      const rawProgress =
        totalScrollable > 0
          ? gsap.utils.clamp(0, 1, -rect.top / totalScrollable)
          : 0;
      // Light smoothing to approximate the old scrub feel, without any
      // dependency on GSAP's pin/refresh internals.
      smoothProgress += (rawProgress - smoothProgress) * 0.25;
      if (Math.abs(smoothProgress - rawProgress) < 0.0005) {
        smoothProgress = rawProgress;
      }
      const progress = smoothProgress;

      if (isMobile) {
        const index = Math.round(progress * (FRAME_COUNT - 1));
        lastFrameIndexRef.current = index;
        drawFrameOnCanvas(
          canvasRef.current,
          framesRef.current,
          framesLoadedRef.current,
          index,
        );
      } else if (video && video.duration && !Number.isNaN(video.duration)) {
        // If the initial priming play() never went through (e.g. it was
        // rejected while the tab wasn't focused yet), retry once the user
        // is actually scrolling — by now the tab is definitely active, so
        // the retry should succeed where the automatic one may not have.
        if (video.paused) {
          (
            video as HTMLVideoElement & { _primeVideo?: () => void }
          )._primeVideo?.();
        }
        video.currentTime = progress * video.duration;
      }

      const exitP = Math.max(0, (progress - 0.72) / 0.28);

      if (fallback) {
        gsap.set(fallback, {
          scale: 1 + progress * 0.1,
          filter: `brightness(${1 - exitP * 0.55})`,
        });
      }

      // Dissolve the video into the page background over the final stretch
      // of the pin, so it hands off to the next section with a soft blend
      // instead of a hard-edged cut.
      const maskP = Math.max(0, (progress - 0.8) / 0.2);
      if (bottomFade) {
        gsap.set(bottomFade, { opacity: maskP });
      }

      const revealP = gsap.utils.clamp(
        0,
        1,
        (progress - REVEAL_START) / REVEAL_SPAN,
      );
      const eased = gsap.parseEase("power2.inOut")(revealP);

      if (titleText) {
        gsap.set(titleText, {
          opacity: 1 - eased,
          y: -eased * 24,
          filter: `blur(${eased * 5}px)`,
        });
      }
      if (menuBtn) {
        gsap.set(menuBtn, { y: -eased * DEPLOY_DISTANCE });
      }
      if (reserveBtn) {
        gsap.set(reserveBtn, { y: eased * DEPLOY_DISTANCE });
      }

      if (cue) {
        gsap.set(cue, { opacity: progress > 0.05 ? 0 : 1 });
      }
    };

    gsap.ticker.add(update);
    // Belt-and-suspenders: some mobile browsers throttle/delay
    // requestAnimationFrame callbacks (what gsap.ticker runs on) during an
    // active touch-scroll gesture, which would leave the frame stuck even
    // though the page is visibly scrolling. A native "scroll" listener is
    // guaranteed by spec to fire on every real scroll event regardless of
    // rAF timing, so it backstops exactly that case.
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("scroll", update);
      gsap.killTweensOf(cue);
    };
  }, [mediaReady, isMobile]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const title = titleRef.current;
    if (!title) return;
    gsap.fromTo(
      title,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.3 },
    );
  }, []);

  return (
    <section
      id="inicio"
      ref={trackRef}
      className="relative w-full"
      style={{ height: `calc(var(--app-vh, 1vh) * ${100 + SCROLL_SPAN_VH})` }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden bg-espresso"
        style={{ height: "calc(var(--app-vh, 1vh) * 100)" }}
      >
        {!mediaFailed && isMobile && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            style={{
              opacity: mediaReady ? 1 : 0,
              transition: "opacity 0.6s ease",
              pointerEvents: "none",
            }}
          />
        )}

        {!mediaFailed && !isMobile && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: mediaReady ? 1 : 0, transition: "opacity 0.6s ease" }}
            src={HERO_VIDEO_SRC}
            muted
            playsInline
            preload="auto"
          />
        )}

        {(!mediaReady || mediaFailed) && (
          <div ref={fallbackRef} className="absolute inset-0">
            <PlaceholderVideoNote
              label="Cargando video…"
              tone={0}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-transparent to-espresso/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/35 via-transparent to-transparent" />

        {/* Softens just the seam at the very bottom edge at the end of the
            scroll-pin, so the handoff to the next section has no hard line —
            without covering the video itself. Starts fully transparent; see
            update() above. */}
        <div
          ref={bottomFadeRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[12%] bg-gradient-to-b from-transparent to-background opacity-0"
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <div ref={titleRef} className="flex flex-col items-center">
            <div ref={titleTextRef} className="flex flex-col items-center">
              <span className="mb-5 font-body text-xs font-medium tracking-[0.4em] text-primary uppercase">
                {siteConfig.city}
              </span>
              <h1 className="font-display text-[16vw] leading-[0.9] font-extrabold tracking-tight text-cream sm:text-[9vw] md:text-[7.5vw]">
                BOB'S
              </h1>
              <p className="mt-3 font-display text-[4vw] font-bold tracking-[0.2em] text-cream/90 uppercase sm:text-[1.8vw] md:text-[1.2vw]">
                Waffles &amp; Café
              </p>
              <p className="mt-6 max-w-md font-body text-sm text-cream/70 sm:text-base">
                {siteConfig.shortDescription}
              </p>
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <a
                ref={menuBtnRef}
                href="#menu"
                className="w-56 rounded-full bg-primary px-8 py-3.5 text-center font-body text-[13px] font-semibold tracking-[0.08em] text-primary-foreground uppercase transition-transform duration-300 hover:scale-[1.03]"
              >
                Ver menú
              </a>
              <a
                ref={reserveBtnRef}
                href="#reservas"
                className="w-56 rounded-full border border-cream/40 px-8 py-3.5 text-center font-body text-[13px] font-semibold tracking-[0.08em] text-cream uppercase transition-colors duration-300 hover:border-cream hover:bg-cream/10"
              >
                Reservar mesa
              </a>
            </div>
          </div>
        </div>

        <div
          ref={scrollCueRef}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-cream/60"
        >
          <span className="font-body text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </section>
  );
}
