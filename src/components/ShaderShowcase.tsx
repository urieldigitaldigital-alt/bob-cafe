import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * A dedicated, fully-transparent band that lets the SilkBackground shader
 * show completely unblended — no cream tint on top. Gives the animation an
 * unmistakable moment instead of a subtle wash behind translucent panels.
 */
export function ShaderShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="relative flex h-[50vh] min-h-[320px] w-full items-center justify-center overflow-hidden sm:h-[60vh]"
    >
      <div ref={textRef} className="px-6 text-center">
        <span className="mb-4 block font-body text-xs font-semibold tracking-[0.5em] text-cream/80 uppercase [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
          BOB'S
        </span>
        <p className="font-display text-3xl leading-tight font-bold tracking-tight text-cream uppercase [text-shadow:0_4px_24px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl">
          Café · Brunch
          <br />
          Buenos momentos
        </p>
      </div>
    </section>
  );
}
