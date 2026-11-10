import { juego, type IdJuego } from '@/lib/juegos/catalogo'
import { ComoSeJuega } from './ComoSeJuega'
import { Icono } from './Icono'
import { MontarJuego } from './MontarJuego'
import { BotonEstadisticas } from './Estadisticas'

/** Cabecera común de cada juego (centrada); el juego se monta en el cliente con los datos de datos.json. */
export function PaginaJuego({ id }: { id: IdJuego }) {
  const j = juego(id)
  return (
    <div className="space-y-6">
      <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-tinta/80 ring-1 ring-tinta-2 backdrop-blur">
          <Icono id={id} color={j.color} size={40} />
        </span>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{j.nombre}</h1>
        <p className="mt-2 text-niebla [text-shadow:0_1px_10px_rgb(14_21_48)]">{j.descripcion}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2"><ComoSeJuega id={id} /><BotonEstadisticas id={id} /></div>
      </header>
      <MontarJuego id={id} />
    </div>
  )
}
