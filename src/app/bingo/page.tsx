import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { PaginaJuego } from '@/components/PaginaJuego'
import { Bingo } from '@/components/bingo/Bingo'

export const metadata: Metadata = { title: 'Bingo' }

export default async function Pagina() {
  return (
    <PaginaJuego id="bingo">
      <Bingo personajes={await getPersonajes()} />
    </PaginaJuego>
  )
}
