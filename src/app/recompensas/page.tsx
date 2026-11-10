import type { Metadata } from 'next'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Mayor o menor' }

export default function Pagina() {
  return <PaginaJuego id="recompensas" />
}
