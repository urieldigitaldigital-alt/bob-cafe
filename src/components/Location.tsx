import { useEffect, useRef } from "react";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { siteConfig } from "@/config/site";

export function Location() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapQuery = encodeURIComponent(siteConfig.address.mapsQuery);
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll("[data-reveal]"),
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 75%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="ubicacion" ref={sectionRef} className="relative bg-background/50 py-20 sm:py-28 md:py-40">
      <div className="container-edit">
        <span data-reveal className="mb-4 block font-body text-xs font-medium tracking-[0.35em] text-primary uppercase">
          Ubicación
        </span>
        <h2 data-reveal className="mb-14 max-w-lg text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Encontranos
        </h2>

        <div
          data-reveal
          className="grid grid-cols-1 overflow-hidden rounded-3xl border border-line bg-secondary md:grid-cols-12"
        >
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-12 md:col-span-4">
            <div>
              <p className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                {siteConfig.name}
              </p>
              <p className="font-body text-sm tracking-[0.06em] text-primary uppercase">
                {siteConfig.tagline}
              </p>

              <div className="mt-8 flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="font-body text-sm text-foreground/70">
                    {siteConfig.address.line1}
                    <br />
                    {siteConfig.address.line2}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="font-body text-sm text-foreground/70">{siteConfig.phoneDisplay}</p>
                </div>

                <div className="flex flex-col gap-1 pl-7 font-body text-sm text-foreground/50">
                  {siteConfig.hours.map((h) => (
                    <p key={h.days}>
                      {h.days}: {h.time}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="min-h-[360px] md:col-span-8">
            <iframe
              title={`Mapa — ${siteConfig.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[360px] w-full grayscale-[20%] contrast-[1.02] md:min-h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
