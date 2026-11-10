// Frutas del diablo con usuarios (actuales y anteriores) que están en los juegos. Sin las SMILE genéricas.
export const SQL_FRUTAS = /* sql */ `
SELECT f.id, f.nombre, f.tipo, c.numero AS desde,
  array_agg(DISTINCT pf.personaje_id) AS usuarios
FROM fruta_diablo f
JOIN personaje_fruta pf ON pf.fruta_id = f.id
JOIN juegos.dificultad_personaje d ON d.personaje_id = pf.personaje_id
LEFT JOIN capitulo c ON c.id = f.spoiler_desde_capitulo_id
WHERE f.tipo <> 'SMILE'
GROUP BY f.id, c.numero
ORDER BY f.id
`
