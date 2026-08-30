import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const menu = menuRef.current;
    const links = linksRef.current?.children;
    if (!menu) return;

    if (open) {
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(
        menu,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" },
      );
      if (links) {
        gsap.fromTo(
          links,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, delay: 0.25, ease: "power3.out" },
        );
      }
    } else if (menu.style.display === "flex") {
      gsap.to(menu, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => gsap.set(menu, { display: "none" }),
      });
    }
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,padding,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled
          ? "border-b border-line/60 bg-background/75 py-3 backdrop-blur-md"
          : "border-b border-transparent bg-transparent py-6",
      )}
    >
      <nav className="container-edit flex items-center justify-between">
        <a
          href="#inicio"
          className={cn(
            "font-display text-xl font-extrabold tracking-tight select-none transition-colors duration-500",
            scrolled ? "text-foreground" : "text-cream",
          )}
        >
          BOB'S
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "link-underline font-body text-[13px] font-medium tracking-[0.06em] uppercase transition-colors duration-500",
                scrolled
                  ? "text-foreground/80 hover:text-foreground"
                  : "text-cream/85 hover:text-cream",
              )}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#reservas"
          className="hidden rounded-full border border-primary/70 px-5 py-2.5 font-body text-[13px] font-medium tracking-[0.05em] text-primary uppercase transition-colors duration-300 hover:bg-primary hover:text-primary-foreground md:inline-block"
        >
          Reservar mesa
        </a>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "relative z-[60] flex h-10 w-10 items-center justify-center transition-colors duration-500 md:hidden",
            scrolled ? "text-foreground" : "text-cream",
          )}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        ref={menuRef}
        className="fixed inset-0 hidden flex-col justify-center gap-8 bg-espresso px-8 md:hidden"
        style={{ display: "none" }}
      >
        <div ref={linksRef} className="flex flex-col gap-6">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl text-cream"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#reservas"
            onClick={() => setOpen(false)}
            className="mt-4 w-fit rounded-full border border-primary px-6 py-3 font-body text-sm font-medium tracking-[0.05em] text-primary uppercase"
          >
            Reservar mesa
          </a>
        </div>
      </div>
    </header>
  );
}
