import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { PaginaJuego } from '@/components/PaginaJuego'
import { Cronologia } from '@/components/cronologia/Cronologia'
import type { ConDebut } from '@/lib/juegos/cronologia'

export const metadata: Metadata = { title: 'Cronología' }

export default async function Pagina() {
  const personajes: ConDebut[] = (await getPersonajes())
    .filter((p) => p.debutCap && p.debutArco)
    .map(({ id, nombre, imagen, debutCap, debutArco, dificultad }) => ({ id, nombre, imagen, debutCap: debutCap!, debutArco: debutArco!, dificultad }))
  return (
    <PaginaJuego titulo="Cronología" descripcion="Ordena a los personajes según el capítulo en que aparecen por primera vez en el manga.">
      <Cronologia personajes={personajes} />
    </PaginaJuego>
  )
}
