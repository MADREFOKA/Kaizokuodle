import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { PaginaJuego } from '@/components/PaginaJuego'
import { Bingo } from '@/components/bingo/Bingo'

export const metadata: Metadata = { title: 'Bingo' }

export default async function Pagina() {
  return (
    <PaginaJuego titulo="Bingo" descripcion="Van saliendo personajes: colócalos en una casilla que cumplan o pasa. Si te equivocas, lo pierdes. Completa el cartón antes de que se acabe el mazo.">
      <Bingo personajes={await getPersonajes()} />
    </PaginaJuego>
  )
}
