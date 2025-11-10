/* ====================================================
   💰 Kaizoku Higher or Lower
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

async function cargarDatosHL(dif) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNames[dif]}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  personajes = data.values.slice(1).filter(p => p[13] && p[13] !== "---");
  nuevoDuelo();
}

function nuevoDuelo() {
  pj1 = personajes[Math.floor(Math.random() * personajes.length)];
  pj2 = personajes[Math.floor(Math.random() * personajes.length)];
  if (pj1 === pj2) return nuevoDuelo();

  $("#name1").text(pj1[0]);
  $("#name2").text(pj2[0]);
  $("#img1").attr("src", pj1[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#img2").attr("src", pj2[16] || "https://i.imgur.com/1t6rFZC.png");
  $("#bounty1").text(pj1[13] + " ฿");
  $("#bounty2").text("???");
  $("#mensaje").text("");
  actualizarRacha();
}

function elegirPersonaje(num) {
  const b1 = parseFloat(pj1[13].replace(/[^\d]/g, ""));
  const b2 = parseFloat(pj2[13].replace(/[^\d]/g, ""));
  const correcto = b1 > b2 ? 1 : 2;

  if (num === correcto) {
    racha++;
    mejorRacha = Math.max(mejorRacha, racha);
    localStorage.setItem("mejorRacha", mejorRacha);
    $("#mensaje").text("✅ ¡Correcto!").css("color", "#3cb371");
  } else {
    $("#mensaje").text(`❌ Fallaste. Era ${pj1[13] > pj2[13] ? pj1[0] : pj2[0]} con ${Math.max(b1, b2)}฿`).css("color", "#ff5555");
    racha = 0;
  }
  setTimeout(nuevoDuelo, 1200);
}

function actualizarRacha() {
  $("#racha").text(`Racha: ${racha}`);
  $("#mejorRacha").text(`Mejor racha: ${mejorRacha}`);
}

// Botones de dificultad
$('#facil-hl').click(() => { dificultad = 'facil'; $('#hl-container').show(); cargarDatosHL('facil'); });
$('#medio-hl').click(() => { dificultad = 'medio'; $('#hl-container').show(); cargarDatosHL('medio'); });
$('#dificil-hl').click(() => { dificultad = 'dificil'; $('#hl-container').show(); cargarDatosHL('dificil'); });
$('#imposible-hl').click(() => { dificultad = 'imposible'; $('#hl-container').show(); cargarDatosHL('imposible'); });
