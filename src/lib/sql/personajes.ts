// Dataset de personajes para todos los juegos (solo los que tienen dificultad).
// Los campos *_hist llevan el capítulo en que se conoce cada dato, para el modo sin spoilers.
//
// Frutas: cuenta la fruta aunque el usuario haya muerto (estado «Muerto»). Las filas «Modificación»
// solo cuentan si el personaje no tiene otra activa (Gomu Gomu → Nika: queda Nika).
const FRUTAS_VALIDAS = /* sql */ `
  FROM personaje_fruta pf JOIN fruta_diablo f ON f.id = pf.fruta_id
  WHERE pf.personaje_id = p.id
    AND (pf.estado <> 'Modificación'
         OR NOT EXISTS (SELECT 1 FROM personaje_fruta x WHERE x.personaje_id = p.id AND x.estado <> 'Modificación'))`

export const SQL_PERSONAJES = /* sql */ `
SELECT
  p.id,
  btrim(p.nombre) AS nombre,
  p.imagen_url AS imagen,
  p.sexo,
  p.estado,
  p.altura::float8 AS altura,
  p.edad,
  p.cumpleanos,
  p.mar_origen AS origen,
  io.nombre AS isla_origen,
  COALESCE(
    (SELECT rh.cantidad FROM recompensa_hist rh LEFT JOIN capitulo c ON c.id = rh.capitulo_id
      WHERE rh.personaje_id = p.id ORDER BY c.numero DESC NULLS LAST, rh.cantidad DESC LIMIT 1),
    NULLIF(p.recompensa, 0)
  )::float8 AS recompensa,
  NULLIF(p.recompensa, 0)::float8 AS recompensa_base,
  p.primera_aparicion_cap AS debut_cap,
  a.nombre AS debut_arco,
  s.nombre AS debut_saga,
  d.dificultad,
  COALESCE((SELECT array_agg(r.nombre ORDER BY r.nombre) FROM personaje_raza pr JOIN raza r ON r.id = pr.raza_id
            WHERE pr.personaje_id = p.id), '{}') AS razas,
  COALESCE((SELECT array_agg(f.nombre ORDER BY f.nombre) ${FRUTAS_VALIDAS}), '{}') AS frutas,
  COALESCE((SELECT array_agg(DISTINCT f.tipo) ${FRUTAS_VALIDAS}), '{}') AS fruta_tipos,
  COALESCE((SELECT array_agg(replace(h.nombre, 'Haki de ', '') ORDER BY h.id) FROM personaje_haki ph JOIN haki h ON h.id = ph.haki_id
            WHERE ph.personaje_id = p.id), '{}') AS haki,
  COALESCE((SELECT array_agg(DISTINCT btrim(af.nombre)) FROM personaje_afiliacion pa JOIN afiliacion af ON af.id = pa.afiliacion_id
            WHERE pa.personaje_id = p.id AND pa.estado IN ('Activo', 'Infiltrado')), '{}') AS afiliaciones,
  COALESCE((SELECT array_agg(DISTINCT o.nombre) FROM (
              SELECT ocupacion_id FROM personaje_ocupacion WHERE personaje_id = p.id
              UNION SELECT ocupacion_id FROM personaje_afiliacion WHERE personaje_id = p.id AND ocupacion_id IS NOT NULL
            ) x JOIN ocupacion o ON o.id = x.ocupacion_id), '{}') AS ocupaciones,

  -- Historial con capítulos (modo sin spoilers)
  COALESCE((SELECT json_agg(json_build_array(c2.numero, rh.cantidad::float8) ORDER BY c2.numero)
            FROM recompensa_hist rh JOIN capitulo c2 ON c2.id = rh.capitulo_id WHERE rh.personaje_id = p.id), '[]') AS recompensas_hist,
  COALESCE((SELECT json_agg(json_build_object('n', btrim(af.nombre), 'd', ci.numero, 'h', cs.numero, 'a', pa.estado IN ('Activo', 'Infiltrado'), 'f', pa.estado = 'Fallecido'))
            FROM personaje_afiliacion pa JOIN afiliacion af ON af.id = pa.afiliacion_id
            LEFT JOIN capitulo ci ON ci.id = pa.capitulo_ingreso_id LEFT JOIN capitulo cs ON cs.id = pa.capitulo_salida_id
            WHERE pa.personaje_id = p.id), '[]') AS afiliaciones_hist,
  COALESCE((SELECT json_agg(json_build_object('n', f.nombre, 't', f.tipo, 'd', cf.numero, 'm', pf.estado = 'Modificación'))
            FROM personaje_fruta pf JOIN fruta_diablo f ON f.id = pf.fruta_id LEFT JOIN capitulo cf ON cf.id = f.spoiler_desde_capitulo_id
            WHERE pf.personaje_id = p.id), '[]') AS frutas_hist,
  COALESCE((SELECT json_agg(json_build_array(replace(h.nombre, 'Haki de ', ''), ch.numero))
            FROM personaje_haki ph JOIN haki h ON h.id = ph.haki_id LEFT JOIN capitulo ch ON ch.id = ph.capitulo_id
            WHERE ph.personaje_id = p.id), '[]') AS haki_hist,
  (SELECT min(ce.numero) FROM personaje_evento pe JOIN evento e ON e.id = pe.evento_id
     JOIN capitulo ce ON ce.id = COALESCE(e.capitulo_id::int, e.capitulo_inicio_id::int)
   WHERE pe.personaje_id = p.id AND pe.rol = 'Víctima' AND e.tipo IN ('Muerte', 'Ejecución')) AS muerte_cap,
  COALESCE((SELECT json_agg(json_build_array(x.nombre, x.cap)) FROM (
              SELECT btrim(al.nombre) AS nombre, ca.numero AS cap FROM alias al LEFT JOIN capitulo ca ON ca.id = al.capitulo_id WHERE al.personaje_id = p.id
              UNION ALL SELECT btrim(ep.nombre), NULL FROM epiteto ep WHERE ep.personaje_id = p.id
            ) x), '[]') AS alias
FROM juegos.dificultad_personaje d
JOIN personaje p ON p.id = d.personaje_id
LEFT JOIN isla io ON io.id = p.isla_origen_id
LEFT JOIN capitulo c ON c.numero = p.primera_aparicion_cap
LEFT JOIN arco a ON a.id = c.arco_id
LEFT JOIN saga s ON s.id = a.saga_id
ORDER BY p.id
`
