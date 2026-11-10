import type { Datos, Historial, Personaje } from './types'

/**
 * Sin datos de capítulo, el haki se da por conocido a partir de aquí
 * (tras el salto temporal se explican los tres tipos).
 */
export const HAKI_CONOCIDO_DESDE = 600

const hasta = (cap: number | null, limite: number) => cap == null || cap <= limite

/** Cómo era el personaje hasta el capítulo `limite`, o `null` si aún no ha aparecido. */
export function personajeHasta(p: Personaje, limite: number): Personaje | null {
  if (p.debutCap == null || p.debutCap > limite) return null
  const h = p.hist

  const recompensas = h.recompensas.filter(([c]) => c <= limite)
  const recompensa = recompensas.length ? recompensas.at(-1)![1] : h.recompensas.length ? null : h.recompensaBase

  // Afiliación vigente en ese capítulo. Sin capítulo de entrada se da por conocida desde el debut.
  // Los «Fallecido» siguen siendo miembros mientras su muerte no haya ocurrido (o no se sepa cuándo).
  const vigente = (a: Historial['afiliaciones'][number]) => {
    if (a.h != null) return a.h > limite
    return a.a || (!!a.f && (h.muerteCap == null || h.muerteCap > limite))
  }
  const afiliaciones = [...new Set(h.afiliaciones.filter((a) => hasta(a.d, limite) && vigente(a)).map((a) => a.n))]

  // Frutas cuyo nombre ya se conoce; si hay una activa, las «Modificación» (p. ej. Gomu Gomu) quedan detrás.
  const visibles = h.frutas.filter((f) => hasta(f.d, limite))
  const frutas = visibles.some((f) => !f.m) ? visibles.filter((f) => !f.m) : visibles

  const haki = h.haki.filter(([, c]) => (c == null ? limite >= Math.max(HAKI_CONOCIDO_DESDE, p.debutCap ?? 0) : c <= limite)).map(([n]) => n)

  const estado = p.estado !== 'Muerto' ? p.estado : h.muerteCap == null ? 'Desconocido' : h.muerteCap <= limite ? 'Muerto' : 'Vivo'

  return {
    ...p,
    recompensa,
    afiliaciones,
    frutas: frutas.map((f) => f.n),
    frutaTipos: [...new Set(frutas.map((f) => f.t))],
    haki,
    estado,
    alias: h.alias.filter(([, c]) => hasta(c, limite)).map(([n]) => n),
  }
}

/** Todos los datos de los juegos tal y como se conocen hasta el capítulo `limite` (null = sin límite). */
export function datosHasta(datos: Datos, limite: number | null): Datos {
  if (limite == null) return datos
  const personajes = datos.personajes.map((p) => personajeHasta(p, limite)).filter((p): p is Personaje => !!p)
  const porId = new Map(personajes.map((p) => [p.id, p]))
  return {
    personajes,
    frutas: datos.frutas
      .filter((f) => hasta(f.desde, limite))
      .map((f) => ({ ...f, usuarios: f.usuarios.filter((u) => porId.get(u)?.frutas.includes(f.nombre)) }))
      .filter((f) => f.usuarios.length > 0),
    escenas: datos.escenas.filter((e) => e.personajes.every((id) => porId.has(id))),
    roscos: datos.roscos,
  }
}
