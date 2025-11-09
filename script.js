// SCRIPT DEL JUEGO ONE PIECEDLE KAIZOKUODLE
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
let intentos = 0; // contador de intentos

// Cargar los datos de la hoja seleccionada
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

// Mostrar la sección de búsqueda
function mostrarBusqueda() {
  $('#busqueda-section').show();
  $('#resultado-comparacion').hide();
  $('#mensaje-felicidades').hide();
  $('#comparacion-cuerpo').empty();
  intentos = 0;
  actualizarBotonesPista();
}

// Función para normalizar texto eliminando tildes y caracteres especiales
function normalizarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Función para dividir la entrada en palabras y verificar si cada palabra aparece en el nombre
function buscarPorPalabras(nombre, input) {
  const palabrasBusqueda = input.split(' ').map(palabra => normalizarTexto(palabra));
  const nombreNormalizado = normalizarTexto(nombre);
  return palabrasBusqueda.every(palabra => nombreNormalizado.includes(palabra));
}

// Debounce simple para el buscador
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
    let resultados = personajes.filter(personaje => buscarPorPalabras(personaje[0], input));
    mostrarSugerencias(resultados);

    if (resultados.length === 1 && event.key === "Enter") {
      seleccionarPersonaje(resultados[0][0]);
    }
  }, 200);
}

// Función para seleccionar personaje con Enter
$('#busqueda').on('keydown', function(event) {
  if (event.key === "Enter") {
    const input = normalizarTexto($('#busqueda').val());
    const personajeSeleccionado = personajes.find(p => normalizarTexto(p[0]) === input);
    if (personajeSeleccionado) {
      seleccionarPersonaje(personajeSeleccionado[0]);
    } else {
      const personajeParcial = personajes.find(p => buscarPorPalabras(p[0], input));
      if (personajeParcial) {
        seleccionarPersonaje(personajeParcial[0]);
      }
    }
  }
});

// Mostrar sugerencias
function mostrarSugerencias(resultados) {
  const listaSugerencias = $('#autocomplete-list');
  listaSugerencias.empty();

  resultados.forEach(personaje => {
    const item = $('<div class="autocomplete-item"></div>');
    item.text(personaje[0]);
    item.click(function() {
      seleccionarPersonaje(personaje[0]);
    });
    listaSugerencias.append(item);
  });
}

// Seleccionar un personaje
function seleccionarPersonaje(nombre) {
  const personajeSeleccionado = personajes.find(p => p[0] === nombre);
  if (personajeSeleccionado) {
    intentos++;
    actualizarBotonesPista();
    $('#resultado-comparacion').show();
    compararPersonajes(personajeSeleccionado);
    $('#autocomplete-list').empty();
    $('#busqueda').val('');
  }
}

// Comparar el personaje seleccionado con el personaje aleatorio
function compararPersonajes(personajeSeleccionado) {
  const comparacionCuerpo = $('#comparacion-cuerpo');

  const columnas = ["Nombre", "Primera Aparición", "Saga", "Arco", "Estado", "Origen", "Raza", "Sexo", "Altura", "Edad", "Cumpleaños", "Fruta del Diablo", "Haki", "Recompensa", "Afiliación", "Ocupación"];
  const filaComparacion = [];

  columnas.forEach((col, index) => {
    let valorAleatorio = personajeAleatorio[index] ? String(personajeAleatorio[index]) : "";
    let valorSeleccionado = personajeSeleccionado[index] ? String(personajeSeleccionado[index]) : "";
    let clase = "incorrecto";
    let flecha = "";

    // Comparación textual directa
    if ([0, 2, 3, 4, 5, 6, 7, 11, 12, 14].includes(index)) {
      const normalizar = t => t.trim().toLowerCase();
      if (normalizar(valorAleatorio) === normalizar(valorSeleccionado)) {
        clase = "correcto";
      } else if ((index === 11 || index === 12) && (valorAleatorio.toLowerCase().includes(valorSeleccionado.toLowerCase()) || valorSeleccionado.toLowerCase().includes(valorAleatorio.toLowerCase()))) {
        clase = "parcial";
      }
    }

    // Comparación de ocupación (lista)
    if (index === 15) {
      let normalizarLista = texto => texto.split(',').map(t => t.trim().toLowerCase()).sort();
      let a = normalizarLista(valorAleatorio);
      let b = normalizarLista(valorSeleccionado);
      if (JSON.stringify(a) === JSON.stringify(b)) clase = "correcto";
      else if (b.some(p => a.includes(p))) clase = "parcial";
    }

    // Comparaciones numéricas (Altura, Edad, Recompensa)
    if ([1, 8, 9, 13].includes(index)) {
      if (valorAleatorio === valorSeleccionado) {
        clase = "correcto";
      } else {
        const valorAleatorioNumerico = parseFloat(valorAleatorio.replace(/[^\d.-]/g, ''));
        const valorSeleccionadoNumerico = parseFloat(valorSeleccionado.replace(/[^\d.-]/g, ''));
        if (!isNaN(valorAleatorioNumerico) && !isNaN(valorSeleccionadoNumerico)) {
          if (valorSeleccionadoNumerico === valorAleatorioNumerico) {
            clase = "correcto";
          } else if (valorSeleccionadoNumerico > valorAleatorioNumerico) {
            flecha = '<span class="flecha-down">↓</span>';
          } else if (valorSeleccionadoNumerico < valorAleatorioNumerico) {
            flecha = '<span class="flecha-up">↑</span>';
          }
        }
      }
    }

    // Comparar cumpleaños
    if (index === 10) {
      if (valorAleatorio === valorSeleccionado) {
        clase = "correcto";
      } else if ((valorAleatorio.includes(" ") && valorSeleccionado.includes(" "))) {
        const [diaA, mesA] = valorAleatorio.split(" ");
        const [diaS, mesS] = valorSeleccionado.split(" ");
        const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
        const fA = new Date(2025, meses.indexOf(mesA), parseInt(diaA));
        const fS = new Date(2025, meses.indexOf(mesS), parseInt(diaS));
        if (fS.getTime() > fA.getTime()) flecha = '<span class="flecha-down">↓</span>';
        else if (fS.getTime() < fA.getTime()) flecha = '<span class="flecha-up">↑</span>';
        if (diaA === diaS && mesA === mesS) clase = "correcto";
        else if (diaA === diaS || mesA === mesS) clase = "parcial";
      }
    }

    if ([12, 14, 15].includes(index))
      filaComparacion.push(`<td class="texto-ajustado ${clase}">${valorSeleccionado.replace(/,/g, "<br>")} ${flecha}</td>`);
    else if (index === 0)
      filaComparacion.push(`<td class="texto-ajustado ${clase}">${valorSeleccionado.replace(/\//g, "<br>")} ${flecha}</td>`);
    else
      filaComparacion.push(`<td class="texto-ajustado ${clase}">${valorSeleccionado} ${flecha}</td>`);
  });

  comparacionCuerpo.prepend(`<tr>${filaComparacion.join("")}</tr>`);

  const adivinados = $('#comparacion-cuerpo tr:first-child td.correcto').length;
  if (adivinados === columnas.length) {
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

// Dificultades
$('#facil').click(() => { dificultad = 'facil'; reiniciarJuego(); });
$('#medio').click(() => { dificultad = 'medio'; reiniciarJuego(); });
$('#dificil').click(() => { dificultad = 'dificil'; reiniciarJuego(); });
$('#imposible').click(() => { dificultad = 'imposible'; reiniciarJuego(); });

// Reiniciar el juego
function reiniciarJuego() {
  $('#mensaje-felicidades').hide();
  $('#busqueda').prop('disabled', false);
  $('#busqueda').val('');
  $('#autocomplete-list').empty();
  $('#resultado-comparacion').hide();
  $('#comparacion-cuerpo').empty();
  intentos = 0;
  actualizarBotonesPista();
  cargarDatos(dificultad);
}

// Botones de pista
$('#btn-pista-arco').click(() => {
  alert(`Primera aparición en ${personajeAleatorio[3]}.`);
});
$('#btn-pista-ocupacion').click(() => {
  alert(`La ocupación del personaje es: ${personajeAleatorio[15]}.`);
});

function actualizarBotonesPista() {
  if (intentos >= 10) {
    $('#btn-pista-arco').prop('disabled', false);
  } else {
    $('#btn-pista-arco').prop('disabled', true);
  }
  if (intentos >= 15) {
    $('#btn-pista-ocupacion').prop('disabled', false);
  } else {
    $('#btn-pista-ocupacion').prop('disabled', true);
  }
}

// AVISOS
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
  .then(response => response.text())
  .then(() => alert("Aviso enviado correctamente."))
  .catch(() => alert("Hubo un problema al enviar el aviso."));

  cerrarModal();
}
