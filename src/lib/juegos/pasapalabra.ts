import type { EntradaRosco, Personaje } from '@/lib/types'
import { barajar } from '@/lib/azar'
import { formatoBerry, normalizar } from '@/lib/texto'

export const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/** Palabras del nombre que sirven de respuesta (sin «D.», partículas ni números). */
const palabras = (nombre: string) => normalizar(nombre).split(' ').filter((w) => w.length >= 3 && !/^\d+$/.test(w))

/** Datos de un personaje que pueden servir de definición (de más a menos reveladores), sin delatar la respuesta. */
function pistasDe(p: Personaje, prohibidas: string[]): string[] {
  const otra = (t: string) => !prohibidas.some((w) => normalizar(t).split(' ').includes(w))
  const datos: string[] = []
  const oc = p.ocupaciones.find((o) => !['Pirata', 'Civil', 'Animal', 'Animal salvaje'].includes(o))
  const af = p.afiliaciones.find(otra)
  if (oc && af) datos.push(`${oc} de ${af}`)
  else if (af) datos.push(`Miembro de ${af}`)
  else if (oc) datos.push(oc)
  if (p.frutas[0] && otra(p.frutas[0])) datos.push(`Comió la ${p.frutas[0]}`)
  const raza = p.razas.find((r) => r !== 'Humano')
  if (raza) datos.push(`De raza ${raza.toLowerCase()}`)
  if ((p.recompensa ?? 0) >= 1e8) datos.push(`Recompensa de ${formatoBerry(p.recompensa!)}`)
  if (p.islaOrigen && otra(p.islaOrigen)) datos.push(`Nació en ${p.islaOrigen}`)
  else if (p.origen && !['Desconocido', 'Grand Line'].includes(p.origen)) datos.push(`Nació en ${p.origen}`)
  if (p.debutArco && otra(p.debutArco)) datos.push(`Aparece por primera vez en ${p.debutArco}`)
  return datos.filter(otra)
}

/**
 * Rosco generado desde OPBD: una palabra del nombre de un personaje por letra.
 * «Empieza por» si hay candidato; si no, «Contiene».
 */
export function generarRosco(personajes: Personaje[], r: () => number): EntradaRosco[] {
  const usados = new Set<number>()
  const candidatos = barajar([...personajes].sort((a, b) => a.dificultad - b.dificultad).filter((p) => p.dificultad <= 3), r)
    .sort((a, b) => Math.min(a.dificultad, 3) - Math.min(b.dificultad, 3))
  const entradas: EntradaRosco[] = []
  for (const letra of LETRAS) {
    const l = letra.toLowerCase()
    const elegir = (contiene: boolean) => {
      for (const p of candidatos) {
        if (usados.has(p.id)) continue
        const ws = palabras(p.nombre)
        // «Empieza por»: el primer o el último nombre (Luffy, Zoro, Hancock); «Contiene»: cualquiera.
        const w = contiene ? ws.find((x) => x.includes(l)) : [ws[0], ws.at(-1)].find((x) => x?.startsWith(l))
        if (!w) continue
        const datos = pistasDe(p, ws)
        if (datos.length < 2) continue
        usados.add(p.id)
        return { letra, contiene, definicion: barajar(datos.slice(0, 3), r).join('. ') + '.', respuesta: p.nombre, personaje: p.nombre, alternativas: p.alias }
      }
      return null
    }
    const e = elegir(false) ?? elegir(true)
    if (e) entradas.push(e)
  }
  return entradas
}

/**
 * Vale la respuesta exacta, el nombre completo, cualquier palabra del nombre (p. ej. «Sanji» para «Vinsmoke Sanji»)
 * o un alias conocido.
 */
export function esCorrecta(e: EntradaRosco, intento: string) {
  const i = normalizar(intento)
  if (!i) return false
  const sinEspacios = (x: string) => normalizar(x).replace(/ /g, '')
  const formas = [e.respuesta, ...(e.alternativas ?? [])]
  if (formas.some((f) => sinEspacios(f) === i.replace(/ /g, ''))) return true
  // Respuesta de varias palabras: basta con una de ellas (de 3 letras o más).
  if (palabras(e.respuesta).length > 1 && palabras(e.respuesta).includes(i)) return true
  // Al revés: si escribe el nombre completo y la respuesta es una sola palabra de él.
  return i.split(' ').length > 1 && i.split(' ').includes(normalizar(e.respuesta))
}
