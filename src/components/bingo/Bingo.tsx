'use client'
import { useMemo, useState } from 'react'
import type { Personaje } from '@/lib/types'
import { barajar, hoy, rngDiario } from '@/lib/azar'
import { guardarDiario, leerDiario } from '@/lib/guardado'
import { bancoDeCondiciones, generarCarton } from '@/lib/juegos/condiciones'
import { Retrato } from '../Retrato'
import { Boton, PanelFinal, SelectorModo, copiar, type Modo } from '../ui'

const MAZO = 40
/** casillas[i] = id colocado; turno = posición en el mazo; fallos = personajes mal colocados. */
type Estado = { semilla: string; casillas: (number | null)[]; turno: number; fallos: number; pistas?: number }
const PISTAS = 3

export function Bingo({ personajes }: { personajes: Personaje[] }) {
  const banco = useMemo(() => bancoDeCondiciones(personajes), [personajes])
  const nuevo = (semilla: string): Estado => ({ semilla, casillas: Array(16).fill(null), turno: 0, fallos: 0 })
  const diario = () => { const f = hoy(); return leerDiario<Estado>('bingo', f) ?? nuevo(f) }

  const [modo, setModo] = useState<Modo>('diario')
  const [estado, setEstado] = useState<Estado>(diario)
  const [aviso, setAviso] = useState<{ texto: string; ok: boolean } | null>(null)
  const [copiado, setCopiado] = useState(false)

  const carton = useMemo(() => generarCarton(personajes, banco, rngDiario('bingo', estado.semilla)), [personajes, banco, estado.semilla])
  const mazo = useMemo(
    () => barajar(personajes.filter((p) => p.dificultad <= 3), rngDiario('bingo-mazo', estado.semilla)).slice(0, MAZO),
    [personajes, estado.semilla],
  )
  const porId = useMemo(() => new Map(personajes.map((p) => [p.id, p])), [personajes])

  const llenas = estado.casillas.filter((x) => x !== null).length
  const terminado = llenas === 16 || estado.turno >= mazo.length
  const actual = terminado ? null : mazo[estado.turno]

  const actualizar = (e: Estado) => { setEstado(e); if (modo === 'diario') guardarDiario('bingo', e.semilla, e) }

  const colocar = (i: number) => {
    if (!actual || estado.casillas[i] !== null) return
    const c = carton[i]
    if (c.cumple(actual)) {
      actualizar({ ...estado, casillas: estado.casillas.map((x, j) => (j === i ? actual.id : x)), turno: estado.turno + 1 })
      setAviso({ texto: `${actual.nombre}: ${c.texto}.`, ok: true })
    } else {
      actualizar({ ...estado, turno: estado.turno + 1, fallos: estado.fallos + 1 })
      setAviso({ texto: `${actual.nombre} no cumple «${c.texto}». Lo pierdes.`, ok: false })
    }
  }

  const pistasUsadas = estado.pistas ?? 0
  const [iluminar, setIluminar] = useState<number | null>(null) // turno en el que se pidió la pista
  const pedirPista = () => {
    if (pistasUsadas >= PISTAS) return
    actualizar({ ...estado, pistas: pistasUsadas + 1 })
    setIluminar(estado.turno)
  }
  const encaja = (i: number) => iluminar === estado.turno && !!actual && estado.casillas[i] === null && carton[i].cumple(actual)

  const pasar = () => { actualizar({ ...estado, turno: estado.turno + 1 }); setAviso(null) }

  const cambiarModo = (m: Modo) => { setModo(m); setAviso(null); setEstado(m === 'diario' ? diario() : nuevo(`libre-${Math.random()}`)) }

  const compartir = async () => {
    const filas = [0, 1, 2, 3].map((f) => [0, 1, 2, 3].map((c) => (estado.casillas[f * 4 + c] ? '🟩' : '⬛')).join(''))
    if (await copiar(`Bingo · ${estado.semilla}\n${llenas}/16 con ${estado.turno} personajes\n${filas.join('\n')}\n${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/bingo/`)) {
      setCopiado(true); setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3">
        <SelectorModo modo={modo} onCambiar={cambiarModo} />
        <p className="text-niebla">Quedan <strong className="tabular-nums text-papel">{mazo.length - estado.turno}</strong> personajes en el mazo</p>
      </div>

      {terminado ? (
        <PanelFinal titulo={llenas === 16 ? '¡Bingo!' : `${llenas} de 16 casillas`}
          acciones={modo === 'diario'
            ? <Boton variante="acento" onClick={compartir}>{copiado ? 'Copiado' : 'Copiar resultado'}</Boton>
            : <Boton variante="primario" onClick={() => cambiarModo('libre')}>Otro cartón</Boton>}>
          {llenas === 16 ? `Con ${estado.turno} personajes y ${estado.fallos} ${estado.fallos === 1 ? 'fallo' : 'fallos'}.` : 'Se ha acabado el mazo.'}
        </PanelFinal>
      ) : actual && (
        <div className="mx-auto flex max-w-xl flex-wrap items-center gap-4 rounded-2xl border-2 border-berry/60 bg-tinta/90 p-4 backdrop-blur">
          <Retrato src={actual.imagen} alt="" size={72} />
          <div className="flex-1">
            <p className="text-sm text-niebla">Sale…</p>
            <p className="font-display text-2xl font-extrabold leading-tight">{actual.nombre}</p>
            <p className="text-sm text-niebla">Elige una casilla que cumpla o pasa.</p>
          </div>
          <div className="flex gap-2">
            <Boton onClick={pedirPista} disabled={pistasUsadas >= PISTAS || iluminar === estado.turno} aria-label={`Pista: quedan ${PISTAS - pistasUsadas}`}>💡 {PISTAS - pistasUsadas}</Boton>
            <Boton onClick={pasar}>Pasar</Boton>
          </div>
        </div>
      )}

      <p aria-live="polite" className={`min-h-6 text-center ${iluminar === estado.turno && !terminado ? 'text-berry' : aviso?.ok ? 'text-acierto' : 'text-parcial'}`}>{iluminar === estado.turno && !terminado ? (carton.some((_, i) => encaja(i)) ? 'Encaja en las casillas iluminadas.' : 'No encaja en ninguna casilla libre: pásalo.') : aviso?.texto}</p>

      <div className="mx-auto grid max-w-xl grid-cols-4 gap-2">
        {carton.map((c, i) => {
          const p = estado.casillas[i] !== null ? porId.get(estado.casillas[i]!) : undefined
          return (
            <button key={c.id} disabled={!!p || terminado} onClick={() => colocar(i)}
              aria-label={p ? `${c.texto}: ${p.nombre}` : c.texto}
              className={`ficha flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-xl p-1.5 text-center transition backdrop-blur ${p ? 'bg-acierto' : encaja(i) ? 'bg-berry/30 ring-2 ring-berry' : 'bg-tinta/90 enabled:hover:bg-tinta-2'}`}>
              {p ? (
                <>
                  <Retrato src={p.imagen} alt="" size={48} />
                  <span className="line-clamp-2 text-[11px] font-bold leading-tight sm:text-xs">{c.texto}</span>
                </>
              ) : (
                <span className="font-display text-xs font-bold leading-tight sm:text-base">{c.texto}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
