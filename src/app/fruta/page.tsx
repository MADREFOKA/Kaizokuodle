import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { getFrutas } from '@/lib/frutas'
import { PaginaJuego } from '@/components/PaginaJuego'
import { AdivinaFruta } from '@/components/fruta/AdivinaFruta'

export const metadata: Metadata = { title: 'Adivina la fruta' }

export default async function Pagina() {
  const [personajes, frutas] = await Promise.all([getPersonajes(), getFrutas()])
  return (
    <PaginaJuego id="fruta">
      <AdivinaFruta frutas={frutas} personajes={personajes.map(({ id, nombre, imagen, dificultad, debutArco }) => ({ id, nombre, imagen, dificultad, debutArco }))} />
    </PaginaJuego>
  )
}
