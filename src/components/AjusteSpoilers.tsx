'use client'
import { useState } from 'react'
import { setCapitulo, useCapitulo } from '@/lib/capitulo'
import { Modal } from './Modal'
import { Boton } from './ui'

const MINIMO = 100

/** Botón de la cabecera para elegir hasta qué capítulo vas (modo sin spoilers). */
export function AjusteSpoilers() {
  const capitulo = useCapitulo()
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <button onClick={() => setAbierto(true)}
        className={`rounded-full px-4 py-1.5 text-sm font-bold ring-1 transition ${capitulo ? 'bg-berry/15 text-berry ring-berry/60' : 'text-niebla ring-tinta-2 hover:text-papel'}`}>
        {capitulo ? `Sin spoilers: cap. ${capitulo}` : 'Sin spoilers'}
      </button>
      <Modal abierto={abierto} onCerrar={() => setAbierto(false)} titulo="Modo sin spoilers">
        <FormularioCapitulo actual={capitulo} onListo={() => setAbierto(false)} />
      </Modal>
    </>
  )
}

function FormularioCapitulo({ actual, onListo }: { actual: number | null; onListo: () => void }) {
  const [valor, setValor] = useState(actual ? String(actual) : '')
  const n = Number(valor)
  const valido = Number.isInteger(n) && n >= MINIMO && n <= 2000
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (valido) { setCapitulo(n); onListo() } }}>
      <p className="text-papel/90">
        Dinos por qué capítulo del manga vas y los juegos solo usarán personajes y datos conocidos hasta ahí: recompensas,
        afiliaciones, frutas, haki y muertes.
      </p>
      <label className="block">
        <span className="text-sm text-niebla">Voy por el capítulo</span>
        <input type="number" inputMode="numeric" min={MINIMO} max={2000} value={valor} onChange={(e) => setValor(e.target.value)} autoFocus
          className="mt-1 w-full rounded-xl border-2 border-tinta-2 bg-mar px-4 py-3 text-lg focus:border-berry focus-visible:outline-none" />
      </label>
      <p className="text-sm text-niebla">
        Desde el capítulo {MINIMO}: antes hay muy pocos personajes para que los juegos funcionen.
        Si de un personaje muerto no sabemos en qué capítulo murió, su estado aparecerá como «Desconocido».
      </p>
      <div className="flex flex-wrap justify-end gap-2">
        {actual && <Boton type="button" onClick={() => { setCapitulo(null); onListo() }}>Estoy al día</Boton>}
        <Boton type="submit" variante="primario" disabled={!valido}>Guardar</Boton>
      </div>
    </form>
  )
}

/** Recordatorio dentro de cada juego cuando el modo está activo. */
export function AvisoSpoilers() {
  const capitulo = useCapitulo()
  if (!capitulo) return null
  return (
    <p className="mx-auto w-fit rounded-full bg-berry/15 px-4 py-1.5 text-center text-sm text-berry ring-1 ring-berry/50">
      Sin spoilers: solo datos hasta el capítulo {capitulo}.
    </p>
  )
}
