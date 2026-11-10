'use client'
import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'acento' | 'secundario'
const estilos: Record<Variante, string> = {
  primario: 'bg-sombrero text-papel hover:brightness-110',
  acento: 'bg-berry text-mar hover:brightness-110',
  secundario: 'bg-tinta/80 text-papel ring-1 ring-tinta-2 hover:bg-tinta-2',
}

export function Boton({ variante = 'secundario', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      {...props}
      className={`rounded-full px-5 py-2 font-display font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${estilos[variante]} ${className}`}
    />
  )
}

export type Modo = 'diario' | 'libre'

export function SelectorModo({ modo, onCambiar }: { modo: Modo; onCambiar: (m: Modo) => void }) {
  return (
    <div role="tablist" aria-label="Modo de juego" className="inline-flex rounded-full bg-tinta/80 p-1 backdrop-blur">
      {(['diario', 'libre'] as const).map((m) => (
        <button key={m} role="tab" aria-selected={modo === m} onClick={() => m !== modo && onCambiar(m)}
          className={`rounded-full px-5 py-2 font-display font-bold transition ${modo === m ? 'bg-papel text-mar' : 'text-niebla hover:text-papel'}`}>
          {m === 'diario' ? 'Reto diario' : 'Partida libre'}
        </button>
      ))}
    </div>
  )
}

/** Recuadro de fin de partida. */
export function PanelFinal({ titulo, children, acciones }: { titulo: string; children?: React.ReactNode; acciones?: React.ReactNode }) {
  return (
    <section aria-live="polite" className="flex flex-col gap-4 rounded-2xl border-2 border-berry/60 bg-tinta/90 p-5 backdrop-blur sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="font-display text-2xl font-extrabold">{titulo}</p>
        {children && <div className="text-niebla">{children}</div>}
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </section>
  )
}

export async function copiar(texto: string) {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    return false
  }
}
