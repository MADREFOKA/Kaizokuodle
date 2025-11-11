/* ====================================================
   💰 Kaizoku Higher or Lower — lógica exacta MADREFOKA
   ==================================================== */

const sheetID = "1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ";
const apiKey = "TU_API_KEY_AQUI"; // <- tu key restringida
const sheetsNamesHL = {
  facil: "Fácil",
  medio: "Medio",
  dificil: "Difícil",
  imposible: "Imposible",
};

let dificultadHL = "facil";
let personajesHL = [];
let pj1, pj2;
let racha = 0;
let mejorRacha = parseInt(localStorage.getItem("mejorRacha") || "0");

// Control
let nombresUsadosHL = new Set();
let ultimoGanadorNombre = null;
let victoriasConsecutivasGanador = 0;

// ================= CARGAR DATOS =================
async function cargarDatosHL(dif) {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNamesHL[dif]}?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    personajesHL = (data.values || [])
      .slice(1)
      .filter((p) => p[13] && p[13] !== "---");

    nombresUsadosHL.clear();
    ultimoGanadorNombre = null;
    victoriasConsecutivasGanador = 0;
    racha = 0;
    actualizarRacha();

    if (personajesHL.length >= 2) nuevoDuelo();
    else alert("No hay suficientes personajes con recompensa en esta dificultad.");
  } catch (err) {
    console.error("Error al cargar datos:", err);
  }
}

// ============== UTILIDADES =================
function normalizarNombre(n) {
  return n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function obtenerPersonajeNoRepetido(excluir = null) {
  const excl = excluir ? normalizarNombre(excluir) : null;
  const disponibles = personajesHL.filter((p) => {
    const nom = normalizarNombre(p[0]);
    return nom !== excl && !nombresUsadosHL.has(nom);
  });
  if (disponibles.length === 0) {
    nombresUsadosHL.clear(); // reinicia si se agotan
    return null;
  }
  const elegido = disponibles[Math.floor(Math.random() * disponibles.length)];
  nombresUsadosHL.add(normalizarNombre(elegido[0]));
  return elegido;
}

// ============== NUEVO DUELO =================
function nuevoDuelo(mantener = null) {
  if (!personajesHL.length) return;

  pj1 = mantener || obtenerPersonajeNoRepetido();
  if (!pj1) pj1 = personajesHL[Math.floor(Math.random() * personajesHL.length)];
  pj2 = obtenerPersonajeNoRepetido(pj1[0]) || obtenerPersonajeNoRepetido();

  $("#name1").text(pj1[0]);
  $("#name2").text(pj2[0]);
  $("#img1").attr("src", pj1[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#img2").attr("src", pj2[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#bounty1").text(pj1[13] + " ฿");
  $("#bounty2").text("???");

  $("#mensaje").removeClass("msg-visible").hide();
  $(".hl-card").removeClass("correctoHL incorrectoHL");
}

// ============== ELEGIR PERSONAJE =================
function elegirPersonaje(num) {
  const b1 = parseFloat(pj1[13].replace(/[^\d]/g, ""));
  const b2 = parseFloat(pj2[13].replace(/[^\d]/g, ""));
  const card1 = $("#card1");
  const card2 = $("#card2");
  const seleccionado = num === 1 ? card1 : card2;

  let ganadorIndex = 0;
  if (b1 !== b2) ganadorIndex = b1 > b2 ? 1 : 2;
  const haAcertado = ganadorIndex === 0 || num === ganadorIndex;

  if (haAcertado) {
    seleccionado.addClass("correctoHL");
    racha++;
    mejorRacha = Math.max(mejorRacha, racha);
    localStorage.setItem("mejorRacha", mejorRacha);
    mostrarMensajeHL("✅ ¡Correcto!");

    const ganador = ganadorIndex === 1 || (ganadorIndex === 0 && num === 1) ? pj1 : pj2;
    const perdedor = ganador === pj1 ? pj2 : pj1;

    const nombreGanador = normalizarNombre(ganador[0]);
    if (nombreGanador === ultimoGanadorNombre) {
      victoriasConsecutivasGanador++;
    } else {
      ultimoGanadorNombre = nombreGanador;
      victoriasConsecutivasGanador = 1;
    }

    // ⚓ Lógica MADREFOKA: máximo 2 rondas seguidas → luego se queda el otro
    let siguiente;
    if (victoriasConsecutivasGanador >= 2) {
      siguiente = perdedor;
      ultimoGanadorNombre = null;
      victoriasConsecutivasGanador = 0;
    } else {
      siguiente = ganador;
    }

    setTimeout(() => nuevoDuelo(siguiente), 3000);
  } else {
    seleccionado.addClass("incorrectoHL");
    const pjGanador = b1 > b2 ? pj1 : pj2;
    mostrarMensajeHL(`❌ Fallaste. ${pjGanador[0]} tiene más recompensa.`);
    racha = 0;
    ultimoGanadorNombre = null;
    victoriasConsecutivasGanador = 0;
    setTimeout(() => nuevoDuelo(), 3000);
  }
  actualizarRacha();
}

// ============== MENSAJES =================
function mostrarMensajeHL(texto) {
  const msg = $("#mensaje");
  msg
    .text(texto)
    .css({ opacity: 0, display: "inline-block" })
    .addClass("msg-visible")
    .animate({ opacity: 1 }, 300);

  setTimeout(() => {
    msg.animate({ opacity: 0 }, 300, () => {
      msg.removeClass("msg-visible").hide();
    });
  }, 2500);
}

// ============== RACHAS =================
function actualizarRacha() {
  $("#racha").text(`Racha: ${racha}`);
  $("#mejorRacha").text(`Mejor racha: ${mejorRacha}`);
}

// ============== BOTONES DE DIFICULTAD =================
$("#facil-hl").click(() => { dificultadHL = "facil"; $("#hl-container").show(); cargarDatosHL("facil"); });
$("#medio-hl").click(() => { dificultadHL = "medio"; $("#hl-container").show(); cargarDatosHL("medio"); });
$("#dificil-hl").click(() => { dificultadHL = "dificil"; $("#hl-container").show(); cargarDatosHL("dificil"); });
$("#imposible-hl").click(() => { dificultadHL = "imposible"; $("#hl-container").show(); cargarDatosHL("imposible"); });
