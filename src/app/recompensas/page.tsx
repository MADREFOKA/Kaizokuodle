import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { PaginaJuego } from '@/components/PaginaJuego'
import { MayorMenor, type ConRecompensa } from '@/components/recompensas/MayorMenor'

export const metadata: Metadata = { title: 'Mayor o menor' }

export default async function Pagina() {
  const personajes: ConRecompensa[] = (await getPersonajes())
    .filter((p) => p.recompensa)
    .map(({ id, nombre, imagen, recompensa, dificultad, afiliaciones, debutArco }) => ({ id, nombre, imagen, recompensa: recompensa!, dificultad, afiliaciones, debutArco }))
  return (
    <PaginaJuego id="recompensas">
      <MayorMenor personajes={personajes} />
    </PaginaJuego>
  )
}
