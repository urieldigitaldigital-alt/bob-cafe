import { Camera, Film } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = [
  "from-[#3a2a1c] via-[#1a140d] to-[#b5502c]/40",
  "from-[#4a3520] via-[#1a140d] to-[#d3a44c]/30",
  "from-[#2a1f16] via-[#14100b] to-[#8a5a34]/40",
  "from-[#3a2416] via-[#1a140d] to-[#c1592f]/30",
] as const;

type PlaceholderImageProps = {
  label: string;
  src?: string;
  alt?: string;
  tone?: number;
  className?: string;
  imgClassName?: string;
};

/**
 * Placeholder fotográfico premium. Si se provee `src`, renderiza la imagen
 * real. Caso contrario, muestra un fondo degradado en la paleta de marca
 * con una etiqueta indicando qué foto reemplazar.
 */
export function PlaceholderImage({
  label,
  src,
  alt,
  tone = 0,
  className,
  imgClassName,
}: PlaceholderImageProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <img
          src={src}
          alt={alt ?? label}
          loading="lazy"
          decoding="async"
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </div>
    );
  }

  const gradient = TONES[tone % TONES.length];

  return (
    <div
      className={cn(
        "relative flex items-start overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
      role="img"
      aria-label={alt ?? label}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]">
        <Camera className="h-1/3 w-1/3 text-cream" strokeWidth={0.75} />
      </div>
      <div className="noise-overlay pointer-events-none absolute inset-0" />
      <span className="relative z-10 m-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 truncate rounded-full border border-cream/20 bg-black/30 px-3 py-1 font-body text-[10px] font-medium tracking-[0.12em] text-cream/70 uppercase backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}

type PlaceholderVideoProps = {
  label: string;
  tone?: number;
  className?: string;
};

/** Placeholder para secciones de video cuando aún no hay metraje real cargado. */
export function PlaceholderVideoNote({ label, tone = 0, className }: PlaceholderVideoProps) {
  const gradient = TONES[tone % TONES.length];
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      <div className="noise-overlay absolute inset-0" />
      <div className="absolute right-5 bottom-5 left-5 z-10 flex items-center gap-2 sm:right-auto sm:max-w-xs">
        <Film className="h-3.5 w-3.5 shrink-0 text-cream/35" strokeWidth={1.5} />
        <span className="font-body text-[10px] tracking-[0.1em] text-cream/35 uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
