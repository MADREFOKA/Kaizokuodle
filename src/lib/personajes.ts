import 'server-only'
import { pool } from './db'
import { SQL_PERSONAJES } from './sql/personajes'
import type { Personaje } from './types'

const num = (v: unknown) => (v === null || v === undefined ? null : Number(v))

let cache: Promise<Personaje[]> | undefined

/** Se ejecuta al compilar: la consulta va una sola vez a Neon y el resultado queda en la web estática. */
export function getPersonajes(): Promise<Personaje[]> {
  return (cache ??= cargar())
}

async function cargar(): Promise<Personaje[]> {
  if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL: no se pueden leer los datos de OPBD al compilar.')
  const { rows } = await pool.query(SQL_PERSONAJES)
  return rows.map((r) => ({
    id: Number(r.id),
    nombre: r.nombre,
    imagen: r.imagen,
    sexo: r.sexo,
    estado: r.estado,
    altura: num(r.altura) || null, // 0 = desconocida
    edad: num(r.edad),
    cumpleanos: r.cumpleanos,
    origen: r.origen,
    islaOrigen: r.isla_origen,
    recompensa: num(r.recompensa),
    debutCap: num(r.debut_cap),
    debutArco: r.debut_arco,
    debutSaga: r.debut_saga,
    dificultad: Number(r.dificultad),
    razas: r.razas,
    frutas: r.frutas,
    frutaTipos: r.fruta_tipos,
    haki: r.haki,
    afiliaciones: r.afiliaciones,
    ocupaciones: r.ocupaciones,
  }))
}
