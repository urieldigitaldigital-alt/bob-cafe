import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { menu, type MenuCategoryId } from "@/data/menu";

type MenuModalProps = {
  categoryId: MenuCategoryId | null;
  onClose: () => void;
};

export function MenuModal({ categoryId, onClose }: MenuModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [renderId, setRenderId] = useState<MenuCategoryId | null>(null);

  useEffect(() => {
    if (categoryId) setRenderId(categoryId);
  }, [categoryId]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!renderId || !overlay || !panel) return;

    document.body.style.overflow = "hidden";

    if (categoryId) {
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { y: 48, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.05, ease: "power3.out" },
      );
      closeBtnRef.current?.focus({ preventScroll: true });
    } else {
      gsap.to(panel, { y: 24, opacity: 0, scale: 0.98, duration: 0.35, ease: "power2.in" });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        delay: 0.05,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setRenderId(null);
          document.body.style.overflow = "";
        },
      });
    }
  }, [categoryId, renderId]);

  useEffect(() => {
    if (!categoryId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [categoryId, onClose]);

  if (!renderId) return null;
  const category = menu[renderId];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] hidden items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
      style={{ display: "none" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={category.label}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-espresso"
      >
        <div className="flex items-start justify-between border-b border-line px-7 py-6 sm:px-10 sm:py-8">
          <div>
            <span className="font-body text-xs font-medium tracking-[0.3em] text-primary uppercase">
              BOB'S
            </span>
            <h3 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-cream sm:text-5xl">
              {category.label}
            </h3>
            <p className="mt-2 max-w-sm font-body text-sm text-cream/60">{category.description}</p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mt-1 -mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-4 sm:px-10">
          <ul>
            {category.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-6 border-b border-line/70 py-5 last:border-none"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-lg text-cream">{item.name}</h4>
                    {item.tag && (
                      <span className="rounded-full border border-primary/50 px-2 py-0.5 font-body text-[10px] tracking-[0.08em] text-primary uppercase">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 max-w-sm font-body text-sm text-cream/55">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 pt-1 font-body text-sm font-medium text-cream/80">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line px-7 py-4 sm:px-10">
          <p className="font-body text-[11px] tracking-[0.05em] text-cream/35">
            Precios de referencia — actualizar en src/data/menu.ts
          </p>
        </div>
      </div>
    </div>
  );
}
