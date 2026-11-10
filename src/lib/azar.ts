/** Generador determinista (mulberry32): mismo día → misma partida para todos. */
export function rng(semilla: number) {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Fecha del día en España (AAAA-MM-DD): el reto diario cambia a medianoche de Madrid. */
export const hoy = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())

export const elegir = <T,>(lista: T[], r: () => number) => lista[Math.floor(r() * lista.length)]

/** Copia barajada (Fisher-Yates) con el generador dado. */
export function barajar<T>(lista: readonly T[], r: () => number): T[] {
  const a = [...lista]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Generador del reto diario de un juego: mismo juego + mismo día = misma partida. */
export const rngDiario = (juego: string, fecha = hoy()) => rng(hash(`${juego}:${fecha}`))
