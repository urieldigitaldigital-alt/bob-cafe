import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { CloudCluster } from "@/components/CloudCluster";
import { PlaceholderVideoNote } from "@/components/ui/Placeholder";

/**
 * Video de fondo — PLACEHOLDER. Reemplazar por metraje real en
 * /public/media/transition.mp4 (terraza, exterior del local, gente
 * disfrutando un café).
 */
const TRANSITION_VIDEO_SRC = "/media/transition.mp4";

export function ScrollVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const leftCloudRef = useRef<HTMLDivElement>(null);
  const rightCloudRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setVideoReady(true);
    const onError = () => setVideoFailed(true);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);
    const failTimer = window.setTimeout(() => {
      if (video.readyState === 0) setVideoFailed(true);
    }, 2500);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
      window.clearTimeout(failTimer);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const fallback = fallbackRef.current;
    const leftCloud = leftCloudRef.current;
    const rightCloud = rightCloudRef.current;
    const text = textRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set([leftCloud, rightCloud], { xPercent: (i) => (i === 0 ? -140 : 140) });
      gsap.set(text, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          if (video && video.duration && !Number.isNaN(video.duration)) {
            video.currentTime = p * video.duration;
          }
          if (fallback) {
            gsap.set(fallback, { scale: 1.08 - p * 0.08 });
          }

          gsap.set(leftCloud, { xPercent: -p * 145, y: -p * 20 });
          gsap.set(rightCloud, { xPercent: p * 145, y: -p * 20 });

          const textP = Math.min(p / 0.75, 1);
          gsap.set(text, {
            opacity: textP,
            y: 24 * (1 - textP),
            filter: `blur(${(1 - textP) * 4}px)`,
          });
        },
      });

      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, [videoReady]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-espresso"
      aria-label="Bienvenida a BOB'S"
    >
      {!videoFailed && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.6s ease" }}
          src={TRANSITION_VIDEO_SRC}
          muted
          playsInline
          preload="metadata"
        />
      )}

      {(!videoReady || videoFailed) && (
        <div ref={fallbackRef} className="absolute inset-0">
          <PlaceholderVideoNote
            label="Video transición — reemplazar en /public/media/transition.mp4 (terraza, exterior, gente disfrutando un café)"
            tone={1}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-espresso/40 via-transparent to-espresso/50" />

      <div
        ref={leftCloudRef}
        className="pointer-events-none absolute top-1/2 left-[-15%] w-[75vw] max-w-3xl -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <CloudCluster className="w-full" />
      </div>
      <div
        ref={rightCloudRef}
        className="pointer-events-none absolute top-1/2 right-[-15%] w-[75vw] max-w-3xl -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <CloudCluster flip className="w-full" />
      </div>

      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center opacity-0"
      >
        <h2 className="font-display text-[9vw] leading-[0.95] font-bold tracking-tight text-cream sm:text-6xl md:text-7xl">
          Bienvenidos a BOB'S
        </h2>
        <p className="mt-4 font-body text-sm tracking-[0.3em] text-primary uppercase sm:text-base">
          Café · Brunch · Waffles
        </p>
      </div>
    </section>
  );
}
