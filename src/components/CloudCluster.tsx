type CloudClusterProps = {
  flip?: boolean;
  className?: string;
};

/**
 * Grupo de nubes generado en SVG (círculos superpuestos + blur) — no
 * requiere imágenes externas. Dos instancias espejadas forman el efecto
 * de "cortina de nubes" que se abre con el scroll.
 */
export function CloudCluster({ flip, className }: CloudClusterProps) {
  const puffs = [
    { cx: 120, cy: 190, r: 95 },
    { cx: 230, cy: 150, r: 120 },
    { cx: 350, cy: 195, r: 105 },
    { cx: 460, cy: 160, r: 130 },
    { cx: 190, cy: 240, r: 90 },
    { cx: 400, cy: 245, r: 95 },
    { cx: 300, cy: 260, r: 110 },
  ];

  return (
    <svg
      viewBox="0 0 600 340"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <filter id={`cloud-blur-${flip ? "l" : "r"}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id={`cloud-shade-${flip ? "l" : "r"}`} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9e3d6" />
        </radialGradient>
      </defs>
      <g filter={`url(#cloud-blur-${flip ? "l" : "r"})`} fill={`url(#cloud-shade-${flip ? "l" : "r"})`}>
        {puffs.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
        ))}
        <rect x="0" y="230" width="600" height="110" />
      </g>
    </svg>
  );
}
