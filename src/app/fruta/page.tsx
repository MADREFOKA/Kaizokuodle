import type { Metadata } from 'next'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Adivina la fruta' }

export default function Pagina() {
  return <PaginaJuego id="fruta" />
}
