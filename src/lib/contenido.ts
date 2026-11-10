import 'server-only'
import { pool } from './db'
import type { Escena, Rosco } from './types'

/** Contenido propio de los juegos (esquema `juegos`). Si aún no se han creado las tablas, devuelve vacío. */
async function consultar<T>(sql: string, mapear: (r: Record<string, unknown>) => T): Promise<T[]> {
  try {
    const { rows } = await pool.query(sql)
    return rows.map(mapear)
  } catch (e) {
    if ((e as { code?: string }).code === '42P01') return [] // tabla inexistente
    throw e
  }
}

export const getEscenas = () =>
  consultar<Escena>(
    /* sql */ `SELECT e.id, e.imagen, e.solucion, e.pista, e.dificultad,
       COALESCE(array_agg(ep.personaje_id ORDER BY ep.personaje_id) FILTER (WHERE ep.personaje_id IS NOT NULL), '{}') AS personajes
     FROM juegos.escena e LEFT JOIN juegos.escena_personaje ep ON ep.escena_id = e.id
     GROUP BY e.id ORDER BY e.id`,
    (r) => ({
      id: Number(r.id), imagen: String(r.imagen), solucion: String(r.solucion), pista: (r.pista as string) ?? null,
      dificultad: Number(r.dificultad), personajes: (r.personajes as unknown[]).map(Number),
    }),
  )

export const getRoscos = () =>
  consultar<Rosco>(
    /* sql */ `SELECT r.id, r.nombre,
       json_agg(json_build_object('letra', e.letra, 'contiene', e.contiene, 'definicion', e.definicion, 'respuesta', e.respuesta) ORDER BY e.letra) AS entradas
     FROM juegos.rosco r JOIN juegos.rosco_entrada e ON e.rosco_id = r.id
     GROUP BY r.id ORDER BY r.id`,
    (r) => ({ id: Number(r.id), nombre: String(r.nombre), entradas: r.entradas as Rosco['entradas'] }),
  )
