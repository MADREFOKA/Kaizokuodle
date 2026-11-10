import type { Metadata } from 'next'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Recuerda esta escena' }

export default function Pagina() {
  return <PaginaJuego id="escena" />
}
