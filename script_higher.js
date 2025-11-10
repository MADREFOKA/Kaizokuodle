/* ====================================================
   📜 KaizokuDatos - Adivina los datos (v. mejorada final)
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

async function cargarDatosDatos(dif) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetsNames[dif]}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  personajes = data.values.slice(1);
  personajeObjetivo = personajes[Math.floor(Math.random() * personajes.length)];
  mostrarFormulario();
}

function mostrarFormulario() {
  $('#datos-container').show();

  // Limpiar cabecera anterior
  $('.datos-header').remove();

  // Mostrar nombre e imagen
  const nombre = personajeObjetivo[0];
  const imagen = personajeObjetivo[16] || "https://i.imgur.com/1t6rFZC.png";

  $('#datos-container').prepend(`
    <div class="datos-header">
      <img src="${imagen}" alt="${nombre}" class="datos-imagen">
      <h2 class="nombrePersonaje">${nombre}</h2>
    </div>
  `);

  // Campos (sin el nombre)
  const campos = [
    "Primera Aparición", "Saga", "Arco", "Estado", "Origen",
    "Raza", "Sexo", "Altura", "Edad", "Cumpleaños",
    "Fruta del Diablo", "Haki", "Recompensa", "Afiliación", "Ocupación"
  ];

  const form = $('#datosForm');
  form.empty();

  campos.forEach((campo, i) => {
    const realIndex = i + 1; // desplazado porque omitimos el nombre
    const valorCorrecto = personajeObjetivo[realIndex]?.trim() || "";
    const bloqueado = valorCorrecto === "---";

    form.append(`
      <div class="campo-dato">
        <label>${campo}</label>
        <input type="text" id="campo-${i}" data-index="${i}" ${bloqueado ? "disabled class='correcto'" : ""} autocomplete="off">
        <div class="flecha-indicador" id="flecha-${i}"></div>
      </div>
    `);
  });
}

$('#btn-comprobar').click((e) => {
  e.preventDefault();
  comprobarDatos();
});

function comprobarDatos() {
  const campos = $("#datosForm input");
  let aciertos = 0;

  campos.each(function () {
    const i = $(this).data('index');
    const valor = $(this).val().trim();
    const realIndex = i + 1; // desplazado 1 porque omitimos el nombre
    const correcto = personajeObjetivo[realIndex] ? String(personajeObjetivo[realIndex]).trim() : "";
    let clase = "incorrecto", flecha = "";

    if ($(this).is(":disabled")) return aciertos++; // si está bloqueado ya cuenta como correcto

    if ([13, 8, 9].includes(realIndex)) {
      const nV = parseFloat(valor.replace(/[^\d]/g, ""));
      const nC = parseFloat(correcto.replace(/[^\d]/g, ""));
      if (nV === nC) clase = "correcto";
      else if (nV > nC) flecha = "↓";
      else if (nV < nC) flecha = "↑";
    } else if (valor.toLowerCase() === correcto.toLowerCase()) {
      clase = "correcto";
    }

    $(this).removeClass("correcto incorrecto").addClass(clase);
    $(`#flecha-${i}`).text(flecha);

    if (clase === "correcto") {
      $(this).prop("disabled", true);
      aciertos++;
    }
  });

  if (aciertos === $("#datosForm input").length) {
    alert(`🏴‍☠️ ¡Has completado todos los datos de ${personajeObjetivo[0]}!`);
  }
}

// Dificultad
$('#facil-datos').click(() => { dificultad = 'facil'; $('#datos-container').show(); cargarDatosDatos('facil'); });
$('#medio-datos').click(() => { dificultad = 'medio'; $('#datos-container').show(); cargarDatosDatos('medio'); });
$('#dificil-datos').click(() => { dificultad = 'dificil'; $('#datos-container').show(); cargarDatosDatos('dificil'); });
$('#imposible-datos').click(() => { dificultad = 'imposible'; $('#datos-container').show(); cargarDatosDatos('imposible'); });
