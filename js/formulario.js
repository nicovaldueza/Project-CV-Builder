// Formulario del CV: recorrido, listas, vista previa, localStorage, validación y PDF.
// Usa AREAS y HABILIDADES (reglas.js) y criticar / mostrarResultado (critica.js).

const CLAVE_STORAGE = "matchdev-cv";

// Textos de la interfaz que arma JavaScript (para traducir en la v2).
const TEXTOS = {
  faltanCampos: (n) => n === 1 ? "Falta completar 1 campo." : `Faltan completar ${n} campos.`,
  faltanCamposPaso: (n) => n === 1 ? "Falta completar 1 campo en este paso." : `Faltan completar ${n} campos en este paso.`,
  faltanCamposOtroPaso: (n, paso) => `${n === 1 ? "Falta completar 1 campo" : `Faltan completar ${n} campos`}. Te llevamos al paso ${paso}.`,
  anuncioPaso: (n, total, nombre) => `Paso ${n} de ${total}: ${nombre}`,
  pasoCompleto: "completo",
  pasoBloqueado: "todavía no disponible",
  errorVacio: "Completá este campo.",
  errorEmail: "Escribí un email válido, por ejemplo nombre@mail.com.",
  errorUrl: "Escribí un link completo, que empiece con https://",
  errorLinks: "Falta un link: con GitHub o portfolio alcanza.",
  errorHabilidades: "Elegí al menos una habilidad.",
  revisando: "Revisando ortografía…",
  ejemploTitulo: {
    backend: "Desarrollador/a Backend Junior",
    frontend: "Desarrollador/a Frontend Junior",
    data: "Analista de Datos Junior",
    uxui: "Diseñador/a UX/UI Junior"
  },
  actualidad: "Actualidad",
  enCurso: "En curso",
  placeholderNombre: "Tu nombre",
  placeholderTitulo: "Tu título",
  tituloPerfil: "Perfil",
  tituloExperiencia: "Experiencia",
  tituloProyectos: "Proyectos",
  tituloEducacion: "Educación",
  tituloHabilidades: "Habilidades",
  meses: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."]
};

const form = document.getElementById("form-cv");
const editor = document.getElementById("editor");
let cv = cargar();

// ---------- Datos ----------

function cvVacio() {
  return {
    area: "",
    datos: { nombre: "", titulo: "", email: "", telefono: "", ubicacion: "" },
    perfil: "",
    experiencias: [{ puesto: "", empresa: "", desde: "", hasta: "", descripcion: "" }],
    educacion: [{ titulo: "", institucion: "", desde: "", hasta: "" }],
    habilidades: [],
    otrasHabilidades: "",
    proyectos: [{ nombre: "", descripcion: "", tecnologias: "", link: "" }],
    links: { github: "", linkedin: "", portfolio: "" }
  };
}

function cargar() {
  const vacio = cvVacio();
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    if (!guardado) return vacio;
    return {
      ...vacio,
      ...guardado,
      datos: { ...vacio.datos, ...guardado.datos },
      links: { ...vacio.links, ...guardado.links }
    };
  } catch (e) {
    return vacio;
  }
}

function guardar() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(cv));
  } catch (e) {
    // Sin localStorage (modo privado, bloqueado): la página sigue funcionando sin guardar.
  }
}

// Lee un valor anidado como "datos.nombre".
function leerRuta(objeto, ruta) {
  return ruta.split(".").reduce((o, clave) => (o ? o[clave] : ""), objeto) ?? "";
}

function escribirRuta(objeto, ruta, valor) {
  const claves = ruta.split(".");
  const ultima = claves.pop();
  claves.reduce((o, clave) => o[clave], objeto)[ultima] = valor;
}

// ---------- Formulario ↔ objeto cv ----------

function leerFormulario() {
  const nuevo = cvVacio();
  nuevo.area = cv.area;

  form.querySelectorAll("[data-campo]").forEach((campo) => {
    if (!campo.closest(".item")) escribirRuta(nuevo, campo.dataset.campo, campo.value.trim());
  });

  form.querySelectorAll("[data-lista]").forEach((lista) => {
    nuevo[lista.dataset.lista] = [...lista.querySelectorAll(".item")].map((item) => {
      const datos = {};
      item.querySelectorAll("[data-campo]").forEach((campo) => {
        datos[campo.dataset.campo] = campo.value.trim();
      });
      return datos;
    });
  });

  if (document.getElementById("sin-experiencia").checked) nuevo.experiencias = [];

  nuevo.habilidades = [...form.querySelectorAll('input[name="habilidad"]:checked')].map((c) => c.value);
  return nuevo;
}

function escribirFormulario() {
  form.querySelectorAll("[data-campo]").forEach((campo) => {
    if (!campo.closest(".item")) campo.value = leerRuta(cv, campo.dataset.campo);
  });

  const sinExperiencia = cv.experiencias.length === 0;
  document.getElementById("sin-experiencia").checked = sinExperiencia;
  alternarExperiencia(sinExperiencia);

  ["experiencias", "educacion", "proyectos"].forEach((lista) => {
    document.querySelector(`[data-lista="${lista}"]`).innerHTML = "";
    const items = cv[lista].length ? cv[lista] : cvVacio()[lista];
    items.forEach((datos) => agregarItem(lista, datos));
  });

  renderHabilidades();
}

let contadorItems = 0;

function agregarItem(lista, datos = {}) {
  const contenedor = document.querySelector(`[data-lista="${lista}"]`);
  const item = document.getElementById(`tpl-${lista}`).content.firstElementChild.cloneNode(true);
  contadorItems++;

  item.querySelectorAll(".campo").forEach((campo) => {
    const input = campo.querySelector("[data-campo]");
    input.id = `${lista}-${contadorItems}-${input.dataset.campo}`;
    input.value = datos[input.dataset.campo] || "";
    campo.querySelector("label").htmlFor = input.id;
  });

  contenedor.appendChild(item);
  actualizarBotonesQuitar(contenedor);
  return item;
}

// Siempre queda al menos un ítem en cada lista.
function actualizarBotonesQuitar(contenedor) {
  const botones = contenedor.querySelectorAll("[data-quitar]");
  botones.forEach((boton) => { boton.hidden = botones.length === 1; });
}

function alternarExperiencia(sinExperiencia) {
  const lista = document.getElementById("lista-experiencias");
  lista.hidden = sinExperiencia;
  document.querySelector('[data-agregar="experiencias"]').hidden = sinExperiencia;
}

function renderHabilidades() {
  const contenedor = document.getElementById("lista-habilidades");
  const delArea = HABILIDADES[cv.area] || [];
  // Las que ya eligió para otra área se mantienen al final.
  const todas = [...delArea, ...cv.habilidades.filter((h) => !delArea.includes(h))];

  contenedor.innerHTML = "";
  todas.forEach((habilidad, i) => {
    const label = document.createElement("label");
    label.className = "chip";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "habilidad";
    input.value = habilidad;
    input.id = `habilidad-${i}`;
    input.checked = cv.habilidades.includes(habilidad);
    label.append(input, document.createTextNode(habilidad));
    contenedor.appendChild(label);
  });
}

// ---------- Vista previa ----------

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatearFecha(valor) {
  if (!valor) return "";
  const [anio, mes] = valor.split("-");
  return `${TEXTOS.meses[Number(mes) - 1]} ${anio}`;
}

function rango(desde, hasta, textoSinFin) {
  if (!desde && !hasta) return "";
  return `${formatearFecha(desde)} – ${hasta ? formatearFecha(hasta) : textoSinFin}`;
}

function linkVisible(url) {
  return escapar(url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""));
}

function renderPreview() {
  const hoja = document.getElementById("cv-hoja");
  const d = cv.datos;

  const contacto = [d.email, d.telefono, d.ubicacion].filter(Boolean).map(escapar);
  const links = Object.values(cv.links).filter(Boolean).map((url) =>
    `<a href="${escapar(url)}">${linkVisible(url)}</a>`);

  const experiencias = cv.experiencias.filter((e) => e.puesto || e.empresa || e.descripcion);
  const proyectos = cv.proyectos.filter((p) => p.nombre || p.descripcion);
  const educacion = cv.educacion.filter((e) => e.titulo || e.institucion);
  const habilidades = [...cv.habilidades, ...(cv.otrasHabilidades ? [cv.otrasHabilidades] : [])];

  const bloque = (titulo, contenido) => contenido ? `<section class="cv__bloque"><h3>${titulo}</h3>${contenido}</section>` : "";

  hoja.innerHTML = `
    <header class="cv__cabecera">
      <h2 class="cv__nombre">${escapar(d.nombre) || `<span class="cv__vacio">${TEXTOS.placeholderNombre}</span>`}</h2>
      <p class="cv__titulo">${escapar(d.titulo) || `<span class="cv__vacio">${TEXTOS.placeholderTitulo}</span>`}</p>
      ${contacto.length || links.length ? `<p class="cv__contacto">${[...contacto, ...links].join(" · ")}</p>` : ""}
    </header>
    ${bloque(TEXTOS.tituloPerfil, cv.perfil ? `<p>${escapar(cv.perfil)}</p>` : "")}
    ${bloque(TEXTOS.tituloExperiencia, experiencias.map((e) => `
      <div class="cv__item">
        <div class="cv__item-cabecera">
          <strong>${escapar(e.puesto)}${e.empresa ? ` — ${escapar(e.empresa)}` : ""}</strong>
          <span>${rango(e.desde, e.hasta, TEXTOS.actualidad)}</span>
        </div>
        ${e.descripcion ? `<p>${escapar(e.descripcion)}</p>` : ""}
      </div>`).join(""))}
    ${bloque(TEXTOS.tituloProyectos, proyectos.map((p) => `
      <div class="cv__item">
        <div class="cv__item-cabecera">
          <strong>${escapar(p.nombre)}</strong>
          ${p.link ? `<a href="${escapar(p.link)}">${linkVisible(p.link)}</a>` : ""}
        </div>
        ${p.tecnologias ? `<p class="cv__tecnologias">${escapar(p.tecnologias)}</p>` : ""}
        ${p.descripcion ? `<p>${escapar(p.descripcion)}</p>` : ""}
      </div>`).join(""))}
    ${bloque(TEXTOS.tituloEducacion, educacion.map((e) => `
      <div class="cv__item">
        <div class="cv__item-cabecera">
          <strong>${escapar(e.titulo)}${e.institucion ? ` — ${escapar(e.institucion)}` : ""}</strong>
          <span>${rango(e.desde, e.hasta, TEXTOS.enCurso)}</span>
        </div>
      </div>`).join(""))}
    ${bloque(TEXTOS.tituloHabilidades, habilidades.length ? `<p>${habilidades.map(escapar).join(" · ")}</p>` : "")}`;
}

// ---------- Validación (RF07) ----------

// Agrega o saca un id de aria-describedby sin pisar los que ya tiene (ej. el texto de ayuda).
function alternarDescripcion(campo, id, agregar) {
  const ids = (campo.getAttribute("aria-describedby") || "").split(" ").filter((i) => i && i !== id);
  if (agregar) ids.push(id);
  if (ids.length) campo.setAttribute("aria-describedby", ids.join(" "));
  else campo.removeAttribute("aria-describedby");
}

// Marca el campo en rojo y le pone su mensaje de error, vinculado con aria-describedby.
function marcar(campo, invalido, mensaje = "") {
  const idError = `${campo.id}-error`;
  let error = document.getElementById(idError);

  campo.classList.toggle("invalido", invalido);
  if (invalido) campo.setAttribute("aria-invalid", "true");
  else campo.removeAttribute("aria-invalid");

  if (invalido) {
    if (!error) {
      error = document.createElement("p");
      error.className = "campo__error";
      error.id = idError;
      campo.insertAdjacentElement("afterend", error);
    }
    error.textContent = mensaje;
  } else if (error) {
    error.remove();
  }
  alternarDescripcion(campo, idError, invalido);
}

function mensajeError(campo) {
  if (!campo.value.trim()) return TEXTOS.errorVacio;
  if (campo.type === "email") return TEXTOS.errorEmail;
  if (campo.type === "url") return TEXTOS.errorUrl;
  return TEXTOS.errorVacio;
}

function campoValido(campo) {
  return campo.value.trim() !== "" && campo.checkValidity();
}

// Campos que se validan en un paso: los obligatorios, más los links (paso 4) y el grupo de habilidades (paso 3).
function camposDelPaso(i) {
  const paso = pasos[i];
  const campos = [...paso.querySelectorAll("[required]")];
  if (paso.id === "seccion-habilidades") campos.push(document.getElementById("lista-habilidades"));
  if (paso.id === "seccion-proyectos") campos.push(document.getElementById("github"), document.getElementById("portfolio"));
  return campos;
}

// Errores de un paso, sin marcarlos: [{ campo, mensaje }], en el orden de la página.
// Se saltean los campos ocultos dentro del paso (la lista de experiencias con "sin experiencia").
function erroresDelPaso(i) {
  const paso = pasos[i];
  const errores = [];

  paso.querySelectorAll("[required]").forEach((campo) => {
    const oculto = campo.closest("[hidden]");
    if (oculto && oculto !== paso && paso.contains(oculto)) return;
    if (!campoValido(campo)) errores.push({ campo, mensaje: mensajeError(campo) });
  });

  // Habilidades: al menos una elegida.
  if (paso.id === "seccion-habilidades" && !paso.querySelector('input[name="habilidad"]:checked')) {
    errores.push({ campo: document.getElementById("lista-habilidades"), mensaje: TEXTOS.errorHabilidades });
  }

  // Links: al menos GitHub o portfolio, y con formato válido.
  if (paso.id === "seccion-proyectos") {
    const links = [document.getElementById("github"), document.getElementById("portfolio")];
    const sinLinks = links.every((campo) => !campo.value.trim());
    links.forEach((campo) => {
      if (sinLinks) errores.push({ campo, mensaje: TEXTOS.errorLinks });
      else if (campo.value.trim() && !campo.checkValidity()) errores.push({ campo, mensaje: TEXTOS.errorUrl });
    });
  }
  return errores;
}

// Marca en rojo los errores del paso (y desmarca los que se corrigieron).
function marcarPaso(i) {
  const errores = erroresDelPaso(i);
  const mensajes = new Map(errores.map((e) => [e.campo, e.mensaje]));
  camposDelPaso(i).forEach((campo) => marcar(campo, mensajes.has(campo), mensajes.get(campo)));
  return errores;
}

function enfocarError(error) {
  const campo = error.campo.id === "lista-habilidades" ? error.campo.querySelector("input") || error.campo : error.campo;
  campo.focus();
}

function mostrarErrorForm(texto) {
  const error = document.getElementById("error-form");
  error.hidden = !texto;
  error.textContent = texto || "";
}

// "Siguiente": valida solo el paso actual.
function validarPaso(i) {
  const errores = marcarPaso(i);
  mostrarErrorForm(errores.length ? TEXTOS.faltanCamposPaso(errores.length) : "");
  if (errores.length) enfocarError(errores[0]);
  return errores.length === 0;
}

// "Criticar mi CV": valida todo; si falta algo, lleva al primer paso con errores (RF07).
function validarTodo() {
  const porPaso = pasos.map((_, i) => marcarPaso(i));
  const total = porPaso.reduce((suma, errores) => suma + errores.length, 0);
  if (!total) {
    mostrarErrorForm("");
    return true;
  }
  const primero = porPaso.findIndex((errores) => errores.length);
  irAPaso(primero, { enfocar: false });
  mostrarErrorForm(primero === pasoActual && primero === ULTIMO_PASO ? TEXTOS.faltanCampos(total) : TEXTOS.faltanCamposOtroPaso(total, primero + 1));
  enfocarError(porPaso[primero][0]);
  return false;
}

// ---------- Pasos del formulario ----------

const pasos = [...form.querySelectorAll(".seccion[data-paso]")];
const ULTIMO_PASO = pasos.length - 1;
let pasoActual = 0;
let pasoMaximo = 0; // el paso más lejano al que se puede saltar desde la barra

const nombrePaso = (i) => pasos[i].querySelector("legend").textContent.replace(/^\d+\.\s*/, "");

function irAPaso(n, { enfocar = true } = {}) {
  pasoActual = n;
  pasoMaximo = Math.max(pasoMaximo, n);
  pasos.forEach((paso, i) => { paso.hidden = i !== n; });

  document.getElementById("btn-anterior").hidden = n === 0;
  document.getElementById("btn-siguiente").hidden = n === ULTIMO_PASO;
  document.getElementById("btn-criticar").hidden = n !== ULTIMO_PASO;
  document.getElementById("btn-pdf").hidden = n !== ULTIMO_PASO;
  mostrarErrorForm("");
  actualizarBarraPasos();
  document.getElementById("anuncio-paso").textContent = TEXTOS.anuncioPaso(n + 1, pasos.length, nombrePaso(n));

  if (enfocar) {
    form.scrollIntoView({ block: "start" });
    const titulo = pasos[n].querySelector("legend");
    titulo.setAttribute("tabindex", "-1");
    titulo.focus({ preventScroll: true });
  }
}

function actualizarBarraPasos() {
  document.querySelectorAll("[data-ir-paso]").forEach((boton) => {
    const i = Number(boton.dataset.irPaso);
    const completo = i !== pasoActual && i <= pasoMaximo && erroresDelPaso(i).length === 0;
    boton.disabled = i > pasoMaximo;
    boton.classList.toggle("paso-boton--completo", completo);
    boton.querySelector(".paso-boton__numero").textContent = completo ? "✓" : String(i + 1);
    if (i === pasoActual) boton.setAttribute("aria-current", "step");
    else boton.removeAttribute("aria-current");
    // El nombre accesible es "Paso 1: Datos, completo": incluye el texto visible ("Datos").
    boton.querySelector(".paso-boton__estado").textContent = completo ? `, ${TEXTOS.pasoCompleto}` : i > pasoMaximo ? `, ${TEXTOS.pasoBloqueado}` : "";
  });
}

function siguientePaso() {
  if (validarPaso(pasoActual)) irAPaso(pasoActual + 1);
}

// ---------- Recorrido ----------

function irA(id) {
  ["inicio", "area", "editor"].forEach((seccion) => {
    document.getElementById(seccion).hidden = seccion !== id;
  });
  window.scrollTo(0, 0);
  const titulo = document.querySelector(`#${id} h1, #${id} h2, #${id} legend`);
  if (titulo) {
    titulo.setAttribute("tabindex", "-1");
    titulo.focus({ preventScroll: true });
  }
}

function elegirArea(area) {
  cv.area = area;
  document.getElementById("area-actual").textContent = AREAS[area];
  document.getElementById("titulo").placeholder = TEXTOS.ejemploTitulo[area];
  document.getElementById("select-otra-area").value = area;
  const radio = document.querySelector(`input[name="area"][value="${area}"]`);
  if (radio) radio.checked = true;
  renderHabilidades();
  guardar();
}

function modoEditor(modo) {
  editor.dataset.modo = modo;
  form.hidden = modo !== "edicion";
  document.getElementById("resultado").hidden = modo !== "resultado";
}

// Espera la revisión del diccionario (en segundo plano) y muestra la crítica.
let criticando = false;

async function criticarYMostrar() {
  if (criticando) return;
  criticando = true;
  const botones = [document.getElementById("btn-criticar"), document.getElementById("btn-otra-area")];
  const textosOriginales = botones.map((boton) => boton.textContent);
  botones.forEach((boton) => { boton.disabled = true; boton.textContent = TEXTOS.revisando; });
  form.setAttribute("aria-busy", "true");

  const diccionario = await Diccionario.revisar(cv);

  botones.forEach((boton, i) => { boton.disabled = false; boton.textContent = textosOriginales[i]; });
  form.removeAttribute("aria-busy");
  criticando = false;

  mostrarResultado(criticar(cv, diccionario), cv);
  modoEditor("resultado");
  window.scrollTo(0, 0);
  document.getElementById("titulo-resultado").setAttribute("tabindex", "-1");
  document.getElementById("titulo-resultado").focus();
}

function imprimir() {
  const tituloOriginal = document.title;
  if (cv.datos.nombre) document.title = `CV ${cv.datos.nombre}`;  // nombre sugerido del PDF
  window.addEventListener("afterprint", () => { document.title = tituloOriginal; }, { once: true });
  window.print();
}

// ---------- Eventos ----------

document.getElementById("btn-empezar").addEventListener("click", () => irA("area"));

document.querySelector(".logo").addEventListener("click", (e) => {
  e.preventDefault();
  irA("inicio");
});

document.getElementById("btn-ir-formulario").addEventListener("click", () => {
  const elegida = document.querySelector('input[name="area"]:checked');
  document.getElementById("error-area").hidden = Boolean(elegida);
  if (!elegida) return;
  elegirArea(elegida.value);
  modoEditor("edicion");
  irA("editor");
  irAPaso(pasoActual);
  Diccionario.iniciar(); // el diccionario carga mientras se completa el CV
});

document.getElementById("btn-anterior").addEventListener("click", () => irAPaso(pasoActual - 1));
document.getElementById("btn-siguiente").addEventListener("click", () => {
  cv = leerFormulario();
  siguientePaso();
});
document.querySelector(".pasos").addEventListener("click", (e) => {
  const boton = e.target.closest("[data-ir-paso]");
  if (boton && !boton.disabled) irAPaso(Number(boton.dataset.irPaso));
});

document.getElementById("btn-cambiar-area").addEventListener("click", () => irA("area"));

// Cada cambio actualiza el objeto cv, la vista previa y localStorage (RF01, RF09).
form.addEventListener("input", (e) => {
  cv = leerFormulario();
  renderPreview();
  guardar();
  if (e.target.classList.contains("invalido") && campoValido(e.target)) marcar(e.target, false);

  // Con un link válido en GitHub o portfolio, el otro deja de ser obligatorio.
  if (["github", "portfolio"].includes(e.target.id) && campoValido(e.target)) {
    ["github", "portfolio"].forEach((id) => {
      const otro = document.getElementById(id);
      if (otro.classList.contains("invalido") && !otro.value.trim()) marcar(otro, false);
    });
  }

  if (e.target.name === "habilidad" && cv.habilidades.length) marcar(document.getElementById("lista-habilidades"), false);
});

form.addEventListener("click", (e) => {
  const agregar = e.target.closest("[data-agregar]");
  const quitar = e.target.closest("[data-quitar]");

  if (agregar) {
    const item = agregarItem(agregar.dataset.agregar);
    item.querySelector("input").focus();
  }
  if (quitar) {
    const contenedor = quitar.closest("[data-lista]");
    quitar.closest(".item").remove();
    actualizarBotonesQuitar(contenedor);
  }
  if (agregar || quitar) {
    cv = leerFormulario();
    renderPreview();
    guardar();
  }
});

document.getElementById("sin-experiencia").addEventListener("change", (e) => {
  alternarExperiencia(e.target.checked);
  const lista = document.getElementById("lista-experiencias");
  if (!e.target.checked && !lista.children.length) agregarItem("experiencias");
  cv = leerFormulario();
  renderPreview();
  guardar();
});

// Enter en un campo: en los primeros pasos equivale a "Siguiente"; en el último, a "Criticar mi CV".
form.addEventListener("submit", (e) => {
  e.preventDefault();
  cv = leerFormulario();
  if (pasoActual < ULTIMO_PASO) siguientePaso();
  else if (validarTodo()) criticarYMostrar();
});

document.getElementById("btn-editar").addEventListener("click", () => {
  modoEditor("edicion");
  window.scrollTo(0, 0);
  irAPaso(0);
});

document.getElementById("btn-otra-area").addEventListener("click", () => {
  elegirArea(document.getElementById("select-otra-area").value);
  criticarYMostrar();
});

document.getElementById("btn-pdf").addEventListener("click", imprimir);
document.getElementById("btn-pdf-resultado").addEventListener("click", imprimir);

// ---------- Inicio ----------

(function iniciar() {
  const select = document.getElementById("select-otra-area");
  Object.entries(AREAS).forEach(([valor, nombre]) => select.add(new Option(nombre, valor)));

  escribirFormulario();
  if (cv.area) elegirArea(cv.area);
  renderPreview();

  // Con un CV guardado, se puede saltar hasta el primer paso que tenga algo sin completar.
  const primeroIncompleto = pasos.findIndex((_, i) => erroresDelPaso(i).length);
  pasoMaximo = primeroIncompleto === -1 ? ULTIMO_PASO : primeroIncompleto;
  irAPaso(0, { enfocar: false });
})();
