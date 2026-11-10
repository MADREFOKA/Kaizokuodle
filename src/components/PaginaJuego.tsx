import { juego, type IdJuego } from '@/lib/juegos/catalogo'
import { ComoSeJuega } from './ComoSeJuega'
import { Icono } from './Icono'
import { SoloCliente } from './SoloCliente'

/** Cabecera común de cada juego (centrada) + montaje solo en cliente (fecha local, progreso guardado). */
export function PaginaJuego({ id, children }: { id: IdJuego; children: React.ReactNode }) {
  const j = juego(id)
  return (
    <div className="space-y-6">
      <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-tinta/80 ring-1 ring-tinta-2 backdrop-blur">
          <Icono id={id} color={j.color} size={40} />
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{j.nombre}</h1>
        <p className="mt-2 text-niebla [text-shadow:0_1px_10px_rgb(14_21_48)]">{j.descripcion}</p>
        <div className="mt-3"><ComoSeJuega id={id} /></div>
      </header>
      <SoloCliente reemplazo={<div className="mx-auto h-28 max-w-2xl animate-pulse rounded-2xl bg-tinta" aria-label="Cargando" />}>{children}</SoloCliente>
    </div>
  )
}
