/**
 * Límite de capítulo de la partida en curso. Lo fija MontarJuego antes de pintar el juego,
 * para que el reto diario y su progreso guardado sean distintos con y sin spoilers.
 */
let capitulo: number | null = null

export const fijarCapitulo = (cap: number | null) => { capitulo = cap }
export const sufijoSpoiler = () => (capitulo == null ? '' : `@${capitulo}`)
