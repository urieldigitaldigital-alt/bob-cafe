import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { PlaceholderImage } from "@/components/ui/Placeholder";

const photos = [
  { label: "Café de especialidad", ratio: "aspect-[3/4]" },
  { label: "Waffles recién hechos", ratio: "aspect-square" },
  { label: "Platos de brunch", ratio: "aspect-[3/4]" },
  { label: "Gente disfrutando BOB'S", ratio: "aspect-square" },
  { label: "Interior de la cafetería", ratio: "aspect-[4/5]" },
  { label: "Detalles de barra", ratio: "aspect-square" },
  { label: "Mesas y ambiente", ratio: "aspect-[3/4]" },
  { label: "Terraza", ratio: "aspect-[4/5]" },
  { label: "Pastelería de autor", ratio: "aspect-square" },
];

export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      itemRefs.current.forEach((item, i) => {
        if (!item) return;

        gsap.fromTo(
          item,
          { y: 70, opacity: 0, scale: 1.04 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 90%" },
          },
        );

        gsap.to(item, {
          yPercent: i % 3 === 1 ? -6 : 6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-background/50 py-20 sm:py-28 md:py-40">
      <div className="container-edit mb-14">
        <span className="mb-4 block font-body text-xs font-medium tracking-[0.35em] text-primary uppercase">
          Galería
        </span>
        <h2 className="max-w-lg text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Un vistazo a BOB'S
        </h2>
      </div>

      <div ref={sectionRef} className="container-edit columns-2 gap-4 sm:columns-3 sm:gap-5">
        {photos.map((photo, i) => (
          <div
            key={photo.label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`mb-4 break-inside-avoid overflow-hidden rounded-2xl sm:mb-5 ${photo.ratio}`}
          >
            <PlaceholderImage
              label={photo.label}
              tone={i}
              className="h-full w-full transition-transform duration-700 ease-out hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
