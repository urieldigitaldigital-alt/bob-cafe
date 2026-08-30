/**
 * Configuración central del sitio BOB'S — Waffles & Café.
 *
 * Todos los valores marcados como PLACEHOLDER deben reemplazarse por
 * datos reales antes de publicar el sitio. Ningún dato de contacto real
 * fue provisto, por lo que no se inventó información: reemplazá estos
 * valores por los datos reales de BOB'S.
 */

export const siteConfig = {
  name: "BOB'S",
  tagline: "Waffles & Café",
  shortDescription: "Café, brunch & buenos momentos.",
  city: "Pinamar",

  /** Número de WhatsApp en formato internacional sin signos (ej: 5492255123456). PLACEHOLDER. */
  whatsappNumber: "5492255000000",

  /** Dirección — PLACEHOLDER, tomado de la bio de Instagram como referencia de formato. */
  address: {
    line1: "Av. Bunge, entre Shaw y Marco Polo",
    line2: "Pinamar, Buenos Aires, Argentina",
    mapsQuery: "Av. Bunge, Pinamar, Buenos Aires, Argentina",
  },

  /** Horarios — PLACEHOLDER. */
  hours: [
    { days: "Lunes a Viernes", time: "8:00 – 20:00" },
    { days: "Sábados, Domingos y Feriados", time: "8:30 – 21:00" },
  ],

  /** Teléfono de contacto — PLACEHOLDER. */
  phoneDisplay: "+54 9 2255 000-000",

  email: "hola@bobscafe.ar",

  socials: {
    instagram: "https://www.instagram.com/bobscafe.ar",
    whatsapp: "https://wa.me/5492255000000",
    facebook: "https://www.facebook.com/bobscafe.ar",
    tiktok: "https://www.tiktok.com/@bobscafe.ar",
  },

  nav: [
    { label: "Inicio", href: "#inicio" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Menú", href: "#menu" },
    { label: "Reservas", href: "#reservas" },
    { label: "Ubicación", href: "#ubicacion" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
