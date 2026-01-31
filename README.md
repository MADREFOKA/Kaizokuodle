# 🏴‍☠️ One Piece Games V2 - Arquitectura Modular

Colección de juegos de One Piece completamente rediseñada con **arquitectura modular**, **Thousand Sunny animado** y **iconos SVG temáticos**.

## 🎮 Juegos Incluidos (TODOS COMPLETOS ✅)

1. **Adivina el Personaje** ✅ - 5 niveles de dificultad, 16 campos con sistema de flechas
2. **Grid Challenge** ✅ - Matriz 3x3 interactiva con búsqueda en tiempo real
3. **Higher or Lower** ✅ - Comparación de recompensas con sistema de rachas
4. **Timeline** ✅ - Ordena 10 personajes por aparición con drag & drop
5. **Adivina la Fruta/Usuario** ✅ - 2 modos de juego con frutas del diablo
6. **Rellena los Datos** ✅ - 15 campos completos con validación inteligente

## 📁 Estructura del Proyecto (NUEVA - Modular)

```
onepiece-games/
├── index.html              # Menú principal con iconos SVG
├── css/
│   └── styles.css         # Estilos compartidos + animaciones
├── js/
│   └── utils.js           # Funciones comunes + carga de datos
├── games/
│   ├── wordle.html        # ✅ Adivina el personaje (COMPLETO)
│   ├── grid.html          # ✅ Grid challenge (COMPLETO)
│   ├── higher.html        # ✅ Higher or Lower (COMPLETO)
│   ├── timeline.html      # ✅ Timeline (COMPLETO)
│   ├── fruit.html         # ✅ Devil fruit guesser (COMPLETO)
│   └── fill.html          # ✅ Fill blanks (COMPLETO)
├── images/                # (futuro) iconos adicionales
├── characters.json
├── fruits.json
└── ships.json
```

## 🎨 Mejoras Visuales V2

### Fondo Mejorado
- ✅ **Cielo degradado** azul realista (celeste → azul oscuro)
- ✅ **Nubes flotantes** animadas en 3 capas
- ✅ **Olas del mar** en 3 capas con movimiento infinito
- ✅ **Thousand Sunny navegando** con animación de balanceo sobre las olas
  - Diseño vectorial SVG del barco completo
  - León Sunny (figura de proa)
  - Jolly Roger de los Mugiwara en la vela
  - Ventanas, ancla y detalles del barco
  - Animación de navegación continua + balanceo realista

### Iconos SVG Temáticos
Cada juego tiene un icono personalizado en estilo One Piece:

1. **Adivina el Personaje**: Lupa sobre wanted poster
2. **Grid Challenge**: Cuadrícula colorida con sombrero de paja
3. **Higher or Lower**: Wanted poster con flechas ↑↓
4. **Timeline**: Reloj con paneles de manga
5. **Devil Fruit**: Fruta morada con espirales características
6. **Fill Blanks**: Cuaderno con pluma dorada

## 💪 Ventajas de la Arquitectura Modular

### Antes (v1)
- ❌ Un solo archivo HTML de 15,000+ líneas
- ❌ Difícil de mantener y debuggear
- ❌ Carga completa en cada juego
- ❌ Imposible trabajar en equipo

### Ahora (v2)
- ✅ Archivos HTML separados por juego (~300 líneas c/u)
- ✅ CSS y JS compartidos (DRY - Don't Repeat Yourself)
- ✅ Carga solo lo necesario por página
- ✅ Fácil añadir nuevos juegos
- ✅ Múltiples desarrolladores pueden trabajar sin conflictos
- ✅ Mejor performance (menos código por página)

## 🚀 Cómo Desplegar

### GitHub Pages (Recomendado)

1. **Sube toda la carpeta** `onepiece-games` a tu repositorio
2. **Estructura en GitHub**:
   ```
   tu-repo/
   ├── index.html
   ├── css/
   ├── js/
   ├── games/
   ├── characters.json
   ├── fruits.json
   └── ships.json
   ```
3. **Activa Pages**: Settings → Pages → Branch: main → / (root)
4. **URL**: `https://tu-usuario.github.io/tu-repo`

### Vercel (Alternativa)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd onepiece-games
vercel
```

### Local (Testing)

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# Visita: http://localhost:8000
```

## 🔧 Cómo Añadir un Nuevo Juego

1. **Crea** `games/mi-juego.html`
2. **Importa** CSS y JS compartidos:
   ```html
   <link rel="stylesheet" href="../css/styles.css">
   <script src="../js/utils.js"></script>
   ```
3. **Añade al menú** en `index.html`:
   ```html
   <a href="games/mi-juego.html" class="game-card">
       <svg class="game-icon-svg" viewBox="0 0 100 100">
           <!-- Tu icono SVG aquí -->
       </svg>
       <h3>Mi Juego</h3>
       <p>Descripción</p>
   </a>
   ```

## 📊 Sistema de Estadísticas

El archivo `js/utils.js` incluye funciones para guardar stats en LocalStorage:

```javascript
// Guardar estadísticas
saveStats('wordle', {
    gamesPlayed: 10,
    wins: 7,
    currentStreak: 3
});

// Recuperar estadísticas
const stats = getStats('wordle');
console.log(stats.wins); // 7
```

## 🎯 Próximas Mejoras Sugeridas

- [ ] Sistema de logros globales
- [ ] Leaderboard con Supabase (opcional)
- [ ] Modo Daily Challenge (personaje/fruta del día)
- [ ] PWA (Progressive Web App) para instalación móvil
- [ ] Sonidos del anime en cada juego
- [ ] Animaciones adicionales (Going Merry, otros barcos)
- [ ] Modo multijugador/competitivo
- [ ] Estadísticas avanzadas por juego
- [ ] Compartir puntuaciones en redes sociales
- [ ] Tema oscuro/claro toggle

## 🐛 Troubleshooting

**Las rutas no cargan:**
- Verifica que la estructura de carpetas sea correcta
- Los archivos de juegos deben usar `../` para acceder a recursos del nivel superior

**Las animaciones van lentas:**
- Reduce la cantidad de personajes cargados inicialmente
- Considera lazy loading para datos

**El Thousand Sunny no aparece:**
- Asegúrate de que `styles.css` esté cargado correctamente
- Verifica que `.ship-container` esté presente en el HTML

## 🤝 Contribuir

Con la arquitectura modular, es mucho más fácil contribuir:

1. Haz fork del proyecto
2. Crea tu juego en `games/tu-juego.html`
3. Añade tu icono SVG al menú
4. Pull request

## 📝 Changelog

### v2.0.0 (2026-01-31) - Arquitectura Modular
- ✅ **ARQUITECTURA COMPLETAMENTE NUEVA**
- ✅ Separación en archivos HTML individuales
- ✅ CSS y JS compartidos y reutilizables
- ✅ **Thousand Sunny navegando** sobre olas animadas
- ✅ **Iconos SVG temáticos** de One Piece
- ✅ Cielo con nubes flotantes
- ✅ Sistema de estadísticas en LocalStorage
- ✅ Performance mejorado (menos código por página)
- ✅ Mejor mantenibilidad y escalabilidad

### v1.0.0 (2026-01-30)
- 9 juegos en un solo archivo monolítico
- Fondo oceánico básico
- Emojis como iconos

## 📄 Licencia

Proyecto de fan para fans. One Piece © Eiichiro Oda.

---

**¡Zarpamos hacia la aventura con código limpio! ⚓**
