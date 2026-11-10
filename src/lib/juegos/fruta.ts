import { barajar } from '@/lib/azar'

export type FrutaJuego = { id: number; nombre: string; tipo: string; usuarios: number[] }
export type UsuarioJuego = { id: number; nombre: string; imagen: string | null; dificultad: number; debutArco: string | null }

/** Pregunta: «¿Quién comió X?» (respuesta: personaje) o «¿Qué fruta comió Y?» (respuesta: fruta). */
export type Pregunta = { tipo: 'usuario'; frutaId: number } | { tipo: 'fruta'; personajeId: number }

export const POR_PARTIDA = 5
export const INTENTOS = 3

export function generarPreguntas(frutas: FrutaJuego[], porId: Map<number, UsuarioJuego>, r: () => number, n: number, dificultadMax: number): Pregunta[] {
  const conocidas = frutas.filter((f) => f.usuarios.some((u) => (porId.get(u)?.dificultad ?? 9) <= dificultadMax))
  return barajar(conocidas, r).slice(0, n).map((f, i) => {
    if (i % 2 === 0) return { tipo: 'usuario', frutaId: f.id }
    const usuarios = f.usuarios.filter((u) => (porId.get(u)?.dificultad ?? 9) <= dificultadMax)
    return { tipo: 'fruta', personajeId: usuarios[Math.floor(r() * usuarios.length)] }
  })
}

/** Una respuesta vale si ese personaje ha tenido la fruta, o si esa fruta la ha tenido el personaje. */
export function esCorrecta(p: Pregunta, respuestaId: number, frutas: FrutaJuego[]) {
  if (p.tipo === 'usuario') return frutas.find((f) => f.id === p.frutaId)!.usuarios.includes(respuestaId)
  return frutas.find((f) => f.id === respuestaId)?.usuarios.includes(p.personajeId) ?? false
}
