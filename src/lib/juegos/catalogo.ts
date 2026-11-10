export type IdJuego = 'adivina' | 'grid' | 'escena' | 'fruta' | 'recompensas' | 'cronologia' | 'pasapalabra' | 'conexiones' | 'bingo'

export type Juego = {
  id: IdJuego
  ruta: string
  nombre: string
  descripcion: string
  /** Color propio del juego (icono y detalles). */
  color: string
  listo: boolean
  diario: boolean
  /** Pasos de «Cómo se juega». */
  reglas: string[]
  pistas?: string
  /** Ocupa dos columnas en la portada. */
  ancho?: boolean
}

export const JUEGOS: Juego[] = [
  {
    id: 'adivina', ruta: '/adivina', nombre: 'Adivina el personaje', color: '#f5b83d', listo: true, diario: true, ancho: true,
    descripcion: 'Descubre al personaje oculto comparando sus datos con los tuyos.',
    reglas: [
      'Escribe el nombre de cualquier personaje y elígelo de la lista.',
      'Cada dato se colorea: verde si coincide con el personaje oculto, amarillo si coincide en parte (por ejemplo, comparte una de sus afiliaciones) y rojo si no.',
      'En debut, altura y recompensa, la flecha indica si el personaje oculto tiene más (▲) o menos (▼).',
      'No hay límite de intentos: gana quien lo encuentre con menos.',
    ],
    pistas: 'A los 4, 7 y 10 intentos se desbloquean pistas: un dato que no sale en la tabla, la inicial de su nombre y su retrato difuminado.',
  },
  {
    id: 'grid', ruta: '/grid', nombre: 'Grid', color: '#4fb8d9', listo: true, diario: true,
    descripcion: 'Un tablero 3×3 donde cada casilla cruza dos condiciones.',
    reglas: [
      'Cada casilla pide un personaje que cumpla la condición de su fila y la de su columna a la vez.',
      'Pulsa una casilla y escribe el personaje. Cada personaje solo se puede usar una vez.',
      'Tienes 12 intentos para las 9 casillas: cada fallo gasta uno.',
      'Todas las casillas tienen al menos tres respuestas válidas.',
    ],
    pistas: 'Tienes 3 pistas por tablero: al abrir una casilla, te enseñan la inicial y el arco de debut de una respuesta válida.',
  },
  {
    id: 'conexiones', ruta: '/conexiones', nombre: 'Conexiones', color: '#8a5bd6', listo: true, diario: true,
    descripcion: 'Dieciséis personajes, cuatro grupos con algo en común.',
    reglas: [
      'Selecciona cuatro personajes que creas que comparten algo y pulsa Enviar.',
      'Si aciertas, el grupo se revela con su conexión. Si te falta uno, te avisamos.',
      'Cada personaje pertenece a un solo grupo. Puedes fallar cuatro veces.',
    ],
    pistas: 'Dos pistas por partida: cada una revela qué tiene en común uno de los grupos que te faltan.',
  },
  {
    id: 'bingo', ruta: '/bingo', nombre: 'Bingo', color: '#2c9f68', listo: true, diario: true,
    descripcion: 'Coloca a cada personaje que sale en una casilla que cumpla.',
    reglas: [
      'Van saliendo personajes de un mazo de 40, de uno en uno.',
      'Coloca cada uno en una casilla del cartón cuya condición cumpla, o pásalo.',
      'Si lo colocas donde no cumple, lo pierdes.',
      'Completa las 16 casillas antes de que se acabe el mazo.',
    ],
    pistas: 'Tres pistas por cartón: iluminan las casillas donde encaja el personaje que ha salido.',
  },
  {
    id: 'fruta', ruta: '/fruta', nombre: 'Adivina la fruta', color: '#e0343f', listo: true, diario: true,
    descripcion: 'De la fruta del diablo a su usuario, y al revés.',
    reglas: [
      'Son cinco preguntas. En unas te damos una fruta y escribes quién la comió; en otras, al revés.',
      'Tienes tres intentos por pregunta.',
      'Si una fruta ha tenido varios usuarios, vale cualquiera.',
    ],
    pistas: 'Cada fallo te da una pista: primero el arco o el tipo, después las primeras letras de la respuesta.',
  },
  {
    id: 'recompensas', ruta: '/recompensas', nombre: 'Mayor o menor', color: '#f08a4b', listo: true, diario: false, ancho: true,
    descripcion: 'Dos carteles de Se Busca: ¿cuál vale más?',
    reglas: [
      'Ves la recompensa del primer personaje. Decide si la del segundo es mayor o menor.',
      'Si aciertas, el segundo pasa a ser el primero y sale otro cartel.',
      'Un fallo termina la racha. Se guarda tu récord.',
    ],
    pistas: 'Un comodín por racha: te dice a qué afiliación pertenece el personaje del segundo cartel y en qué arco debutó.',
  },
  {
    id: 'cronologia', ruta: '/cronologia', nombre: 'Cronología', color: '#5fc9a8', listo: true, diario: true,
    descripcion: 'Ordena a seis personajes por su primera aparición.',
    reglas: [
      'Ordena a los seis personajes del que apareció antes en el manga al que apareció después.',
      'Arrastra las filas o usa las flechas para moverlas.',
      'Pulsa Comprobar: las filas bien colocadas se ponen en verde. Repite hasta acertar.',
    ],
    pistas: 'Tras el primer fallo puedes ver el arco de debut de cada personaje.',
  },
  {
    id: 'escena', ruta: '/escena', nombre: 'Recuerda esta escena', color: '#aab2d3', listo: false, diario: true,
    descripcion: '¿Quién falta en la viñeta?', reglas: [],
  },
  {
    id: 'pasapalabra', ruta: '/pasapalabra', nombre: 'Pasapalabra', color: '#aab2d3', listo: false, diario: true,
    descripcion: 'Un rosco completo de la A a la Z.', reglas: [],
  },
]

export const juego = (id: IdJuego) => JUEGOS.find((j) => j.id === id)!
