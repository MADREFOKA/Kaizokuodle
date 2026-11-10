'use client'
import { useMemo, useState } from 'react'
import type { Personaje } from '@/lib/types'
import { barajar, hoy, rngDiario } from '@/lib/azar'
import { guardarDiario, leerDiario } from '@/lib/guardado'
import { bancoDeCondiciones, generarConexiones } from '@/lib/juegos/condiciones'
import { Retrato } from '../Retrato'
import { Boton, PanelFinal, SelectorModo, copiar, type Modo } from '../ui'

const FALLOS = 4
const COLORES = ['bg-berry text-mar', 'bg-acierto', 'bg-[#4a7fd6]', 'bg-[#8a5bd6]']
const EMOJI = ['🟨', '🟩', '🟦', '🟪']

/** resueltos: índices de grupo en orden de acierto; intentos: cada envío (ids) para compartir. */
type Estado = { semilla: string; resueltos: number[]; intentos: number[][]; fallos: number }

export function Conexiones({ personajes }: { personajes: Personaje[] }) {
  const banco = useMemo(() => bancoDeCondiciones(personajes), [personajes])
  const nuevo = (semilla: string): Estado => ({ semilla, resueltos: [], intentos: [], fallos: 0 })
  const diario = () => { const f = hoy(); return leerDiario<Estado>('conexiones', f) ?? nuevo(f) }

  const [modo, setModo] = useState<Modo>('diario')
  const [estado, setEstado] = useState<Estado>(diario)
  const grupos = useMemo(() => generarConexiones(personajes, banco, rngDiario('conexiones', estado.semilla))!, [personajes, banco, estado.semilla])
  const grupoDe = useMemo(() => new Map(grupos.flatMap((g, i) => g.personajes.map((p) => [p.id, i] as const))), [grupos])
  const [orden, setOrden] = useState<number[]>(() => barajar(grupos.flatMap((g) => g.personajes.map((p) => p.id)), Math.random))
  const [seleccion, setSeleccion] = useState<number[]>([])
  const [aviso, setAviso] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  const porId = new Map(grupos.flatMap((g) => g.personajes).map((p) => [p.id, p]))
  const perdido = estado.fallos >= FALLOS
  const terminado = perdido || estado.resueltos.length === 4
  // Al perder se muestran todos los grupos que faltaban.
  const visibles = terminado ? [...estado.resueltos, ...[0, 1, 2, 3].filter((i) => !estado.resueltos.includes(i))] : estado.resueltos
  const sueltos = orden.filter((id) => !visibles.includes(grupoDe.get(id)!))

  const actualizar = (e: Estado) => { setEstado(e); if (modo === 'diario') guardarDiario('conexiones', e.semilla, e) }

  const alternar = (id: number) => {
    setAviso(null)
    setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s))
  }

  const enviar = () => {
    const repetido = estado.intentos.some((t) => t.length === 4 && t.every((id) => seleccion.includes(id)))
    if (repetido) return setAviso('Ya has probado esa combinación.')
    const cuenta = new Map<number, number>()
    for (const id of seleccion) cuenta.set(grupoDe.get(id)!, (cuenta.get(grupoDe.get(id)!) ?? 0) + 1)
    const max = Math.max(...cuenta.values())
    const intentos = [...estado.intentos, seleccion]
    if (max === 4) {
      actualizar({ ...estado, intentos, resueltos: [...estado.resueltos, grupoDe.get(seleccion[0])!] })
      setSeleccion([])
    } else {
      actualizar({ ...estado, intentos, fallos: estado.fallos + 1 })
      setAviso(max === 3 ? 'Te falta uno.' : 'No es un grupo.')
    }
  }

  const cambiarModo = (m: Modo) => {
    const e = m === 'diario' ? diario() : nuevo(`libre-${Math.random()}`)
    setModo(m); setEstado(e); setSeleccion([]); setAviso(null)
    const g = generarConexiones(personajes, banco, rngDiario('conexiones', e.semilla))!
    setOrden(barajar(g.flatMap((x) => x.personajes.map((p) => p.id)), Math.random))
  }

  const compartir = async () => {
    const filas = estado.intentos.map((t) => t.map((id) => EMOJI[grupoDe.get(id)!]).join(''))
    if (await copiar(`Conexiones · ${estado.semilla}\n${filas.join('\n')}\n${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/conexiones/`)) {
      setCopiado(true); setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <SelectorModo modo={modo} onCambiar={cambiarModo} />
        <p className="flex items-center gap-2 text-niebla">
          Fallos restantes:
          <span className="flex gap-1" aria-label={`${FALLOS - estado.fallos} de ${FALLOS}`}>
            {Array.from({ length: FALLOS }, (_, i) => (
              <span key={i} className={`size-3 rounded-full ${i < FALLOS - estado.fallos ? 'bg-papel' : 'bg-tinta-2'}`} />
            ))}
          </span>
        </p>
      </div>

      {visibles.map((gi) => {
        const g = grupos[gi]
        return (
          <section key={gi} className={`ficha rounded-xl px-4 py-3 text-center ${COLORES[gi]} ${terminado && !estado.resueltos.includes(gi) ? 'opacity-75' : ''}`}>
            <p className="font-display text-lg font-extrabold">{g.condicion.texto}</p>
            <p className="text-sm">{g.personajes.map((p) => p.nombre).join(', ')}</p>
          </section>
        )
      })}

      {sueltos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sueltos.map((id) => {
            const p = porId.get(id)!
            const sel = seleccion.includes(id)
            return (
              <button key={id} aria-pressed={sel} onClick={() => alternar(id)}
                className={`ficha flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center transition ${sel ? 'bg-papel text-mar' : 'bg-tinta/90 hover:bg-tinta-2'} backdrop-blur`}>
                <Retrato src={p.imagen} alt="" size={44} />
                <span className="text-sm font-bold leading-tight">{p.nombre}</span>
              </button>
            )
          })}
        </div>
      )}

      <p aria-live="polite" className="min-h-6 text-parcial">{aviso}</p>

      {terminado ? (
        <PanelFinal titulo={perdido ? 'Sin más fallos' : '¡Los cuatro grupos!'}
          acciones={modo === 'diario'
            ? <Boton variante="acento" onClick={compartir}>{copiado ? 'Copiado' : 'Copiar resultado'}</Boton>
            : <Boton variante="primario" onClick={() => cambiarModo('libre')}>Otra partida</Boton>}>
          {perdido ? 'Arriba tienes los grupos que faltaban.' : `Con ${estado.fallos} ${estado.fallos === 1 ? 'fallo' : 'fallos'}.`}
        </PanelFinal>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Boton onClick={() => setOrden((o) => barajar(o, Math.random))}>Mezclar</Boton>
          <Boton onClick={() => setSeleccion([])} disabled={!seleccion.length}>Deseleccionar</Boton>
          <Boton variante="primario" onClick={enviar} disabled={seleccion.length !== 4}>Enviar</Boton>
        </div>
      )}
    </div>
  )
}
