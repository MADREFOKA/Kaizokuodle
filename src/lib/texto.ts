/** Minúsculas, sin acentos ni signos: para buscar nombres. */
export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const berry = new Intl.NumberFormat('es-ES')
export const formatoBerry = (n: number) => `฿ ${berry.format(n)}`

/** Corto para casillas: millones con «M» (฿ 1.965 M = 1.965 millones). */
export const formatoBerryCorto = (n: number) =>
  n >= 1_000_000 ? `฿ ${berry.format(Math.round(n / 100_000) / 10)} M` : formatoBerry(n)

export const formatoAltura = (m: number) =>
  m >= 10 ? `${Math.round(m)} m` : `${m.toFixed(2).replace('.', ',')} m`
