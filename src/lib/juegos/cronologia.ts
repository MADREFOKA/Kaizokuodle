import { barajar } from '@/lib/azar'

export type ConDebut = { id: number; nombre: string; imagen: string | null; debutCap: number; debutArco: string; dificultad: number }

export const TAMANO = 6

/** 6 personajes de arcos distintos (para que el orden sea deducible), en orden aleatorio. */
export function generarRonda(personajes: ConDebut[], r: () => number, dificultadMax: number): ConDebut[] {
  const vistos = new Set<string>()
  const elegidos: ConDebut[] = []
  for (const p of barajar(personajes.filter((p) => p.dificultad <= dificultadMax), r)) {
    if (vistos.has(p.debutArco)) continue
    vistos.add(p.debutArco)
    elegidos.push(p)
    if (elegidos.length === TAMANO) break
  }
  return elegidos
}

/** Para cada posición, ¿el personaje está en su sitio? */
export function corregir(orden: ConDebut[]): boolean[] {
  const correcto = [...orden].sort((a, b) => a.debutCap - b.debutCap)
  return orden.map((p, i) => p.id === correcto[i].id)
}
