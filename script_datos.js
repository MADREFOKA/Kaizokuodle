/* ====================================================
   📜 KaizokuDatos - Adivina los datos (v. mejorada)
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
  let aciertos = 0;

  campos.each(function () {
    const i = $(this).data('index');
    const valor = $(this).val().trim();
    const realIndex = i + 1; // desplazado 1 porque omitimos el nombre
    const correcto = personajeObjetivo[realIndex] ? String(personajeObjetivo[realIndex]).trim() : "";
    let clase = "incorrecto", flecha = "";

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
    if (clase === "correcto") $(this).prop("disabled", true);

    if (clase === "correcto") aciertos++;
  });

  if (aciertos === $("#datosForm input").length) {
     const msg = $("#mensaje-datos");
   
     msg
       .text(`🏴‍☠️ ¡Has completado todos los datos de ${personajeObjetivo[0]}!`)
       .addClass("visible")
       .css({ opacity: 0 })
       .animate({ opacity: 1 }, 600);
   
     // Desaparecer automáticamente después de 5 segundos
     setTimeout(() => {
       msg.animate({ opacity: 0 }, 600, () => {
         msg.removeClass("visible");
       });
     }, 5000);
   }
}

// Botones de dificultad
$('#facil-datos').click(() => { dificultad = 'facil'; $('#datos-container').show(); cargarDatosDatos('facil'); });
$('#medio-datos').click(() => { dificultad = 'medio'; $('#datos-container').show(); cargarDatosDatos('medio'); });
$('#dificil-datos').click(() => { dificultad = 'dificil'; $('#datos-container').show(); cargarDatosDatos('dificil'); });
$('#imposible-datos').click(() => { dificultad = 'imposible'; $('#datos-container').show(); cargarDatosDatos('imposible'); });
