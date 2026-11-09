import { getPersonajes } from '@/lib/personajes'

export const dynamic = 'force-static'

// Se publica como archivo estático (/api/personajes/): el mismo dataset que usan los juegos.
export async function GET() {
  const personajes = await getPersonajes()
  return Response.json(personajes)
}
