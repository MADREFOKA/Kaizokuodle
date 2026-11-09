import type { Personaje } from '@/lib/types'
import { COLUMNAS, comparar, type Celda } from '@/lib/juegos/adivina'
import { Retrato } from '../Retrato'

const fondo: Record<Celda['estado'], string> = {
  acierto: 'bg-acierto',
  parcial: 'bg-parcial text-mar',
  fallo: 'bg-fallo',
}

function Flecha({ direccion }: { direccion: Celda['direccion'] }) {
  if (!direccion) return null
  return (
    <span className="mt-1 block text-xl leading-none" aria-label={direccion === 'arriba' ? 'Es mayor' : 'Es menor'}>
      {direccion === 'arriba' ? '▲' : '▼'}
    </span>
  )
}

export function TablaIntentos({ intentos, objetivo, nuevo }: { intentos: Personaje[]; objetivo: Personaje; nuevo: number | null }) {
  if (!intentos.length) return null
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 [perspective:800px]">
      <table className="w-full min-w-[980px] table-fixed border-separate border-spacing-1 text-center text-sm sm:min-w-[1120px]">
        <colgroup>
          <col className="w-16 sm:w-44" />
          {COLUMNAS.map((c) => <col key={c.clave} className={c.clave === 'afiliacion' || c.clave === 'haki' ? 'w-[12%]' : ''} />)}
        </colgroup>
        <thead>
          <tr className="text-niebla">
            <th scope="col" className="sticky left-0 z-10 bg-mar px-2 py-1 text-left font-normal"><span className="sr-only sm:not-sr-only">Personaje</span></th>
            {COLUMNAS.map((c) => (
              <th key={c.clave} scope="col" className="px-2 py-1 font-normal">{c.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...intentos].reverse().map((p) => {
            const celdas = comparar(p, objetivo)
            const animar = p.id === nuevo
            return (
              <tr key={p.id}>
                <th scope="row" className="sticky left-0 z-10 bg-mar py-0 pr-1 text-left font-normal">
                  <div className={`flex h-full min-h-16 items-center gap-2 rounded-lg px-2 ${p.id === objetivo.id ? 'bg-acierto' : 'bg-tinta'} ${animar ? 'casilla-nueva' : ''}`}
                    style={{ '--i': 0 } as React.CSSProperties}>
                    <Retrato src={p.imagen} alt={p.nombre} size={44} />
                    <span className="sr-only font-bold leading-tight sm:not-sr-only">{p.nombre}</span>
                  </div>
                </th>
                {celdas.map((c, i) => (
                  <td key={COLUMNAS[i].clave} className="p-0 align-stretch">
                    <div className={`flex min-h-16 flex-col items-center justify-center rounded-lg px-1.5 py-2 leading-tight [overflow-wrap:anywhere] ${fondo[c.estado]} ${animar ? 'casilla-nueva' : ''}`}
                      style={{ '--i': i + 1 } as React.CSSProperties}
                      title={c.titulo}
                      aria-label={`${COLUMNAS[i].titulo}: ${c.titulo ?? c.texto}, ${c.estado}`}>
                      <span className={COLUMNAS[i].clave === 'recompensa' || COLUMNAS[i].clave === 'altura' ? 'whitespace-nowrap' : ''}>{c.texto}</span>
                      {c.detalle && <span className="text-xs opacity-80">{c.detalle}</span>}
                      <Flecha direccion={c.direccion} />
                    </div>
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
