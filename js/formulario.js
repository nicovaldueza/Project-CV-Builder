// Formulario del CV: recorrido, listas, vista previa, localStorage, validación y PDF.
// Usa AREAS y HABILIDADES (reglas.js) y criticar / mostrarResultado (critica.js).

const CLAVE_STORAGE = "matchdev-cv";

// Textos de la interfaz que arma JavaScript (para traducir en la v2).
const TEXTOS = {
  faltanCampos: (n) => n === 1 ? "Falta completar 1 campo." : `Faltan completar ${n} campos.`,
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

function marcar(campo, invalido) {
  campo.classList.toggle("invalido", invalido);
  if (invalido) campo.setAttribute("aria-invalid", "true");
  else campo.removeAttribute("aria-invalid");
}

function validar() {
  const invalidos = [];

  form.querySelectorAll("[required]").forEach((campo) => {
    if (campo.closest("[hidden]")) return;
    const malo = !campo.value.trim() || !campo.checkValidity();
    marcar(campo, malo);
    if (malo) invalidos.push(campo);
  });

  // Links: al menos GitHub o portfolio.
  const github = document.getElementById("github");
  const portfolio = document.getElementById("portfolio");
  const sinLinks = !github.value.trim() && !portfolio.value.trim();
  [github, portfolio].forEach((campo) => {
    const malo = sinLinks || (campo.value.trim() !== "" && !campo.checkValidity());
    marcar(campo, malo);
    if (malo) invalidos.push(campo);
  });

  // Habilidades: al menos una elegida.
  const grupoHabilidades = document.getElementById("lista-habilidades");
  const sinHabilidades = cv.habilidades.length === 0;
  marcar(grupoHabilidades, sinHabilidades);
  if (sinHabilidades) invalidos.push(grupoHabilidades.querySelector("input") || grupoHabilidades);

  // Ordenados como aparecen en la página, para ir al primero.
  invalidos.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  const error = document.getElementById("error-form");
  error.hidden = invalidos.length === 0;
  error.textContent = invalidos.length ? TEXTOS.faltanCampos(invalidos.length) : "";
  if (invalidos.length) invalidos[0].focus();

  return invalidos.length === 0;
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

function criticarYMostrar() {
  mostrarResultado(criticar(cv), cv);
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
});

document.getElementById("btn-cambiar-area").addEventListener("click", () => irA("area"));

// Cada cambio actualiza el objeto cv, la vista previa y localStorage (RF01, RF09).
form.addEventListener("input", (e) => {
  cv = leerFormulario();
  renderPreview();
  guardar();
  if (e.target.classList.contains("invalido") && e.target.value.trim()) marcar(e.target, false);
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  cv = leerFormulario();
  if (validar()) criticarYMostrar();
});

document.getElementById("btn-editar").addEventListener("click", () => {
  modoEditor("edicion");
  window.scrollTo(0, 0);
  const primeraSeccion = document.querySelector("#seccion-perfil legend");
  primeraSeccion.setAttribute("tabindex", "-1");
  primeraSeccion.focus({ preventScroll: true });
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
})();
