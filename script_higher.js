/* ====================================================
   💰 Kaizoku Higher or Lower (versión final)
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
let contadorVictoriasPj1 = 0;
let contadorVictoriasPj2 = 0;

// =============== CARGA DATOS =================
async function cargarDatosHL(dif) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNamesHL[dif]}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  personajesHL = data.values.slice(1).filter(p => p[13] && p[13] !== "---");
  nuevoDuelo();
}

// =============== NUEVO DUELO =================
function nuevoDuelo(mantener = null) {
  if (!mantener) {
    pj1 = personajesHL[Math.floor(Math.random() * personajesHL.length)];
    contadorVictoriasPj1 = 0;
  } else {
    pj1 = mantener;
  }
  pj2 = personajesHL[Math.floor(Math.random() * personajesHL.length)];
  if (pj1 === pj2) return nuevoDuelo(mantener);

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

// =============== ELECCIÓN DE PERSONAJE =================
function elegirPersonaje(num) {
  const b1 = parseFloat(pj1[13].replace(/[^\d]/g, ""));
  const b2 = parseFloat(pj2[13].replace(/[^\d]/g, ""));
  const ganador = b1 > b2 ? 1 : 2;

  const card1 = $("#card1");
  const card2 = $("#card2");

  let seleccionado = num === 1 ? card1 : card2;

  if (num === ganador) {
    // ACIERTO
    seleccionado.addClass("correctoHL");
    racha++;
    mejorRacha = Math.max(mejorRacha, racha);
    localStorage.setItem("mejorRacha", mejorRacha);
    mostrarMensajeHL("✅ ¡Correcto!");

    if (ganador === 1) {
      contadorVictoriasPj1++;
      contadorVictoriasPj2 = 0;
    } else {
      contadorVictoriasPj2++;
      contadorVictoriasPj1 = 0;
    }

    let mantener = ganador === 1 ? pj1 : pj2;

    // Si ese personaje ya lleva 2 seguidas, se cambia también
    if (contadorVictoriasPj1 >= 2 || contadorVictoriasPj2 >= 2) {
      mantener = null;
      contadorVictoriasPj1 = 0;
      contadorVictoriasPj2 = 0;
    }

    setTimeout(() => nuevoDuelo(mantener), 3000);
  } else {
    // FALLO
    seleccionado.addClass("incorrectoHL");
    const pjGanador = ganador === 1 ? pj1 : pj2;
    mostrarMensajeHL(`❌ Fallaste. ${pjGanador[0]} tiene más recompensa.`);
    racha = 0;
    contadorVictoriasPj1 = 0;
    contadorVictoriasPj2 = 0;
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
$('#facil-hl').click(() => { dificultadHL = 'facil'; $('#hl-container').show(); cargarDatosHL('facil'); });
$('#medio-hl').click(() => { dificultadHL = 'medio'; $('#hl-container').show(); cargarDatosHL('medio'); });
$('#dificil-hl').click(() => { dificultadHL = 'dificil'; $('#hl-container').show(); cargarDatosHL('dificil'); });
$('#imposible-hl').click(() => { dificultadHL = 'imposible'; $('#hl-container').show(); cargarDatosHL('imposible'); });
