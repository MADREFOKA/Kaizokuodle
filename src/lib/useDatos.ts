'use client'
import { useEffect, useState } from 'react'
import type { Datos } from './types'

let promesa: Promise<Datos> | null = null

/** Descarga datos.json una vez por visita (el navegador lo guarda en caché entre páginas). */
export function cargarDatos(): Promise<Datos> {
  return (promesa ??= fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/datos.json`).then((r) => {
    if (!r.ok) throw new Error(`datos.json: ${r.status}`)
    return r.json()
  }).catch((e) => { promesa = null; throw e }))
}

export function useDatos(): { datos: Datos | null; error: boolean } {
  const [estado, setEstado] = useState<{ datos: Datos | null; error: boolean }>({ datos: null, error: false })
  useEffect(() => {
    let vivo = true
    cargarDatos().then((datos) => vivo && setEstado({ datos, error: false }), () => vivo && setEstado({ datos: null, error: true }))
    return () => { vivo = false }
  }, [])
  return estado
}
