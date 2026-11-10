'use client'
import { useEffect, useSyncExternalStore } from 'react'
import { hoy } from './azar'
import { guardar, leer } from './guardado'
import type { IdJuego } from './juegos/catalogo'

/** Resultado de un reto diario: si se superó y un valor numérico (intentos, aciertos…). */
export type Resultado = { gano: boolean; valor: number }
type Historial = Record<string, Resultado>

const clave = (juego: IdJuego) => `historial:${juego}`
const evento = 'fokagames:historial'

export const historial = (juego: IdJuego) => leer<Historial>(clave(juego), {})

/** Guarda el primer resultado de cada día (rejugar no lo cambia). */
export function registrar(juego: IdJuego, fecha: string, r: Resultado) {
  const h = historial(juego)
  if (h[fecha]) return
  guardar(clave(juego), { ...h, [fecha]: r })
  window.dispatchEvent(new Event(evento))
}

/** Registra el resultado del reto diario en cuanto la partida termina. */
export function useRegistrarDiario(juego: IdJuego, activo: boolean, fecha: string, r: Resultado) {
  const { gano, valor } = r
  useEffect(() => {
    if (activo) registrar(juego, fecha, { gano, valor })
  }, [juego, activo, fecha, gano, valor])
}

const diaAnterior = (f: string) => {
  const d = new Date(`${f}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function resumen(juego: IdJuego) {
  const h = historial(juego)
  const fechas = Object.keys(h).sort()
  // Racha actual: días seguidos jugando hasta hoy (o hasta ayer, si hoy aún no has jugado).
  let racha = 0
  let f = h[hoy()] ? hoy() : diaAnterior(hoy())
  while (h[f]) { racha++; f = diaAnterior(f) }
  let mejor = 0, actual = 0, previa = ''
  for (const x of fechas) {
    actual = previa && diaAnterior(x) === previa ? actual + 1 : 1
    mejor = Math.max(mejor, actual)
    previa = x
  }
  const distribucion = new Map<number, number>()
  for (const r of Object.values(h)) distribucion.set(r.valor, (distribucion.get(r.valor) ?? 0) + 1)
  return {
    jugados: fechas.length,
    ganados: Object.values(h).filter((r) => r.gano).length,
    racha,
    mejor,
    distribucion: [...distribucion.entries()].sort((a, b) => a[0] - b[0]),
  }
}

const suscribir = (cb: () => void) => {
  window.addEventListener(evento, cb)
  window.addEventListener('storage', cb)
  return () => { window.removeEventListener(evento, cb); window.removeEventListener('storage', cb) }
}

/** ¿Ya has jugado hoy el reto diario de este juego? (false en el servidor). */
export function useJugadoHoy(juego: IdJuego) {
  return useSyncExternalStore(suscribir, () => !!historial(juego)[hoy()], () => false)
}
