'use client'
import { useState } from 'react'
import { juego, type IdJuego } from '@/lib/juegos/catalogo'
import { Modal } from './Modal'

export function ComoSeJuega({ id }: { id: IdJuego }) {
  const [abierto, setAbierto] = useState(false)
  const j = juego(id)
  return (
    <>
      <button onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-full bg-tinta/80 px-4 py-1.5 text-sm font-bold text-niebla ring-1 ring-tinta-2 backdrop-blur transition hover:bg-tinta-2 hover:text-papel">
        <span aria-hidden className="grid size-5 place-items-center rounded-full bg-tinta-2 text-xs">?</span>
        Cómo se juega
      </button>
      <Modal abierto={abierto} onCerrar={() => setAbierto(false)} titulo={`Cómo se juega: ${j.nombre}`}>
        <ol className="space-y-3">
          {j.reglas.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-mar" style={{ background: j.color }}>{i + 1}</span>
              <span className="text-papel/90">{r}</span>
            </li>
          ))}
        </ol>
        {j.pistas && (
          <p className="mt-4 rounded-xl bg-tinta-2/60 p-3 text-sm"><strong className="text-berry">Pistas.</strong> {j.pistas}</p>
        )}
        {j.diario && (
          <p className="mt-3 text-sm text-niebla">El reto diario es el mismo para todos y cambia a medianoche (hora de España). En partida libre puedes jugar todas las veces que quieras.</p>
        )}
      </Modal>
    </>
  )
}
