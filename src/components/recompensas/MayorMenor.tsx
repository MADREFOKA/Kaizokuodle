'use client'
import { useState } from 'react'
import { barajar } from '@/lib/azar'
import { leer, guardar } from '@/lib/guardado'
import { formatoBerry } from '@/lib/texto'
import { Cartel } from '../Cartel'
import { Boton, PanelFinal } from '../ui'

export type ConRecompensa = { id: number; nombre: string; imagen: string | null; recompensa: number; dificultad: number; afiliaciones: string[]; debutArco: string | null }

type Fase = 'pregunta' | 'acierto' | 'fallo'

export function MayorMenor({ personajes }: { personajes: ConRecompensa[] }) {
  const [todos, setTodos] = useState(false)
  const nuevaBaraja = (incluirTodos = todos) =>
    barajar(personajes.filter((p) => incluirTodos || p.dificultad <= 3), Math.random)

  const [baraja, setBaraja] = useState(() => nuevaBaraja())
  const [pos, setPos] = useState(0) // baraja[pos] = conocido, baraja[pos + 1] = oculto
  const [racha, setRacha] = useState(0)
  const [record, setRecord] = useState(() => leer('recompensas:record', 0))
  const [fase, setFase] = useState<Fase>('pregunta')
  const [comodin, setComodin] = useState<'libre' | 'activo' | 'gastado'>('libre') // uno por racha

  const izq = baraja[pos]
  const der = baraja[pos + 1]

  const responder = (mayor: boolean) => {
    if (fase !== 'pregunta') return
    const ok = der.recompensa === izq.recompensa || (der.recompensa > izq.recompensa) === mayor
    setFase(ok ? 'acierto' : 'fallo')
    if (!ok) return
    const r = racha + 1
    setRacha(r)
    if (r > record) { setRecord(r); guardar('recompensas:record', r) }
    setTimeout(() => {
      // Al llegar al final de la baraja se vuelve a barajar, manteniendo el cartel actual a la izquierda.
      if (pos + 2 >= baraja.length) {
        setBaraja([der, ...nuevaBaraja().filter((p) => p.id !== der.id)])
        setPos(0)
      } else setPos(pos + 1)
      setFase('pregunta')
      setComodin((c) => (c === 'activo' ? 'gastado' : c))
    }, 1100)
  }

  const reiniciar = (incluirTodos = todos) => {
    setBaraja(nuevaBaraja(incluirTodos))
    setPos(0)
    setRacha(0)
    setFase('pregunta')
    setComodin('libre')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg">
        <p>Racha: <strong className="font-display text-2xl text-berry tabular-nums">{racha}</strong></p>
        <p className="text-niebla">Récord: <strong className="tabular-nums text-papel">{record}</strong></p>
        <label className="flex cursor-pointer items-center gap-2 text-base text-niebla">
          <input type="checkbox" checked={todos} className="size-4 accent-berry"
            onChange={(e) => { setTodos(e.target.checked); reiniciar(e.target.checked) }} />
          Incluir personajes poco conocidos
        </label>
      </div>

      {fase === 'fallo' && (
        <PanelFinal titulo={`Fin de la racha: ${racha}`}
          acciones={<Boton variante="primario" onClick={() => reiniciar()}>Jugar otra vez</Boton>}>
          {der.nombre} tiene {formatoBerry(der.recompensa)} y {izq.nombre} {formatoBerry(izq.recompensa)}.
        </PanelFinal>
      )}

      <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-stretch">
        <Cartel nombre={izq.nombre} imagen={izq.imagen}>
          <p className="font-display text-2xl font-extrabold tabular-nums text-berry">{formatoBerry(izq.recompensa)}</p>
        </Cartel>

        <p className="self-center font-display text-xl font-bold text-niebla">contra</p>

        <Cartel nombre={der.nombre} imagen={der.imagen} tono={fase === 'pregunta' ? 'normal' : fase}>
          {fase === 'pregunta' ? (
            <div className="flex w-full flex-col gap-2">
              <p className="text-sm text-niebla">¿Su recompensa es mayor o menor?</p>
              <div className="grid grid-cols-2 gap-2">
                <Boton variante="acento" onClick={() => responder(true)}>▲ Mayor</Boton>
                <Boton variante="acento" onClick={() => responder(false)}>▼ Menor</Boton>
              </div>
              {comodin === 'activo' ? (
                <p className="rounded-xl bg-berry/15 px-3 py-2 text-left text-sm ring-1 ring-berry/50">
                  {der.afiliaciones.length ? `De ${der.afiliaciones.join(', ')}. ` : 'Sin afiliación conocida. '}
                  {der.debutArco ? `Debuta en ${der.debutArco}.` : ''}
                </p>
              ) : comodin === 'libre' && (
                <button onClick={() => setComodin('activo')} className="text-sm text-niebla underline underline-offset-4 hover:text-papel">💡 Usar comodín (1 por racha)</button>
              )}
            </div>
          ) : (
            <p aria-live="polite" className="font-display text-2xl font-extrabold tabular-nums text-berry">{formatoBerry(der.recompensa)}</p>
          )}
        </Cartel>
      </div>
    </div>
  )
}
