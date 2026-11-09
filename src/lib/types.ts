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
}
