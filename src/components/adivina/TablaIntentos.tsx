import type { Personaje } from '@/lib/types'
import { COLUMNAS, comparar, type Celda } from '@/lib/juegos/adivina'
import { Retrato } from '../Retrato'

const fondo: Record<Celda['estado'], string> = {
  acierto: 'bg-acierto',
  parcial: 'bg-parcial text-mar',
  fallo: 'bg-fallo',
}

const ANCHO_PERSONAJE = 160

function Flecha({ direccion, enLinea }: { direccion: Celda['direccion']; enLinea?: boolean }) {
  if (!direccion) return null
  return (
    <span className={enLinea ? 'text-sm leading-none' : 'mt-1 block text-lg leading-none'} aria-label={direccion === 'arriba' ? 'Es mayor' : 'Es menor'}>
      {direccion === 'arriba' ? '▲' : '▼'}
    </span>
  )
}

export function TablaIntentos({ intentos, objetivo, nuevo }: { intentos: Personaje[]; objetivo: Personaje; nuevo: number | null }) {
  if (!intentos.length) return null
  const ancho = ANCHO_PERSONAJE + COLUMNAS.reduce((t, c) => t + c.ancho + 4, 0)
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-3 [perspective:900px]">
      <table className="mx-auto table-fixed border-separate border-spacing-1 text-center text-[13px]" style={{ width: ancho }}>
        <colgroup>
          <col style={{ width: ANCHO_PERSONAJE }} className="max-sm:!w-16" />
          {COLUMNAS.map((c) => <col key={c.clave} style={{ width: c.ancho }} />)}
        </colgroup>
        <thead>
          <tr className="text-niebla">
            <th scope="col" className="sticky left-0 z-10 bg-mar px-2 text-left text-xs font-bold">
              <span className="sr-only sm:not-sr-only">Personaje</span>
            </th>
            {COLUMNAS.map((c) => (
              <th key={c.clave} scope="col" className="px-1 pb-1 text-xs font-bold whitespace-nowrap">{c.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...intentos].reverse().map((p) => {
            const celdas = comparar(p, objetivo)
            const animar = p.id === nuevo
            return (
              <tr key={p.id}>
                <th scope="row" className="sticky left-0 z-10 bg-mar p-0 text-left font-normal">
                  <div className={`ficha flex h-[72px] items-center gap-3 rounded-xl px-2 ${p.id === objetivo.id ? 'bg-acierto' : 'bg-tinta'} ${animar ? 'casilla-nueva' : ''}`}
                    style={{ '--i': 0 } as React.CSSProperties}>
                    <Retrato src={p.imagen} alt={p.nombre} size={48} />
                    <span className="sr-only font-display font-bold leading-tight sm:not-sr-only">{p.nombre}</span>
                  </div>
                </th>
                {celdas.map((c, i) => {
                  const col = COLUMNAS[i]
                  const numero = col.clave === 'recompensa' || col.clave === 'altura'
                  return (
                    <td key={col.clave} className="p-0">
                      <div className={`ficha flex h-[72px] flex-col items-center justify-center rounded-xl px-2 leading-tight ${fondo[c.estado]} ${animar ? 'casilla-nueva' : ''}`}
                        style={{ '--i': i + 1 } as React.CSSProperties}
                        title={c.titulo ?? c.texto}
                        aria-label={`${col.titulo}: ${c.titulo ?? c.texto}, ${c.estado}`}>
                        <span className={`font-bold ${numero ? 'whitespace-nowrap tabular-nums' : 'line-clamp-3'} ${c.texto.length > 24 ? 'text-xs' : ''}`}>{c.texto}</span>
                        {c.detalle ? (
                          <span className="mt-0.5 flex items-center gap-1 text-xs opacity-85">{c.detalle}<Flecha direccion={c.direccion} enLinea /></span>
                        ) : (
                          <Flecha direccion={c.direccion} />
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
