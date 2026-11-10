import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Escena } from '@/components/Escena'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Fokagames', template: '%s · Fokagames' },
  description: 'Minijuegos de One Piece. Un reto nuevo cada día.',
}

export const viewport: Viewport = { themeColor: '#0e1530' }

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="relative isolate flex min-h-full flex-col">
        <Escena />
        <header>
          <nav className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
              Foka<span className="text-berry">games</span>
            </Link>
            <Link href="/" className="rounded-full px-4 py-1.5 text-sm font-bold text-niebla ring-1 ring-tinta-2 hover:text-papel">Todos los juegos</Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8">{children}</main>
        <footer className="px-4 py-6 text-center text-sm text-niebla">
          Datos de One Piece Base de Datos. One Piece pertenece a Eiichiro Oda.
        </footer>
      </body>
    </html>
  )
}
