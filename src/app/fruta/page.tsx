import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { getFrutas } from '@/lib/frutas'
import { PaginaJuego } from '@/components/PaginaJuego'
import { AdivinaFruta } from '@/components/fruta/AdivinaFruta'

export const metadata: Metadata = { title: 'Adivina la fruta' }

export default async function Pagina() {
  const [personajes, frutas] = await Promise.all([getPersonajes(), getFrutas()])
  return (
    <PaginaJuego titulo="Adivina la fruta" descripcion="Cinco preguntas: a veces te damos la fruta del diablo y buscas a quien la comió; otras, al revés. Tres intentos por pregunta.">
      <AdivinaFruta frutas={frutas} personajes={personajes.map(({ id, nombre, imagen, dificultad }) => ({ id, nombre, imagen, dificultad }))} />
    </PaginaJuego>
  )
}
