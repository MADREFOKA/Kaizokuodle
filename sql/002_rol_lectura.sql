-- Rol de solo lectura para la web de juegos. Ejecutar en Neon (SQL Editor) con el usuario dueño.
-- Cambia la contraseña antes de ejecutarlo.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'fokagames_lectura') THEN
    CREATE ROLE fokagames_lectura LOGIN PASSWORD 'CAMBIA_ESTA_CONTRASEÑA';
  END IF;
END $$;

GRANT CONNECT ON DATABASE neondb TO fokagames_lectura;   -- cambia «neondb» si tu BD se llama distinto
GRANT USAGE ON SCHEMA public, juegos TO fokagames_lectura;
GRANT SELECT ON ALL TABLES IN SCHEMA public, juegos TO fokagames_lectura;

-- Tablas que se creen en el futuro también serán legibles (solo lectura)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO fokagames_lectura;
ALTER DEFAULT PRIVILEGES IN SCHEMA juegos GRANT SELECT ON TABLES TO fokagames_lectura;
