import { sufijoSpoiler } from './contexto'

/** localStorage tolerante a fallos (modo privado, almacenamiento bloqueado). */
export function leer<T>(clave: string, porDefecto: T): T {
  try {
    const v = localStorage.getItem(`fokagames:${clave}`)
    return v === null ? porDefecto : (JSON.parse(v) as T)
  } catch {
    return porDefecto
  }
}

export function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(`fokagames:${clave}`, JSON.stringify(valor))
  } catch {}
}

/** Progreso del reto diario: solo vale si es del mismo día. */
export function leerDiario<T>(juego: string, fecha: string): T | null {
  const g = leer<{ fecha: string; estado: T } | null>(`${juego}:diario${sufijoSpoiler()}`, null)
  return g?.fecha === fecha ? g.estado : null
}

export const guardarDiario = (juego: string, fecha: string, estado: unknown) => guardar(`${juego}:diario${sufijoSpoiler()}`, { fecha, estado })
