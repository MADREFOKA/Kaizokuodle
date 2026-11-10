'use client'
import { useState, type ButtonHTMLAttributes } from 'react'

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
export function PanelFinal({ titulo, children, acciones, icono }: { titulo: string; children?: React.ReactNode; acciones?: React.ReactNode; icono?: React.ReactNode }) {
  return (
    <section aria-live="polite" className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl border-2 border-berry/60 bg-tinta/90 p-5 text-center backdrop-blur sm:flex-row sm:text-left">
      {icono}
      <div className="flex-1">
        <p className="font-display text-2xl font-extrabold">{titulo}</p>
        {children && <div className="text-niebla">{children}</div>}
      </div>
      {acciones && <div className="flex flex-wrap justify-center gap-2">{acciones}</div>}
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

export type Pista = { titulo: string; contenido: React.ReactNode; /** Si existe, la pista está bloqueada y se explica por qué. */ bloqueo?: string }

/** Fila de pistas: cada una se destapa al pulsarla cuando está desbloqueada. */
export function Pistas({ pistas, className = '' }: { pistas: Pista[]; className?: string }) {
  const [vistas, setVistas] = useState<Set<number>>(new Set())
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {pistas.map((p, i) =>
        vistas.has(i) && !p.bloqueo ? (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-berry/15 px-4 py-2 text-sm ring-1 ring-berry/50">
            <span className="font-bold text-berry">{p.titulo}:</span>
            <span>{p.contenido}</span>
          </div>
        ) : (
          <button key={i} disabled={!!p.bloqueo} onClick={() => setVistas((v) => new Set(v).add(i))}
            className="flex items-center gap-2 rounded-xl bg-tinta/80 px-4 py-2 text-sm ring-1 ring-tinta-2 backdrop-blur transition enabled:hover:ring-berry disabled:opacity-60">
            <span aria-hidden>{p.bloqueo ? '🔒' : '💡'}</span>
            <span className="font-bold">{p.titulo}</span>
            {p.bloqueo && <span className="text-niebla">· {p.bloqueo}</span>}
          </button>
        ),
      )}
    </div>
  )
}
