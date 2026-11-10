import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { Adivina } from '@/components/adivina/Adivina'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Adivina el personaje' }

export default async function Pagina() {
  return (
    <PaginaJuego id="adivina">
      <Adivina personajes={await getPersonajes()} />
    </PaginaJuego>
  )
}
