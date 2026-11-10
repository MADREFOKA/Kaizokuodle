# Fokagames

Minijuegos de One Piece que leen la base de datos OPBD (Neon). Web estática publicada en GitHub Pages.

- **Stack:** Next.js 16 (exportación estática) + TypeScript + Tailwind 4.
- **Datos:** al compilar, GitHub Actions lee OPBD con el rol de solo lectura `fokagames_lectura` y genera `datos.json`
  (personajes, frutas, escenas y roscos). Todos los juegos lo descargan una vez. Se recompila cada noche, en cada push
  y a mano (Actions → Publicar → Run workflow).
- **Contenido propio de los juegos:** esquema `juegos` dentro de la BD de OPBD (dificultad, escenas, roscos).

## Puesta en marcha

1. En Neon, ejecutar en orden los archivos de `sql/` (todos son idempotentes):
   `001_dificultad_personaje.sql`, `002_rol_lectura.sql` (con una contraseña nueva) y `003_escenas_pasapalabra.sql`.
2. En GitHub: secreto `DATABASE_URL` (ver `.env.example`) y Settings → Pages → Source: **GitHub Actions**.
3. Local: `cp .env.example .env.local`, rellenar y `npm run dev`.

## Estructura

- `src/lib/sql/` — consultas a OPBD; `src/app/datos.json/route.ts` — el JSON compartido.
- `src/lib/spoilers.ts` — modo sin spoilers: cómo era cada personaje hasta un capítulo (recompensa, afiliaciones,
  frutas, haki, muerte, alias).
- `src/lib/juegos/` — lógica pura de cada juego, banco de condiciones (Grid, Conexiones, Bingo) y catálogo (reglas, pistas).
- `src/components/MontarJuego.tsx` — carga los datos, aplica el modo sin spoilers y monta cada juego.
- `src/lib/estadisticas.ts` — rachas y estadísticas del reto diario (en el navegador).
- `public/escenas/` — imágenes de «Recuerda esta escena».

Para añadir un juego: lógica en `src/lib/juegos/<juego>.ts`, componente en `src/components/<juego>/`, entrada en
`catalogo.ts` (con reglas y pistas), en `MontarJuego.tsx` y su `src/app/<juego>/page.tsx`.

El código anterior (Kaizokuodle con JSON) sigue en el historial de git, commit `cbc6ada`.
