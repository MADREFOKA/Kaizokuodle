import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { PaginaJuego } from '@/components/PaginaJuego'
import { Grid } from '@/components/grid/Grid'

export const metadata: Metadata = { title: 'Grid' }

export default async function Pagina() {
  return (
    <PaginaJuego titulo="Grid" descripcion="Cada casilla pide un personaje que cumpla a la vez la condición de su fila y la de su columna. Tienes 12 intentos para las 9 casillas.">
      <Grid personajes={await getPersonajes()} />
    </PaginaJuego>
  )
}
