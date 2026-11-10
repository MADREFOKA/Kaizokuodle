'use client'
import { useRegistrarDiario } from '@/lib/estadisticas'
import { useMemo, useState } from 'react'
import type { Personaje } from '@/lib/types'
import { hoy } from '@/lib/azar'
import { guardarDiario, leerDiario } from '@/lib/guardado'
import { bancoDeCondiciones, generarConSemilla, generarGrid, respuestas, type Condicion, type Tablero } from '@/lib/juegos/condiciones'
import { Buscador } from '../Buscador'
import { Modal } from '../Modal'
import { Retrato } from '../Retrato'
import { Boton, PanelFinal, SelectorModo, copiar, type Modo } from '../ui'

const INTENTOS = 12
/** casillas[fila * 3 + col] = id del personaje colocado; fallos = intentos incorrectos. */
type Estado = { semilla: string; casillas: (number | null)[]; fallos: number; pistas?: number }
const PISTAS = 3

export function Grid({ personajes }: { personajes: Personaje[] }) {
  const banco = useMemo(() => bancoDeCondiciones(personajes), [personajes])
  const posible = useMemo(() => !!generarConSemilla('grid', hoy(), (r) => generarGrid(personajes, banco, r)), [personajes, banco])
  return posible ? <GridJuego personajes={personajes} banco={banco} /> : (
      <p className="mx-auto max-w-xl rounded-2xl bg-tinta/90 p-5 text-center text-niebla">
        Con los personajes conocidos hasta tu capítulo no hay datos suficientes para este juego. Prueba con un capítulo más avanzado.
      </p>
  )
}

function GridJuego({ personajes, banco }: { personajes: Personaje[]; banco: Condicion[] }) {
  const porId = useMemo(() => new Map(personajes.map((p) => [p.id, p])), [personajes])
  const nuevoEstado = (semilla: string): Estado => ({ semilla, casillas: Array(9).fill(null), fallos: 0 })
  const diario = () => { const f = hoy(); return leerDiario<Estado>('grid', f) ?? nuevoEstado(f) }

  const [modo, setModo] = useState<Modo>('diario')
  const [estado, setEstado] = useState<Estado>(diario)
  const tablero: Tablero = useMemo(() => generarConSemilla('grid', estado.semilla, (r) => generarGrid(personajes, banco, r))!, [personajes, banco, estado.semilla])
  const [celda, setCelda] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [verSoluciones, setVerSoluciones] = useState(false)
  const [pista, setPista] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  const usados = new Set(estado.casillas.filter((x): x is number => x !== null))
  const aciertos = usados.size
  const intentosUsados = aciertos + estado.fallos
  const terminado = aciertos === 9 || intentosUsados >= INTENTOS
  useRegistrarDiario('grid', modo === 'diario' && terminado, estado.semilla, { gano: aciertos === 9, valor: aciertos })
  const condiciones = (i: number) => [tablero.filas[Math.floor(i / 3)], tablero.columnas[i % 3]] as const

  const actualizar = (e: Estado) => { setEstado(e); if (modo === 'diario') guardarDiario('grid', e.semilla, e) }

  const pistasUsadas = estado.pistas ?? 0
  const usarPista = () => {
    if (celda === null || pistasUsadas >= PISTAS) return
    const [f, c] = condiciones(celda)
    const r = respuestas(personajes, f, c).filter((p) => !usados.has(p.id)).sort((a, b) => a.dificultad - b.dificultad)[0]
    if (!r) return setPista('No quedan respuestas libres para esta casilla.')
    setPista(`Una respuesta empieza por «${r.nombre.slice(0, 2)}» y debuta en ${r.debutArco ?? 'un arco desconocido'}.`)
    actualizar({ ...estado, pistas: pistasUsadas + 1 })
  }

  const abrir = (i: number) => { setCelda(i); setPista(null) }

  const intentar = (p: Personaje) => {
    if (celda === null) return
    const [f, c] = condiciones(celda)
    if (f.cumple(p) && c.cumple(p)) {
      actualizar({ ...estado, casillas: estado.casillas.map((x, i) => (i === celda ? p.id : x)) })
      setAviso(null)
    } else {
      actualizar({ ...estado, fallos: estado.fallos + 1 })
      setAviso(`${p.nombre} no cumple ${!f.cumple(p) ? `«${f.texto}»` : `«${c.texto}»`}.`)
    }
    setCelda(null)
  }

  const cambiarModo = (m: Modo) => {
    setModo(m); setAviso(null); setVerSoluciones(false)
    setEstado(m === 'diario' ? diario() : nuevoEstado(`libre-${Math.random()}`))
  }

  const compartir = async () => {
    const filas = [0, 1, 2].map((f) => [0, 1, 2].map((c) => (estado.casillas[f * 3 + c] ? '🟩' : '⬛')).join(''))
    if (await copiar(`Grid · ${estado.semilla}\n${aciertos}/9 en ${intentosUsados} intentos\n${filas.join('\n')}\n${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/grid/`)) {
      setCopiado(true); setTimeout(() => setCopiado(false), 2000)
    }
  }

  const cabecera = 'flex items-center justify-center rounded-xl bg-tinta/70 p-2 text-center font-display text-sm font-bold leading-tight backdrop-blur sm:text-base'

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3">
        <SelectorModo modo={modo} onCambiar={cambiarModo} />
        <p className="text-niebla">
          Intentos: <strong className="tabular-nums text-papel">{Math.max(0, INTENTOS - intentosUsados)}</strong> de {INTENTOS}
          <span className="mx-3 text-tinta-2">|</span>
          Pistas: <strong className="tabular-nums text-papel">{PISTAS - pistasUsadas}</strong>
        </p>
      </div>

      {terminado && (
        <PanelFinal titulo={aciertos === 9 ? '¡Tablero completo!' : `${aciertos} de 9 casillas`}
          acciones={<>
            <Boton onClick={() => setVerSoluciones((v) => !v)}>{verSoluciones ? 'Ocultar respuestas' : 'Ver respuestas'}</Boton>
            {modo === 'diario'
              ? <Boton variante="acento" onClick={compartir}>{copiado ? 'Copiado' : 'Copiar resultado'}</Boton>
              : <Boton variante="primario" onClick={() => cambiarModo('libre')}>Otro tablero</Boton>}
          </>}>
          {aciertos === 9 ? `Con ${estado.fallos} ${estado.fallos === 1 ? 'fallo' : 'fallos'}.` : 'Se han acabado los intentos.'}
          {modo === 'diario' && ' Mañana, tablero nuevo.'}
        </PanelFinal>
      )}

      <p aria-live="polite" className="min-h-6 text-center text-parcial">{aviso}</p>

      <div className="mx-auto grid max-w-2xl grid-cols-[minmax(0,0.8fr)_repeat(3,minmax(0,1fr))] gap-2">
        <div />
        {tablero.columnas.map((c) => <div key={c.id} className={cabecera}>{c.texto}</div>)}
        {tablero.filas.map((f, fi) => (
          <div key={f.id} className="contents">
            <div className={cabecera}>{f.texto}</div>
            {tablero.columnas.map((c, ci) => {
              const i = fi * 3 + ci
              const p = estado.casillas[i] !== null ? porId.get(estado.casillas[i]!) : undefined
              const total = respuestas(personajes, f, c)
              return (
                <button key={c.id} disabled={!!p || terminado} onClick={() => abrir(i)}
                  aria-label={p ? `${f.texto} y ${c.texto}: ${p.nombre}` : `Casilla ${f.texto} y ${c.texto}`}
                  className={`ficha relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-xl p-1 text-center transition ${p ? 'bg-acierto' : 'bg-tinta/90 hover:bg-tinta-2 disabled:hover:bg-tinta/90'} backdrop-blur`}>
                  {p ? (
                    <>
                      <Retrato src={p.imagen} alt="" size={64} />
                      <span className="line-clamp-2 text-xs font-bold leading-tight sm:text-sm">{p.nombre}</span>
                    </>
                  ) : terminado && verSoluciones ? (
                    <span className="text-xs leading-snug text-niebla">
                      {total.slice().sort((a, b) => a.dificultad - b.dificultad).slice(0, 4).map((x) => x.nombre).join(', ')}
                      {total.length > 4 && ` y ${total.length - 4} más`}
                    </span>
                  ) : (
                    <span className="font-display text-3xl text-niebla/50" aria-hidden>+</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <Modal abierto={celda !== null} onCerrar={() => setCelda(null)}
        titulo={celda !== null ? `${condiciones(celda)[0].texto} + ${condiciones(celda)[1].texto}` : ''}>
        <Buscador opciones={personajes} excluir={usados} onElegir={intentar} autoFocus />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-niebla">Cada personaje solo se puede usar una vez. Un fallo gasta un intento.</p>
          {!pista && <Boton onClick={usarPista} disabled={pistasUsadas >= PISTAS}>💡 Pista ({PISTAS - pistasUsadas})</Boton>}
        </div>
        {pista && <p className="mt-3 rounded-xl bg-berry/15 p-3 text-sm ring-1 ring-berry/50">{pista}</p>}
      </Modal>
    </div>
  )
}
