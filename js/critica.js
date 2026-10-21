// Motor de crítica y panel de resultado.
// Usa AREAS, SECCIONES, REGLAS_COMUNES y REGLAS_AREA de reglas.js.

/*
  Forma del resultado que devuelve criticar(cv) y recibe mostrarResultado():

  {
    puntaje: 72,                      // entero de 0 a 100
    secciones: {
      perfil:      { obtenidos: 5,  posibles: 10, porcentaje: 50 },
      experiencia: { obtenidos: 10, posibles: 10, porcentaje: 100 },
      habilidades: { ... },
      proyectos:   { ... }
    },
    mejoras: [                         // una por regla no cumplida o cumplida a medias
      { id: "B2", seccion: "habilidades", mensaje: "...", perdidos: 15, pista: "" }
    ]
  }
*/

// Pasa a minúsculas y saca los acentos: "Investigación" → "investigacion".
function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Busca "palabra" como palabra completa: "java" no coincide con "javascript".
function contiene(texto, palabra) {
  const escapada = palabra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp("(^|[^a-z0-9])" + escapada + "(?![a-z0-9])");
  return regex.test(normalizar(texto));
}

function colorSemaforo(porcentaje) {
  if (porcentaje >= 80) return { clase: "verde", texto: "Bien" };
  if (porcentaje >= 50) return { clase: "amarillo", texto: "Medio" };
  return { clase: "rojo", texto: "Bajo" };
}

// TODO: implementar según docs/specs.md (Motor de crítica):
//   - reglas comunes C1–C4 (lógica propia por id)
//   - reglas del área con palabras clave: 100 % si aparecen en habilidades y en
//     proyectos/experiencia, 50 % si aparecen en uno solo, 0 si no aparecen
//   - F1 por grupos: 5 puntos por cada grupo que aparezca en cualquier lugar
//   - porcentaje por sección y mejoras ordenadas por puntos perdidos
function criticar(cv) {
  const secciones = {};
  for (const clave in SECCIONES) {
    secciones[clave] = { obtenidos: 0, posibles: 0, porcentaje: 0 };
  }
  return { puntaje: 0, secciones, mejoras: [], pendiente: true };
}

function mostrarResultado(resultado, cv) {
  const contenedor = document.getElementById("resultado-contenido");
  const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const general = colorSemaforo(resultado.puntaje);

  const filasSecciones = Object.keys(SECCIONES).map((clave) => {
    const s = resultado.secciones[clave];
    const color = colorSemaforo(s.porcentaje);
    return `
      <li class="semaforo__fila">
        <span>${SECCIONES[clave]}</span>
        <span class="insignia insignia--${color.clase}">${color.texto} · ${s.porcentaje}</span>
      </li>`;
  }).join("");

  const mejoras = [...resultado.mejoras].sort((a, b) => b.perdidos - a.perdidos);
  const listaMejoras = mejoras.length
    ? `<ol class="mejoras">${mejoras.map((m) => `
        <li class="mejora">
          <span class="mejora__puntos">−${m.perdidos}</span>
          <div>
            <p>${escapar(m.mensaje)}</p>
            ${m.pista ? `<p class="mejora__pista">${escapar(m.pista)}</p>` : ""}
            <p class="mejora__seccion">${SECCIONES[m.seccion]}</p>
          </div>
        </li>`).join("")}</ol>`
    : resultado.pendiente
      ? ""
      : `<p class="felicitacion">¡Tu CV cumple todo lo que se pide para ${AREAS[cv.area]}! Descargalo y mandalo.</p>`;

  contenedor.innerHTML = `
    ${resultado.pendiente ? `<p class="aviso">El motor de crítica todavía no está implementado: estos valores son de ejemplo.</p>` : ""}
    <div class="puntaje">
      <span class="puntaje__numero insignia--${general.clase}">${resultado.puntaje}</span>
      <span class="puntaje__texto">de 100 para <strong>${AREAS[cv.area]}</strong></span>
    </div>
    <h3>Por sección</h3>
    <ul class="semaforo">${filasSecciones}</ul>
    <h3>Qué mejorar</h3>
    ${listaMejoras}`;
}
