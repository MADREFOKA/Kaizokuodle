import type { Metadata } from 'next'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Conexiones' }

export default function Pagina() {
  return <PaginaJuego id="conexiones" />
}
