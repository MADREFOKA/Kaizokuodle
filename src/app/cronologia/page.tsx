import type { Metadata } from 'next'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Cronología' }

export default function Pagina() {
  return <PaginaJuego id="cronologia" />
}
