'use client'
import { useMemo } from 'react'
import type { IdJuego } from '@/lib/juegos/catalogo'
import type { Datos } from '@/lib/types'
import { useDatos } from '@/lib/useDatos'
import { useCapitulo } from '@/lib/capitulo'
import { datosHasta } from '@/lib/spoilers'
import { fijarCapitulo } from '@/lib/contexto'
import { Adivina } from './adivina/Adivina'
import { MayorMenor } from './recompensas/MayorMenor'
import { Cronologia } from './cronologia/Cronologia'
import { AdivinaFruta } from './fruta/AdivinaFruta'
import { Grid } from './grid/Grid'
import { Conexiones } from './conexiones/Conexiones'
import { Bingo } from './bingo/Bingo'
import { Escena } from './escena/Escena'
import { Pasapalabra } from './pasapalabra/Pasapalabra'
import { AvisoSpoilers } from './AjusteSpoilers'

const JUEGOS: Record<IdJuego, (d: Datos) => React.ReactNode> = {
  adivina: (d) => <Adivina personajes={d.personajes} />,
  recompensas: (d) => <MayorMenor personajes={d.personajes.filter((p) => p.recompensa).map((p) => ({ ...p, recompensa: p.recompensa! }))} />,
  cronologia: (d) => <Cronologia personajes={d.personajes.filter((p) => p.debutCap && p.debutArco).map((p) => ({ ...p, debutCap: p.debutCap!, debutArco: p.debutArco! }))} />,
  fruta: (d) => <AdivinaFruta frutas={d.frutas} personajes={d.personajes} />,
  grid: (d) => <Grid personajes={d.personajes} />,
  conexiones: (d) => <Conexiones personajes={d.personajes} />,
  bingo: (d) => <Bingo personajes={d.personajes} />,
  escena: (d) => <Escena escenas={d.escenas} personajes={d.personajes} />,
  pasapalabra: (d) => <Pasapalabra roscos={d.roscos} personajes={d.personajes} />,
}

/** Carga los datos, aplica el modo sin spoilers y monta el juego (se vuelve a montar si cambia el capítulo). */
export function MontarJuego({ id }: { id: IdJuego }) {
  const { datos, error } = useDatos()
  const capitulo = useCapitulo()
  const visibles = useMemo(() => (datos ? datosHasta(datos, capitulo) : null), [datos, capitulo])

  if (error) return <p className="text-center text-parcial">No se han podido cargar los datos. Recarga la página.</p>
  if (!visibles) return <div className="mx-auto h-28 max-w-2xl animate-pulse rounded-2xl bg-tinta" aria-label="Cargando" />
  fijarCapitulo(capitulo)
  return (
    <div className="space-y-6">
      <AvisoSpoilers />
      <div key={capitulo ?? 'todo'}>{JUEGOS[id](visibles)}</div>
    </div>
  )
}
