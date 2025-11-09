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

// Buscar por palabras
function buscarPorPalabras(nombre, input) {
  const palabras = input.split(' ').map(p => normalizarTexto(p));
  const nombreNormalizado = normalizarTexto(nombre);
  return palabras.every(p => nombreNormalizado.includes(p));
}

// Debounce del buscador
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
    const pSel = personajes.find(p => normalizarTexto(p[0]) === input && !usados.has(p[0]));
    if (pSel) {
      seleccionarPersonaje(pSel[0]);
    } else {
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
  const columnas = [
    "Nombre","Primera Aparición","Saga","Arco","Estado","Origen","Raza","Sexo",
    "Altura","Edad","Cumpleaños","Fruta del Diablo","Haki","Recompensa","Afiliación","Ocupación"
  ];
  const fila = [];

  columnas.forEach((col, index) => {
    let vA = personajeAleatorio[index] ? String(personajeAleatorio[index]) : "";
    let vS = pSel[index] ? String(pSel[index]) : "";
    let clase = "incorrecto";
    let flecha = "";

    // Comparaciones textuales simples
    if ([0,2,3,4,5,6,7,11,12,14].includes(index)) {
      const n = t => t.trim().toLowerCase();
      if (n(vA) === n(vS)) {
        clase = "correcto";
      } else if (
        (index === 11 || index === 12) &&
        (vA.toLowerCase().includes(vS.toLowerCase()) || vS.toLowerCase().includes(vA.toLowerCase()))
      ) {
        clase = "parcial";
      }
    }

    // Ocupación (lista separada por comas)
    if (index === 15) {
      const nL = t => t.split(',').map(s => s.trim().toLowerCase()).sort();
      const a = nL(vA);
      const b = nL(vS);
      if (JSON.stringify(a) === JSON.stringify(b)) {
        clase = "correcto";
      } else if (b.some(p => a.includes(p))) {
        clase = "parcial";
      }
    }

    // Numéricos (Primera apar., Altura, Edad, Recompensa)
    if ([1,8,9,13].includes(index)) {
      // Igual texto => correcto
      if (vA === vS) {
        clase = "correcto";
      } else if (vA !== "---" && vS !== "---") {

        if (index === 13) {
          // RECOMPENSA: comparar como enteros grandes (quitando todo menos dígitos)
          const toInt = val => {
            const digits = val.toString().replace(/[^\d-]/g, '');
            return digits ? parseInt(digits, 10) : NaN;
          };
          const recompensaCorrecta = toInt(vA);  // personajeAleatorio
          const recompensaIntento  = toInt(vS);  // personaje seleccionado

          if (!isNaN(recompensaCorrecta) && !isNaN(recompensaIntento)) {
            if (recompensaIntento === recompensaCorrecta) {
              clase = "correcto";
            } else {
              // AQUÍ ESTABA INVERTIDO ANTES:
              // si tu recompensa es MAYOR que la correcta → hay que BAJAR → ↓
              if (recompensaIntento > recompensaCorrecta) {
                flecha = '<span class="flecha-down">↓</span>';
              }
              // si tu recompensa es MENOR que la correcta → hay que SUBIR → ↑
              else if (recompensaIntento < recompensaCorrecta) {
                flecha = '<span class="flecha-up">↑</span>';
              }
            }
          }
        } else {
          // ALTURA / EDAD / PRIMERA APAR. (floats normales con coma decimal)
          const limpiarNumero = val => {
            return parseFloat(
              val
                .toString()
                .replace(/[^\d.,-]/g, '')   // quitar símbolos
                .replace(/\./g, '')         // quitar puntos de miles
                .replace(',', '.')          // cambiar coma decimal
            );
          };
          const nA = limpiarNumero(vA);
          const nS = limpiarNumero(vS);

          if (!isNaN(nA) && !isNaN(nS)) {
            if (nS === nA) {
              clase = "correcto";
            } else if (nS > nA) {
              flecha = '<span class="flecha-down">↓</span>';
            } else if (nS < nA) {
              flecha = '<span class="flecha-up">↑</span>';
            }
          }
        }
      }
    }

    // Cumpleaños
    if (index === 10) {
      if (vA === vS) {
        clase = "correcto";
      } else if (vA.includes(" ") && vS.includes(" ")) {
        const [dA, mA] = vA.split(" ");
        const [dS, mS] = vS.split(" ");
        const meses = [
          "enero","febrero","marzo","abril","mayo","junio",
          "julio","agosto","septiembre","octubre","noviembre","diciembre"
        ];
        const fA = new Date(2025, meses.indexOf(mA), parseInt(dA));
        const fS = new Date(2025, meses.indexOf(mS), parseInt(dS));

        if (fS > fA) flecha = '<span class="flecha-down">↓</span>';
        else if (fS < fA) flecha = '<span class="flecha-up">↑</span>';

        if (dA === dS && mA === mS) {
          clase = "correcto";
        } else if (dA === dS || mA === mS) {
          clase = "parcial";
        }
      }
    }

    // Texto final (saltos solo en Haki y Ocupación)
    let textoFinal = vS;
    if (index === 12 || index === 15) {
      textoFinal = vS.replace(/,/g, "<br>");
    }

    fila.push(`<td class="texto-ajustado ${clase}">${textoFinal} ${flecha}</td>`);
  });

  cuerpo.prepend(`<tr class="nueva-fila">${fila.join("")}</tr>`);

  const aciertos = $('#comparacion-cuerpo tr:first-child td.correcto').length;
  if (aciertos === columnas.length) {
    $('#mensaje-felicidades').show().html(
      `<span>¡Felicidades! Has adivinado al personaje: ${personajeAleatorio[0]}</span>`
    );
    $('#busqueda').prop('disabled', true);
    $('#autocomplete-list').empty();
  }
}

// Rendirse
function mostrarPersonajeCorrecto() {
  $('#mensaje-felicidades').show().html(
    `<span>El personaje era ${personajeAleatorio[0]}, más suerte a la próxima.</span>`
  );
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
$('#btn-pista-arco').click(() => {
  alert(`Primera aparición en ${personajeAleatorio[3]}.`);
});
$('#btn-pista-ocupacion').click(() => {
  alert(`La ocupación del personaje es: ${personajeAleatorio[15]}.`);
});

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
  const personaje = document.getElementById('nombre-personaje').value;
  const fallo = document.getElementById('descripcion-fallo').value;

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
