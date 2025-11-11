/* ====================================================
   💰 Kaizoku Higher or Lower (versión con no repetidos,
      máximo 2 rondas por personaje y empates correctos)
   ==================================================== */

const sheetID = '1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ';
const apiKey = 'AIzaSyAiIS758bKjVHSvAN9Ub__7dSQOWbWSLfQ';
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

// nombres usados en la partida (para no repetir)
let nombresUsadosHL = new Set();

// control de victorias consecutivas del mismo personaje
let ultimoGanadorNombre = null;
let victoriasConsecutivasGanador = 0;

// =============== CARGA DATOS =================
async function cargarDatosHL(dif) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNamesHL[dif]}?key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    personajesHL = (data.values || [])
      .slice(1)
      .filter(p => p[13] && p[13] !== '---'); // solo con recompensa

    nombresUsadosHL.clear();
    ultimoGanadorNombre = null;
    victoriasConsecutivasGanador = 0;
    racha = 0;
    $("#racha").text(`Racha: 0`);
    $("#mejorRacha").text(`Mejor racha: ${mejorRacha}`);

    if (personajesHL.length < 2) {
      alert("No hay suficientes personajes con recompensa en esta dificultad.");
      return;
    }

    nuevoDuelo();
  } catch (e) {
    console.error('Error al cargar datos HL:', e);
  }
}

// =============== NORMALIZAR NOMBRE =================
function normalizarNombre(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// =============== OBTENER PERSONAJE SIN REPETIR =================
function obtenerPersonajeNoRepetido(excluirNombre = null) {
  const excl = excluirNombre ? normalizarNombre(excluirNombre) : null;

  let disponibles = personajesHL.filter(p => {
    const nom = normalizarNombre(p[0]);
    if (excl && nom === excl) return false;
    return !nombresUsadosHL.has(nom);
  });

  // Si se han usado todos, reseteamos el set y volvemos a construir la lista
  if (disponibles.length === 0) {
    nombresUsadosHL.clear();
    disponibles = personajesHL.filter(p => {
      const nom = normalizarNombre(p[0]);
      return !(excl && nom === excl);
    });
  }

  if (disponibles.length === 0) return null; // caso extremo

  const elegido = disponibles[Math.floor(Math.random() * disponibles.length)];
  nombresUsadosHL.add(normalizarNombre(elegido[0]));
  return elegido;
}

// =============== NUEVO DUELO =================
function nuevoDuelo(mantener = null) {
  if (!personajesHL.length) return;

  // Si nos han dicho quién debe quedarse (por lógica de 2 rondas)
  if (mantener) {
    pj1 = mantener;
  } else {
    pj1 = obtenerPersonajeNoRepetido();
  }

  if (!pj1) return;

  pj2 = obtenerPersonajeNoRepetido(pj1[0]);
  if (!pj2) {
    pj2 = obtenerPersonajeNoRepetido(); // fallback
    if (!pj2) return;
  }

  $("#name1").text(pj1[0]);
  $("#name2").text(pj2[0]);
  $("#img1").attr("src", pj1[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#img2").attr("src", pj2[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#bounty1").text(pj1[13]);
  $("#bounty2").text("???");

  $("#mensaje").removeClass("msg-visible").hide();
  $(".hl-card").removeClass("correctoHL incorrectoHL");

  actualizarRacha();
}

// =============== ELECCIÓN DE PERSONAJE =================
function elegirPersonaje(num) {
  const b1 = parseFloat(pj1[13].replace(/[^\d]/g, ""));
  const b2 = parseFloat(pj2[13].replace(/[^\d]/g, ""));

  const card1 = $("#card1");
  const card2 = $("#card2");
  const seleccionado = num === 1 ? card1 : card2;

  let ganadorIndex; // 1, 2 o 0 si empate

  if (b1 === b2) {
    ganadorIndex = 0; // empate: cualquiera vale
  } else if (b1 > b2) {
    ganadorIndex = 1;
  } else {
    ganadorIndex = 2;
  }

  const haAcertado = (ganadorIndex === 0) || (num === ganadorIndex);

  if (haAcertado) {
    // ========= ACIERTO =========
    seleccionado.addClass("correctoHL");
    racha++;
    mejorRacha = Math.max(mejorRacha, racha);
    localStorage.setItem("mejorRacha", mejorRacha);

    mostrarMensajeHL("✅ ¡Correcto!");

    // Lógica de quién se queda
    let ganadorPj, perdedorPj;

    if (ganadorIndex === 1 || (ganadorIndex === 0 && num === 1)) {
      ganadorPj = pj1;
      perdedorPj = pj2;
    } else if (ganadorIndex === 2 || (ganadorIndex === 0 && num === 2)) {
      ganadorPj = pj2;
      perdedorPj = pj1;
    } else {
      ganadorPj = pj1;
      perdedorPj = pj2;
    }

    const nombreGanador = normalizarNombre(ganadorPj[0]);

    if (nombreGanador === ultimoGanadorNombre) {
      victoriasConsecutivasGanador++;
    } else {
      ultimoGanadorNombre = nombreGanador;
      victoriasConsecutivasGanador = 1;
    }

    // 🔥 REGLA MADREFOKA:
    // Máximo 2 RONDAS seguidas con el mismo ganador.
    // Si ya lleva 2, en la siguiente RONDA se queda el otro.
    let mantenerSiguiente;

    if (victoriasConsecutivasGanador >= 2) {
      // ya ha ganado 2 seguidas → ahora se queda el perdedor
      mantenerSiguiente = perdedorPj;
      ultimoGanadorNombre = null;
      victoriasConsecutivasGanador = 0;
    } else {
      // menos de 2 seguidas → se mantiene el ganador
      mantenerSiguiente = ganadorPj;
    }

    setTimeout(() => nuevoDuelo(mantenerSiguiente), 3000);
  } else {
    // ========= FALLO =========
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

// =============== MENSAJE CON FADE =================
function mostrarMensajeHL(texto) {
  const msg = $("#mensaje");
  msg
    .text(texto)
    .css({ opacity: 0, display: 'inline-block' })
    .addClass("msg-visible")
    .animate({ opacity: 1 }, 300);

  setTimeout(() => {
    msg.animate({ opacity: 0 }, 300, () => {
      msg.removeClass("msg-visible").hide();
    });
  }, 2500);
}

// =============== RACHAS =================
function actualizarRacha() {
  $("#racha").text(`Racha: ${racha}`);
  $("#mejorRacha").text(`Mejor racha: ${mejorRacha}`);
}

// =============== BOTONES DE DIFICULTAD =================
$('#facil-hl').click(() => { dificultadHL = 'facil';     $('#hl-container').show(); cargarDatosHL('facil'); });
$('#medio-hl').click(() => { dificultadHL = 'medio';     $('#hl-container').show(); cargarDatosHL('medio'); });
$('#dificil-hl').click(() => { dificultadHL = 'dificil'; $('#hl-container').show(); cargarDatosHL('dificil'); });
$('#imposible-hl').click(() => { dificultadHL = 'imposible'; $('#hl-container').show(); cargarDatosHL('imposible'); });
