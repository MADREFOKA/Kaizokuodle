import type { Personaje } from '@/lib/types'
import { barajar } from '@/lib/azar'

/**
 * Banco de condiciones sobre personajes, generado a partir de los datos (nunca a mano):
 * cualquier respuesta que acepte un juego está respaldada por OPBD.
 */
export type Condicion = {
  id: string
  familia: 'afiliacion' | 'fruta' | 'haki' | 'origen' | 'raza' | 'debut' | 'recompensa' | 'estado' | 'sexo' | 'altura' | 'ocupacion'
  texto: string
  cumple: (p: Personaje) => boolean
}

/**
 * Altura para las condiciones: la de OPBD o, si no se sabe, la que da la raza cuando no hay duda
 * (los tontatta miden unos 20 cm; los gigantes, más de 10 m). Si no, desconocida.
 */
export function alturaEstimada(p: Personaje): number | null {
  if (p.altura != null) return p.altura
  if (p.razas.includes('Tontatta')) return 0.2
  if (p.razas.includes('Gigante') || p.razas.includes('Gigante Ancestral')) return 10
  return null
}

const contar = <T,>(lista: T[]) => {
  const m = new Map<T, number>()
  for (const x of lista) m.set(x, (m.get(x) ?? 0) + 1)
  return m
}

export function bancoDeCondiciones(personajes: Personaje[], minimo = 6): Condicion[] {
  const c: Condicion[] = []
  const frecuentes = (lista: (string | null)[]) => [...contar(lista.filter((x): x is string => !!x)).entries()].filter(([, n]) => n >= minimo).map(([k]) => k)

  for (const a of frecuentes(personajes.flatMap((p) => p.afiliaciones)))
    c.push({ id: `af:${a}`, familia: 'afiliacion', texto: a.trim(), cumple: (p) => p.afiliaciones.includes(a) })

  c.push(
    { id: 'fr:paramecia', familia: 'fruta', texto: 'Fruta Paramecia', cumple: (p) => p.frutaTipos.includes('Paramecia') },
    { id: 'fr:zoan', familia: 'fruta', texto: 'Fruta Zoan', cumple: (p) => p.frutaTipos.some((t) => t.startsWith('Zoan')) },
    { id: 'fr:logia', familia: 'fruta', texto: 'Fruta Logia', cumple: (p) => p.frutaTipos.includes('Logia') },
    { id: 'fr:mitica', familia: 'fruta', texto: 'Zoan Mítica', cumple: (p) => p.frutaTipos.includes('Zoan Mítica') },
    { id: 'fr:alguna', familia: 'fruta', texto: 'Ha comido una fruta del diablo', cumple: (p) => p.frutaTipos.length > 0 },
    { id: 'hk:conquistador', familia: 'haki', texto: 'Haki del Conquistador', cumple: (p) => p.haki.includes('Conquistador') },
    { id: 'hk:armamento', familia: 'haki', texto: 'Haki de Armamento', cumple: (p) => p.haki.includes('Armamento') },
    { id: 'hk:observacion', familia: 'haki', texto: 'Haki de Observación', cumple: (p) => p.haki.includes('Observación') },
    { id: 'rc:1000', familia: 'recompensa', texto: 'Recompensa de más de 1.000 M', cumple: (p) => (p.recompensa ?? 0) > 1e9 },
    { id: 'rc:100', familia: 'recompensa', texto: 'Recompensa de más de 100 M', cumple: (p) => (p.recompensa ?? 0) > 1e8 },
    { id: 'rc:alguna', familia: 'recompensa', texto: 'Tiene recompensa', cumple: (p) => (p.recompensa ?? 0) > 0 },
    { id: 'es:muerto', familia: 'estado', texto: 'Ha muerto', cumple: (p) => p.estado === 'Muerto' },
    { id: 'sx:mujer', familia: 'sexo', texto: 'Mujer', cumple: (p) => p.sexo === 'Femenino' },
    { id: 'al:3', familia: 'altura', texto: 'Mide más de 3 m', cumple: (p) => (alturaEstimada(p) ?? 0) > 3 },
    { id: 'al:menos', familia: 'altura', texto: 'Mide menos de 1,60 m', cumple: (p) => { const a = alturaEstimada(p); return a != null && a < 1.6 } },
  )

  for (const o of ['East Blue', 'North Blue', 'West Blue', 'South Blue', 'Grand Line'])
    c.push({ id: `or:${o}`, familia: 'origen', texto: `Nacido en ${o === 'Grand Line' ? 'el ' : ''}${o}`, cumple: (p) => p.origen === o })

  for (const r of frecuentes(personajes.flatMap((p) => p.razas)).filter((r) => r !== 'Humano'))
    c.push({ id: `rz:${r}`, familia: 'raza', texto: r, cumple: (p) => p.razas.includes(r) })

  for (const s of frecuentes(personajes.map((p) => p.debutSaga)))
    c.push({ id: `sg:${s}`, familia: 'debut', texto: `Debuta en la saga ${s}`, cumple: (p) => p.debutSaga === s })
  for (const a of frecuentes(personajes.map((p) => p.debutArco)))
    c.push({ id: `ar:${a}`, familia: 'debut', texto: `Debuta en ${a}`, cumple: (p) => p.debutArco === a })

  const nada = new Set(['Animal', 'Animal salvaje', 'Civil', 'Mascota', 'Transporte', 'Montura', 'Pirata'])
  for (const o of frecuentes(personajes.flatMap((p) => p.ocupaciones)).filter((o) => !nada.has(o)))
    c.push({ id: `oc:${o}`, familia: 'ocupacion', texto: o, cumple: (p) => p.ocupaciones.includes(o) })

  // Quita duplicados con exactamente los mismos personajes (p. ej. saga Wano = arco Wano): se queda la primera.
  const firmas = new Set<string>()
  return c.filter((x) => {
    const f = personajes.filter(x.cumple).map((p) => p.id).join(',')
    if (firmas.has(f)) return false
    firmas.add(f)
    return true
  })
}

export const respuestas = (personajes: Personaje[], ...conds: Condicion[]) => personajes.filter((p) => conds.every((c) => c.cumple(p)))

export type Tablero = { filas: Condicion[]; columnas: Condicion[] }

/**
 * Grid 3×3: ninguna familia aparece a la vez en filas y columnas, y cada cruce tiene
 * al menos `minimo` respuestas en total y alguna conocida (dificultad ≤ 3).
 */
export function generarGrid(personajes: Personaje[], banco: Condicion[], r: () => number, minimo = 3): Tablero | null {
  const conocidos = personajes.filter((p) => p.dificultad <= 3)
  // Condiciones demasiado amplias (más de 40 % del total) hacen el tablero trivial.
  const utiles = banco.filter((c) => { const n = respuestas(personajes, c).length; return n >= 8 && n < personajes.length * 0.4 })
  for (let intento = 0; intento < 4000; intento++) {
    const baraja = barajar(utiles, r)
    const filas: Condicion[] = []
    const columnas: Condicion[] = []
    for (const c of baraja) {
      const fFam = new Set(filas.map((x) => x.familia)), cFam = new Set(columnas.map((x) => x.familia))
      const cabe = (eje: Condicion[], propia: Set<string>, otra: Set<string>) =>
        eje.length < 3 && !otra.has(c.familia) && (!propia.has(c.familia) || c.familia === 'afiliacion') && !eje.some((x) => x.id === c.id)
      if (cabe(filas, fFam, cFam) && columnas.every((col) => valida(c, col))) filas.push(c)
      else if (cabe(columnas, cFam, fFam) && filas.every((f) => valida(f, c))) columnas.push(c)
      if (filas.length === 3 && columnas.length === 3) return { filas, columnas }
    }
  }
  return null

  function valida(f: Condicion, c: Condicion) {
    const todas = respuestas(personajes, f, c)
    return todas.length >= minimo && todas.some((p) => conocidos.includes(p))
  }
}

export type Grupo = { condicion: Condicion; personajes: Personaje[] }

/** Conexiones: 4 condiciones de familias distintas y 4 personajes por grupo que solo encajan en el suyo. */
export function generarConexiones(personajes: Personaje[], banco: Condicion[], r: () => number, dificultadMax = 3): Grupo[] | null {
  const pool = personajes.filter((p) => p.dificultad <= dificultadMax)
  const candidatas = banco.filter((c) => respuestas(pool, c).length >= 6)
  for (let intento = 0; intento < 2000; intento++) {
    const elegidas: Condicion[] = []
    for (const c of barajar(candidatas, r)) {
      if (!elegidas.some((e) => e.familia === c.familia)) elegidas.push(c)
      if (elegidas.length === 4) break
    }
    if (elegidas.length < 4) return null
    const grupos = elegidas.map((c) => ({
      condicion: c,
      personajes: barajar(pool.filter((p) => c.cumple(p) && elegidas.every((o) => o === c || !o.cumple(p))), r).slice(0, 4),
    }))
    if (grupos.every((g) => g.personajes.length === 4)) return grupos
  }
  return null
}

/** Cartón de bingo 4×4: condiciones distintas con suficientes personajes conocidos cada una. */
export function generarCarton(personajes: Personaje[], banco: Condicion[], r: () => number): Condicion[] {
  const pool = personajes.filter((p) => p.dificultad <= 3)
  const porFamilia = new Map<string, number>()
  const carton: Condicion[] = []
  for (const c of barajar(banco.filter((c) => { const n = respuestas(pool, c).length; return n >= 12 && n < pool.length * 0.4 }), r)) {
    const n = porFamilia.get(c.familia) ?? 0
    if (n >= (c.familia === 'afiliacion' || c.familia === 'debut' ? 3 : 2)) continue
    porFamilia.set(c.familia, n + 1)
    carton.push(c)
    if (carton.length === 16) break
  }
  return carton
}
