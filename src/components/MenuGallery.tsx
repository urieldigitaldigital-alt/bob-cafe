import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { menu, menuCategoryOrder, type MenuCategoryId } from "@/data/menu";
import { MenuModal } from "@/components/MenuModal";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=70&auto=format`;

/** Stock photography stand-ins — swap for real BOB'S photos in /public/images. */
const CATEGORY_IMAGE: Record<MenuCategoryId, { src: string; alt: string }> = {
  coffee: { src: UNSPLASH("1461023058943-07fcbe16d735"), alt: "Café servido en taza blanca visto desde arriba" },
  breakfast: { src: UNSPLASH("1533089860892-a7c6f0a88666"), alt: "Mesa de desayuno con variedad de platos" },
  waffles: { src: UNSPLASH("1504754524776-8f4f37790ca0"), alt: "Waffle con frutos rojos y almíbar" },
  brunch: { src: UNSPLASH("1550547660-d9450f859349"), alt: "Tostada de palta estilo brunch" },
  drinks: { src: UNSPLASH("1544145945-f90425340c7e"), alt: "Bebida fría de especialidad" },
  bakery: { src: UNSPLASH("1509440159596-0249088772ff"), alt: "Selección de pastelería de autor" },
};

export function MenuGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const carouselWrapRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<MenuCategoryId | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const slides = useMemo<CoverflowSlide[]>(
    () =>
      menuCategoryOrder.map((id) => {
        const category = menu[id];
        const featured = category.items.find((item) => item.tag)?.name ?? category.items[0]?.name;
        return {
          src: CATEGORY_IMAGE[id].src,
          alt: CATEGORY_IMAGE[id].alt,
          title: category.label,
          subtitle: category.description,
          meta: [
            { label: "Ítems", value: String(category.items.length) },
            { label: "Destacado", value: featured ?? "—" },
          ],
        };
      }),
    [],
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%" },
      });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 28, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          carouselWrapRef.current,
          { opacity: 0, y: 60, scale: 0.94, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const selectedId = menuCategoryOrder[selectedIndex];

  return (
    <section id="menu" ref={sectionRef} className="relative bg-background/40 py-20 sm:py-28 md:py-40">
      <div className="container-edit mb-10 sm:mb-14">
        <span
          ref={eyebrowRef}
          className="mb-4 block font-body text-xs font-medium tracking-[0.35em] text-primary uppercase"
        >
          Nuestro menú
        </span>
        <h2
          ref={headingRef}
          className="max-w-lg text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          Explorá la carta
        </h2>
      </div>

      <div ref={carouselWrapRef}>
        <CoverflowCarousel
          slides={slides}
          showCaption
          showNavigation
          showPagination
          label="Categorías del menú de BOB'S"
          onSelectedChange={setSelectedIndex}
          onCardActivate={(index) => setActiveModal(menuCategoryOrder[index])}
        />
      </div>

      <div ref={ctaRef} className="mt-8 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveModal(selectedId)}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[13px] font-semibold tracking-[0.08em] text-primary-foreground uppercase transition-transform duration-300 hover:scale-[1.03]"
        >
          Ver menú de {menu[selectedId].label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
        <p className="font-body text-xs text-foreground/40">
          Arrastrá o hacé clic en una categoría para explorarla
        </p>
      </div>

      <MenuModal categoryId={activeModal} onClose={() => setActiveModal(null)} />
    </section>
  );
}
