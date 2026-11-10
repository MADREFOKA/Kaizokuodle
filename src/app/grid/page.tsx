import type { Metadata } from 'next'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Grid' }

export default function Pagina() {
  return <PaginaJuego id="grid" />
}
