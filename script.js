/* SCRIPT DEL JUEGO ONE PIECEDLE KAIZOKUODLE */

const sheetID = '1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ';
const apiKey = 'AIzaSyAiIS758bKjVHSvAN9Ub__7dSQOWbWSLfQ';
let dificultad = 'facil';
const sheetsNames = {
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
  imposible: 'Imposible'
};

let personajes = [];
let personajeAleatorio = null;
let intentos = 0;
let usados = new Set(); // guarda los personajes ya intentados

// Cargar datos de Google Sheets
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
  } catch {
    alert("Hubo un problema al cargar los datos.");
  }
}

// Mostrar buscador
function mostrarBusqueda() {
  $('#busqueda-section').show();
  $('#resultado-comparacion').hide();
  $('#mensaje-felicidades').hide();
  $('#comparacion-cuerpo').empty();
  intentos = 0;
  usados.clear();
  actualizarBotonesPista();
  actualizarFondo();
}

// Normalizar texto (tildes, mayúsculas)
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Buscar por palabras
function buscarPorPalabras(nombre, input) {
  const palabrasBusqueda = input.split(' ').map(palabra => normalizarTexto(palabra));
  const nombreNormalizado = normalizarTexto(nombre);
  return palabrasBusqueda.every(palabra => nombreNormalizado.includes(palabra));
}

// Debounce
let timeout = null;
function filtrarPersonajes(event) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const inputRaw = $('#busqueda').val();
    if (inputRaw === '') {
      mostrarSugerencias(personajes.slice(0, 10));
      return;
    }
    const input = normalizarTexto(inputRaw);
    let resultados = personajes.filter(p => buscarPorPalabras(p[0], input) && !usados.has(p[0]));
    mostrarSugerencias(resultados);

    if (resultados.length === 1 && event.key === "Enter") {
      seleccionarPersonaje(resultados[0][0]);
    }
  }, 200);
}

// Enter para seleccionar
$('#busqueda').on('keydown', function(event) {
  if (event.key === "Enter") {
    const input = normalizarTexto($('#busqueda').val());
    const personajeSeleccionado = personajes.find(p => normalizarTexto(p[0]) === input && !usados.has(p[0]));
    if (personajeSeleccionado) {
      seleccionarPersonaje(personajeSeleccionado[0]);
    } else {
      const personajeParcial = personajes.find(p => buscarPorPalabras(p[0], input) && !usados.has(p[0]));
      if (personajeParcial) seleccionarPersonaje(personajeParcial[0]);
    }
  }
});

// Mostrar sugerencias
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

// Seleccionar personaje
function seleccionarPersonaje(nombre) {
  const personajeSeleccionado = personajes.find(p => p[0] === nombre);
  if (personajeSeleccionado) {
    intentos++;
    usados.add(nombre);
    actualizarBotonesPista();
    $('#resultado-comparacion').show();
    compararPersonajes(personajeSeleccionado);
    $('#autocomplete-list').empty();
    $('#busqueda').val('');
  }
}

// Comparación de datos
function compararPersonajes(personajeSeleccionado) {
  const comparacionCuerpo = $('#comparacion-cuerpo');
  const columnas = ["Nombre","Primera Aparición","Saga","Arco","Estado","Origen","Raza","Sexo","Altura","Edad","Cumpleaños","Fruta del Diablo","Haki","Recompensa","Afiliación","Ocupación"];
  const fila = [];

  columnas.forEach((col, index) => {
    let valorAleatorio = personajeAleatorio[index] ? String(personajeAleatorio[index]) : "";
    let valorSel = personajeSeleccionado[index] ? String(personajeSeleccionado[index]) : "";
    let clase = "incorrecto";
    let flecha = "";

    // Comparación textual
    if ([0,2,3,4,5,6,7,11,12,14].includes(index)) {
      const norm = t => t.trim().toLowerCase();
      if (norm(valorAleatorio) === norm(valorSel)) clase = "correcto";
      else if ((index === 11 || index === 12) && (valorAleatorio.toLowerCase().includes(valorSel.toLowerCase()) || valorSel.toLowerCase().includes(valorAleatorio.toLowerCase())))
        clase = "parcial";
    }

    // Ocupación (lista)
    if (index === 15) {
      let normLista = t => t.split(',').map(s => s.trim().toLowerCase()).sort();
      let a = normLista(valorAleatorio);
      let b = normLista(valorSel);
      if (JSON.stringify(a) === JSON.stringify(b)) clase = "correcto";
      else if (b.some(p => a.includes(p))) clase = "parcial";
    }

    // Numéricos
    if ([1,8,9,13].includes(index)) {
      const nA = parseFloat(valorAleatorio.replace(/[^\d.-]/g, ''));
      const nS = parseFloat(valorSel.replace(/[^\d.-]/g, ''));
      if (!isNaN(nA) && !isNaN(nS)) {
        if (nS === nA) clase = "correcto";
        else if (nS > nA) flecha = '<span class="flecha-down">↓</span>';
        else if (nS < nA) flecha = '<span class="flecha-up">↑</span>';
      }
    }

    // Cumpleaños
    if (index === 10) {
      if (valorAleatorio === valorSel) clase = "correcto";
      else if (valorAleatorio.includes(" ") && valorSel.includes(" ")) {
        const [dA, mA] = valorAleatorio.split(" ");
        const [dS, mS] = valorSel.split(" ");
        const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
        const fA = new Date(2025, meses.indexOf(mA), parseInt(dA));
        const fS = new Date(2025, meses.indexOf(mS), parseInt(dS));
        if (fS > fA) flecha = '<span class="flecha-down">↓</span>';
        else if (fS < fA) flecha = '<span class="flecha-up">↑</span>';
        if (dA === dS && mA === mS) clase = "correcto";
        else if (dA === dS || mA === mS) clase = "parcial";
      }
    }

    fila.push(`<td class="texto-ajustado ${clase}">${valorSel.replace(/,/g, "<br>")} ${flecha}</td>`);
  });

  comparacionCuerpo.prepend(`<tr class="nueva-fila">${fila.join("")}</tr>`);

  const aciertos = $('#comparacion-cuerpo tr:first-child td.correcto').length;
  if (aciertos === columnas.length) {
    $('#mensaje-felicidades').show().html(`<span>¡Felicidades! Has adivinado al personaje: ${personajeAleatorio[0]}</span>`);
    $('#busqueda').prop('disabled', true);
    $('#autocomplete-list').empty();
  }
}

// Mensaje de rendirse
function mostrarPersonajeCorrecto() {
  $('#mensaje-felicidades').show().html(`<span>El personaje era ${personajeAleatorio[0]}, más suerte a la próxima.</span>`);
  $('#busqueda').prop('disabled', true);
  $('#autocomplete-list').empty();
}

// Botones de dificultad
$('#facil').click(() => { dificultad = 'facil'; reiniciarJuego(); });
$('#medio').click(() => { dificultad = 'medio'; reiniciarJuego(); });
$('#dificil').click(() => { dificultad = 'dificil'; reiniciarJuego(); });
$('#imposible').click(() => { dificultad = 'imposible'; reiniciarJuego(); });

// Reiniciar
function reiniciarJuego() {
  $('#mensaje-felicidades').hide();
  $('#busqueda').prop('disabled', false).val('');
  $('#autocomplete-list').empty();
  $('#resultado-comparacion').hide();
  $('#comparacion-cuerpo').empty();
  intentos = 0;
  usados.clear();
  actualizarBotonesPista();
  cargarDatos(dificultad);
}

// Pistas
$('#btn-pista-arco').click(() => alert(`Primera aparición en ${personajeAleatorio[3]}.`));
$('#btn-pista-ocupacion').click(() => alert(`La ocupación del personaje es: ${personajeAleatorio[15]}.`));

function actualizarBotonesPista() {
  $('#contador-intentos').text(`Intentos: ${intentos}/15`);
  $('#btn-pista-arco').prop('disabled', intentos < 10);
  $('#btn-pista-ocupacion').prop('disabled', intentos < 15);
}

// Fondo según dificultad
function actualizarFondo() {
  const colores = {
    facil: 'linear-gradient(#b4f0b4, #6bd46b)',
    medio: 'linear-gradient(#ffeaa7, #f6c90e)',
    dificil: 'linear-gradient(#ffb3b3, #ff5c5c)',
    imposible: 'linear-gradient(#b19cd9, #6a0dad)'
  };
  $('body').css('background', colores[dificultad]);
}

// Avisos
function cerrarModal() {
  document.getElementById("modal-aviso").style.display = "none";
}
function enviarAviso() {
  var personaje = document.getElementById('nombre-personaje').value;
  var fallo = document.getElementById('descripcion-fallo').value;
  if (personaje.trim() === "" || fallo.trim() === "") {
    alert("Por favor, rellena todos los campos.");
    return;
  }
  fetch('https://script.google.com/macros/s/AKfycbzBj20YZ95Tii1zYRKnpjiy3JQFMjNisyHKSWPcG2RQ_6k5qGTyWJiqnC_53AECdQHH/exec', {
    method: 'POST',
    body: new URLSearchParams({ 'personaje': personaje, 'fallo': fallo }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .then(() => alert("Aviso enviado correctamente."))
  .catch(() => alert("Hubo un problema al enviar el aviso."));
  cerrarModal();
}
