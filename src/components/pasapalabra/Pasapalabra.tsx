'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { EntradaRosco, Personaje, Rosco } from '@/lib/types'
import { hoy, rngDiario } from '@/lib/azar'
import { guardarDiario, leerDiario } from '@/lib/guardado'
import { useRegistrarDiario } from '@/lib/estadisticas'
import { esCorrecta, generarRosco } from '@/lib/juegos/pasapalabra'
import { Boton, PanelFinal, SelectorModo, copiar, type Modo } from '../ui'

const TIEMPO = 300 // segundos
const PISTAS = 3
type Marca = 'pendiente' | 'acierto' | 'fallo' | 'pasada'
type Partida = { entradas: EntradaRosco[]; marcas: Marca[]; actual: number; restante: number; pistas: number[]; respuestas: string[] }

const nueva = (entradas: EntradaRosco[]): Partida => ({
  entradas, marcas: entradas.map(() => 'pendiente'), actual: 0, restante: TIEMPO, pistas: [], respuestas: entradas.map(() => ''),
})

/** Siguiente letra sin responder (pendiente o pasada), dando la vuelta al rosco. */
function siguiente(marcas: Marca[], desde: number) {
  for (let k = 1; k <= marcas.length; k++) {
    const i = (desde + k) % marcas.length
    if (marcas[i] === 'pendiente' || marcas[i] === 'pasada') return i
  }
  return -1
}

const color: Record<Marca, string> = {
  pendiente: 'bg-[#2f5bd3] text-papel',
  pasada: 'bg-[#2f5bd3] text-papel ring-2 ring-papel/60',
  acierto: 'bg-acierto text-papel',
  fallo: 'bg-fallo text-papel',
}

export function Pasapalabra({ roscos, personajes }: { roscos: Rosco[]; personajes: Personaje[] }) {
  const diario = () => {
    const f = hoy()
    return { fecha: f, partida: leerDiario<Partida>('pasapalabra', f) ?? nueva(generarRosco(personajes, rngDiario('pasapalabra', f))) }
  }
  const [inicial] = useState(diario)
  const [modo, setModo] = useState<Modo>('diario')
  const [fecha, setFecha] = useState(inicial.fecha)
  const [partida, setPartida] = useState<Partida>(inicial.partida)
  const [fuente, setFuente] = useState<string>('aleatorio')
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState<{ ok: boolean; t: string } | null>(null)
  const [copiado, setCopiado] = useState(false)
  const entrada = useRef<HTMLInputElement>(null)

  const { entradas, marcas, actual, restante } = partida
  const aciertos = marcas.filter((m) => m === 'acierto').length
  const terminado = restante <= 0 || siguiente(marcas, actual - 1) === -1
  useRegistrarDiario('pasapalabra', modo === 'diario' && terminado, fecha, { gano: aciertos === entradas.length, valor: aciertos })

  const actualizar = setPartida

  // El progreso del reto diario se guarda en cada cambio (también el reloj).
  useEffect(() => { if (modo === 'diario') guardarDiario('pasapalabra', fecha, partida) }, [modo, fecha, partida])

  // Reloj: un segundo menos mientras se juega.
  useEffect(() => {
    if (terminado) return
    const t = setInterval(() => setPartida((p) => ({ ...p, restante: Math.max(0, p.restante - 1) })), 1000)
    return () => clearInterval(t)
  }, [terminado])

  const avanzar = (marca: Marca, respuesta = '') => {
    const m = marcas.map((x, i) => (i === actual ? marca : x))
    const r = partida.respuestas.map((x, i) => (i === actual ? respuesta : x))
    const sig = siguiente(m, actual)
    actualizar({ ...partida, marcas: m, respuestas: r, actual: sig === -1 ? actual : sig })
    setTexto('')
    entrada.current?.focus()
  }

  const responder = () => {
    if (!texto.trim()) return
    const e = entradas[actual]
    const ok = esCorrecta(e, texto)
    setAviso(ok ? { ok, t: `¡Bien! ${e.respuesta}.` } : { ok, t: `No. Era ${e.respuesta}.` })
    avanzar(ok ? 'acierto' : 'fallo', texto)
  }
  const pasar = () => { setAviso(null); avanzar('pasada') }
  const pedirPista = () => { if (partida.pistas.length < PISTAS && !partida.pistas.includes(actual)) actualizar({ ...partida, pistas: [...partida.pistas, actual] }) }

  const empezarLibre = (f = fuente) => {
    const r = roscos.find((x) => String(x.id) === f)
    setPartida(nueva(r ? r.entradas : generarRosco(personajes, Math.random)))
    setAviso(null); setTexto('')
  }
  const cambiarModo = (m: Modo) => {
    setModo(m); setAviso(null); setTexto('')
    if (m === 'diario') { const d = diario(); setFecha(d.fecha); setPartida(d.partida) } else empezarLibre()
  }

  const compartir = async () => {
    const fila = marcas.map((m) => (m === 'acierto' ? '🟩' : m === 'fallo' ? '🟥' : '🟦')).join('')
    if (await copiar(`Pasapalabra · ${fecha}\n${aciertos}/${entradas.length}\n${fila}\n${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/pasapalabra/`)) {
      setCopiado(true); setTimeout(() => setCopiado(false), 2000)
    }
  }

  const e = entradas[actual]
  const min = Math.floor(restante / 60), seg = String(restante % 60).padStart(2, '0')
  const posiciones = useMemo(() => entradas.map((_, i) => {
    const a = (i / entradas.length) * 2 * Math.PI - Math.PI / 2
    return { left: `${50 + 44 * Math.cos(a)}%`, top: `${50 + 44 * Math.sin(a)}%` }
  }), [entradas])

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3">
        <SelectorModo modo={modo} onCambiar={cambiarModo} />
        {modo === 'libre' && roscos.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-niebla">
            Rosco
            <select value={fuente} onChange={(ev) => { setFuente(ev.target.value); empezarLibre(ev.target.value) }}
              className="rounded-lg border border-tinta-2 bg-tinta px-3 py-1.5 text-papel">
              <option value="aleatorio">Aleatorio con personajes</option>
              {roscos.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="relative mx-auto aspect-square w-[min(92vw,420px)]">
        {entradas.map((x, i) => (
          <span key={x.letra} style={posiciones[i]}
            className={`absolute grid size-[9.5%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-sm font-extrabold shadow-md shadow-black/40 transition sm:text-base ${color[marcas[i]]} ${i === actual && !terminado ? 'scale-125 !bg-berry !text-mar' : ''}`}
            aria-label={`${x.letra}: ${marcas[i]}`}>
            {x.letra}
          </span>
        ))}
        <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-tinta/90 text-center backdrop-blur">
          <span className={`font-display text-4xl font-extrabold tabular-nums sm:text-5xl ${restante <= 30 ? 'text-fallo' : ''}`} aria-label="Tiempo restante">{min}:{seg}</span>
          <span className="mt-1 text-sm text-niebla"><strong className="text-acierto">{aciertos}</strong> aciertos</span>
        </div>
      </div>

      {terminado ? (
        <PanelFinal titulo={`${aciertos} de ${entradas.length}`}
          acciones={modo === 'diario'
            ? <Boton variante="acento" onClick={compartir}>{copiado ? 'Copiado' : 'Copiar resultado'}</Boton>
            : <Boton variante="primario" onClick={() => empezarLibre()}>Otro rosco</Boton>}>
          {restante <= 0 ? 'Se acabó el tiempo.' : '¡Rosco terminado!'}
        </PanelFinal>
      ) : (
        <section className="mx-auto max-w-2xl space-y-3 rounded-2xl bg-tinta/90 p-5 backdrop-blur">
          <p className="font-display text-lg font-bold text-berry">{e.contiene ? 'Contiene' : 'Empieza por'} la {e.letra}</p>
          <p className="text-lg">{e.definicion}</p>
          {partida.pistas.includes(actual) && (
            <p className="rounded-xl bg-berry/15 px-4 py-2 text-sm ring-1 ring-berry/50">
              <span className="font-bold text-berry">Pista:</span> «{e.respuesta.slice(0, 2)}…», {e.respuesta.split(' ').length > 1 ? `${e.respuesta.split(' ').length} palabras` : `${e.respuesta.length} letras`}
            </p>
          )}
          <form className="flex flex-wrap gap-2" onSubmit={(ev) => { ev.preventDefault(); responder() }}>
            <label className="sr-only" htmlFor="respuesta">Respuesta</label>
            <input id="respuesta" ref={entrada} value={texto} onChange={(ev) => setTexto(ev.target.value)} autoComplete="off" autoFocus
              placeholder="Tu respuesta…"
              className="min-w-0 flex-1 rounded-xl border-2 border-tinta-2 bg-mar px-4 py-2.5 text-lg focus:border-berry focus-visible:outline-none" />
            <Boton type="submit" variante="primario" disabled={!texto.trim()}>Responder</Boton>
          </form>
          <div className="flex flex-wrap justify-center gap-2">
            <Boton onClick={pasar}>Pasapalabra</Boton>
            <Boton onClick={pedirPista} disabled={partida.pistas.length >= PISTAS || partida.pistas.includes(actual)}>💡 Pista ({PISTAS - partida.pistas.length})</Boton>
          </div>
        </section>
      )}

      <p aria-live="polite" className={`min-h-6 text-center ${aviso?.ok ? 'text-acierto' : 'text-parcial'}`}>{aviso?.t}</p>

      {terminado && (
        <ul className="mx-auto grid max-w-3xl gap-2 sm:grid-cols-2">
          {entradas.map((x, i) => (
            <li key={x.letra} className="flex gap-3 rounded-xl bg-tinta/80 p-3 text-sm">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full font-display font-bold ${color[marcas[i]]}`}>{x.letra}</span>
              <span><strong>{x.respuesta}</strong><span className="block text-niebla">{x.definicion}</span></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
