/* ====================================================
   🏴‍☠️ KaizokuOdle - Adivina el personaje
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
let personajeAleatorio = null;
let personajesUsados = new Set();

// =================== CARGAR DATOS ===================
async function cargarDatos(dificultad) {
  const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNames[dificultad]}?key=${apiKey}`;
  try {
    const response = await fetch(sheetURL);
    const data = await response.json();

    if (data && data.values) {
      personajes = data.values.slice(1);
      personajeAleatorio = personajes[Math.floor(Math.random() * personajes.length)];
      mostrarBusqueda();
    } else {
      alert("Error al cargar los datos.");
    }
  } catch (error) {
    alert("Hubo un problema al cargar los datos.");
  }
}

// =================== MOSTRAR ===================
function mostrarBusqueda() {
  $('#busqueda-section').show();
  $('#resultado-comparacion').hide();
  $('#mensaje-felicidades').hide();
  $('#comparacion-cuerpo').empty();
}

// =================== BUSCAR ===================
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function buscarPorPalabras(nombre, input) {
  const palabras = input.split(' ').map(p => normalizarTexto(p));
  const nombreNorm = normalizarTexto(nombre);
  return palabras.every(p => nombreNorm.includes(p));
}

function filtrarPersonajes(event) {
  const inputRaw = $('#busqueda').val();
  if (inputRaw === '') {
    mostrarSugerencias(personajes.slice(0, 10));
    return;
  }

  const input = normalizarTexto(inputRaw);
  const resultados = personajes.filter(p => buscarPorPalabras(p[0], input) && !personajesUsados.has(p[0]));
  mostrarSugerencias(resultados);

  if (resultados.length === 1 && event && event.key === "Enter") {
    seleccionarPersonaje(resultados[0][0]);
  }
}

$('#busqueda').on('keydown', function (event) {
  if (event.key === "Enter") {
    const input = normalizarTexto($('#busqueda').val());
    const exacto = personajes.find(p => normalizarTexto(p[0]) === input && !personajesUsados.has(p[0]));
    if (exacto) seleccionarPersonaje(exacto[0]);
  }
});

function mostrarSugerencias(resultados) {
  const lista = $('#autocomplete-list');
  lista.empty();
  resultados.forEach(personaje => {
    const item = $('<div class="autocomplete-item"></div>');
    item.text(personaje[0]);
    item.click(() => seleccionarPersonaje(personaje[0]));
    lista.append(item);
  });
}

// =================== COMPARAR ===================
function seleccionarPersonaje(nombre) {
  const personajeSeleccionado = personajes.find(p => p[0] === nombre);
  if (personajeSeleccionado) {
    personajesUsados.add(nombre);
    $('#resultado-comparacion').show();
    compararPersonajes(personajeSeleccionado);
    $('#autocomplete-list').empty();
    $('#busqueda').val('');
  }
}

function compararPersonajes(p) {
  const cuerpo = $('#comparacion-cuerpo');
  const columnas = ["Nombre", "Primera Aparición", "Saga", "Arco", "Estado", "Origen", "Raza", "Sexo", "Altura", "Edad", "Cumpleaños", "Fruta del Diablo", "Haki", "Recompensa", "Afiliación", "Ocupación"];
  const fila = [];

  columnas.forEach((col, i) => {
    let valA = personajeAleatorio[i] ? String(personajeAleatorio[i]) : "";
    let valS = p[i] ? String(p[i]) : "";
    let clase = "incorrecto", flecha = "";

    // Texto
    if ([0,2,3,4,5,6,7,11,12,14].includes(i)) {
      const norm = t => t.trim().toLowerCase();
      if (norm(valA) === norm(valS)) clase = "correcto";
      else if ((i === 11 || i === 12) && (valA.includes(valS) || valS.includes(valA))) clase = "parcial";
    }

    // Números (Altura, Edad, Recompensa)
    if ([1,8,9,13].includes(i)) {
      const nA = parseFloat(valA.replace(/[^\d.]/g, ""));
      const nS = parseFloat(valS.replace(/[^\d.]/g, ""));
      if (isNaN(nA) || isNaN(nS)) clase = "incorrecto";
      else if (nA === nS) clase = "correcto";
      else if (nS > nA) { flecha = "↓"; clase = "incorrecto"; }
      else { flecha = "↑"; clase = "incorrecto"; }
    }

    // Cumpleaños
    if (i === 10) {
      if (valA === valS) clase = "correcto";
    }

    // Haki y Ocupación con salto de línea
    if ([12,14,15].includes(i))
      valS = valS.replace(/,/g, "<br>");

    fila.push(`<td class="${clase}">${valS} ${flecha}</td>`);
  });

  cuerpo.prepend(`<tr>${fila.join("")}</tr>`);

  const aciertos = $('#comparacion-cuerpo tr:first-child td.correcto').length;
  if (aciertos === columnas.length) {
    $('#mensaje-felicidades').show().html(`<span>¡Felicidades! Era ${personajeAleatorio[0]}!</span>`);
    $('#busqueda').prop('disabled', true);
  }
}

// =================== BOTONES ===================
$('#facil').click(() => { dificultad = 'facil'; reiniciarJuego(); });
$('#medio').click(() => { dificultad = 'medio'; reiniciarJuego(); });
$('#dificil').click(() => { dificultad = 'dificil'; reiniciarJuego(); });
$('#imposible').click(() => { dificultad = 'imposible'; reiniciarJuego(); });

function reiniciarJuego() {
  $('#mensaje-felicidades').hide();
  $('#busqueda').prop('disabled', false).val('');
  $('#autocomplete-list').empty();
  $('#resultado-comparacion').hide();
  $('#comparacion-cuerpo').empty();
  personajesUsados.clear();
  cargarDatos(dificultad);
}

// =================== RENDIRSE ===================
function mostrarPersonajeCorrecto() {
  $('#mensaje-felicidades').show().html(`<span>Era ${personajeAleatorio[0]}.</span>`);
  $('#busqueda').prop('disabled', true);
}

// =================== AVISO ===================
$('#btn-aviso').click(() => $('#modal-aviso').show());
function cerrarModal() { $('#modal-aviso').hide(); }
function enviarAviso() {
  const pj = $('#nombre-personaje').val();
  const fallo = $('#descripcion-fallo').val();
  if (!pj || !fallo) return alert("Completa todos los campos.");
  fetch("https://script.google.com/macros/s/AKfycbzBj20YZ95Tii1zYRKnpjiy3JQFMjNisyHKSWPcG2RQ_6k5qGTyWJiqnC_53AECdQHH/exec", {
    method: "POST",
    body: new URLSearchParams({ personaje: pj, fallo }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(() => alert("Aviso enviado."))
    .catch(() => alert("Error al enviar aviso."));
  cerrarModal();
}

cargarDatos('facil');
