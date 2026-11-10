'use client'
import { useMemo, useState } from 'react'
import { hoy, rngDiario } from '@/lib/azar'
import { guardarDiario, leerDiario } from '@/lib/guardado'
import { INTENTOS, POR_PARTIDA, esCorrecta, generarPreguntas, type FrutaJuego, type Pregunta, type UsuarioJuego } from '@/lib/juegos/fruta'
import { Buscador } from '../Buscador'
import { Retrato } from '../Retrato'
import { Boton, PanelFinal, SelectorModo, copiar, type Modo } from '../ui'

/** Respuestas dadas por pregunta (ids); la pregunta acaba al acertar o al gastar los intentos. */
type Estado = { preguntas: Pregunta[]; respuestas: number[][] }

export function AdivinaFruta({ frutas, personajes }: { frutas: FrutaJuego[]; personajes: UsuarioJuego[] }) {
  const porId = useMemo(() => new Map(personajes.map((p) => [p.id, p])), [personajes])
  const frutaPorId = useMemo(() => new Map(frutas.map((f) => [f.id, f])), [frutas])
  const opcionesFruta = useMemo(() => frutas.map((f) => ({ id: f.id, nombre: f.nombre, imagen: null, sub: f.tipo })), [frutas])

  const diaria = () => {
    const fecha = hoy()
    const preguntas = generarPreguntas(frutas, porId, rngDiario('fruta', fecha), POR_PARTIDA, 2)
    return { fecha, estado: leerDiario<Estado>('fruta', fecha) ?? { preguntas, respuestas: preguntas.map(() => []) } }
  }
  const libre = (): Estado => {
    const preguntas = generarPreguntas(frutas, porId, Math.random, POR_PARTIDA, 4)
    return { preguntas, respuestas: preguntas.map(() => []) }
  }
  const [inicial] = useState(diaria)
  const [modo, setModo] = useState<Modo>('diario')
  const [fecha, setFecha] = useState(inicial.fecha)
  const [estado, setEstado] = useState<Estado>(inicial.estado)
  const [copiado, setCopiado] = useState(false)

  const acertada = (i: number) => estado.respuestas[i].some((r) => esCorrecta(estado.preguntas[i], r, frutas))
  const cerrada = (i: number) => acertada(i) || estado.respuestas[i].length >= INTENTOS
  const actual = estado.preguntas.findIndex((_, i) => !cerrada(i))
  const aciertos = estado.preguntas.filter((_, i) => acertada(i)).length

  const responder = (id: number) => {
    const respuestas = estado.respuestas.map((r, i) => (i === actual ? [...r, id] : r))
    const e = { ...estado, respuestas }
    setEstado(e)
    if (modo === 'diario') guardarDiario('fruta', fecha, e)
  }

  const cambiarModo = (m: Modo) => {
    setModo(m)
    if (m === 'diario') { const d = diaria(); setFecha(d.fecha); setEstado(d.estado) } else setEstado(libre())
  }

  const solucion = (p: Pregunta) => p.tipo === 'usuario'
    ? frutaPorId.get(p.frutaId)!.usuarios.map((u) => porId.get(u)?.nombre).filter(Boolean).join(' / ')
    : frutas.filter((f) => f.usuarios.includes(p.personajeId)).map((f) => f.nombre).join(' / ')

  const compartir = async () => {
    const fila = estado.preguntas.map((_, i) => (acertada(i) ? '🟩' : '🟥')).join('')
    if (await copiar(`Adivina la fruta · ${fecha}\n${aciertos}/${POR_PARTIDA} ${fila}\n${location.origin}${process.env.NEXT_PUBLIC_BASE_PATH}/fruta/`)) {
      setCopiado(true); setTimeout(() => setCopiado(false), 2000)
    }
  }

  const p = actual >= 0 ? estado.preguntas[actual] : null
  const fallos = actual >= 0 ? estado.respuestas[actual] : []

  return (
    <div className="space-y-6">
      <SelectorModo modo={modo} onCambiar={cambiarModo} />

      <ol className="flex max-w-2xl gap-2" aria-label="Progreso">
        {estado.preguntas.map((_, i) => (
          <li key={i} aria-label={`Pregunta ${i + 1}: ${cerrada(i) ? (acertada(i) ? 'acertada' : 'fallada') : i === actual ? 'actual' : 'pendiente'}`}
            className={`h-2 flex-1 rounded-full ${cerrada(i) ? (acertada(i) ? 'bg-acierto' : 'bg-fallo') : i === actual ? 'bg-berry' : 'bg-tinta-2'}`} />
        ))}
      </ol>

      {p ? (
        <section className="max-w-2xl space-y-4 rounded-2xl bg-tinta/90 p-5 backdrop-blur">
          <p className="text-sm text-niebla">Pregunta {actual + 1} de {estado.preguntas.length}</p>
          {p.tipo === 'usuario' ? (
            <div>
              <p className="text-lg">¿Quién ha comido esta fruta?</p>
              <p className="mt-1 font-display text-3xl font-extrabold">{frutaPorId.get(p.frutaId)!.nombre}</p>
              <p className="text-niebla">{frutaPorId.get(p.frutaId)!.tipo}</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Retrato src={porId.get(p.personajeId)?.imagen ?? null} alt="" size={80} />
              <div>
                <p className="text-lg">¿Qué fruta ha comido?</p>
                <p className="mt-1 font-display text-3xl font-extrabold">{porId.get(p.personajeId)?.nombre}</p>
              </div>
            </div>
          )}
          {p.tipo === 'usuario'
            ? <Buscador key={actual} opciones={personajes} excluir={new Set(fallos)} onElegir={(x) => responder(x.id)} autoFocus />
            : <Buscador key={actual} opciones={opcionesFruta} excluir={new Set(fallos)} onElegir={(x) => responder(x.id)} placeholder="Escribe una fruta…" autoFocus />}
          <p className="text-sm text-niebla">
            {fallos.length
              ? `No es ${fallos.map((id) => (p.tipo === 'usuario' ? porId.get(id)?.nombre : frutaPorId.get(id)?.nombre)).join(' ni ')}. Te quedan ${INTENTOS - fallos.length}.`
              : `Tienes ${INTENTOS} intentos.`}
          </p>
        </section>
      ) : (
        <PanelFinal titulo={`${aciertos} de ${estado.preguntas.length} aciertos`}
          acciones={modo === 'diario'
            ? <Boton variante="acento" onClick={compartir}>{copiado ? 'Copiado' : 'Copiar resultado'}</Boton>
            : <Boton variante="primario" onClick={() => setEstado(libre())}>Otra partida</Boton>}>
          {modo === 'diario' && 'Mañana, cinco preguntas nuevas.'}
        </PanelFinal>
      )}

      {estado.preguntas.some((_, i) => cerrada(i)) && (
        <ul className="max-w-2xl space-y-2">
          {estado.preguntas.map((q, i) => cerrada(i) && (
            <li key={i} className={`ficha rounded-xl px-4 py-3 ${acertada(i) ? 'bg-acierto' : 'bg-fallo'}`}>
              <span className="font-bold">{q.tipo === 'usuario' ? frutaPorId.get(q.frutaId)!.nombre : porId.get(q.personajeId)?.nombre}</span>
              <span className="opacity-90">: {solucion(q)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
