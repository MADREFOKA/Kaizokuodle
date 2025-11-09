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
let usados = new Set();

// Cargar datos
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
}

// Normalizar texto
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Buscar
function buscarPorPalabras(nombre, input) {
  const palabras = input.split(' ').map(p => normalizarTexto(p));
  const nombreNormalizado = normalizarTexto(nombre);
  return palabras.every(p => nombreNormalizado.includes(p));
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
    if (resultados.length === 1 && event.key === "Enter") seleccionarPersonaje(resultados[0][0]);
  }, 200);
}

// Enter
$('#busqueda').on('keydown', function(event) {
  if (event.key === "Enter") {
    const input = normalizarTexto($('#busqueda').val());
    const pSel = personajes.find(p => normalizarTexto(p[0]) === input && !usados.has(p[0]));
    if (pSel) seleccionarPersonaje(pSel[0]);
    else {
      const parcial = personajes.find(p => buscarPorPalabras(p[0], input) && !usados.has(p[0]));
      if (parcial) seleccionarPersonaje(parcial[0]);
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
  const pSel = personajes.find(p => p[0] === nombre);
  if (pSel) {
    intentos++;
    usados.add(nombre);
    actualizarBotonesPista();
    $('#resultado-comparacion').show();
    compararPersonajes(pSel);
    $('#autocomplete-list').empty();
    $('#busqueda').val('');
  }
}

// Comparar personajes
function compararPersonajes(pSel) {
  const cuerpo = $('#comparacion-cuerpo');
  const columnas = ["Nombre","Primera Aparición","Saga","Arco","Estado","Origen","Raza","Sexo","Altura","Edad","Cumpleaños","Fruta del Diablo","Haki","Recompensa","Afiliación","Ocupación"];
  const fila = [];

  columnas.forEach((col, index) => {
    let vA = personajeAleatorio[index] ? String(personajeAleatorio[index]) : "";
    let vS = pSel[index] ? String(pSel[index]) : "";
    let clase = "incorrecto";
    let flecha = "";

    // Comparaciones textuales
    if ([0,2,3,4,5,6,7,11,12,14].includes(index)) {
      const n = t => t.trim().toLowerCase();
      if (n(vA) === n(vS)) clase = "correcto";
      else if ((index === 11 || index === 12) && (vA.toLowerCase().includes(vS.toLowerCase()) || vS.toLowerCase().includes(vA.toLowerCase()))) clase = "parcial";
    }

    // Ocupación (lista)
    if (index === 15) {
      let nL = t => t.split(',').map(s => s.trim().toLowerCase()).sort();
      let a = nL(vA);
      let b = nL(vS);
      if (JSON.stringify(a) === JSON.stringify(b)) clase = "correcto";
      else if (b.some(p => a.includes(p))) clase = "parcial";
    }

    // Numéricos
    if ([1,8,9,13].includes(index)) {
      if (vA === vS) clase = "correcto";
      else if (vA !== "---" && vS !== "---") {
        const nA = parseFloat(vA.replace(/[^\d.-]/g, '').replace(',', '.'));
        const nS = parseFloat(vS.replace(/[^\d.-]/g, '').replace(',', '.'));
        if (!isNaN(nA) && !isNaN(nS)) {
          if (nS === nA) clase = "correcto";
          else if (index === 13) {
            // Solo flechas en recompensa
            if (nS > nA) flecha = '<span class="flecha-down">↓</span>';
            else if (nS < nA) flecha = '<span class="flecha-up">↑</span>';
          }
        }
      }
    }

    // Cumpleaños
    if (index === 10) {
      if (vA === vS) clase = "correcto";
      else if (vA.includes(" ") && vS.includes(" ")) {
        const [dA,mA] = vA.split(" "), [dS,mS] = vS.split(" ");
        const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
        const fA = new Date(2025, meses.indexOf(mA), parseInt(dA));
        const fS = new Date(2025, meses.indexOf(mS), parseInt(dS));
        if (fS > fA) flecha = '<span class="flecha-down">↓</span>';
        else if (fS < fA) flecha = '<span class="flecha-up">↑</span>';
        if (dA === dS && mA === mS) clase = "correcto";
        else if (dA === dS || mA === mS) clase = "parcial";
      }
    }

    fila.push(`<td class="texto-ajustado ${clase}">${vS} ${flecha}</td>`);
  });

  cuerpo.prepend(`<tr class="nueva-fila">${fila.join("")}</tr>`);

  const aciertos = $('#comparacion-cuerpo tr:first-child td.correcto').length;
  if (aciertos === columnas.length) {
    $('#mensaje-felicidades').show().html(`<span>¡Felicidades! Has adivinado al personaje: ${personajeAleatorio[0]}</span>`);
    $('#busqueda').prop('disabled', true);
    $('#autocomplete-list').empty();
  }
}

// Rendirse
function mostrarPersonajeCorrecto() {
  $('#mensaje-felicidades').show().html(`<span>El personaje era ${personajeAleatorio[0]}, más suerte a la próxima.</span>`);
  $('#busqueda').prop('disabled', true);
  $('#autocomplete-list').empty();
}

// Dificultades
$('#facil').click(() => { dificultad = 'facil'; reiniciarJuego(); });
$('#medio').click(() => { dificultad = 'medio'; reiniciarJuego(); });
$('#dificil').click(() => { dificultad = 'dificil'; reiniciarJuego(); });
$('#imposible').click(() => { dificultad = 'imposible'; reiniciarJuego(); });

// Reinicio
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
  $('#contador-intentos').text(`Intentos: ${intentos}`);
  // color visual según progreso
  let color = '#fffbe0';
  if (intentos >= 12) color = '#ffb3b3';
  else if (intentos >= 8) color = '#fff5a0';
  $('#contador-intentos').css('background', `linear-gradient(145deg, ${color}, #ffe85c)`);

  $('#btn-pista-arco').prop('disabled', intentos < 10);
  $('#btn-pista-ocupacion').prop('disabled', intentos < 15);
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
