import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Fondo } from '@/components/Fondo'
import { AjusteSpoilers } from '@/components/AjusteSpoilers'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './globals.css'

// URL pública (GitHub Pages); se usa para la imagen al compartir enlaces.
const SITIO = `https://madrefoka.github.io${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: { default: 'Fokagames', template: '%s · Fokagames' },
  description: 'Minijuegos de One Piece. Un reto nuevo cada día.',
  openGraph: {
    type: 'website',
    siteName: 'Fokagames',
    locale: 'es_ES',
    images: [{ url: `${SITIO}og.png`, width: 1200, height: 630, alt: 'Fokagames: minijuegos de One Piece, cada día' }],
  },
  twitter: { card: 'summary_large_image', images: [`${SITIO}og.png`] },
}

export const viewport: Viewport = { themeColor: '#0e1530' }

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="relative isolate flex min-h-full flex-col">
        <Fondo />
        <header>
          <nav className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
              Foka<span className="text-berry">games</span>
            </Link>
            <div className="flex items-center gap-2">
              <AjusteSpoilers />
              <Link href="/" className="hidden rounded-full px-4 py-1.5 text-sm font-bold text-niebla ring-1 ring-tinta-2 hover:text-papel sm:block">Todos los juegos</Link>
            </div>
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
