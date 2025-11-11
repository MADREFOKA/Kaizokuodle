/* ====================================================
   💰 Kaizoku Higher or Lower — lógica exacta MADREFOKA
   ==================================================== */

const sheetID = '1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ';
const apiKey  = 'TU_API_KEY_AQUI'; // ⚠️ Reemplaza tu API key aquí
const sheetsNamesHL = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
  imposible: 'Imposible'
};

let dificultadHL = 'facil';
let personajesHL = [];
let pj1, pj2;
let racha = 0;
let mejorRacha = parseInt(localStorage.getItem("mejorRacha") || "0");

// Control de repetidos y permanencia
let usados = new Set();
let personajeActual = null;
let victoriasSeguidas = 0;

// ===================================================
// Cargar datos desde Google Sheets
// ===================================================
async function cargarDatosHL(dif) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNamesHL[dif]}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  personajesHL = (data.values || [])
    .slice(1)
    .filter(p => p[13] && p[13] !== "---");

  usados.clear();
  personajeActual = null;
  victoriasSeguidas = 0;
  racha = 0;
  actualizarRacha();
  nuevoDuelo();
}

// ===================================================
// Obtener personaje aleatorio sin repetir
// ===================================================
function obtenerPersonaje(excluir = null) {
  const disponibles = personajesHL.filter(p => {
    const nombre = p[0];
    return nombre !== excluir && !usados.has(nombre);
  });

  if (disponibles.length === 0) {
    usados.clear();
    return obtenerPersonaje(excluir);
  }

  const elegido = disponibles[Math.floor(Math.random() * disponibles.length)];
  usados.add(elegido[0]);
  return elegido;
}

// ===================================================
// Mostrar nuevo duelo
// ===================================================
function nuevoDuelo(mantener = null) {
  if (!mantener) pj1 = obtenerPersonaje();
  else pj1 = mantener;

  pj2 = obtenerPersonaje(pj1[0]);
  if (!pj2) pj2 = obtenerPersonaje();

  $("#name1").text(pj1[0]);
  $("#name2").text(pj2[0]);
  $("#img1").attr("src", pj1[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#img2").attr("src", pj2[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#bounty1").text(pj1[13] + " ฿");
  $("#bounty2").text("???");

  $("#mensaje").removeClass("msg-visible").hide();
  $(".hl-card").removeClass("correctoHL incorrectoHL");
}

// ===================================================
// Elegir personaje (click en carta)
// ===================================================
function elegirPersonaje(num) {
  const recompensa1 = parseFloat(pj1[13].replace(/[^\d]/g, ""));
  const recompensa2 = parseFloat(pj2[13].replace(/[^\d]/g, ""));
  const card1 = $("#card1");
  const card2 = $("#card2");
  const seleccionado = num === 1 ? card1 : card2;

  // Determinar ganador
  let ganadorIndex = 0;
  if (recompensa1 === recompensa2) ganadorIndex = 0;
  else ganadorIndex = recompensa1 > recompensa2 ? 1 : 2;

  const acierto = ganadorIndex === 0 || num === ganadorIndex;

  if (acierto) {
    seleccionado.addClass("correctoHL");
    racha++;
    mejorRacha = Math.max(mejorRacha, racha);
    localStorage.setItem("mejorRacha", mejorRacha);
    mostrarMensajeHL("✅ ¡Correcto!");

    const ganador = ganadorIndex === 1 || (ganadorIndex === 0 && num === 1) ? pj1 : pj2;
    const perdedor = ganador === pj1 ? pj2 : pj1;

    // 🧩 Lógica exacta MADREFOKA:
    // - El mismo personaje puede ganar 2 veces seguidas.
    // - A la tercera ronda (tras 2 victorias consecutivas),
    //   se queda el otro personaje, aunque el ganador volviera a ganar.

    if (ganador[0] === personajeActual) {
      victoriasSeguidas++;
    } else {
      personajeActual = ganador[0];
      victoriasSeguidas = 1;
    }

    let siguiente;
    if (victoriasSeguidas < 3) {
      // 1ª y 2ª victoria → se mantiene el ganador
      siguiente = ganador;
    } else {
      // 3ª ronda → se queda el otro
      siguiente = perdedor;
      victoriasSeguidas = 0;
      personajeActual = null;
    }

    setTimeout(() => nuevoDuelo(siguiente), 3000);

  } else {
    seleccionado.addClass("incorrectoHL");
    const pjGanador = recompensa1 > recompensa2 ? pj1 : pj2;
    mostrarMensajeHL(`❌ Fallaste. ${pjGanador[0]} tiene más recompensa.`);

    racha = 0;
    personajeActual = null;
    victoriasSeguidas = 0;
    setTimeout(() => nuevoDuelo(), 3000);
  }

  actualizarRacha();
}

// ===================================================
// Mostrar mensaje con fade
// ===================================================
function mostrarMensajeHL(texto) {
  const msg = $("#mensaje");
  msg.text(texto)
    .css({ opacity: 0, display: "inline-block" })
    .addClass("msg-visible")
    .animate({ opacity: 1 }, 300);

  setTimeout(() => {
    msg.animate({ opacity: 0 }, 300, () => {
      msg.removeClass("msg-visible").hide();
    });
  }, 2500);
}

// ===================================================
// Actualizar racha y mejor racha
// ===================================================
function actualizarRacha() {
  $("#racha").text(`Racha: ${racha}`);
  $("#mejorRacha").text(`Mejor racha: ${mejorRacha}`);
}

// ===================================================
// Botones de dificultad
// ===================================================
$('#facil-hl').click(() => { dificultadHL = 'facil'; $('#hl-container').show(); cargarDatosHL('facil'); });
$('#medio-hl').click(() => { dificultadHL = 'medio'; $('#hl-container').show(); cargarDatosHL('medio'); });
$('#dificil-hl').click(() => { dificultadHL = 'dificil'; $('#hl-container').show(); cargarDatosHL('dificil'); });
$('#imposible-hl').click(() => { dificultadHL = 'imposible'; $('#hl-container').show(); cargarDatosHL('imposible'); });
