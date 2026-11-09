import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { Adivina } from '@/components/adivina/Adivina'
import { SoloCliente } from '@/components/SoloCliente'

export const metadata: Metadata = { title: 'Adivina el personaje' }

export default async function Pagina() {
  const personajes = await getPersonajes()
  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Adivina el personaje</h1>
        <p className="mt-2 text-niebla">
          Escribe el nombre de cualquier personaje. Cada intento te dice qué datos comparte con el personaje oculto.
        </p>
      </header>
      <SoloCliente reemplazo={<div className="h-28 animate-pulse rounded-2xl bg-tinta" aria-label="Cargando" />}>
        <Adivina personajes={personajes} />
      </SoloCliente>
    </div>
  )
}
