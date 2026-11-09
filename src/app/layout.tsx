import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Fokagames', template: '%s · Fokagames' },
  description: 'Minijuegos de One Piece. Un reto nuevo cada día.',
}

export const viewport: Viewport = { themeColor: '#0f2c40' }

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <header className="border-b border-tinta-2/70">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
              Foka<span className="text-sombrero">games</span>
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="px-4 py-6 text-center text-sm text-niebla">
          Datos de One Piece Base de Datos. One Piece pertenece a Eiichiro Oda.
        </footer>
      </body>
    </html>
  )
}
