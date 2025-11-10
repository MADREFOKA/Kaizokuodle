/* ====================================================
   💰 Kaizoku Higher or Lower (v. completa)
   ==================================================== */

const sheetID = '1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ';
const apiKey = 'AIzaSyAiIS758bKjVHSvAN9Ub__7dSQOWbWSLfQ';
const sheetsNames = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
  imposible: 'Imposible'
};

let dificultad = 'facil';
let personajes = [];
let pj1, pj2;
let racha = 0;
let mejorRacha = parseInt(localStorage.getItem("mejorRacha") || "0");
let contadorVictoriasPj1 = 0;
let contadorVictoriasPj2 = 0;

async function cargarDatosHL(dif) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNames[dif]}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  personajes = data.values.slice(1).filter(p => p[13] && p[13] !== "---");
  nuevoDuelo();
}

function nuevoDuelo(mantener = null) {
  if (!mantener) {
    pj1 = personajes[Math.floor(Math.random() * personajes.length)];
  } else {
    pj1 = mantener;
  }
  pj2 = personajes[Math.floor(Math.random() * personajes.length)];
  if (pj1 === pj2) return nuevoDuelo(mantener);

  $("#name1").text(pj1[0]);
  $("#name2").text(pj2[0]);
  $("#img1").attr("src", pj1[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#img2").attr("src", pj2[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#bounty1").text(pj1[13] + " ฿");
  $("#bounty2").text("???");
  $("#mensaje").text("").removeClass("msg-visible");

  $(".hl-card").removeClass("correctoHL incorrectoHL");
  actualizarRacha();
}

function elegirPersonaje(num) {
  const b1 = parseFloat(pj1[13].replace(/[^\d]/g, ""));
  const b2 = parseFloat(pj2[13].replace(/[^\d]/g, ""));
  const ganador = b1 > b2 ? 1 : 2;

  let seleccionado = num === 1 ? $("#card1") : $("#card2");
  let noSeleccionado = num === 1 ? $("#card2") : $("#card1");

  if (num === ganador) {
    seleccionado.addClass("correctoHL");
    racha++;
    mejorRacha = Math.max(mejorRacha, racha);
    localStorage.setItem("mejorRacha", mejorRacha);
    $("#mensaje").text("✅ ¡Correcto!").addClass("msg-visible");

    if (ganador === 1) contadorVictoriasPj1++;
    else contadorVictoriasPj2++;

    // Si gana 2 veces seguidas, se cambia automáticamente
    let mantener = ganador === 1 ? pj1 : pj2;
    if ((ganador === 1 && contadorVictoriasPj1 >= 2) || (ganador === 2 && contadorVictoriasPj2 >= 2)) {
      mantener = null;
      contadorVictoriasPj1 = 0;
      contadorVictoriasPj2 = 0;
    }

    setTimeout(() => nuevoDuelo(mantener), 3000);
  } else {
    seleccionado.addClass("incorrectoHL");
    $("#mensaje").text(`❌ Fallaste. ${ganador === 1 ? pj1[0] : pj2[0]} tiene más recompensa.`).addClass("msg-visible");
    racha = 0;
    contadorVictoriasPj1 = 0;
    contadorVictoriasPj2 = 0;
    setTimeout(() => nuevoDuelo(), 3000);
  }

  actualizarRacha();
}

function actualizarRacha() {
  $("#racha").text(`Racha: ${racha}`);
  $("#mejorRacha").text(`Mejor racha: ${mejorRacha}`);
}

// Dificultades
$('#facil-hl').click(() => { dificultad = 'facil'; $('#hl-container').show(); cargarDatosHL('facil'); });
$('#medio-hl').click(() => { dificultad = 'medio'; $('#hl-container').show(); cargarDatosHL('medio'); });
$('#dificil-hl').click(() => { dificultad = 'dificil'; $('#hl-container').show(); cargarDatosHL('dificil'); });
$('#imposible-hl').click(() => { dificultad = 'imposible'; $('#hl-container').show(); cargarDatosHL('imposible'); });
