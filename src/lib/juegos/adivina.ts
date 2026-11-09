import type { Personaje } from '@/lib/types'
import { formatoAltura, formatoBerry, formatoBerryCorto } from '@/lib/texto'

export type Estado = 'acierto' | 'parcial' | 'fallo'
export type Direccion = 'arriba' | 'abajo' | null
export type Celda = { texto: string; detalle?: string; titulo?: string; estado: Estado; direccion: Direccion }

type Columna = {
  clave: string
  titulo: string
  ancho: number // px
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

// Orden de las columnas en la tabla. `ancho` en px (texto a 13 px en negrita).
export const COLUMNAS: Columna[] = [
  {
    clave: 'debut',
    titulo: 'Debut',
    ancho: 112,
    comparar: (i, o) => {
      const c = numero((p) => p.debutCap, (n) => `Cap. ${n}`, 'Desconocido')(i, o)
      return i.debutArco ? { ...c, texto: i.debutArco, detalle: `Cap. ${i.debutCap}` } : c
    },
  },
  { clave: 'origen', titulo: 'Origen', ancho: 104, comparar: categoria((p) => p.origen) },
  { clave: 'raza', titulo: 'Raza', ancho: 100, comparar: conjunto((p) => p.razas, 'Desconocida') },
  { clave: 'sexo', titulo: 'Sexo', ancho: 96, comparar: categoria((p) => p.sexo) },
  { clave: 'estado', titulo: 'Estado', ancho: 100, comparar: categoria((p) => p.estado) },
  { clave: 'altura', titulo: 'Altura', ancho: 100, comparar: numero((p) => p.altura, formatoAltura, 'Desconocida') },
  { clave: 'recompensa', titulo: 'Recompensa', ancho: 104, comparar: (i, o) => ({ ...numero((p) => p.recompensa, formatoBerryCorto, 'Ninguna', true)(i, o), titulo: i.recompensa ? formatoBerry(i.recompensa) : undefined }) },
  { clave: 'afiliacion', titulo: 'Afiliación', ancho: 136, comparar: conjunto((p) => p.afiliaciones, 'Ninguna') },
  { clave: 'fruta', titulo: 'Fruta', ancho: 104, comparar: conjunto((p) => p.frutaTipos, 'Ninguna') },
  { clave: 'haki', titulo: 'Haki', ancho: 120, comparar: conjunto((p) => p.haki, 'Ninguno') },
]

export const comparar = (intento: Personaje, objetivo: Personaje) =>
  COLUMNAS.map((c) => c.comparar(intento, objetivo))
