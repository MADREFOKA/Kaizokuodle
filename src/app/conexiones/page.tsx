import type { Metadata } from 'next'
import { getPersonajes } from '@/lib/personajes'
import { PaginaJuego } from '@/components/PaginaJuego'
import { Conexiones } from '@/components/conexiones/Conexiones'

export const metadata: Metadata = { title: 'Conexiones' }

export default async function Pagina() {
  return (
    <PaginaJuego titulo="Conexiones" descripcion="Dieciséis personajes, cuatro grupos de cuatro. Encuentra qué tienen en común. Puedes fallar cuatro veces.">
      <Conexiones personajes={await getPersonajes()} />
    </PaginaJuego>
  )
}
