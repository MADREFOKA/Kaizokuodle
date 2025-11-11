/* ====================================================
   📜 KaizokuDatos - Solo dificultad Fácil, con flechas
      y coincidencias flexibles en Haki/Ocupación
   ==================================================== */

const sheetID_D = '1OJVVupqt0UJTB8QJKLH_UNYYaWtY41ekqpZBSlpFdxQ';
const apiKey_D  = 'TU_API_KEY_AQUI'; // <- nueva key restringida

let personajeObjetivoD = null;

const camposMeta = [
  { id: "primera",    idx: 1,  tipo: "numero" }, // Primera aparición
  { id: "saga",       idx: 2,  tipo: "texto" },
  { id: "arco",       idx: 3,  tipo: "texto" },
  { id: "estado",     idx: 4,  tipo: "texto" },
  { id: "origen",     idx: 5,  tipo: "texto" },
  { id: "raza",       idx: 6,  tipo: "texto" },
  { id: "sexo",       idx: 7,  tipo: "texto" },
  { id: "altura",     idx: 8,  tipo: "numero" },
  { id: "edad",       idx: 9,  tipo: "numero" },
  { id: "cumple",     idx: 10, tipo: "fecha" },
  { id: "fruta",      idx: 11, tipo: "texto" },
  { id: "haki",       idx: 12, tipo: "lista" },
  { id: "recompensa", idx: 13, tipo: "numero" },
  { id: "afiliacion", idx: 14, tipo: "texto" },
  { id: "ocupacion",  idx: 15, tipo: "lista" },
];

// ========= UTILIDADES =========
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
  // Formato esperado: "5 marzo"
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const partes = norm(str).split(" ");
  if (partes.length < 2) return null;
  const dia = parseInt(partes[0], 10);
  const mesIndex = meses.indexOf(partes[1]);
  if (isNaN(dia) || mesIndex === -1) return null;
  // Usamos año fijo porque solo importa orden
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

// ========= CARGA PERSONAJE (solo FÁCIL) =========
async function cargarDatosFacil() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID_D}/values/Fácil!A2:Q1600?key=${apiKey_D}`;
  const res = await fetch(url);
  const data = await res.json();
  const personajes = (data.values || []);
  personajeObjetivoD = personajes[Math.floor(Math.random() * personajes.length)];

  // Nombre + imagen
  document.getElementById("nombrePersonaje").textContent = personajeObjetivoD[0];
  const img = personajeObjetivoD[16] || "https://i.imgur.com/1t6rFZC.png";
  const imgEl = document.getElementById("imgPersonaje");
  if (imgEl) imgEl.src = img;

  // Inicializar campos
  camposMeta.forEach(c => {
    const input = document.getElementById(c.id);
    const real = personajeObjetivoD[c.idx] || "---";

    input.classList.remove("correcto","incorrecto","parcial");
    input.disabled = false;
    input.value = "";
    const flechaEl = input.nextElementSibling;
    if (flechaEl) flechaEl.textContent = "";

    if (real.trim() === "---") {
      input.value = "---";
      input.disabled = true;
      input.classList.add("correcto");
    }
  });

  const msg = document.getElementById("mensaje-datos");
  msg.classList.remove("visible");
  msg.textContent = "";
}

// ========= COMPARAR =========
function compararDatos() {
  let aciertos = 0;

  camposMeta.forEach(c => {
    const input  = document.getElementById(c.id);
    const real   = personajeObjetivoD[c.idx] || "";
    const user   = input.value;
    const flechaEl = input.nextElementSibling;

    if (input.disabled) {
      aciertos++;
      return;
    }

    let clase = "incorrecto";
    let flecha = "";

    const nUser = norm(user);
    const nReal = norm(real);

    if (c.tipo === "numero") {
      const uNum = parseNumero(user);
      const rNum = parseNumero(real);
      if (uNum !== null && rNum !== null) {
        if (uNum === rNum) {
          clase = "correcto";
        } else if (uNum < rNum) {
          clase = "incorrecto";
          flecha = "↑";
        } else {
          clase = "incorrecto";
          flecha = "↓";
        }
      }
    } else if (c.tipo === "fecha") {
      const uT = parseFecha(user);
      const rT = parseFecha(real);
      if (uT !== null && rT !== null) {
        if (uT === rT) {
          clase = "correcto";
        } else if (uT < rT) {
          clase = "incorrecto";
          flecha = "↑";
        } else {
          clase = "incorrecto";
          flecha = "↓";
        }
      }
    } else if (c.tipo === "lista") {
      clase = compararListas(user, real); // correcto / parcial / incorrecto
    } else {
      if (nUser && nUser === nReal) {
        clase = "correcto";
      } else if (nUser && nReal.includes(nUser) && nUser.length > 2) {
        clase = "parcial";
      }
    }

    input.classList.remove("correcto","incorrecto","parcial");
    input.classList.add(clase);
    if (flechaEl) flechaEl.textContent = flecha;

    if (clase === "correcto") {
      input.disabled = true;
      aciertos++;
    }
  });

  if (aciertos === camposMeta.length) {
    const msg = document.getElementById("mensaje-datos");
    msg.textContent = `🏴‍☠️ ¡Has completado todos los datos de ${personajeObjetivoD[0]}!`;
    msg.classList.add("visible");
    msg.style.opacity = 0;
    $(msg).animate({ opacity: 1 }, 600);

    setTimeout(() => {
      $(msg).animate({ opacity: 0 }, 600, () => {
        msg.classList.remove("visible");
      });
    }, 5000);
  }
}

// ========= EVENTOS =========
document.getElementById("btn-comprobar").addEventListener("click", function(e) {
  e.preventDefault();
  compararDatos();
});

window.addEventListener("load", cargarDatosFacil);
