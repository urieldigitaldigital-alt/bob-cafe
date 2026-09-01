import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

// BASE_URL is "/" locally but "/bob-cafe/" on GitHub Pages.
const DESKTOP_SRC = `${import.meta.env.BASE_URL}media/bg-desktop.mp4`;
const MOBILE_SRC = `${import.meta.env.BASE_URL}media/bg-mobile.mp4`;
const MOBILE_QUERY = "(max-width: 767px)";

const SMOOTHING = 0.08; // 0-1, lower = slower/more ambient drift
const SNAP_EPSILON = 0.0006;
const SEEK_EPSILON = 0.08; // seconds; avoids reseeking for negligible deltas

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

// Only seek to a time that's already downloaded; if the target isn't
// buffered yet, return the nearest buffered edge instead of doing nothing
// (which would otherwise leave the frame stuck on a fast scroll jump).
function resolveBufferedTime(
  video: HTMLVideoElement,
  time: number,
): number | null {
  const buffered = video.buffered;
  let nearest: number | null = null;
  let nearestDist = Infinity;
  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i);
    const end = buffered.end(i);
    if (time >= start && time <= end) return time;
    const edge = time < start ? start : end;
    const dist = Math.abs(time - edge);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = edge;
    }
  }
  return nearest;
}

export function ScrollBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React doesn't reliably apply the `muted` JSX attribute as a DOM
    // property in Safari, and Safari's autoplay gate checks the property —
    // set it imperatively so the priming play() below is actually allowed.
    video.muted = true;
    video.defaultMuted = true;

    const primeState = video as HTMLVideoElement & { _priming?: boolean };
    // iOS Safari stops repainting a <video> once it's fully paused, so
    // scrubbing currentTime during scroll would just freeze on one frame.
    // Keeping it technically "playing" at rate 0 (instead of pausing) keeps
    // the decode/paint pipeline alive without the video advancing on its
    // own.
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

    const onLoaded = () => primeVideo();
    video.addEventListener("loadedmetadata", onLoaded);

    // Reactive mobile/desktop source swap. A <source media="..."> child is
    // only evaluated once when the video loads — this reacts live to
    // window resize and orientation changes instead.
    const mql = window.matchMedia(MOBILE_QUERY);
    let activeSrc = "";
    const syncSource = () => {
      const src = mql.matches ? MOBILE_SRC : DESKTOP_SRC;
      if (activeSrc === src) return;
      activeSrc = src;
      video.src = src;
      video.load();
    };
    syncSource();
    if (video.readyState >= 1) onLoaded();

    mql.addEventListener("change", syncSource);
    window.addEventListener("resize", syncSource);

    if (prefersReducedMotion()) {
      return () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        mql.removeEventListener("change", syncSource);
        window.removeEventListener("resize", syncSource);
      };
    }

    let current = 0;
    let lastTick = performance.now();
    let rafId = 0;

    const step = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const target = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;

      // Pursue the target with an eased value instead of jumping straight
      // to it, so the video drifts rather than snapping 1:1 with scroll.
      let next = current + (target - current) * SMOOTHING;
      if (Math.abs(target - next) < SNAP_EPSILON) next = target;
      current = next;

      const duration = video.duration;
      if (isFinite(duration) && duration > 0) {
        const desired = next * duration;
        const seekTarget = resolveBufferedTime(video, desired);
        if (
          seekTarget !== null &&
          Math.abs(video.currentTime - seekTarget) > SEEK_EPSILON
        ) {
          video.currentTime = seekTarget;
        }
      }
      if (video.paused) primeVideo();
    };

    const tick = () => {
      lastTick = performance.now();
      step();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // rAF is throttled/suspended in background or hidden tabs — this
    // low-frequency interval keeps the scrub alive there, only acting if
    // the rAF loop hasn't ticked recently (so it's a no-op the rest of the
    // time, never fighting the rAF loop).
    const intervalId = window.setInterval(() => {
      if (performance.now() - lastTick > 200) step();
    }, 150);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearInterval(intervalId);
      video.removeEventListener("loadedmetadata", onLoaded);
      mql.removeEventListener("change", syncSource);
      window.removeEventListener("resize", syncSource);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden bg-black"
      style={{ zIndex: 0, pointerEvents: "none" }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        style={{ transform: "scale(1.05)", opacity: 0.45 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,.35), rgba(0,0,0,.25))",
        }}
      />
    </div>
  );
}
