import 'server-only'
import { pool } from './db'
import { SQL_FRUTAS } from './sql/frutas'
import type { Fruta } from './types'

let cache: Promise<Fruta[]> | undefined

export function getFrutas(): Promise<Fruta[]> {
  return (cache ??= pool.query(SQL_FRUTAS).then(({ rows }) =>
    rows.map((r) => ({ id: Number(r.id), nombre: r.nombre.trim(), tipo: r.tipo, usuarios: r.usuarios.map(Number), desde: r.desde == null ? null : Number(r.desde) })),
  ))
}
