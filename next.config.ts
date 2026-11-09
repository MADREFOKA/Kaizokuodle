import type { NextConfig } from 'next'

// Web estática: los datos de OPBD se leen al compilar (GitHub Actions) y se publica en GitHub Pages.
// BASE_PATH = "/Kaizokuodle" en Pages (madrefoka.github.io/Kaizokuodle); vacío en local.
const basePath = process.env.BASE_PATH ?? ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' },
    },
  },
}

export default nextConfig
