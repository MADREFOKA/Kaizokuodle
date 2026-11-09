'use client'
import { useSyncExternalStore } from 'react'

const suscribir = () => () => {}

/** Renderiza solo en el navegador (fecha local, localStorage). En el servidor muestra el reemplazo. */
export function SoloCliente({ children, reemplazo }: { children: React.ReactNode; reemplazo: React.ReactNode }) {
  const cliente = useSyncExternalStore(suscribir, () => true, () => false)
  return cliente ? children : reemplazo
}
