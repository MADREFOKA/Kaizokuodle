/* ====================================================
   📜 KaizokuDatos - Solo dificultad "Fácil" con ayudas
   ==================================================== */

const sheetID = '1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ';
const apiKey = 'AIzaSyAiIS758bKjVHSvAN9Ub__7dSQOWbWSLfQ';

let personajeObjetivo = null;

// Campos (nombre en la hoja y tipo)
const camposMeta = [
  { id: "primera", label: "Primera Aparición", tipo: "numero" },
  { id: "saga", label: "Saga", tipo: "texto" },
  { id: "arco", label: "Arco", tipo: "texto" },
  { id: "estado", label: "Estado", tipo: "texto" },
  { id: "origen", label: "Origen", tipo: "texto" },
  { id: "raza", label: "Raza", tipo: "texto" },
  { id: "sexo", label: "Sexo", tipo: "texto" },
  { id: "altura", label: "Altura", tipo: "numero" },
  { id: "edad", label: "Edad", tipo: "numero" },
  { id: "cumple", label: "Cumpleaños", tipo: "fecha" },
  { id: "fruta", label: "Fruta del Diablo", tipo: "texto" },
  { id: "haki", label: "Haki", tipo: "lista" },
  { id: "recompensa", label: "Recompensa", tipo: "numero" },
  { id: "afiliacion", label: "Afiliación", tipo: "texto" },
  { id: "ocupacion", label: "Ocupación", tipo: "lista" },
];

// =============== UTILIDADES ===============
function norm(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseNumero(str) {
  const n = parseFloat(str.replace(/[^\d.]/g, "").replace(",", "."));
  return isNaN(n) ? null : n;
}

function parseFecha(str) {
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const partes = norm(str).split(" ");
  if (partes.length < 2) return null;
  const dia = parseInt(partes[0], 10);
  const mesIndex = meses.indexOf(partes[1]);
  if (isNaN(dia) || mesIndex === -1) return null;
  return new Date(2025, mesIndex, dia).getTime();
}

function normalizarLista(texto) {
  return norm(texto)
    .replace(/ y /g, ",")
    .replace(/,/g, ",")
    .split(/[,\s]+/)
    .filter(Boolean)
    .sort();
}

function compararListas(valorUser, valorReal) {
  const u = normalizarLista(valorUser);
  const r = normalizarLista(valorReal);
  if (r.length === 0) return "incorrecto";
  const comunes = u.filter(x => r.includes(x));
  if (comunes.length === r.length && u.length === r.length) return "correcto";
  if (comunes.length > 0) return "parcial";
  return "incorrecto";
}

// =============== CARGAR PERSONAJE ===============
async function cargarPersonaje() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/Fácil?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  const personajes = (data.values || []).slice(1);
  personajeObjetivo = personajes[Math.floor(Math.random() * personajes.length)];

  const nombre = personajeObjetivo[0];
  const imagen = personajeObjetivo[16] || "https://i.imgur.com/1t6rFZC.png";

  $("#datos-container").show().prepend(`
    <div class="datos-header">
      <img src="${imagen}" class="datos-imagen">
      <h2 class="nombrePersonaje">${nombre}</h2>
    </div>
  `);

  const form = $("#datosForm");
  form.empty();

  camposMeta.forEach((campo, i) => {
    const valorReal = personajeObjetivo[i + 1] || "";
    const desconocido = valorReal.trim() === "---";

    form.append(`
      <div class="campo-dato">
        <label>${campo.label}</label>
        <input id="${campo.id}" type="text"
          ${desconocido ? "value='---' disabled class='correcto'" : ""}
          autocomplete="off">
        <div class="flecha-indicador" id="flecha-${campo.id}"></div>
      </div>
    `);
  });
}

// =============== COMPARAR DATOS ===============
function comprobarDatos() {
  let aciertos = 0;

  camposMeta.forEach((campo, i) => {
    const input = $(`#${campo.id}`);
    const valorUser = input.val().trim();
    const valorReal = (personajeObjetivo[i + 1] || "").trim();
    const flecha = $(`#flecha-${campo.id}`);

    if (input.prop("disabled")) {
      aciertos++;
      return;
    }

    let clase = "incorrecto";
    let indicador = "";

    if (campo.tipo === "numero") {
      const uNum = parseNumero(valorUser);
      const rNum = parseNumero(valorReal);
      if (uNum !== null && rNum !== null) {
        if (uNum === rNum) clase = "correcto";
        else if (uNum < rNum) indicador = "↑";
        else if (uNum > rNum) indicador = "↓";
      }
    } else if (campo.tipo === "fecha") {
      const uF = parseFecha(valorUser);
      const rF = parseFecha(valorReal);
      if (uF && rF) {
        if (uF === rF) clase = "correcto";
        else if (uF < rF) indicador = "↑";
        else indicador = "↓";
      }
    } else if (campo.tipo === "lista") {
      clase = compararListas(valorUser, valorReal);
    } else {
      const nU = norm(valorUser);
      const nR = norm(valorReal);
      if (nU === nR && nU.length > 0) clase = "correcto";
      else if (nR.includes(nU) && nU.length > 2) clase = "parcial";
    }

    input.removeClass("correcto parcial incorrecto").addClass(clase);
    flecha.text(indicador);

    if (clase === "correcto") {
      input.prop("disabled", true);
      aciertos++;
    }
  });

  if (aciertos === camposMeta.length) mostrarMensajeFinal();
}

// =============== MENSAJE FINAL ===============
function mostrarMensajeFinal() {
  const msg = $("#mensaje-datos");
  msg.text(`🏴‍☠️ ¡Has completado todos los datos de ${personajeObjetivo[0]}!`)
    .addClass("visible")
    .css({ opacity: 0 })
    .animate({ opacity: 1 }, 600);

  setTimeout(() => {
    msg.animate({ opacity: 0 }, 600, () => msg.removeClass("visible"));
  }, 5000);
}

// =============== EVENTOS ===============
$(document).ready(() => {
  cargarPersonaje();
  $("#btn-comprobar").on("click", (e) => {
    e.preventDefault();
    comprobarDatos();
  });
});
