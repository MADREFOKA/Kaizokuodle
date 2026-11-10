import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { PaginaJuego } from '@/components/PaginaJuego'
import { Conexiones } from '@/components/conexiones/Conexiones'

export const metadata: Metadata = { title: 'Conexiones' }

export default async function Pagina() {
  return (
    <PaginaJuego id="conexiones">
      <Conexiones personajes={await getPersonajes()} />
    </PaginaJuego>
  )
}
