import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { siteConfig } from "@/config/site";

// The Hero's own scroll-scrubbed video/canvas was replaced by
// ScrollBackgroundVideo — a single fixed background video that scrubs with
// the whole page's scroll position, sitting behind every section including
// this one. Hero itself is now just the static title/CTA content.
export function Hero() {
  const titleRef = useRef<HTMLDivElement>(null);

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
      className="relative flex w-full flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: "calc(var(--app-vh, 1vh) * 100)" }}
    >
      <div ref={titleRef} className="flex flex-col items-center">
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

        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href="#menu"
            className="w-56 rounded-full bg-primary px-8 py-3.5 text-center font-body text-[13px] font-semibold tracking-[0.08em] text-primary-foreground uppercase transition-transform duration-300 hover:scale-[1.03]"
          >
            Ver menú
          </a>
          <a
            href="#reservas"
            className="w-56 rounded-full border border-cream/40 px-8 py-3.5 text-center font-body text-[13px] font-semibold tracking-[0.08em] text-cream uppercase transition-colors duration-300 hover:border-cream hover:bg-cream/10"
          >
            Reservar mesa
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-cream/60">
        <span className="font-body text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  );
}
