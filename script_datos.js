/* ====================================================
   📜 KaizokuDatos - Adivina los datos
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
  $('#nombrePersonaje').text("¿Quién es? 🤔");
  const campos = ["Nombre", "Primera Aparición", "Saga", "Arco", "Estado", "Origen", "Raza", "Sexo", "Altura", "Edad", "Cumpleaños", "Fruta del Diablo", "Haki", "Recompensa", "Afiliación", "Ocupación"];
  const form = $('#datosForm');
  form.empty();
  campos.forEach((campo, i) => {
    form.append(`
      <div class="campo-dato">
        <label>${campo}</label>
        <input type="text" id="campo-${i}" data-index="${i}" autocomplete="off">
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
  campos.each(function () {
    const i = $(this).data('index');
    const valor = $(this).val().trim();
    const correcto = personajeObjetivo[i] ? String(personajeObjetivo[i]).trim() : "";
    let clase = "incorrecto", flecha = "";

    if (i === 13 || i === 8 || i === 9) {
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

    if (clase === "correcto") $(this).prop("disabled", true);
  });
}

// Dificultad
$('#facil-datos').click(() => { dificultad = 'facil'; cargarDatosDatos('facil'); });
$('#medio-datos').click(() => { dificultad = 'medio'; cargarDatosDatos('medio'); });
$('#dificil-datos').click(() => { dificultad = 'dificil'; cargarDatosDatos('dificil'); });
$('#imposible-datos').click(() => { dificultad = 'imposible'; cargarDatosDatos('imposible'); });
