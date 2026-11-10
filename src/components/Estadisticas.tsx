'use client'
import { useState } from 'react'
import { juego, type IdJuego } from '@/lib/juegos/catalogo'
import { resumen } from '@/lib/estadisticas'
import { Modal } from './Modal'

export function BotonEstadisticas({ id }: { id: IdJuego }) {
  const [abierto, setAbierto] = useState(false)
  const j = juego(id)
  if (!j.diario) return null
  return (
    <>
      <button onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-full bg-tinta/80 px-4 py-1.5 text-sm font-bold text-niebla ring-1 ring-tinta-2 backdrop-blur transition hover:bg-tinta-2 hover:text-papel">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden fill="currentColor"><rect x="1" y="8" width="3" height="7" rx="1" /><rect x="6.5" y="4" width="3" height="11" rx="1" /><rect x="12" y="1" width="3" height="14" rx="1" /></svg>
        Estadísticas
      </button>
      <Modal abierto={abierto} onCerrar={() => setAbierto(false)} titulo={`Tus estadísticas: ${j.nombre}`}>
        <Panel id={id} />
      </Modal>
    </>
  )
}

function Panel({ id }: { id: IdJuego }) {
  const r = resumen(id)
  const j = juego(id)
  const max = Math.max(1, ...r.distribucion.map(([, n]) => n))
  const cifras = [
    ['Jugados', r.jugados],
    ['Superados', r.jugados ? `${Math.round((r.ganados / r.jugados) * 100)} %` : '—'],
    ['Racha', r.racha],
    ['Mejor racha', r.mejor],
  ] as const
  if (!r.jugados) return <p className="text-niebla">Aún no has terminado ningún reto diario de este juego. Tus resultados se guardan en este navegador.</p>
  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-4 gap-2 text-center">
        {cifras.map(([t, v]) => (
          <div key={t} className="rounded-xl bg-mar/60 px-1 py-3">
            <dd className="font-display text-2xl font-extrabold tabular-nums" style={{ color: j.color }}>{v}</dd>
            <dt className="text-xs text-niebla">{t}</dt>
          </div>
        ))}
      </dl>
      <div>
        <p className="mb-2 text-sm text-niebla">{j.valor} por partida</p>
        <ul className="space-y-1">
          {r.distribucion.map(([valor, n]) => (
            <li key={valor} className="flex items-center gap-2 text-sm">
              <span className="w-6 text-right tabular-nums text-niebla">{valor}</span>
              <span className="h-5 rounded" style={{ width: `${Math.max(8, (n / max) * 100)}%`, background: j.color }} />
              <span className="tabular-nums">{n}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-niebla">Se guardan en este navegador. La racha cuenta los días seguidos que juegas el reto diario.</p>
    </div>
  )
}
