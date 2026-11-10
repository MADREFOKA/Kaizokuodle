import { SoloCliente } from './SoloCliente'

/** Cabecera común de cada juego + montaje solo en cliente (fecha local, progreso guardado). */
export function PaginaJuego({ titulo, descripcion, children }: { titulo: string; descripcion: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{titulo}</h1>
        <p className="mt-2 text-niebla">{descripcion}</p>
      </header>
      <SoloCliente reemplazo={<div className="h-28 animate-pulse rounded-2xl bg-tinta" aria-label="Cargando" />}>{children}</SoloCliente>
    </div>
  )
}
