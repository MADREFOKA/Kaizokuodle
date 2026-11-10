import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { PaginaJuego } from '@/components/PaginaJuego'
import { Grid } from '@/components/grid/Grid'

export const metadata: Metadata = { title: 'Grid' }

export default async function Pagina() {
  return (
    <PaginaJuego id="grid">
      <Grid personajes={await getPersonajes()} />
    </PaginaJuego>
  )
}
