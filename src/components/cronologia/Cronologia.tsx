'use client'
import { useState } from 'react'
import { hoy, rngDiario } from '@/lib/azar'
import { guardarDiario, leerDiario } from '@/lib/guardado'
import { corregir, generarRonda, type ConDebut } from '@/lib/juegos/cronologia'
import { Retrato } from '../Retrato'
import { Boton, PanelFinal, SelectorModo, copiar, type Modo } from '../ui'

type Estado = { orden: number[]; intentos: boolean[][] }

export function Cronologia({ personajes }: { personajes: ConDebut[] }) {
  const porId = new Map(personajes.map((p) => [p.id, p]))
  const diaria = () => {
    const fecha = hoy()
    const ronda = generarRonda(personajes, rngDiario('cronologia', fecha), 3)
    const guardado = leerDiario<Estado>('cronologia', fecha)
    return { fecha, estado: guardado ?? { orden: ronda.map((p) => p.id), intentos: [] } }
  }
  const [inicial] = useState(diaria)
  const [modo, setModo] = useState<Modo>('diario')
  const [fecha, setFecha] = useState(inicial.fecha)
  const [estado, setEstado] = useState<Estado>(inicial.estado)
  const [arrastrando, setArrastrando] = useState<number | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [verArcos, setVerArcos] = useState(false)

  const orden = estado.orden.map((id) => porId.get(id)!).filter(Boolean)
  const ultimo = estado.intentos.at(-1)
  const resuelto = !!ultimo && ultimo.every(Boolean)

  const actualizar = (e: Estado) => {
    setEstado(e)
    if (modo === 'diario') guardarDiario('cronologia', fecha, e)
  }

  const mover = (de: number, a: number) => {
    if (resuelto || a < 0 || a >= orden.length || de === a) return
    const nuevo = [...estado.orden]
    const [x] = nuevo.splice(de, 1)
    nuevo.splice(a, 0, x)
    actualizar({ ...estado, orden: nuevo })
  }

  const comprobar = () => actualizar({ ...estado, intentos: [...estado.intentos, corregir(orden)] })

  const cambiarModo = (m: Modo) => {
    setModo(m); setVerArcos(false)
    if (m === 'diario') { const d = diaria(); setFecha(d.fecha); setEstado(d.estado) }
    else nuevaLibre()
  }
  const nuevaLibre = () => { setVerArcos(false); return setEstado({ orden: generarRonda(personajes, Math.random, 4).map((p) => p.id), intentos: [] }) }

  // Tras comprobar, cada posición se marca hasta que vuelvas a mover algo.
  const marcas = ultimo && estado.intentos.length && corregir(orden).every((v, i) => v === ultimo[i]) ? ultimo : null

  const compartir = async () => {
    const filas = estado.intentos.map((f) => f.map((v) => (v ? '🟩' : '🟥')).join(''))
    if (await copiar(`Cronología · ${fecha}\n${filas.join('\n')}\n${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/cronologia/`)) {
      setCopiado(true); setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center"><SelectorModo modo={modo} onCambiar={cambiarModo} /></div>

      {resuelto && (
        <PanelFinal titulo="¡Orden correcto!"
          acciones={modo === 'diario'
            ? <Boton variante="acento" onClick={compartir}>{copiado ? 'Copiado' : 'Copiar resultado'}</Boton>
            : <Boton variante="primario" onClick={nuevaLibre}>Otra ronda</Boton>}>
          {estado.intentos.length === 1 ? 'A la primera.' : `En ${estado.intentos.length} intentos.`}
          {modo === 'diario' && ' Mañana, otra ronda.'}
        </PanelFinal>
      )}

      <div className="mx-auto max-w-xl space-y-2">
        <p className="text-sm text-niebla">Primera aparición</p>
        <ol className="space-y-2">
          {orden.map((p, i) => {
            const marca = marcas?.[i]
            const color = resuelto || marca ? 'bg-acierto' : marca === false ? 'bg-fallo' : 'bg-tinta/90'
            return (
              <li key={p.id}
                draggable={!resuelto}
                onDragStart={() => setArrastrando(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (arrastrando !== null) mover(arrastrando, i); setArrastrando(null) }}
                onDragEnd={() => setArrastrando(null)}
                className={`ficha flex items-center gap-3 rounded-xl p-2 pr-3 backdrop-blur transition-colors ${color} ${!resuelto ? 'cursor-grab active:cursor-grabbing' : ''} ${arrastrando === i ? 'opacity-50' : ''}`}>
                <span className="w-6 text-center font-display text-lg font-extrabold text-papel/70">{i + 1}</span>
                <Retrato src={p.imagen} alt="" size={48} />
                <span className="flex-1 font-display font-bold leading-tight">
                  {p.nombre}
                  {resuelto ? <span className="block font-sans text-sm font-normal opacity-85">{p.debutArco}, cap. {p.debutCap}</span>
                    : verArcos && <span className="block font-sans text-sm font-normal opacity-85">Debuta en {p.debutArco}</span>}
                </span>
                {!resuelto && (
                  <span className="flex gap-1">
                    <button aria-label={`Subir a ${p.nombre}`} disabled={i === 0} onClick={() => mover(i, i - 1)}
                      className="grid size-9 place-items-center rounded-lg bg-black/20 hover:bg-black/35 disabled:opacity-30">▲</button>
                    <button aria-label={`Bajar a ${p.nombre}`} disabled={i === orden.length - 1} onClick={() => mover(i, i + 1)}
                      className="grid size-9 place-items-center rounded-lg bg-black/20 hover:bg-black/35 disabled:opacity-30">▼</button>
                  </span>
                )}
              </li>
            )
          })}
        </ol>
        <p className="text-sm text-niebla">Última aparición</p>
      </div>

      {!resuelto && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Boton variante="primario" onClick={comprobar}>Comprobar</Boton>
          {estado.intentos.length > 0 && !verArcos && <Boton onClick={() => setVerArcos(true)}>💡 Ver arcos de debut</Boton>}
          <span className="text-sm text-niebla">
            {estado.intentos.length ? `${estado.intentos.length} ${estado.intentos.length === 1 ? 'intento' : 'intentos'}` : 'Arrastra o usa las flechas para ordenar.'}
          </span>
        </div>
      )}
    </div>
  )
}
