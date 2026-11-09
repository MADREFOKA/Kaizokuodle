import Link from 'next/link'
import { JUEGOS } from '@/lib/juegos/catalogo'

export default function Inicio() {
  const destacado = JUEGOS[0]
  return (
    <div className="space-y-12">
      <section className="max-w-2xl pt-4">
        <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
          Zarpa hacia el reto de hoy
        </h1>
        <p className="mt-4 text-lg text-niebla">
          Minijuegos de One Piece con más de 1.500 personajes del manga. El reto diario es el mismo para todos y cambia a medianoche.
        </p>
        <Link
          href={destacado.ruta}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-sombrero px-6 py-3 font-display text-lg font-bold text-papel transition hover:brightness-110"
        >
          Jugar al reto de hoy
        </Link>
      </section>

      <section aria-labelledby="todos">
        <h2 id="todos" className="font-display text-2xl font-bold">Todos los juegos</h2>
        <ul className="mt-4 divide-y divide-tinta-2 border-y border-tinta-2">
          {JUEGOS.map((j) => (
            <li key={j.ruta}>
              {j.listo ? (
                <Link href={j.ruta} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6 hover:text-berry">
                  <span className="font-display text-xl font-bold sm:w-72">{j.nombre}</span>
                  <span className="text-niebla">{j.descripcion}</span>
                </Link>
              ) : (
                <div className="flex flex-col gap-1 py-4 opacity-60 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="font-display text-xl font-bold sm:w-72">{j.nombre}</span>
                  <span className="text-niebla">{j.descripcion} <em className="not-italic text-berry">En preparación.</em></span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
