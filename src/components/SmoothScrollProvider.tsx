import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setLenisInstance, scrollToHash } from "@/lib/lenis";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  // Mobile browsers' 100vh/100dvh handling is inconsistent (some in-app
  // WebViews don't support dvh at all), so the Hero's full-screen height
  // is driven from an actual measured pixel value instead of a CSS unit —
  // this works everywhere a CSS custom property does, which is virtually
  // every browser in use today.
  useEffect(() => {
    const setAppVh = () => {
      document.documentElement.style.setProperty(
        "--app-vh",
        `${window.innerHeight * 0.01}px`,
      );
    };
    setAppVh();
    window.addEventListener("resize", setAppVh);
    window.addEventListener("orientationchange", setAppVh);
    return () => {
      window.removeEventListener("resize", setAppVh);
      window.removeEventListener("orientationchange", setAppVh);
    };
  }, []);

  useEffect(() => {
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.("a[href^='#']");
      const href = anchor?.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      scrollToHash(href);
    };
    document.addEventListener("click", onAnchorClick);

    if (prefersReducedMotion()) {
      return () => document.removeEventListener("click", onAnchorClick);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      setLenisInstance(null);
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);

  return <>{children}</>;
}
