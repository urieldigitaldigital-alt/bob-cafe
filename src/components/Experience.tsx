import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import CardFanCarousel, { type CardItem } from "@/components/ui/card-fan-carousel";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=500&h=860&fit=crop&q=70&auto=format`;

/** Stock photography stand-ins — swap for real BOB'S photos in /public/images. */
const EXPERIENCE_CARDS: CardItem[] = [
  { imgUrl: UNSPLASH("1509785307050-d4066910ec1e"), alt: "Barista sirviendo café de especialidad" },
  { imgUrl: UNSPLASH("1525351484163-7529414344d8"), alt: "Mesa de brunch servida" },
  { imgUrl: UNSPLASH("1562376552-0d160a2f238d"), alt: "Waffle con frutas frescas" },
  { imgUrl: UNSPLASH("1445116572660-236099ec97a0"), alt: "Terraza y ambiente de la cafetería" },
  { imgUrl: UNSPLASH("1517686469429-8bdb88b9f907"), alt: "Pastelería de autor recién horneada" },
  { imgUrl: UNSPLASH("1521017432531-fbd92d768814"), alt: "Gente compartiendo un buen momento" },
  { imgUrl: UNSPLASH("1453614512568-c4024d13c247"), alt: "Detalle de la barra de café" },
  { imgUrl: UNSPLASH("1495474472287-4d71bcdd2085"), alt: "Latte art visto desde arriba" },
  { imgUrl: UNSPLASH("1587049352846-4a222e784d38"), alt: "Selección de facturas y medialunas" },
  { imgUrl: UNSPLASH("1517244683847-7456b63c5969"), alt: "Panqueques apilados con almíbar" },
  { imgUrl: UNSPLASH("1442512595331-e89e73853f31"), alt: "Café de filtro preparado a mano" },
  { imgUrl: UNSPLASH("1414235077428-338989a2e8c0"), alt: "Interior cálido de la cafetería" },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        },
      );
    }, section);

    // Mount the fan carousel only once it scrolls into view, so its
    // built-in entrance animation plays for the user instead of firing
    // off-screen at page load.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(section);

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background/50 py-20 sm:py-28 md:py-40">
      <div
        ref={headingRef}
        className="container-edit mb-10 flex flex-col items-start justify-between gap-6 md:mb-4 md:flex-row md:items-end"
      >
        <h2 className="max-w-xl text-balance font-display text-4xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-5xl">
          La experiencia BOB'S
        </h2>
        <p className="max-w-xs font-body text-sm text-foreground/50">
          Café de especialidad, brunch, waffles y buenos momentos — la razón
          por la que volvés.
        </p>
      </div>

      {inView && <CardFanCarousel cards={EXPERIENCE_CARDS} />}
    </section>
  );
}
