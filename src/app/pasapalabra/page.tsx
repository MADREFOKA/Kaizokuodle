import type { Metadata } from 'next'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Pasapalabra' }

export default function Pagina() {
  return <PaginaJuego id="pasapalabra" />
}
