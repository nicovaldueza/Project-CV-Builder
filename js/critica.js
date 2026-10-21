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

function contieneAlguna(texto, palabras) {
  return palabras.some((palabra) => contiene(texto, palabra));
}

function esUrl(valor) {
  return /^https?:\/\/[^\s.]+\.\S+/i.test(String(valor || "").trim());
}

function contarPalabras(texto) {
  return String(texto || "").trim().split(/\s+/).filter(Boolean).length;
}

// Textos donde se buscan las palabras clave: habilidades elegidas por un lado,
// descripciones y tecnologías de proyectos y experiencia por el otro.
// "Otras habilidades" no se revisa.
function textosDelCv(cv) {
  return {
    habilidades: cv.habilidades.join(" | "),
    trabajo: [
      ...cv.proyectos.map((p) => `${p.descripcion} | ${p.tecnologias}`),
      ...cv.experiencias.map((e) => e.descripcion)
    ].join(" | ")
  };
}

// ---------- Reglas comunes (lógica propia por id) ----------

const LOGICA_COMUN = {
  // C1: link a GitHub o portfolio.
  C1(regla, cv) {
    const ok = esUrl(cv.links.github) || esUrl(cv.links.portfolio);
    return { obtenidos: ok ? regla.puntos : 0, pista: "" };
  },

  // C2: 5 pts por largo y 5 pts por mencionar el área o una tecnología del área.
  C2(regla, cv) {
    const mitad = regla.puntos / 2;
    const palabras = contarPalabras(cv.perfil);
    const largoOk = palabras >= regla.minimoPalabras;
    const tecnologias = (HABILIDADES[cv.area] || []).map(normalizar);
    const mencionaOk = contieneAlguna(cv.perfil, [...regla.nombresArea[cv.area], ...tecnologias]);

    const pistas = [];
    if (!largoOk) pistas.push(`Tiene ${palabras} palabras; apuntá a ${regla.minimoPalabras} o más.`);
    if (!mencionaOk) pistas.push(`Mencioná ${AREAS[cv.area]} o alguna tecnología del área.`);

    return { obtenidos: (largoOk ? mitad : 0) + (mencionaOk ? mitad : 0), pista: pistas.join(" ") };
  },

  // C3: proporcional a los proyectos con link válido y al menos N tecnologías.
  C3(regla, cv) {
    const total = cv.proyectos.length;
    const cumplen = cv.proyectos.filter((p) =>
      esUrl(p.link) && p.tecnologias.split(",").filter((t) => t.trim()).length >= regla.minimoTecnologias
    ).length;
    const obtenidos = total ? Math.floor((regla.puntos * cumplen) / total) : 0;
    const pista = total && cumplen < total ? `${cumplen} de ${total} proyectos cumplen.` : "";
    return { obtenidos, pista };
  },

  // C4: descripciones con un número, un % o un verbo de logro.
  // 100 % si la mitad o más lo cumple, 50 % si al menos una.
  C4(regla, cv) {
    const descripciones = [
      ...cv.experiencias.map((e) => e.descripcion),
      ...cv.proyectos.map((p) => p.descripcion)
    ].filter((d) => d && d.trim());

    const conResultado = descripciones.filter((d) =>
      /\d|%/.test(d) || contieneAlguna(d, regla.verbosLogro)
    ).length;

    let obtenidos = 0;
    if (conResultado > 0 && conResultado * 2 >= descripciones.length) obtenidos = regla.puntos;
    else if (conResultado > 0) obtenidos = regla.puntos / 2;

    const pista = conResultado > 0 && obtenidos < regla.puntos
      ? `${conResultado} de ${descripciones.length} descripciones muestran resultados.`
      : "";
    return { obtenidos, pista };
  }
};

// ---------- Reglas del área (palabras clave) ----------

// 100 % si aparece en habilidades y en proyectos/experiencia, 50 % si en uno solo.
function evaluarPalabras(regla, textos) {
  const enHabilidades = contieneAlguna(textos.habilidades, regla.palabras);
  const enTrabajo = contieneAlguna(textos.trabajo, regla.palabras);

  if (enHabilidades && enTrabajo) return { obtenidos: regla.puntos, pista: "" };
  if (enHabilidades) return { obtenidos: Math.floor(regla.puntos / 2), pista: "Ya lo tenés en tus habilidades; mostralo también en un proyecto o experiencia." };
  if (enTrabajo) return { obtenidos: Math.floor(regla.puntos / 2), pista: "Ya aparece en tus proyectos o experiencia; sumalo también a tus habilidades." };
  return { obtenidos: 0, pista: "" };
}

// F1: puntos por cada grupo que aparezca en cualquiera de los dos lugares.
function evaluarGrupos(regla, textos) {
  const porGrupo = regla.puntos / regla.grupos.length;
  const faltan = [];
  let obtenidos = 0;

  regla.grupos.forEach((grupo, i) => {
    if (contieneAlguna(textos.habilidades, grupo) || contieneAlguna(textos.trabajo, grupo)) obtenidos += porGrupo;
    else faltan.push(regla.nombresGrupos[i]);
  });

  const pista = faltan.length && faltan.length < regla.grupos.length ? `Te falta: ${faltan.join(", ")}.` : "";
  return { obtenidos, pista };
}

// ---------- Motor ----------

function criticar(cv) {
  const textos = textosDelCv(cv);
  const secciones = {};
  for (const clave in SECCIONES) {
    secciones[clave] = { obtenidos: 0, posibles: 0, porcentaje: 0 };
  }

  const evaluadas = [
    ...REGLAS_COMUNES.map((regla) => ({ regla, ...LOGICA_COMUN[regla.id](regla, cv) })),
    ...(REGLAS_AREA[cv.area] || []).map((regla) => ({
      regla,
      ...(regla.grupos ? evaluarGrupos(regla, textos) : evaluarPalabras(regla, textos))
    }))
  ];

  let puntaje = 0;
  const mejoras = [];

  evaluadas.forEach(({ regla, obtenidos, pista }) => {
    puntaje += obtenidos;
    secciones[regla.seccion].obtenidos += obtenidos;
    secciones[regla.seccion].posibles += regla.puntos;

    if (obtenidos < regla.puntos) {
      mejoras.push({
        id: regla.id,
        seccion: regla.seccion,
        mensaje: regla.mensaje.replace("{area}", AREAS[cv.area]),
        perdidos: regla.puntos - obtenidos,
        pista
      });
    }
  });

  for (const clave in secciones) {
    const s = secciones[clave];
    s.porcentaje = s.posibles ? Math.round((s.obtenidos / s.posibles) * 100) : 0;
  }

  // De mayor a menor por puntos perdidos; si empatan, queda el orden de las reglas.
  mejoras.sort((a, b) => b.perdidos - a.perdidos);

  return { puntaje: Math.round(puntaje), secciones, mejoras };
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

  const mejoras = resultado.mejoras;
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
    : `<p class="felicitacion">¡Tu CV cumple todo lo que se pide para ${AREAS[cv.area]}! Descargalo y mandalo.</p>`;

  contenedor.innerHTML = `
    <div class="puntaje">
      <span class="puntaje__numero insignia--${general.clase}">${resultado.puntaje}</span>
      <span class="puntaje__texto">de 100 para <strong>${AREAS[cv.area]}</strong></span>
    </div>
    <h3>Por sección</h3>
    <ul class="semaforo">${filasSecciones}</ul>
    <h3>Qué mejorar</h3>
    ${listaMejoras}`;
}
