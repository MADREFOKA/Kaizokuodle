'use client'
import { useId, useMemo, useState } from 'react'
import { normalizar } from '@/lib/texto'
import { Retrato } from './Retrato'

type Opcion = { id: number; nombre: string; imagen: string | null; sub?: string }

type Props<T extends Opcion> = {
  opciones: T[]
  excluir?: Set<number>
  onElegir: (p: T) => void
  deshabilitado?: boolean
  placeholder?: string
  autoFocus?: boolean
}

/** Combobox de búsqueda por nombre (sin acentos), para personajes o frutas. */
export function Buscador<T extends Opcion>({ opciones, excluir, onElegir, deshabilitado, placeholder = 'Escribe un personaje…', autoFocus }: Props<T>) {
  const [texto, setTexto] = useState('')
  const [activo, setActivo] = useState(0)
  const id = useId()

  const indice = useMemo(() => opciones.map((p) => ({ p, n: normalizar(p.nombre) })), [opciones])

  const resultados = useMemo(() => {
    const q = normalizar(texto)
    if (!q) return []
    return indice
      .filter(({ p, n }) => !excluir?.has(p.id) && n.includes(q))
      .sort((a, b) => Number(!a.n.startsWith(q)) - Number(!b.n.startsWith(q)) || a.n.length - b.n.length)
      .slice(0, 8)
      .map(({ p }) => p)
  }, [texto, indice, excluir])

  const elegir = (p: T) => {
    onElegir(p)
    setTexto('')
    setActivo(0)
  }

  const abierto = resultados.length > 0

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">Escribe el nombre de un personaje</label>
      <input
        id={id}
        role="combobox"
        aria-expanded={abierto}
        aria-controls={`${id}-lista`}
        aria-activedescendant={abierto ? `${id}-${activo}` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        disabled={deshabilitado}
        value={texto}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => { setTexto(e.target.value); setActivo(0) }}
        onKeyDown={(e) => {
          if (!abierto) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setActivo((a) => (a + 1) % resultados.length) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActivo((a) => (a - 1 + resultados.length) % resultados.length) }
          if (e.key === 'Enter') { e.preventDefault(); elegir(resultados[activo]) }
          if (e.key === 'Escape') setTexto('')
        }}
        className="w-full rounded-xl border-2 border-tinta-2 bg-tinta/90 px-4 py-3 text-lg shadow-lg shadow-black/30 backdrop-blur text-papel placeholder:text-niebla/70 focus:border-berry focus-visible:outline-none disabled:opacity-50"
      />
      {abierto && (
        <ul id={`${id}-lista`} role="listbox"
          className="absolute z-20 mt-2 max-h-96 w-full overflow-auto rounded-xl border border-tinta-2 bg-tinta p-1 shadow-2xl shadow-black/40">
          {resultados.map((p, i) => (
            <li key={p.id} id={`${id}-${i}`} role="option" aria-selected={i === activo}
              onMouseEnter={() => setActivo(i)}
              onMouseDown={(e) => { e.preventDefault(); elegir(p) }}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${i === activo ? 'bg-tinta-2' : ''}`}>
              <Retrato src={p.imagen} alt="" size={36} />
              <span className="flex flex-col leading-tight">{p.nombre}{p.sub && <span className="text-xs text-niebla">{p.sub}</span>}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
