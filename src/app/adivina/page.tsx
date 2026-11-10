import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { Adivina } from '@/components/adivina/Adivina'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Adivina el personaje' }

export default async function Pagina() {
  return (
    <PaginaJuego titulo="Adivina el personaje"
      descripcion="Escribe el nombre de cualquier personaje. Cada intento te dice qué datos comparte con el personaje oculto.">
      <Adivina personajes={await getPersonajes()} />
    </PaginaJuego>
  )
}
