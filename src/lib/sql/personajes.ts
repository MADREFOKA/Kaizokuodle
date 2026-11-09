// Dataset ligero de personajes para todos los juegos (solo los que tienen dificultad).
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
  p.primera_aparicion_cap AS debut_cap,
  a.nombre AS debut_arco,
  s.nombre AS debut_saga,
  d.dificultad,
  COALESCE((SELECT array_agg(r.nombre ORDER BY r.nombre) FROM personaje_raza pr JOIN raza r ON r.id = pr.raza_id
            WHERE pr.personaje_id = p.id), '{}') AS razas,
  COALESCE((SELECT array_agg(f.nombre ORDER BY f.nombre) FROM personaje_fruta pf JOIN fruta_diablo f ON f.id = pf.fruta_id
            WHERE pf.personaje_id = p.id AND pf.estado = 'Activo'), '{}') AS frutas,
  COALESCE((SELECT array_agg(DISTINCT f.tipo) FROM personaje_fruta pf JOIN fruta_diablo f ON f.id = pf.fruta_id
            WHERE pf.personaje_id = p.id AND pf.estado = 'Activo'), '{}') AS fruta_tipos,
  COALESCE((SELECT array_agg(replace(h.nombre, 'Haki de ', '') ORDER BY h.id) FROM personaje_haki ph JOIN haki h ON h.id = ph.haki_id
            WHERE ph.personaje_id = p.id), '{}') AS haki,
  COALESCE((SELECT array_agg(DISTINCT af.nombre) FROM personaje_afiliacion pa JOIN afiliacion af ON af.id = pa.afiliacion_id
            WHERE pa.personaje_id = p.id AND pa.estado IN ('Activo', 'Infiltrado')), '{}') AS afiliaciones,
  COALESCE((SELECT array_agg(DISTINCT o.nombre) FROM (
              SELECT ocupacion_id FROM personaje_ocupacion WHERE personaje_id = p.id
              UNION SELECT ocupacion_id FROM personaje_afiliacion WHERE personaje_id = p.id AND ocupacion_id IS NOT NULL
            ) x JOIN ocupacion o ON o.id = x.ocupacion_id), '{}') AS ocupaciones
FROM juegos.dificultad_personaje d
JOIN personaje p ON p.id = d.personaje_id
LEFT JOIN isla io ON io.id = p.isla_origen_id
LEFT JOIN capitulo c ON c.numero = p.primera_aparicion_cap
LEFT JOIN arco a ON a.id = c.arco_id
LEFT JOIN saga s ON s.id = a.saga_id
ORDER BY p.id
`
