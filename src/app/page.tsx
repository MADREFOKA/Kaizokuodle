import Link from 'next/link'
import { JUEGOS } from '@/lib/juegos/catalogo'
import { Icono } from '@/components/Icono'

export default function Inicio() {
  const listos = JUEGOS.filter((j) => j.listo)
  const proximos = JUEGOS.filter((j) => !j.listo)
  return (
    <div className="space-y-14">
      <section className="mx-auto max-w-3xl pt-6 text-center">
        <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-balance sm:text-7xl">
          Zarpa hacia el reto de hoy
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-niebla text-pretty [text-shadow:0_1px_10px_rgb(14_21_48)]">
          {listos.length} minijuegos de One Piece con más de 1.500 personajes del manga. Cada día, retos nuevos e iguales para todos.
        </p>
        <Link href="/adivina"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-sombrero px-7 py-3.5 font-display text-lg font-bold text-papel shadow-lg shadow-sombrero/30 transition hover:brightness-110">
          Empezar por Adivina el personaje
        </Link>
      </section>

      <section aria-labelledby="todos" className="mx-auto max-w-5xl">
        <h2 id="todos" className="sr-only">Juegos</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listos.map((j, i) => (
            <li key={j.id} className={`${j.ancho ? 'lg:col-span-2' : ''} ${i === 0 ? 'sm:col-span-2' : ''}`}>
              <Link href={j.ruta}
                className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl bg-tinta/85 p-5 ring-1 ring-tinta-2 backdrop-blur transition hover:-translate-y-0.5 hover:ring-2"
                style={{ '--c': j.color } as React.CSSProperties}>
                <span aria-hidden className="absolute -right-10 -top-10 size-36 rounded-full opacity-15 blur-2xl transition group-hover:opacity-30" style={{ background: j.color }} />
                <span className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-xl bg-mar/70"><Icono id={j.id} color={j.color} size={36} /></span>
                  {j.diario && <span className="rounded-full bg-mar/70 px-3 py-1 text-xs font-bold" style={{ color: j.color }}>Reto diario</span>}
                </span>
                <span className="font-display text-xl font-extrabold group-hover:[color:var(--c)]">{j.nombre}</span>
                <span className={`text-niebla ${j.ancho ? 'text-base' : 'text-sm'}`}>{j.descripcion}</span>
              </Link>
            </li>
          ))}
        </ul>

        {proximos.length > 0 && (
          <div className="mt-10 text-center">
            <h3 className="font-display text-lg font-bold text-niebla">Próximamente</h3>
            <ul className="mt-3 flex flex-wrap justify-center gap-3">
              {proximos.map((j) => (
                <li key={j.id} className="flex items-center gap-2 rounded-full bg-tinta/60 py-1.5 pl-2 pr-4 text-sm text-niebla ring-1 ring-tinta-2">
                  <Icono id={j.id} color="#aab2d3" size={24} />{j.nombre}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
