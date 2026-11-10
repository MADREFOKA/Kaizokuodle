import 'server-only'
import { pool } from './db'
import { SQL_FRUTAS } from './sql/frutas'

export type Fruta = { id: number; nombre: string; tipo: string; usuarios: number[] }

let cache: Promise<Fruta[]> | undefined

export function getFrutas(): Promise<Fruta[]> {
  return (cache ??= pool.query(SQL_FRUTAS).then(({ rows }) =>
    rows.map((r) => ({ id: Number(r.id), nombre: r.nombre.trim(), tipo: r.tipo, usuarios: r.usuarios.map(Number) })),
  ))
}
