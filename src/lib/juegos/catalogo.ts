export type Juego = { ruta: string; nombre: string; descripcion: string; listo: boolean }

export const JUEGOS: Juego[] = [
  { ruta: '/adivina', nombre: 'Adivina el personaje', descripcion: 'Escribe nombres y descubre el personaje oculto comparando sus datos.', listo: true },
  { ruta: '/grid', nombre: 'Grid', descripcion: 'Rellena un tablero 3×3 donde cada casilla cumple dos condiciones.', listo: true },
  { ruta: '/escena', nombre: 'Recuerda esta escena', descripcion: '¿Quién falta en la viñeta?', listo: false },
  { ruta: '/fruta', nombre: 'Adivina la fruta', descripcion: 'Del usuario a la fruta del diablo, y al revés.', listo: true },
  { ruta: '/recompensas', nombre: 'Mayor o menor', descripcion: 'Dos carteles de Se Busca: ¿cuál vale más?', listo: true },
  { ruta: '/cronologia', nombre: 'Cronología', descripcion: 'Ordena personajes por su primera aparición.', listo: true },
  { ruta: '/pasapalabra', nombre: 'Pasapalabra', descripcion: 'Un rosco completo de la A a la Z.', listo: false },
  { ruta: '/conexiones', nombre: 'Conexiones', descripcion: 'Cuatro grupos de cuatro con algo en común.', listo: true },
  { ruta: '/bingo', nombre: 'Bingo', descripcion: 'Completa el cartón con personajes que cumplan cada casilla.', listo: true },
]
