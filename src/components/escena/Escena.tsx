'use client'
/* eslint-disable @next/next/no-img-element -- imágenes estáticas de la propia web */
import { useMemo, useState } from 'react'
import type { Escena as TEscena, Personaje } from '@/lib/types'
import { hoy } from '@/lib/azar'
import { guardarDiario, leerDiario } from '@/lib/guardado'
import { useRegistrarDiario } from '@/lib/estadisticas'
import { Buscador } from '../Buscador'
import { Retrato } from '../Retrato'
import { Boton, PanelFinal, SelectorModo, copiar, type Modo } from '../ui'

const FALLOS = 3
type Estado = { escena: number; encontrados: number[]; fallos: number[] }

const ruta = (f: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/${f}`
/** Días desde una fecha fija: el reto diario recorre las escenas en orden y vuelve a empezar. */
const numeroDeDia = (fecha: string) => Math.floor(Date.parse(`${fecha}T12:00:00Z`) / 86_400_000)

export function Escena({ escenas, personajes }: { escenas: TEscena[]; personajes: Personaje[] }) {
  if (!escenas.length) {
    return <p className="mx-auto max-w-xl rounded-2xl bg-tinta/90 p-5 text-center text-niebla">Todavía no hay escenas disponibles. Vuelve pronto.</p>
  }
  return <EscenaJuego escenas={escenas} personajes={personajes} />
}

function EscenaJuego({ escenas, personajes }: { escenas: TEscena[]; personajes: Personaje[] }) {
  const porId = useMemo(() => new Map(personajes.map((p) => [p.id, p])), [personajes])
  const nueva = (id: number): Estado => ({ escena: id, encontrados: [], fallos: [] })
  const diaria = () => {
    const f = hoy()
    const e = escenas[numeroDeDia(f) % escenas.length]
    const g = leerDiario<Estado>('escena', f)
    return { fecha: f, estado: g && g.escena === e.id ? g : nueva(e.id) }
  }
  const [inicial] = useState(diaria)
  const [modo, setModo] = useState<Modo>('diario')
  const [fecha, setFecha] = useState(inicial.fecha)
  const [estado, setEstado] = useState<Estado>(inicial.estado)
  const [verSolucion, setVerSolucion] = useState(true)
  const [copiado, setCopiado] = useState(false)

  const escena = escenas.find((e) => e.id === estado.escena)!
  const total = escena.personajes.length
  const completa = estado.encontrados.length === total
  const terminado = completa || estado.fallos.length >= FALLOS
  useRegistrarDiario('escena', modo === 'diario' && terminado, fecha, { gano: completa, valor: estado.encontrados.length })

  const actualizar = (e: Estado) => { setEstado(e); if (modo === 'diario') guardarDiario('escena', fecha, e) }
  const intentar = (p: Personaje) => {
    if (escena.personajes.includes(p.id)) actualizar({ ...estado, encontrados: [...estado.encontrados, p.id] })
    else actualizar({ ...estado, fallos: [...estado.fallos, p.id] })
  }

  const otraLibre = () => {
    const resto = escenas.filter((e) => e.id !== estado.escena)
    setEstado(nueva((resto.length ? resto : escenas)[Math.floor(Math.random() * (resto.length || escenas.length))].id))
    setVerSolucion(true)
  }
  const cambiarModo = (m: Modo) => {
    setModo(m); setVerSolucion(true)
    if (m === 'diario') { const d = diaria(); setFecha(d.fecha); setEstado(d.estado) } else otraLibre()
  }

  const faltan = escena.personajes.filter((id) => !estado.encontrados.includes(id))
  const pistaInicial = faltan.length ? porId.get(faltan[0])?.nombre[0] : null

  const compartir = async () => {
    const t = `Recuerda esta escena · ${fecha}\n${estado.encontrados.length}/${total} ${'🟩'.repeat(estado.encontrados.length)}${'🟥'.repeat(estado.fallos.length)}\n${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/escena/`
    if (await copiar(t)) { setCopiado(true); setTimeout(() => setCopiado(false), 2000) }
  }

  const imagen = terminado && verSolucion ? escena.solucion : escena.imagen

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3">
        <SelectorModo modo={modo} onCambiar={cambiarModo} />
        <p className="text-niebla">
          {total === 1 ? 'Falta 1 personaje' : `Faltan ${total} personajes`}
          <span className="mx-3 text-tinta-2">|</span>
          Fallos: <strong className="tabular-nums text-papel">{estado.fallos.length}</strong> de {FALLOS}
        </p>
      </div>

      <figure className="mx-auto max-w-3xl overflow-hidden rounded-2xl ring-1 ring-tinta-2 shadow-xl shadow-black/40">
        <img src={ruta(imagen)} alt={terminado && verSolucion ? 'La escena completa' : 'La escena sin los personajes que hay que adivinar'}
          className="mx-auto max-h-[70vh] w-full bg-mar object-contain" />
        {terminado && (
          <figcaption className="flex justify-center gap-2 bg-tinta/90 p-2">
            <Boton onClick={() => setVerSolucion((v) => !v)}>{verSolucion ? 'Ver sin personajes' : 'Ver escena completa'}</Boton>
          </figcaption>
        )}
      </figure>

      {estado.encontrados.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-2" aria-label="Encontrados">
          {estado.encontrados.map((id) => (
            <li key={id} className="ficha flex items-center gap-2 rounded-xl bg-acierto py-1.5 pl-1.5 pr-3 font-bold">
              <Retrato src={porId.get(id)?.imagen ?? null} alt="" size={32} />{porId.get(id)?.nombre}
            </li>
          ))}
        </ul>
      )}

      {terminado ? (
        <PanelFinal titulo={completa ? '¡Escena completa!' : `${estado.encontrados.length} de ${total}`}
          acciones={modo === 'diario'
            ? <Boton variante="acento" onClick={compartir}>{copiado ? 'Copiado' : 'Copiar resultado'}</Boton>
            : <Boton variante="primario" onClick={otraLibre}>Otra escena</Boton>}>
          {completa ? `Con ${estado.fallos.length} ${estado.fallos.length === 1 ? 'fallo' : 'fallos'}.` : `Faltaban: ${faltan.map((id) => porId.get(id)?.nombre).join(', ')}.`}
        </PanelFinal>
      ) : (
        <div className="mx-auto max-w-2xl space-y-3">
          <Buscador opciones={personajes} excluir={new Set([...estado.encontrados, ...estado.fallos])} onElegir={intentar} placeholder="¿Quién falta en la escena?" />
          {estado.fallos.length > 0 && (
            <p className="text-center text-sm text-niebla">No es {estado.fallos.map((id) => porId.get(id)?.nombre).join(' ni ')}.</p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            {estado.fallos.length >= 1 && escena.pista && (
              <p className="rounded-xl bg-berry/15 px-4 py-2 text-sm ring-1 ring-berry/50"><span className="font-bold text-berry">Pista:</span> «{escena.pista}»</p>
            )}
            {estado.fallos.length >= 2 && pistaInicial && (
              <p className="rounded-xl bg-berry/15 px-4 py-2 text-sm ring-1 ring-berry/50"><span className="font-bold text-berry">Pista:</span> uno empieza por «{pistaInicial}»</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
