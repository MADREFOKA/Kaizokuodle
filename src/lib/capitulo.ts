'use client'
import { useSyncExternalStore } from 'react'
import { guardar, leer } from './guardado'

/** Capítulo por el que va el jugador (modo sin spoilers). null = ha leído todo. */
const CLAVE = 'capitulo'
const evento = 'fokagames:capitulo'

export function setCapitulo(cap: number | null) {
  guardar(CLAVE, cap)
  window.dispatchEvent(new Event(evento))
}

const suscribir = (f: () => void) => {
  window.addEventListener(evento, f)
  window.addEventListener('storage', f)
  return () => { window.removeEventListener(evento, f); window.removeEventListener('storage', f) }
}

export function useCapitulo(): number | null {
  return useSyncExternalStore(suscribir, () => leer<number | null>(CLAVE, null), () => null)
}
