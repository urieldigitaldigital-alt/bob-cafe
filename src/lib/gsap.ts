import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Mobile browsers fire resize events when the address bar/toolbar
  // collapses or expands during scroll — without this, ScrollTrigger
  // reacts by recalculating (and can reset) pinned sections mid-scroll,
  // which is why pinned scrub animations like the Hero can glitch or
  // fail to play through on iOS/Android Safari and Chrome.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
