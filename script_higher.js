/* ====================================================
   💰 Kaizoku Higher or Lower (versión final)
   ==================================================== */

const sheetID = '1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ';
const apiKey  = 'TU_API_KEY_AQUI'; // pon aquí tu nueva key restringida
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

// 🔹 NUEVO: control de personajes ya usados
let personajesUsados = new Set();

// 🔹 NUEVO: control de cuántas rondas seguidas lleva el mismo ganador
let nombreUltimoGanador = null;
let victoriasSeguidas = 0;

// ===================================================
// 📜 Cargar personajes
// ===================================================
async function cargarDatosHL(dif) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNamesHL[dif]}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  personajesHL = (data.values || []).slice(1).filter(p => p[13] && p[13] !== "---");
  personajesUsados.clear();
  nombreUltimoGanador = null;
  victoriasSeguidas = 0;
  racha = 0;
  actualizarRacha();

  nuevoDuelo();
}

// ===================================================
// 🌀 Obtener personaje aleatorio sin repetir
// ===================================================
function obtenerPersonaje(excluir = null) {
  const disponibles = personajesHL.filter(p => {
    const nombre = p[0];
    return !personajesUsados.has(nombre) && nombre !== excluir;
  });

  if (disponibles.length === 0) {
    personajesUsados.clear(); // si se acaban, reseteamos
    return obtenerPersonaje(excluir);
  }

  const elegido = disponibles[Math.floor(Math.random() * disponibles.length)];
  personajesUsados.add(elegido[0]);
  return elegido;
}

// ===================================================
// ⚔️ Iniciar nuevo duelo
// ===================================================
function nuevoDuelo(mantener = null) {
  if (!mantener) pj1 = obtenerPersonaje();
  else pj1 = mantener;

  pj2 = obtenerPersonaje(pj1[0]);
  if (!pj2) pj2 = obtenerPersonaje();

  // Mostrar datos en pantalla
  $("#name1").text(pj1[0]);
  $("#name2").text(pj2[0]);
  $("#img1").attr("src", pj1[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#img2").attr("src", pj2[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#bounty1").text(pj1[13] + " ฿");
  $("#bounty2").text("???");

  $("#mensaje").removeClass("msg-visible").hide();
  $(".hl-card").removeClass("correctoHL incorrectoHL");

  actualizarRacha();
}

// ===================================================
// 🧮 Click en un personaje
// ===================================================
function elegirPersonaje(num) {
  const recompensa1 = parseFloat(pj1[13].replace(/[^\d]/g, ""));
  const recompensa2 = parseFloat(pj2[13].replace(/[^\d]/g, ""));

  const card1 = $("#card1");
  const card2 = $("#card2");
  const seleccionado = num === 1 ? card1 : card2;

  let ganadorIndex = 0;

  // ➤ Si son iguales, ambos son correctos
  if (recompensa1 === recompensa2) {
    ganadorIndex = 0; // empate
  } else if (recompensa1 > recompensa2) {
    ganadorIndex = 1;
  } else {
    ganadorIndex = 2;
  }

  const acierto = (ganadorIndex === 0) || (num === ganadorIndex);

  if (acierto) {
    seleccionado.addClass("correctoHL");
    racha++;
    mejorRacha = Math.max(mejorRacha, racha);
    localStorage.setItem("mejorRacha", mejorRacha);
    mostrarMensajeHL("✅ ¡Correcto!");

    // -----------------------
    // Lógica de rotación
    // -----------------------
    let ganador, perdedor;
    if (ganadorIndex === 1 || (ganadorIndex === 0 && num === 1)) {
      ganador = pj1;
      perdedor = pj2;
    } else {
      ganador = pj2;
      perdedor = pj1;
    }

    if (ganador[0] === nombreUltimoGanador) {
      victoriasSeguidas++;
    } else {
      nombreUltimoGanador = ganador[0];
      victoriasSeguidas = 1;
    }

    // ➤ Máximo 2 rondas seguidas por personaje
    let siguiente;
    if (victoriasSeguidas >= 2) {
      siguiente = perdedor;
      nombreUltimoGanador = null;
      victoriasSeguidas = 0;
    } else {
      siguiente = ganador;
    }

    setTimeout(() => nuevoDuelo(siguiente), 3000);
  } else {
    seleccionado.addClass("incorrectoHL");
    const pjGanador = recompensa1 > recompensa2 ? pj1 : pj2;
    mostrarMensajeHL(`❌ Fallaste. ${pjGanador[0]} tiene más recompensa.`);

    // Reset de control
    racha = 0;
    nombreUltimoGanador = null;
    victoriasSeguidas = 0;

    setTimeout(() => nuevoDuelo(), 3000);
  }

  actualizarRacha();
}

// ===================================================
// 💬 Mostrar mensaje con fade
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
// 📊 Actualizar rachas
// ===================================================
function actualizarRacha() {
  $("#racha").text(`Racha: ${racha}`);
  $("#mejorRacha").text(`Mejor racha: ${mejorRacha}`);
}

// ===================================================
// 🧭 Botones de dificultad
// ===================================================
$("#facil-hl").click(() => { dificultadHL = "facil";     $("#hl-container").show(); cargarDatosHL("facil"); });
$("#medio-hl").click(() => { dificultadHL = "medio";     $("#hl-container").show(); cargarDatosHL("medio"); });
$("#dificil-hl").click(() => { dificultadHL = "dificil"; $("#hl-container").show(); cargarDatosHL("dificil"); });
$("#imposible-hl").click(() => { dificultadHL = "imposible"; $("#hl-container").show(); cargarDatosHL("imposible"); });
