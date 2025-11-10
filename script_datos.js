/* ====================================================
   📜 KaizokuDatos - Adivina los datos (versión final)
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
let personajeObjetivo = null;

// =============== CARGA DE DATOS =================
async function cargarDatosDatos(dif) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNames[dif]}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  personajes = data.values.slice(1); // quitamos cabecera
  personajeObjetivo = personajes[Math.floor(Math.random() * personajes.length)];
  mostrarFormulario();
}

// =============== DIBUJAR FORMULARIO =================
function mostrarFormulario() {
  $('#datos-container').show();

  // Limpiar cabecera anterior (por si cambias de dificultad)
  $('.datos-header').remove();
  $('#mensaje-datos').removeClass('visible').text('');

  const nombre = personajeObjetivo[0];
  const imagen = personajeObjetivo[16] || "https://i.imgur.com/1t6rFZC.png";

  $('#datos-container').prepend(`
    <div class="datos-header">
      <img src="${imagen}" alt="${nombre}" class="datos-imagen">
      <h2 class="nombrePersonaje">${nombre}</h2>
    </div>
  `);

  // Campos SIN el nombre (empiezan en índice 1)
  const etiquetas = [
    "Primera Aparición", "Saga", "Arco", "Estado", "Origen",
    "Raza", "Sexo", "Altura", "Edad", "Cumpleaños",
    "Fruta del Diablo", "Haki", "Recompensa", "Afiliación", "Ocupación"
  ];

  const form = $('#datosForm');
  form.empty();

  etiquetas.forEach((campo, i) => {
    const realIndex = i + 1; // porque nombre es [0]
    const valorCorrecto = (personajeObjetivo[realIndex] || "").trim();
    const esDesconocido = valorCorrecto === '---';

    form.append(`
      <div class="campo-dato">
        <label>${campo}</label>
        <input
          type="text"
          id="campo-${i}"
          data-index="${i}"
          ${esDesconocido ? "value='---' disabled class='correcto'" : ""}
          autocomplete="off"
        >
        <div class="flecha-indicador" id="flecha-${i}"></div>
      </div>
    `);
  });
}

// =============== COMPROBAR DATOS =================
$('#btn-comprobar').click((e) => {
  e.preventDefault();
  comprobarDatos();
});

function comprobarDatos() {
  const campos = $("#datosForm input");
  let aciertos = 0;

  campos.each(function () {
    const i = $(this).data('index');
    const realIndex = i + 1; // desplazado por el nombre
    const correcto = (personajeObjetivo[realIndex] || "").trim();
    const valor = $(this).val().trim();

    // Si ya está bloqueado (era ---), cuenta como acierto y seguimos
    if ($(this).is(":disabled")) {
      aciertos++;
      return;
    }

    let clase = "incorrecto";
    let flecha = "";

    // Numéricos: altura (8), edad (9), recompensa (13)
    if ([8, 9, 13].includes(realIndex)) {
      const nV = parseFloat(valor.replace(/[^\d]/g, ""));
      const nC = parseFloat(correcto.replace(/[^\d]/g, ""));
      if (!isNaN(nV) && !isNaN(nC)) {
        if (nV === nC) {
          clase = "correcto";
        } else if (nV > nC) {
          flecha = "↓";
        } else if (nV < nC) {
          flecha = "↑";
        }
      }
    } else {
      if (valor.toLowerCase() === correcto.toLowerCase()) {
        clase = "correcto";
      }
    }

    $(this).removeClass("correcto incorrecto").addClass(clase);
    $(`#flecha-${i}`).text(flecha);

    if (clase === "correcto") {
      $(this).prop("disabled", true);
      aciertos++;
    }
  });

  const totalCampos = $("#datosForm input").length;

  if (aciertos === totalCampos) {
    mostrarMensajeDatosCompletado();
  }
}

// =============== MENSAJE FINAL BONITO =================
function mostrarMensajeDatosCompletado() {
  const msg = $("#mensaje-datos");
  msg
    .text(`🏴‍☠️ ¡Has completado todos los datos de ${personajeObjetivo[0]}!`)
    .addClass("visible")
    .css({ opacity: 0 })
    .animate({ opacity: 1 }, 600);

  // Desaparece a los 5 segundos
  setTimeout(() => {
    msg.animate({ opacity: 0 }, 600, () => {
      msg.removeClass("visible");
    });
  }, 5000);
}

// =============== BOTONES DE DIFICULTAD =================
$('#facil-datos').click(() => { dificultad = 'facil'; cargarDatosDatos('facil'); });
$('#medio-datos').click(() => { dificultad = 'medio'; cargarDatosDatos('medio'); });
$('#dificil-datos').click(() => { dificultad = 'dificil'; cargarDatosDatos('dificil'); });
$('#imposible-datos').click(() => { dificultad = 'imposible'; cargarDatosDatos('imposible'); });
