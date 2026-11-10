-- Fokagames: contenido de «Recuerda esta escena» y «Pasapalabra» (esquema juegos). Idempotente.
-- Ejecutar en Neon con el usuario dueño de la BD.

CREATE TABLE IF NOT EXISTS juegos.escena (
  id         integer PRIMARY KEY,
  imagen     text NOT NULL,      -- ruta dentro de la web (public/): la escena sin los personajes
  solucion   text NOT NULL,      -- la misma escena completa
  pista      text,
  dificultad smallint NOT NULL DEFAULT 2 CHECK (dificultad BETWEEN 1 AND 5)
);
CREATE TABLE IF NOT EXISTS juegos.escena_personaje (
  escena_id    integer NOT NULL REFERENCES juegos.escena(id) ON DELETE CASCADE,
  personaje_id integer NOT NULL REFERENCES public.personaje(id) ON DELETE CASCADE,
  PRIMARY KEY (escena_id, personaje_id)
);
CREATE TABLE IF NOT EXISTS juegos.rosco (
  id     integer PRIMARY KEY,
  nombre text NOT NULL
);
CREATE TABLE IF NOT EXISTS juegos.rosco_entrada (
  rosco_id   integer NOT NULL REFERENCES juegos.rosco(id) ON DELETE CASCADE,
  letra      char(1) NOT NULL,
  contiene   boolean NOT NULL DEFAULT false,  -- «Contiene la X» en vez de «Empieza por la X»
  definicion text NOT NULL,
  respuesta  text NOT NULL,
  dificultad smallint,
  PRIMARY KEY (rosco_id, letra)
);
GRANT SELECT ON ALL TABLES IN SCHEMA juegos TO fokagames_lectura;

-- Escenas (imágenes en public/escenas/ de la web)
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (1, 'escenas/escena-1.webp', 'escenas/solucion-1.webp', '¡Arlong!', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 1, id FROM personaje WHERE nombre = 'Nami' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (2, 'escenas/escena-2.webp', 'escenas/solucion-2.webp', 'Tu brazo...', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 2, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 2, id FROM personaje WHERE nombre = 'Figarland Shanks' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (3, 'escenas/escena-3.webp', 'escenas/solucion-3.webp', 'Pisame daddy...', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 3, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 3, id FROM personaje WHERE nombre = 'Trafalgar D. Water Law' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 3, id FROM personaje WHERE nombre = 'Donquixote Doflamingo' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (4, 'escenas/escena-4.webp', 'escenas/solucion-4.webp', '¡Gritalo reina!', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 4, id FROM personaje WHERE nombre = 'Nico Robin' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (5, 'escenas/escena-5.webp', 'escenas/solucion-5.webp', 'Perdí mi tripulación llegando allí...', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 5, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 5, id FROM personaje WHERE nombre = 'Bellamy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (6, 'escenas/escena-6.webp', 'escenas/solucion-6.webp', 'Arigatou...', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 6, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 6, id FROM personaje WHERE nombre = 'Portgas D. Ace' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (7, 'escenas/escena-7.webp', 'escenas/solucion-7.webp', 'Si brindamos con sake...', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 7, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 7, id FROM personaje WHERE nombre = 'Portgas D. Ace' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 7, id FROM personaje WHERE nombre = 'Sabo' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (8, 'escenas/escena-8.webp', 'escenas/solucion-8.webp', 'Al fin liberado', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 8, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 8, id FROM personaje WHERE nombre = 'Portgas D. Ace' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 8, id FROM personaje WHERE nombre = 'Galdino' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (9, 'escenas/escena-9.webp', 'escenas/solucion-9.webp', '¿Ultimas palabras?', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 9, id FROM personaje WHERE nombre = 'Capone Bege' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 9, id FROM personaje WHERE nombre = 'Pekoms' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (10, 'escenas/escena-10.webp', 'escenas/solucion-10.webp', 'No ha pasado nada.', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 10, id FROM personaje WHERE nombre = 'Roronoa Zoro' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 10, id FROM personaje WHERE nombre = 'Bartholomew Kuma' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (11, 'escenas/escena-11.webp', 'escenas/solucion-11.webp', '¡Es mi amigo!', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 11, id FROM personaje WHERE nombre = 'Bentham' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 11, id FROM personaje WHERE nombre = 'Lobo' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (12, 'escenas/escena-12.webp', 'escenas/solucion-12.webp', 'No soy una zoan.', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 12, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 12, id FROM personaje WHERE nombre = 'Kozuki Momonosuke' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (13, 'escenas/escena-13.webp', 'escenas/solucion-13.webp', 'Funeral Ohara.', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 13, id FROM personaje WHERE nombre = 'Vegapunk' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 13, id FROM personaje WHERE nombre = 'Monkey D. Dragon' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (14, 'escenas/escena-14.webp', 'escenas/solucion-14.webp', '¡Garchu!', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 14, id FROM personaje WHERE nombre = 'Carrot' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 14, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (15, 'escenas/escena-15.webp', 'escenas/solucion-15.webp', 'Sayonara...', 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 15, id FROM personaje WHERE nombre = 'Crocodile' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 15, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (16, 'escenas/escena-16.webp', 'escenas/solucion-16.webp', '¡CORRED¡¡Huid lejos!', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 16, id FROM personaje WHERE nombre = 'Bartholomew Kuma' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 16, id FROM personaje WHERE nombre = 'Monkey D. Luffy' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (17, 'escenas/escena-17.webp', 'escenas/solucion-17.webp', 'Sangoro', 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 17, id FROM personaje WHERE nombre = 'Roronoa Zoro' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 17, id FROM personaje WHERE nombre = 'Vinsmoke Sanji' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 17, id FROM personaje WHERE nombre = 'Toko' ON CONFLICT DO NOTHING;
INSERT INTO juegos.escena (id, imagen, solucion, pista, dificultad) VALUES (18, 'escenas/escena-18.webp', 'escenas/solucion-18.webp', 'Intruso en Baltigo', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.escena_personaje (escena_id, personaje_id) SELECT 18, id FROM personaje WHERE nombre = 'Jesus Burgess' ON CONFLICT DO NOTHING;

-- Rosco clásico (del Kaizokuodle anterior; I, J, Q y X corregidas)
INSERT INTO juegos.rosco (id, nombre) VALUES (1, 'Rosco clásico') ON CONFLICT (id) DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'A', false, 'Hermano de Luffy que murió en Marineford', 'Ace', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'B', false, 'Pirata de las mil libras, ex-shichibukai', 'Buggy', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'C', false, 'Ex-shichibukai con fruta de arena', 'Crocodile', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'D', false, 'Líder de los Revolucionarios y padre de Luffy', 'Dragon', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'E', false, 'Mar donde nació Luffy', 'East Blue', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'F', false, 'Almirante ciego con fruta de gravedad', 'Fujitora', 2) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'G', false, 'Héroe de los Marines y abuelo de Luffy', 'Garp', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'H', false, 'Tipo de poder especial usado por fuertes guerreros', 'Haki', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'I', true, 'Isla del cielo visitada por los Mugiwara', 'Skypiea', 2) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'J', false, 'Timonel de los Mugiwara, antiguo Shichibukai y gyojin', 'Jinbe', 2) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'K', false, 'Almirante con fruta de luz', 'Kizaru', 2) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'L', false, 'Capitán de los Piratas del Sombrero de Paja', 'Luffy', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'M', false, 'Mejor espadachín del mundo', 'Mihawk', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'N', false, 'Navegante de los Mugiwara', 'Nami', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'O', false, 'Tesoro legendario que buscan todos los piratas', 'One Piece', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'P', false, 'Piedras con historia del siglo del vacío', 'Poneglyph', 2) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'Q', false, 'Calamidad de los Piratas Bestia con la fruta del braquiosaurio', 'Queen', 2) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'R', false, 'Mano derecha del Rey de los Piratas', 'Rayleigh', 2) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'S', false, 'Cocinero de los Mugiwara', 'Sanji', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'T', false, 'Barco de los Mugiwara', 'Thousand Sunny', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'U', false, 'Francotirador mentiroso de los Mugiwara', 'Usopp', 1) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'V', false, 'Personaje que puede ver más lejos', 'Viola', 3) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'W', false, 'Pirata Bestia capaz de jugar a un juego de mesa.', 'Who''s-Who', 3) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'X', false, 'Capitán de los legendarios Piratas Rocks', 'Xebec', 4) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'Y', false, 'Título de los 4 emperadores del mar', 'Yonkou', 2) ON CONFLICT DO NOTHING;
INSERT INTO juegos.rosco_entrada (rosco_id, letra, contiene, definicion, respuesta, dificultad) VALUES (1, 'Z', false, 'Primer nakama y espadachín de Luffy', 'Zoro', 1) ON CONFLICT DO NOTHING;

-- Comprobación: 18 escenas, 37 personajes en escenas, 26 entradas de rosco
SELECT (SELECT count(*) FROM juegos.escena) AS escenas, (SELECT count(*) FROM juegos.escena_personaje) AS personajes, (SELECT count(*) FROM juegos.rosco_entrada) AS rosco;
