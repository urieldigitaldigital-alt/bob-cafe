import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { menu, menuCategoryOrder, type MenuCategoryId } from "@/data/menu";
import { PlaceholderImage } from "@/components/ui/Placeholder";
import { MenuModal } from "@/components/MenuModal";

const EXIT_START = 0.7;
const ENTER_SPAN = 0.3;

export function MenuShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const plateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeModal, setActiveModal] = useState<MenuCategoryId | null>(null);
  const categories = menuCategoryOrder;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = prefersReducedMotion();
    const n = categories.length;

    const applyStatic = () => {
      categories.forEach((_, i) => {
        const plate = plateRefs.current[i];
        const copy = copyRefs.current[i];
        const visible = i === 0;
        gsap.set(plate, { opacity: visible ? 1 : 0, scale: 1, rotate: 0 });
        gsap.set(copy, { opacity: visible ? 1 : 0, y: 0 });
      });
    };

    if (reduced) {
      applyStatic();
      return;
    }

    const ctx = gsap.context(() => {
      const segmentMax = n - ENTER_SPAN;

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${n * 75}%`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const segment = self.progress * segmentMax;

          categories.forEach((_, i) => {
            const local = segment - i;
            const plate = plateRefs.current[i];
            const copy = copyRefs.current[i];
            if (!plate || !copy) return;

            let opacity: number;
            let scale: number;
            let rotate: number;

            if (local < -ENTER_SPAN) {
              opacity = 0;
              scale = 1.15;
              rotate = 0;
            } else if (local < 0) {
              const t = (local + ENTER_SPAN) / ENTER_SPAN;
              opacity = t;
              scale = 1.15 - t * 0.15;
              rotate = 0;
            } else if (local < EXIT_START) {
              const t = local / EXIT_START;
              opacity = 1;
              scale = 1;
              rotate = t * 360;
            } else if (local < 1) {
              const t = (local - EXIT_START) / (1 - EXIT_START);
              opacity = 1 - t;
              scale = 1 - t * 0.2;
              rotate = 360;
            } else {
              opacity = 0;
              scale = 0.8;
              rotate = 360;
            }

            gsap.set(plate, { opacity, scale, rotate });
            gsap.set(copy, {
              opacity,
              y: (1 - opacity) * 16,
            });
          });
        },
      });

      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, [categories]);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-espresso"
    >
      <div className="pointer-events-none absolute top-10 left-1/2 z-20 -translate-x-1/2 text-center">
        <span className="font-body text-xs font-medium tracking-[0.4em] text-primary uppercase">
          Nuestro menú
        </span>
      </div>

      <div className="relative flex h-full w-full items-center justify-center">
        {categories.map((id, i) => {
          const category = menu[id];
          return (
            <div
              key={id}
              ref={(el) => {
                copyRefs.current[i] = el;
              }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 opacity-0"
            >
              <h3 className="font-display text-[13vw] leading-none font-bold tracking-tight text-cream sm:text-7xl md:text-8xl">
                {category.label}
              </h3>

              <div
                ref={(el) => {
                  plateRefs.current[i] = el;
                }}
                className="my-8 h-[46vw] w-[46vw] max-h-[360px] max-w-[360px] sm:h-72 sm:w-72"
                style={{ willChange: "transform, opacity" }}
              >
                <PlaceholderImage
                  label={`Plato — ${category.label}`}
                  tone={i}
                  className="h-full w-full rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]"
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(id)}
                className="group inline-flex items-center gap-2 font-body text-sm font-medium tracking-[0.1em] text-cream uppercase"
              >
                Ver menú
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {categories.map((id) => (
          <span key={id} className="h-1 w-6 rounded-full bg-cream/20" />
        ))}
      </div>

      <MenuModal categoryId={activeModal} onClose={() => setActiveModal(null)} />
    </section>
  );
}
