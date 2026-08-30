import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Calendar, Clock, MessageCircle, MessageSquareText, User, Users } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { siteConfig } from "@/config/site";

function formatDateEs(isoDate: string) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

type FieldProps = {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
};

function Field({ id, label, icon, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-1.5 font-body text-[11px] font-semibold tracking-[0.1em] text-foreground/55 uppercase"
      >
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

export function Reservation() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [people, setPeople] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

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
          scrollTrigger: { trigger: section, start: "top 78%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const lines = [
      `Hola ${siteConfig.name}! Quiero reservar una mesa.`,
      `Nombre: ${name}`,
      `Personas: ${people}`,
      `Fecha: ${formatDateEs(date)}`,
      `Hora: ${time}`,
    ];

    if (message.trim()) {
      lines.push(`Mensaje: ${message.trim()}`);
    }

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-background px-4 py-3 font-body text-[15px] text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-primary sm:text-base";

  return (
    <section id="reservas" ref={sectionRef} className="relative bg-background/50 py-20 sm:py-28 md:py-40">
      <div className="container-edit grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <span
            data-reveal
            className="mb-5 block font-body text-xs font-semibold tracking-[0.35em] text-primary uppercase"
          >
            Reservas
          </span>
          <h2
            data-reveal
            className="text-balance font-display text-4xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Reservá tu mesa
          </h2>
          <p
            data-reveal
            className="mt-5 max-w-sm font-body text-[15px] leading-relaxed text-foreground/60 sm:text-base"
          >
            Completá el formulario y te vas a comunicar directo por WhatsApp
            con nosotros para confirmar tu reserva.
          </p>
        </div>

        <form
          data-reveal
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-3xl border border-line bg-secondary/60 p-5 shadow-sm sm:p-8 md:col-span-6 md:col-start-7"
        >
          <Field id="res-name" label="Nombre" icon={<User className="h-3.5 w-3.5" />}>
            <input
              id="res-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <Field id="res-people" label="Personas" icon={<Users className="h-3.5 w-3.5" />}>
              <input
                id="res-people"
                type="number"
                min={1}
                max={20}
                required
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="res-time" label="Hora" icon={<Clock className="h-3.5 w-3.5" />}>
              <input
                id="res-time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field id="res-date" label="Fecha" icon={<Calendar className="h-3.5 w-3.5" />}>
            <input
              id="res-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field
            id="res-message"
            label="Mensaje opcional"
            icon={<MessageSquareText className="h-3.5 w-3.5" />}
          >
            <textarea
              id="res-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Alguna aclaración para tu reserva..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 font-body text-sm font-semibold tracking-[0.06em] text-primary-foreground uppercase transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] sm:w-fit sm:rounded-full"
          >
            <MessageCircle className="h-4 w-4" />
            Reservar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
