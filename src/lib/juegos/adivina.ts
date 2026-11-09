import type { Personaje } from '@/lib/types'
import { formatoAltura, formatoBerry, formatoBerryCorto } from '@/lib/texto'

export type Estado = 'acierto' | 'parcial' | 'fallo'
export type Direccion = 'arriba' | 'abajo' | null
export type Celda = { texto: string; detalle?: string; titulo?: string; estado: Estado; direccion: Direccion }

type Columna = {
  clave: string
  titulo: string
  comparar: (intento: Personaje, objetivo: Personaje) => Celda
}

const lista = (v: string[], vacio: string) => (v.length ? v.join(', ') : vacio)

function conjunto(get: (p: Personaje) => string[], vacio: string) {
  return (i: Personaje, o: Personaje): Celda => {
    const a = get(i), b = new Set(get(o))
    const iguales = a.length === b.size && a.every((x) => b.has(x))
    const comparten = a.some((x) => b.has(x))
    return { texto: lista(a, vacio), estado: iguales ? 'acierto' : comparten ? 'parcial' : 'fallo', direccion: null }
  }
}

function categoria(get: (p: Personaje) => string | null) {
  return (i: Personaje, o: Personaje): Celda => {
    const a = get(i) ?? 'Desconocido'
    return { texto: a, estado: a === (get(o) ?? 'Desconocido') ? 'acierto' : 'fallo', direccion: null }
  }
}

/** Numérico con flecha: indica si el objetivo está por encima o por debajo. */
function numero(get: (p: Personaje) => number | null, formato: (n: number) => string, vacio: string, nuloEsCero = false) {
  return (i: Personaje, o: Personaje): Celda => {
    const norm = (p: Personaje) => get(p) ?? (nuloEsCero ? 0 : null)
    const a = norm(i), b = norm(o)
    const texto = get(i) == null ? vacio : formato(get(i)!)
    if (a === b) return { texto, estado: 'acierto', direccion: null }
    if (a == null || b == null) return { texto, estado: 'fallo', direccion: null }
    return { texto, estado: 'fallo', direccion: b > a ? 'arriba' : 'abajo' }
  }
}

export const COLUMNAS: Columna[] = [
  { clave: 'sexo', titulo: 'Sexo', comparar: categoria((p) => p.sexo) },
  { clave: 'raza', titulo: 'Raza', comparar: conjunto((p) => p.razas, 'Desconocida') },
  { clave: 'afiliacion', titulo: 'Afiliación', comparar: conjunto((p) => p.afiliaciones, 'Ninguna') },
  { clave: 'fruta', titulo: 'Fruta del diablo', comparar: conjunto((p) => p.frutaTipos, 'Ninguna') },
  { clave: 'haki', titulo: 'Haki', comparar: conjunto((p) => p.haki, 'Ninguno') },
  { clave: 'recompensa', titulo: 'Recompensa', comparar: (i, o) => ({ ...numero((p) => p.recompensa, formatoBerryCorto, 'Sin recompensa', true)(i, o), titulo: i.recompensa ? formatoBerry(i.recompensa) : undefined }) },
  { clave: 'altura', titulo: 'Altura', comparar: numero((p) => p.altura, formatoAltura, 'Desconocida') },
  { clave: 'origen', titulo: 'Origen', comparar: categoria((p) => p.origen) },
  {
    clave: 'debut',
    titulo: 'Debut',
    comparar: (i, o) => {
      const c = numero((p) => p.debutCap, (n) => `Cap. ${n}`, 'Desconocido')(i, o)
      return i.debutArco ? { ...c, texto: i.debutArco, detalle: `Cap. ${i.debutCap}` } : c
    },
  },
  { clave: 'estado', titulo: 'Estado', comparar: categoria((p) => p.estado) },
]

export const comparar = (intento: Personaje, objetivo: Personaje) =>
  COLUMNAS.map((c) => c.comparar(intento, objetivo))
