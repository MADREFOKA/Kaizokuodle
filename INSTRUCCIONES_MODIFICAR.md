# 📝 INSTRUCCIONES PARA MODIFICAR LOS JUEGOS

## ✅ **12 JUEGOS COMPLETOS**

Todos los juegos están listos y funcionando. Aquí está lo que necesitas modificar:

---

## 🎮 **JUEGOS QUE NO NECESITAN MODIFICACIÓN**

Estos usan `characters.json`, `fruits.json` o `ships.json` que ya tienes:

1. ✅ **Wordle** - usa characters.json
2. ✅ **Grid Challenge** - usa characters.json  
3. ✅ **Higher or Lower** - usa characters.json
4. ✅ **Timeline** - usa characters.json
5. ✅ **Adivina Fruta** - usa fruits.json
6. ✅ **Rellena Datos** - usa characters.json
7. ✅ **Ships Quiz** - usa ships.json
8. ✅ **Connect 4** - usa characters.json

---

## 📝 **JUEGOS QUE NECESITAS PERSONALIZAR**

### 1️⃣ **QUIZ/TRIVIA** → Archivo: `questions.json`

**Ubicación:** `/onepiece-games-v2/questions.json`

**Formato:**
```json
[
  {
    "question": "¿Quién es el capitán de los Mugiwara?",
    "options": ["Luffy", "Zoro", "Nami", "Sanji"],
    "correct": 0,
    "difficulty": 1,
    "category": "Personajes"
  }
]
```

**Campos:**
- `question`: La pregunta (texto)
- `options`: Array con 4 opciones
- `correct`: Índice de la respuesta correcta (0, 1, 2 o 3)
- `difficulty`: Nivel 1-5
- `category`: Categoría libre (Personajes, Historia, etc.)

**Actualmente:** 20 preguntas de ejemplo
**Recomendado:** 50-100 preguntas para variedad

---

### 2️⃣ **PASAPALABRA** → Archivo: `pasapalabra.json`

**Ubicación:** `/onepiece-games-v2/pasapalabra.json`

**Formato:**
```json
[
  {
    "letter": "A",
    "definition": "Hermano de Luffy que murió en Marineford",
    "answer": "Ace",
    "difficulty": 1
  }
]
```

**Campos:**
- `letter`: Letra A-Z (26 palabras necesarias)
- `definition`: Definición/pista del término
- `answer`: Respuesta correcta
- `difficulty`: Nivel 1-5

**Actualmente:** 26 palabras (A-Z completo)
**Puedes:** Cambiar las definiciones por otras más fáciles/difíciles

---

### 3️⃣ **AUDIO QUIZ** → Archivo: `audio.json`

**Ubicación:** `/onepiece-games-v2/audio.json`

**Formato:**
```json
[
  {
    "id": 1,
    "character": "Brook",
    "sound": "Yohohoho",
    "type": "laugh",
    "difficulty": 1
  }
]
```

**Campos:**
- `id`: Número único
- `character`: Nombre del personaje
- `sound`: Texto de la risa/frase (ej: "Zehahaha", "Shishishi")
- `type`: `"laugh"` o `"phrase"`
- `difficulty`: Nivel 1-5

**Actualmente:** 10 risas de ejemplo
**Recomendado:** 30-50 sonidos diferentes

**⚠️ IMPORTANTE:** Este juego muestra el TEXTO del sonido, NO reproduce audio real. Si quieres reproducir archivos MP3, necesitarás:
1. Añadir un campo `"file": "luffy_laugh.mp3"`
2. Subir los archivos MP3 a `/audio/`
3. Modificar el código para usar `<audio>` tag

---

### 4️⃣ **SPOT THE MISSING** → Archivo: `spot.json` + Imágenes

**Ubicación:** `/onepiece-games-v2/spot.json`

**Formato:**
```json
[
  {
    "id": 1,
    "image": "mugiwara_crew.jpg",
    "missing": ["Luffy", "Zoro", "Nami"],
    "difficulty": 1,
    "hint": "Tripulación de los Sombrero de Paja"
  }
]
```

**Campos:**
- `id`: Número único
- `image`: Nombre del archivo (debe estar en `/images/`)
- `missing`: Array con los nombres de personajes borrados
- `difficulty`: Nivel 1-5
- `hint`: Pista sobre la imagen

**⚠️ CRÍTICO - NECESITAS CREAR LAS IMÁGENES:**

1. **Ubicación:** `/onepiece-games-v2/images/`
2. **Proceso:**
   - Toma una imagen grupal (ej: Mugiwara crew)
   - Borra/pixela algunos personajes con Photoshop/GIMP
   - Guarda como `mugiwara_crew.jpg`
   - Añade entrada en `spot.json` con los nombres borrados

**Actualmente:** 5 niveles de ejemplo (las imágenes NO existen todavía)

---

## 🎨 **CARPETA /images/**

**Ubicación:** `/onepiece-games-v2/images/`

**Necesitas crear y subir:**
- `mugiwara_crew.jpg` - Imagen con algunos Mugiwara borrados
- `shichibukai.jpg` - Imagen con Shichibukai borrados
- `yonkou.jpg` - Imagen con Yonkou borrados
- `admirals.jpg` - Imagen con Almirantes borrados
- `supernovas.jpg` - Imagen con Supernovas borrados

**Formato recomendado:**
- Tamaño: 800x600px o similar
- Formato: JPG o PNG
- Personajes borrados: Rellenados con color sólido o pixelados

---

## 📊 **RESUMEN DE ARCHIVOS A MODIFICAR**

| Archivo | ¿Necesita edición? | Ubicación |
|---------|-------------------|-----------|
| `characters.json` | ❌ Ya tienes | `/onepiece-games-v2/` |
| `fruits.json` | ❌ Ya tienes | `/onepiece-games-v2/` |
| `ships.json` | ❌ Ya tienes | `/onepiece-games-v2/` |
| `questions.json` | ✅ Añade más preguntas | `/onepiece-games-v2/` |
| `pasapalabra.json` | ⚠️ Opcional (ya completo A-Z) | `/onepiece-games-v2/` |
| `audio.json` | ✅ Añade más risas/frases | `/onepiece-games-v2/` |
| `spot.json` | ✅ Añade más niveles | `/onepiece-games-v2/` |
| Imágenes `/images/` | ✅ **CRÍTICO** - Crear imágenes editadas | `/onepiece-games-v2/images/` |

---

## 🚀 **PRIORIDADES**

### **ALTA PRIORIDAD (sin esto no funcionan):**
1. 🖼️ **Crear imágenes** para Spot the Missing
2. ❓ **Añadir preguntas** a Quiz (mínimo 20, ideal 50+)

### **MEDIA PRIORIDAD (mejora variedad):**
3. 🎵 **Añadir risas** a Audio Quiz (mínimo 20)
4. 🔤 **Mejorar definiciones** de Pasapalabra (opcional)

---

## 💡 **TIPS PARA CREAR IMÁGENES**

### Opción 1: Photoshop/GIMP
1. Abre imagen grupal
2. Usa herramienta de selección
3. Rellena personajes con color gris (#808080)
4. Guarda como JPG

### Opción 2: Online (Photopea.com)
1. Sube imagen a photopea.com
2. Usa "Fill tool" para rellenar personajes
3. Descarga resultado

### Opción 3: IA (ChatGPT/DALL-E)
1. "Genera imagen de Mugiwara crew con Luffy, Zoro y Nami borrados"
2. Úsala como base

---

## ✅ **CHECKLIST FINAL**

- [ ] Subir imágenes editadas a `/images/`
- [ ] Actualizar `spot.json` con nombres correctos
- [ ] Añadir 30+ preguntas a `questions.json`
- [ ] Añadir 20+ risas a `audio.json`
- [ ] Probar todos los juegos

---

¡Todo listo! 🏴‍☠️
