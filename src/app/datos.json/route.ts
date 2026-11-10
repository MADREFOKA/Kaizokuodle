import { getPersonajes } from '@/lib/personajes'
import { getFrutas } from '@/lib/frutas'
import { getEscenas, getRoscos } from '@/lib/contenido'
import type { Datos } from '@/lib/types'

export const dynamic = 'force-static'

/** Un único JSON con todo lo que usan los juegos: el navegador lo descarga una vez y lo reutiliza. */
export async function GET() {
  const [personajes, frutas, escenas, roscos] = await Promise.all([getPersonajes(), getFrutas(), getEscenas(), getRoscos()])
  return Response.json({ personajes, frutas, escenas, roscos } satisfies Datos)
}
