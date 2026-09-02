import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import { PlaceholderVideoNote } from "@/components/ui/Placeholder";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

// BASE_URL is "/" locally but "/bob-cafe/" on GitHub Pages — prefix every
// public/ asset reference with it so paths resolve under either.
const HERO_VIDEO_SRC = `${import.meta.env.BASE_URL}media/hero.mp4`;
const HERO_VIDEO_SRC_MOBILE = `${import.meta.env.BASE_URL}media/hero-mobile.mp4`;

// How many extra viewport-heights of scroll the pinned effect spans, on top
// of the 1 viewport-height the section occupies at rest.
const SCROLL_SPAN_VH = 250;

export function Hero() {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const videoSrc = isMobile ? HERO_VIDEO_SRC_MOBILE : HERO_VIDEO_SRC;

  useEffect(() => {
    setMediaReady(false);
    setMediaFailed(false);
  }, [videoSrc]);

  // Scroll-scrubbed <video>, same mechanism on every platform.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React doesn't reliably apply the `muted`/`playsInline` JSX attributes
    // as DOM properties in Safari, and Safari's autoplay gate checks the
    // properties, not just the HTML attributes — set them imperatively so
    // the priming play() below is actually allowed.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const primeState = video as HTMLVideoElement & {
      _priming?: boolean;
      _primed?: boolean;
      _primeVideo?: () => void;
    };

    // A <video> that has never been played won't repaint on iOS Safari
    // when currentTime is set programmatically — it stays stuck on
    // whatever frame it loaded with. Briefly playing it once and pausing
    // again (the standard, widely-used fix for this) "unlocks" the decoder
    // so all later scroll-driven seeks render normally. This only needs to
    // succeed once — after that the video is left paused, which is its
    // normal/expected resting state. Exposed on the element itself so the
    // scroll-progress effect (a separate effect below) can retry it too.
    const primeVideo = () => {
      if (primeState._primed || primeState._priming) return;
      primeState._priming = true;
      video
        .play()
        .then(() => {
          video.pause();
          primeState._primed = true;
          primeState._priming = false;
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

    // Last resort: a real user gesture (a tap, a scroll) is unconditionally
    // allowed to start media playback by every browser's autoplay policy,
    // with no exceptions — unlike a programmatic play() call, which some
    // browser/OS configurations can still refuse even when muted. Only
    // needed if priming hasn't already succeeded by the time the user
    // starts interacting.
    const onFirstInteraction = () => {
      if (!primeState._primed) primeVideo();
    };
    document.addEventListener("touchstart", onFirstInteraction, {
      passive: true,
      once: true,
    });
    document.addEventListener("scroll", onFirstInteraction, {
      passive: true,
      once: true,
    });
    document.addEventListener("pointerdown", onFirstInteraction, {
      passive: true,
      once: true,
    });

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
      window.clearTimeout(failTimer);
      document.removeEventListener("touchstart", onFirstInteraction);
      document.removeEventListener("scroll", onFirstInteraction);
      document.removeEventListener("pointerdown", onFirstInteraction);
    };
  }, [videoSrc]);

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

    // prefers-reduced-motion only skips the decorative flourishes below
    // (the bouncing scroll cue, title blur/fade, button deploy) — the video
    // itself keeps scrubbing with scroll regardless. That motion is a
    // direct 1:1 response to the user's own input, not an autoplaying
    // animation, and skipping it entirely would leave the video frozen on
    // frame one for anyone with the OS-level setting on, which reads as
    // "broken", not "respecting a preference".
    const reduced = prefersReducedMotion();

    if (cue && !reduced) {
      gsap.to(cue, {
        y: 10,
        opacity: 0.4,
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
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

      if (video && video.duration && !Number.isNaN(video.duration)) {
        const primeState = video as HTMLVideoElement & {
          _primed?: boolean;
          _primeVideo?: () => void;
        };
        if (!primeState._primed) {
          // Retry the unlock while scrolling — by now the tab is
          // definitely active/focused, so it should succeed even if the
          // automatic attempt on load didn't.
          primeState._primeVideo?.();
        }
        video.currentTime = progress * video.duration;
        // Nudges the renderer on some mobile browsers that otherwise defer
        // repainting a freshly-seeked video frame until the next unrelated
        // layout pass.
        void video.offsetHeight;
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
      // instead of a hard-edged cut. Driven by rawProgress, not the eased
      // `progress` — the sticky section physically releases the instant
      // real scroll (not the smoothed value trailing behind it) reaches
      // the end of the track, so if this lagged too, a fast scroll could
      // hit that hard release before the fade had actually finished,
      // reading as the video "cutting out" mid-transition instead of
      // dissolving.
      const maskP = Math.max(0, (rawProgress - 0.75) / 0.25);
      if (bottomFade) {
        gsap.set(bottomFade, { opacity: maskP });
      }

      if (!reduced) {
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
      }
    };

    let lastTick = performance.now();
    const tick = () => {
      lastTick = performance.now();
      update();
    };
    gsap.ticker.add(tick);

    // Belt-and-suspenders: some mobile browsers throttle/delay
    // requestAnimationFrame callbacks (what gsap.ticker runs on) during an
    // active touch-scroll gesture, which would leave the frame stuck even
    // though the page is visibly scrolling. A native "scroll" listener is
    // guaranteed by spec to fire on every real scroll event regardless of
    // rAF timing. It's a genuine backstop, though — gated to only run if
    // the rAF loop hasn't ticked very recently — because otherwise both
    // fire for the same scroll movement on any device where rAF is
    // keeping up fine, applying the lerp smoothing twice for one real
    // frame and making it converge inconsistently depending on how often
    // the scroll event happens to interleave with rAF.
    const onScroll = () => {
      if (performance.now() - lastTick > 100) update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(cue);
    };
  }, [mediaReady]);

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
        {!mediaFailed && (
          <video
            key={videoSrc}
            ref={videoRef}
            className={cn(
              "absolute inset-0 h-full w-full",
              // The mobile cut frames its "BOB'S CAFÉ" title close to the
              // edges — object-cover crops whatever the screen's aspect
              // ratio doesn't match, cutting the lettering off on narrower
              // phones. object-contain always shows the full frame instead
              // (letterboxed against the dark background rather than
              // cropped). Desktop's wider, more forgiving crop keeps cover.
              isMobile ? "object-contain" : "object-cover",
            )}
            style={{ opacity: mediaReady ? 1 : 0, transition: "opacity 0.6s ease" }}
            src={videoSrc}
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
