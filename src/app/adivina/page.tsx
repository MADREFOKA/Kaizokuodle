import type { Metadata } from 'next'
import { PaginaJuego } from '@/components/PaginaJuego'

export const metadata: Metadata = { title: 'Adivina el personaje' }

export default function Pagina() {
  return <PaginaJuego id="adivina" />
}
