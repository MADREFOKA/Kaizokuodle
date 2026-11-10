'use client'
import { useMemo, useState } from 'react'
import type { Personaje } from '@/lib/types'
import { comparar } from '@/lib/juegos/adivina'
import { elegir, hash, hoy, rng } from '@/lib/azar'
import { Buscador } from '../Buscador'
import { Retrato } from '../Retrato'
import { TablaIntentos } from './TablaIntentos'
import { Boton, PanelFinal, Pistas, SelectorModo, copiar, type Pista } from '../ui'

type Modo = 'diario' | 'libre'
const UMBRALES = [4, 7, 10] // intentos para desbloquear cada pista
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

const emoji = { acierto: '🟩', parcial: '🟨', fallo: '🟥' } as const

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
    if (await copiar(texto)) { setCopiado(true); setTimeout(() => setCopiado(false), 2000) }
  }

  const cambiarModo = (m: Modo) => {
    if (m === modo) return
    setModo(m)
    if (m === 'libre') return nuevaPartidaLibre()
    const r = retoDiario()
    setFecha(r.fecha); setObjetivoId(r.objetivoId); setIntentos(r.intentos); setRendido(false); setNuevo(null)
  }

  const pistas: Pista[] = objetivo ? [
    { titulo: 'Un dato', contenido: datoExtra(objetivo) },
    { titulo: 'Inicial', contenido: `Empieza por «${objetivo.nombre[0]}» (${objetivo.nombre.split(' ').length} ${objetivo.nombre.split(' ').length === 1 ? 'palabra' : 'palabras'})` },
    { titulo: 'Retrato', contenido: <span className="inline-block overflow-hidden rounded-md align-middle [&_img]:blur-[6px]"><Retrato src={objetivo.imagen} alt="Retrato difuminado" size={56} /></span> },
  ].map((p, i) => (lista.length >= UMBRALES[i] ? p : { ...p, bloqueo: `en ${UMBRALES[i] - lista.length} ${UMBRALES[i] - lista.length === 1 ? 'intento' : 'intentos'}` })) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <SelectorModo modo={modo} onCambiar={cambiarModo} />
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

      <div className="mx-auto max-w-2xl space-y-4">
        {!objetivo ? null : terminado ? (
          <PanelFinal titulo={acertado ? `¡Era ${objetivo.nombre}!` : `Era ${objetivo.nombre}`}
            icono={<Retrato src={objetivo.imagen} alt={objetivo.nombre} size={88} />}
            acciones={<>
              {modo === 'diario' && acertado && <Boton variante="acento" onClick={compartir}>{copiado ? 'Copiado' : 'Copiar resultado'}</Boton>}
              {modo === 'libre' && <Boton variante="primario" onClick={() => nuevaPartidaLibre()}>Otro personaje</Boton>}
            </>}>
            {acertado ? `Lo has encontrado en ${lista.length} ${lista.length === 1 ? 'intento' : 'intentos'}.` : 'Te has rendido esta vez.'}
            {modo === 'diario' && ' El próximo reto llega a medianoche.'}
          </PanelFinal>
        ) : (
          <>
            <Buscador opciones={personajes} excluir={new Set(intentos)} onElegir={intentar} />
            <div className="flex items-center justify-between text-sm text-niebla">
              <span>{lista.length ? `${lista.length} ${lista.length === 1 ? 'intento' : 'intentos'}` : 'Empieza por cualquier personaje.'}</span>
              {modo === 'libre' && lista.length > 0 && (
                <button onClick={() => setRendido(true)} className="underline underline-offset-4 hover:text-papel">Rendirse</button>
              )}
            </div>
            <Pistas key={`${modo}-${objetivoId}`} pistas={pistas} />
          </>
        )}
      </div>

      {objetivo && <TablaIntentos intentos={lista} objetivo={objetivo} nuevo={nuevo} />}

      <Leyenda />
    </div>
  )
}

/** Primera pista: un dato que no está en las columnas. */
function datoExtra(p: Personaje) {
  if (p.islaOrigen) return `Nació en ${p.islaOrigen}`
  const oc = p.ocupaciones.find((o) => !['Pirata', 'Civil', 'Animal'].includes(o))
  if (oc) return `Es ${oc.toLowerCase()}`
  if (p.frutas.length) return `Comió la ${p.frutas[0]}`
  return `Debuta en el capítulo ${p.debutCap}`
}

function Leyenda() {
  const items = [
    ['bg-acierto', 'Coincide'],
    ['bg-parcial', 'Coincide en parte'],
    ['bg-fallo', 'No coincide'],
  ] as const
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-niebla">
      {items.map(([c, t]) => (
        <li key={t} className="flex items-center gap-2"><span className={`size-4 rounded ${c}`} />{t}</li>
      ))}
      <li>▲▼ El personaje oculto tiene más o menos</li>
    </ul>
  )
}
