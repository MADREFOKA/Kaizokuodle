'use client'
import { useJugadoHoy } from '@/lib/estadisticas'
import type { IdJuego } from '@/lib/juegos/catalogo'

/** «Reto diario» o «Hecho hoy» si ya lo has terminado. */
export function EtiquetaDiario({ id, color }: { id: IdJuego; color: string }) {
  const hecho = useJugadoHoy(id)
  return hecho ? (
    <span className="rounded-full px-3 py-1 text-xs font-bold text-mar" style={{ background: color }}>✓ Hecho hoy</span>
  ) : (
    <span className="rounded-full bg-mar/70 px-3 py-1 text-xs font-bold" style={{ color }}>Reto diario</span>
  )
}
