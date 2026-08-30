import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import { PlaceholderVideoNote } from "@/components/ui/Placeholder";
import { useIsMobile } from "@/hooks/useIsMobile";

const HERO_VIDEO_SRC = "/media/hero.mp4";
/** Optional portrait-oriented cut for phones — drop a file here to use it.
 * Falls back to the desktop video automatically if it isn't there yet. */
const HERO_VIDEO_SRC_MOBILE = "/media/hero-mobile.mp4";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLAnchorElement>(null);
  const reserveBtnRef = useRef<HTMLAnchorElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [mobileSourceFailed, setMobileSourceFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const videoSrc = isMobile && !mobileSourceFailed ? HERO_VIDEO_SRC_MOBILE : HERO_VIDEO_SRC;

  useEffect(() => {
    setVideoReady(false);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React doesn't reliably apply the `muted` JSX attribute as a DOM
    // property in Safari, and Safari's autoplay gate checks the property —
    // set it imperatively so the priming play() below is actually allowed.
    video.muted = true;
    video.defaultMuted = true;

    const primeState = video as HTMLVideoElement & {
      _priming?: boolean;
      _primeVideo?: () => void;
    };

    // iOS Safari stops repainting a <video> once it's fully paused, so
    // scrubbing currentTime during scroll would just freeze on one frame.
    // Keeping it technically "playing" at rate 0 (instead of pausing) keeps
    // the decode/paint pipeline alive without the video advancing on its
    // own, so scroll-driven currentTime updates render live. Guarded with
    // _priming so overlapping calls (StrictMode's double effect invocation,
    // the readyState check racing the event, a scroll-triggered retry) don't
    // fire play() concurrently — a second call while one is in flight
    // interrupts/aborts the first and leaves the video paused. If a call is
    // rejected (e.g. a backgrounded tab), the flag resets so a later retry
    // — like the one in the scroll handler below — can try again.
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
      setVideoReady(true);
      primeVideo();
    };
    const onError = () => {
      // The phone-specific cut isn't there yet — fall back to the desktop
      // video instead of showing the "no video" placeholder.
      if (videoSrc === HERO_VIDEO_SRC_MOBILE) {
        setMobileSourceFailed(true);
      } else {
        setVideoFailed(true);
      }
    };

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
  }, [videoSrc]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const fallback = fallbackRef.current;
    const cue = scrollCueRef.current;
    const titleText = titleTextRef.current;
    const menuBtn = menuBtnRef.current;
    const reserveBtn = reserveBtnRef.current;
    const bottomFade = bottomFadeRef.current;
    if (!section) return;

    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
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

      if (reduced) return;

      // Reveal window: as the video reaches its own "BOB'S CAFÉ" title
      // moment, our overlay title fades and the two CTAs part ways
      // (menu up, reserve down) to frame the video's own typography.
      const REVEAL_START = 0.36;
      const REVEAL_END = 0.58;
      const REVEAL_SPAN = REVEAL_END - REVEAL_START;
      const DEPLOY_DISTANCE = 220;

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: 0.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (video && video.duration && !Number.isNaN(video.duration)) {
            // If the initial priming play() never went through (e.g. it was
            // rejected while the tab wasn't focused yet), retry once the
            // user is actually scrolling — by now the tab is definitely
            // active, so the retry should succeed where the automatic one
            // may not have.
            if (video.paused) {
              (
                video as HTMLVideoElement & { _primeVideo?: () => void }
              )._primeVideo?.();
            }
            video.currentTime = self.progress * video.duration;
          }

          const exitP = Math.max(0, (self.progress - 0.72) / 0.28);

          if (fallback) {
            gsap.set(fallback, {
              scale: 1 + self.progress * 0.1,
              filter: `brightness(${1 - exitP * 0.55})`,
            });
          }

          // Dissolve the video into the page background over the final
          // stretch of the pin, so it hands off to the next section with a
          // soft blend instead of a hard-edged cut.
          const maskP = Math.max(0, (self.progress - 0.8) / 0.2);
          if (bottomFade) {
            gsap.set(bottomFade, { opacity: maskP });
          }

          const revealP = gsap.utils.clamp(
            0,
            1,
            (self.progress - REVEAL_START) / REVEAL_SPAN,
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
            gsap.set(cue, { opacity: self.progress > 0.05 ? 0 : 1 });
          }
        },
      });

      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, [videoReady]);

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
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-espresso"
    >
      {!videoFailed && (
        <video
          key={videoSrc}
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.6s ease" }}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
        />
      )}

      {(!videoReady || videoFailed) && (
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
          onUpdate above. */}
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
    </section>
  );
}
