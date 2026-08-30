import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { PlaceholderImage } from "@/components/ui/Placeholder";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(textRef.current?.children ?? [], {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      gsap.fromTo(
        imageWrapRef.current,
        { clipPath: "inset(8% 8% 8% 8%)", opacity: 0.4 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 65%" },
        },
      );

      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="nosotros" ref={sectionRef} className="relative bg-background py-28 md:py-40">
      <div className="container-edit grid grid-cols-1 items-center gap-16 md:grid-cols-12">
        <div ref={textRef} className="md:col-span-5">
          <span className="mb-6 block font-body text-xs font-medium tracking-[0.35em] text-primary uppercase">
            Nuestra filosofía
          </span>
          <h2 className="text-balance font-display text-5xl leading-[1.02] font-bold tracking-tight text-foreground sm:text-6xl">
            Más que café.
          </h2>
          <p className="mt-8 max-w-md text-balance font-body text-base leading-relaxed text-foreground/70 sm:text-lg">
            Un lugar para empezar el día, encontrarse, trabajar, compartir y
            disfrutar algo rico. En BOB'S cada taza se prepara con calma, cada
            plato se piensa para acompañar el momento — sin apuro, sin
            fórmulas de siempre.
          </p>
          <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-foreground/50">
            Café de especialidad, waffles hechos al momento y una pastelería
            que cambia con las estaciones.
          </p>
        </div>

        <div ref={imageWrapRef} className="overflow-hidden rounded-3xl md:col-span-7">
          <div ref={imageRef} className="aspect-[4/3] w-full scale-110 sm:aspect-[16/10]">
            <PlaceholderImage
              label="Interior de BOB'S — foto de la cafetería"
              tone={2}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
