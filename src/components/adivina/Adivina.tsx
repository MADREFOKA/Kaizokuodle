'use client'
import { useMemo, useState } from 'react'
import type { Personaje } from '@/lib/types'
import { comparar } from '@/lib/juegos/adivina'
import { elegir, hash, hoy, rng } from '@/lib/azar'
import { Buscador } from '../Buscador'
import { Retrato } from '../Retrato'
import { TablaIntentos } from './TablaIntentos'

type Modo = 'diario' | 'libre'
const CLAVE_DIARIO = 'fokagames:adivina:diario'
const DIFICULTAD_DIARIO = 2 // el reto diario sale de los personajes más conocidos

function leerDiario(fecha: string): number[] {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE_DIARIO) ?? 'null')
    return g?.fecha === fecha && Array.isArray(g.intentos) ? g.intentos : []
  } catch { return [] }
}
function guardarDiario(fecha: string, intentos: number[]) {
  try { localStorage.setItem(CLAVE_DIARIO, JSON.stringify({ fecha, intentos })) } catch {}
}

const emoji = { acierto: '🟩', parcial: '🟨', fallo: '⬛' } as const

export function Adivina({ personajes }: { personajes: Personaje[] }) {
  const porId = useMemo(() => new Map(personajes.map((p) => [p.id, p])), [personajes])
  const retoDiario = () => {
    const f = hoy()
    const pool = personajes.filter((p) => p.dificultad <= DIFICULTAD_DIARIO)
    return { fecha: f, objetivoId: elegir(pool, rng(hash(`adivina:${f}`))).id, intentos: leerDiario(f) }
  }
  // Se monta solo en el cliente (ver SoloCliente): la fecha de España y el progreso guardado se leen al iniciar.
  const [inicial] = useState(retoDiario)
  const [modo, setModo] = useState<Modo>('diario')
  const [fecha, setFecha] = useState(inicial.fecha)
  const [objetivoId, setObjetivoId] = useState(inicial.objetivoId)
  const [intentos, setIntentos] = useState<number[]>(inicial.intentos)
  const [nuevo, setNuevo] = useState<number | null>(null)
  const [dificultadMax, setDificultadMax] = useState(3)
  const [rendido, setRendido] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const nuevaPartidaLibre = (max = dificultadMax) => {
    const pool = personajes.filter((p) => p.dificultad <= max)
    setObjetivoId(elegir(pool, Math.random).id)
    setIntentos([])
    setRendido(false)
    setNuevo(null)
  }

  const objetivo = objetivoId ? porId.get(objetivoId) : undefined
  const lista = intentos.map((id) => porId.get(id)).filter((p): p is Personaje => !!p)
  const acertado = intentos.includes(objetivoId)
  const terminado = acertado || rendido

  const intentar = (p: Personaje) => {
    const siguientes = [...intentos, p.id]
    setIntentos(siguientes)
    setNuevo(p.id)
    if (modo === 'diario') guardarDiario(fecha, siguientes)
  }

  const compartir = async () => {
    if (!objetivo) return
    const filas = lista.map((p) => comparar(p, objetivo).map((c) => emoji[c.estado]).join(''))
    const texto = `Adivina el personaje · ${fecha}\n${lista.length} ${lista.length === 1 ? 'intento' : 'intentos'}\n${filas.join('\n')}\n${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/adivina/`
    try { await navigator.clipboard.writeText(texto); setCopiado(true); setTimeout(() => setCopiado(false), 2000) } catch {}
  }

  const cambiarModo = (m: Modo) => {
    if (m === modo) return
    setModo(m)
    if (m === 'libre') return nuevaPartidaLibre()
    const r = retoDiario()
    setFecha(r.fecha); setObjetivoId(r.objetivoId); setIntentos(r.intentos); setRendido(false); setNuevo(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div role="tablist" aria-label="Modo de juego" className="inline-flex rounded-full bg-tinta/80 p-1 backdrop-blur">
          {(['diario', 'libre'] as const).map((m) => (
            <button key={m} role="tab" aria-selected={modo === m} onClick={() => cambiarModo(m)}
              className={`rounded-full px-5 py-2 font-display font-bold transition ${modo === m ? 'bg-papel text-mar' : 'text-niebla hover:text-papel'}`}>
              {m === 'diario' ? 'Reto diario' : 'Partida libre'}
            </button>
          ))}
        </div>
        {modo === 'libre' && (
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Dificultad máxima</legend>
            <span className="text-sm text-niebla">Dificultad hasta</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={`grid size-9 cursor-pointer place-items-center rounded-full border-2 font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-berry ${n === dificultadMax ? 'border-berry bg-berry text-mar' : 'border-tinta-2 text-niebla hover:border-niebla'}`}>
                <input type="radio" name="dificultad" value={n} checked={n === dificultadMax} className="sr-only"
                  onChange={() => { setDificultadMax(n); nuevaPartidaLibre(n) }} />
                {n}
              </label>
            ))}
          </fieldset>
        )}
      </div>

      {!objetivo ? null : terminado ? (
        <section aria-live="polite" className="flex flex-col gap-4 rounded-2xl border-2 border-berry/60 bg-tinta p-5 sm:flex-row sm:items-center">
          <Retrato src={objetivo.imagen} alt={objetivo.nombre} size={88} />
          <div className="flex-1">
            <p className="font-display text-2xl font-extrabold">
              {acertado ? `¡Era ${objetivo.nombre}!` : `Era ${objetivo.nombre}`}
            </p>
            <p className="text-niebla">
              {acertado
                ? `Lo has encontrado en ${lista.length} ${lista.length === 1 ? 'intento' : 'intentos'}.`
                : 'Te has rendido esta vez.'}
              {modo === 'diario' && ' El próximo reto llega a medianoche.'}
            </p>
          </div>
          <div className="flex gap-2">
            {modo === 'diario' && acertado && (
              <button onClick={compartir} className="rounded-full bg-berry px-5 py-2 font-display font-bold text-mar hover:brightness-110">
                {copiado ? 'Copiado' : 'Copiar resultado'}
              </button>
            )}
            {modo === 'libre' && (
              <button onClick={() => nuevaPartidaLibre()} className="rounded-full bg-sombrero px-5 py-2 font-display font-bold hover:brightness-110">
                Otro personaje
              </button>
            )}
          </div>
        </section>
      ) : (
        <div className="space-y-2">
          <Buscador personajes={personajes} excluir={new Set(intentos)} onElegir={intentar} />
          <div className="flex items-center justify-between text-sm text-niebla">
            <span>{lista.length ? `${lista.length} ${lista.length === 1 ? 'intento' : 'intentos'}` : 'Empieza por cualquier personaje.'}</span>
            {modo === 'libre' && lista.length > 0 && (
              <button onClick={() => setRendido(true)} className="underline underline-offset-4 hover:text-papel">Rendirse</button>
            )}
          </div>
        </div>
      )}

      {objetivo && <TablaIntentos intentos={lista} objetivo={objetivo} nuevo={nuevo} />}

      <Leyenda />
    </div>
  )
}

function Leyenda() {
  const items = [
    ['bg-acierto', 'Coincide'],
    ['bg-parcial', 'Coincide en parte'],
    ['bg-fallo', 'No coincide'],
  ] as const
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-niebla">
      {items.map(([c, t]) => (
        <li key={t} className="flex items-center gap-2"><span className={`size-4 rounded ${c}`} />{t}</li>
      ))}
      <li>▲▼ El personaje oculto tiene más o menos</li>
    </ul>
  )
}
