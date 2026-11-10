import type { IdJuego } from '@/lib/juegos/catalogo'

/** Iconos propios de cada juego (trazo redondeado, 48×48). */
export function Icono({ id, color, size = 48 }: { id: IdJuego; color: string; size?: number }) {
  const t = { fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const f = { fill: color }
  const dibujo: Record<IdJuego, React.ReactNode> = {
    adivina: <>
      <circle cx="24" cy="17" r="8" {...t} />
      <path d="M9 41c2-9 8-13 15-13s13 4 15 13" {...t} />
      <path d="M33 6c2-3 7-3 8 0s-3 4-3 6" {...t} strokeWidth={2.5} /><circle cx="38" cy="16" r="1.6" {...f} />
    </>,
    grid: <>
      <rect x="7" y="7" width="34" height="34" rx="5" {...t} />
      <path d="M18.5 7v34M29.5 7v34M7 18.5h34M7 29.5h34" {...t} strokeWidth={2.5} />
      <rect x="20.5" y="20.5" width="7" height="7" rx="1.5" {...f} />
    </>,
    conexiones: <>
      {[[14, 14], [34, 14], [14, 34], [34, 34]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="6" {...t} />)}
      <path d="M20 14h8M14 20v8M34 20v8M20 34h8" {...t} strokeWidth={2.5} />
    </>,
    bingo: <>
      <rect x="8" y="6" width="32" height="36" rx="5" {...t} />
      {[16, 24, 32].flatMap((x) => [17, 25, 33].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={x === 24 && y === 25 ? 3.5 : 2} {...f} />))}
    </>,
    fruta: <>
      <path d="M24 14c-9 0-15 6-15 14s7 14 15 14 15-6 15-14-6-14-15-14Z" {...t} />
      <path d="M17 28c0-4 3-6 6-6s5 2 5 5-2 4-4 4-3-1-3-3" {...t} strokeWidth={2.5} />
      <path d="M24 14c0-4 2-7 6-8M24 13c-3-3-7-3-9-1" {...t} strokeWidth={2.5} />
    </>,
    recompensas: <>
      <rect x="10" y="5" width="28" height="38" rx="3" {...t} />
      <circle cx="24" cy="20" r="6" {...t} strokeWidth={2.5} />
      <path d="M16 33h16M18 38h12" {...t} strokeWidth={2.5} />
    </>,
    cronologia: <>
      <path d="M8 24h32" {...t} />
      {[12, 24, 36].map((x) => <circle key={x} cx={x} cy="24" r="4.5" fill="#0e1530" stroke={color} strokeWidth={3} />)}
      <path d="M12 12v6M24 30v6M36 12v6" {...t} strokeWidth={2.5} />
    </>,
    escena: <>
      <rect x="6" y="9" width="36" height="30" rx="4" {...t} />
      <path d="M6 31l10-9 8 7 6-5 12 9" {...t} strokeWidth={2.5} />
      <circle cx="33" cy="18" r="3" {...f} />
    </>,
    pasapalabra: <>
      <circle cx="24" cy="24" r="16" {...t} strokeDasharray="4 5" />
      <circle cx="24" cy="8" r="3.5" {...f} />
      <path d="M19 28l5-11 5 11M20.5 25h7" {...t} strokeWidth={2.5} />
    </>,
  }
  return <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>{dibujo[id]}</svg>
}
