/** Datos de cada personaje con el capítulo en que se conoce cada cosa (para el modo sin spoilers). */
export type Historial = {
  recompensaBase: number | null
  recompensas: [cap: number, cantidad: number][]
  /** a: activo; f: miembro hasta su muerte (estado «Fallecido») */
  afiliaciones: { n: string; d: number | null; h: number | null; a: boolean; f?: boolean }[]
  frutas: { n: string; t: string; d: number | null; m: boolean }[]
  haki: [nombre: string, cap: number | null][]
  /** Capítulo de la muerte si OPBD tiene el evento. */
  muerteCap: number | null
  alias: [nombre: string, cap: number | null][]
}

export type Personaje = {
  id: number
  nombre: string
  imagen: string | null
  sexo: string | null
  estado: string | null
  altura: number | null
  edad: number | null
  cumpleanos: string | null
  origen: string | null
  islaOrigen: string | null
  recompensa: number | null
  debutCap: number | null
  debutArco: string | null
  debutSaga: string | null
  dificultad: number
  razas: string[]
  frutas: string[]
  frutaTipos: string[]
  haki: string[]
  afiliaciones: string[]
  ocupaciones: string[]
  /** Alias y epítetos visibles (para buscar). */
  alias: string[]
  hist: Historial
}

export type Fruta = { id: number; nombre: string; tipo: string; usuarios: number[]; /** capítulo en que se conoce su nombre */ desde: number | null }

export type Escena = { id: number; imagen: string; solucion: string; pista: string | null; dificultad: number; personajes: number[] }

export type EntradaRosco = { letra: string; contiene: boolean; definicion: string; respuesta: string; /** nombre completo si la respuesta es un personaje */ personaje?: string; alternativas?: string[] }
export type Rosco = { id: number; nombre: string; entradas: EntradaRosco[] }

export type Datos = { personajes: Personaje[]; frutas: Fruta[]; escenas: Escena[]; roscos: Rosco[] }
