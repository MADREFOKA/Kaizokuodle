'use client'
import { useEffect, useRef } from 'react'

/** Diálogo nativo (<dialog>): foco atrapado, Escape para cerrar, fondo inerte. */
export function Modal({ abierto, onCerrar, titulo, children }: { abierto: boolean; onCerrar: () => void; titulo: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto && !d.open) d.showModal()
    if (!abierto && d.open) d.close()
  }, [abierto])
  return (
    <dialog ref={ref} onClose={onCerrar} onClick={(e) => e.target === ref.current && onCerrar()}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] overflow-visible rounded-2xl border border-tinta-2 bg-tinta p-5 text-papel shadow-2xl backdrop:bg-black/60">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="font-display text-xl font-bold leading-tight">{titulo}</h2>
        <button onClick={onCerrar} aria-label="Cerrar" className="-m-1 grid size-8 shrink-0 place-items-center rounded-lg text-niebla hover:bg-tinta-2 hover:text-papel">✕</button>
      </div>
      {abierto && children}
    </dialog>
  )
}
