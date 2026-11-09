# Fokagames

Minijuegos de One Piece que leen en vivo la base de datos OPBD (Neon).

- **Stack:** Next.js 16 (exportación estática) + TypeScript + Tailwind 4, publicado en GitHub Pages.
- **Datos:** al compilar, GitHub Actions lee OPBD con el rol de solo lectura `fokagames_lectura` y genera la web estática. Se recompila cada noche, en cada push y a mano (Actions → Publicar → Run workflow).
- **Contenido propio de los juegos** (dificultad, escenas, rosco…): esquema `juegos` dentro de la BD de OPBD.

## Puesta en marcha

1. En Neon, ejecutar `sql/001_dificultad_personaje.sql` (ya hecho) y `sql/002_rol_lectura.sql` (con una contraseña nueva).
2. En GitHub, Settings → Secrets and variables → Actions: secreto `DATABASE_URL` (ver `.env.example`).
3. En GitHub, Settings → Pages → Source: **GitHub Actions**.
4. Local: `cp .env.example .env.local`, rellenar y `npm run dev`.

El código anterior (Kaizokuodle con JSON) sigue en el historial de git, commit `cbc6ada`, incluidas las imágenes de escenas.

## Estructura

- `src/lib/sql/personajes.ts` — consulta del dataset de personajes (compartido por todos los juegos).
- `src/lib/personajes.ts` — carga de datos al compilar (una consulta por build).
- `src/lib/juegos/` — lógica pura de cada juego y catálogo de la portada.
- `src/components/` — UI; `src/app/<juego>/page.tsx` — una ruta por juego.
- `/api/personajes/` — el mismo dataset publicado como JSON estático.

Para añadir un juego: lógica en `src/lib/juegos/<juego>.ts`, componente en `src/components/<juego>/`, página en `src/app/<juego>/` y entrada en `catalogo.ts`.
