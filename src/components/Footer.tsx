import { MessageCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Menú", href: "#menu" },
  { label: "Reservas", href: "#reservas" },
  { label: "Ubicación", href: "#ubicacion" },
];

const socialLinks = [
  { label: "Instagram", href: siteConfig.socials.instagram, icon: InstagramIcon },
  { label: "WhatsApp", href: siteConfig.socials.whatsapp, icon: MessageCircle },
  { label: "Facebook", href: siteConfig.socials.facebook, icon: FacebookIcon },
  { label: "TikTok", href: siteConfig.socials.tiktok, icon: TikTokIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-background/50 pt-16 pb-8">
      <div className="container-edit flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            {siteConfig.name}
          </p>
          <p className="mt-1 font-body text-sm tracking-[0.06em] text-foreground/50 uppercase">
            {siteConfig.tagline}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link-underline font-body text-sm text-foreground/70 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-3">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground/70 transition-colors hover:border-primary hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="container-edit mt-14 border-t border-line/60 pt-6">
        <p className="font-body text-xs text-foreground/35">
          © {year} {siteConfig.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
