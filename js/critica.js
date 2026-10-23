// Motor de crítica y panel de resultado.
// Usa AREAS, SECCIONES, HABILIDADES, REGLAS_COMUNES, REGLAS_AREA y ORTOGRAFIA de reglas.js.

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
      { id: "B2", seccion: "habilidades", mensaje: "...", perdidos: 15, pista: "" },
      { id: "C5-perfil", seccion: "perfil", mensaje: "...", perdidos: 2, pista: "2 errores.",
        detalles: ["Perfil: «desarollo» → «desarrollo»", "..."] }   // "detalles" solo en ortografía
    ],
    dudosas: [{ lugar: "Perfil", palabra: "Kubernets" }],  // no están en el diccionario y no restan
    diccionario: "completo"            // "completo" | "no-disponible" | "sin-diccionario"
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

// ---------- Ortografía, mayúsculas y puntuación (C5) ----------

const ABREVIATURAS = ["ej", "etc", "aprox", "vs", "p", "dr", "dra", "lic", "ing", "sr", "sra", "nro", "n"];
const MINUSCULAS_NORMALIZADAS = new Map(ORTOGRAFIA.minusculas.map((p) => [normalizar(p), p]));
const SIGLAS = new Set(ORTOGRAFIA.siglas);
const TECNOLOGIAS_MINUSCULA = new Set(ORTOGRAFIA.tecnologias.map((t) => t.toLowerCase()));

const esMayuscula = (letra) => letra !== letra.toLowerCase() && letra === letra.toUpperCase();
const esMinuscula = (letra) => letra !== letra.toUpperCase() && letra === letra.toLowerCase();
const conMayuscula = (palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1);
const igualarMayuscula = (original, sugerencia) => (esMayuscula(original.charAt(0)) ? conMayuscula(sugerencia) : sugerencia);

// Saca links y emails: no se corrigen. Se reemplazan por "URL" para no dejar espacios dobles.
function sinUrls(texto) {
  return String(texto || "")
    .replace(/https?:\/\/\S+|\S+@\S+\.\S+|\b[\w-]+\.(com|ar|io|dev|net|org|app)(\/\S*)?/gi, "URL");
}

// ¿La posición está al principio de una oración? Inicio del texto, de una línea (con o sin viñeta)
// o después de . ! ? seguido de espacio. "Node.js" no corta la oración, ni "ej." u otras abreviaturas.
function inicioDeOracion(texto, indice) {
  const antes = texto.slice(0, indice);
  if (/^[\s\-•*¿¡"«(]*$/u.test(antes)) return true;
  if (/\n[ \t]*[-•*]?[ \t]*[¿¡"«(]*$/u.test(antes)) return true;
  const fin = antes.match(/(\p{L}*)[.!?][»")]*\s+[¿¡"«(]*$/u);
  return Boolean(fin) && !ABREVIATURAS.includes(fin[1].toLowerCase());
}

// Las primeras palabras de la oración, para mostrar dónde está el error.
function fragmento(texto, indice) {
  const oracion = texto.slice(indice).match(/^[^\n]*?([.!?](?=\s|$)|$)/u)[0];
  return oracion.split(/\s+/).slice(0, 4).join(" ");
}

/*
  Revisa un texto. Devuelve { errores: [strings], dudosas: [palabras] }.
  tipo: "prosa" (perfil, descripciones), "corto" (títulos, nombres, tecnologías) o "nombre" (nombre, ubicación).
  opciones.inicio: exige mayúscula al principio. opciones.puntoFinal: exige punto al final.
  opciones.diccionario = false: no se revisa contra el diccionario (empresas, instituciones, tecnologías).
  diccionario: el resultado de Diccionario.revisar() o null si no está disponible.
*/
function revisarTexto(textoOriginal, tipo, opciones = {}, diccionario = null) {
  const errores = new Set();
  const dudosas = new Set();
  const texto = sinUrls(textoOriginal);
  if (!texto.trim()) return { errores: [], dudosas: [] };
  const usarDiccionario = diccionario && diccionario.disponible && tipo !== "nombre" && opciones.diccionario !== false;

  // Palabra por palabra: errores frecuentes, tildes en -ción/-sión y minúsculas obligatorias.
  for (const m of texto.matchAll(/\p{L}+/gu)) {
    const palabra = m[0];
    const minuscula = palabra.toLowerCase();
    const normalizada = normalizar(palabra);

    if (tipo !== "nombre" && MINUSCULAS_NORMALIZADAS.has(normalizada) && esMayuscula(palabra.charAt(0)) && !inicioDeOracion(texto, m.index)) {
      errores.add(`«${palabra}» → «${MINUSCULAS_NORMALIZADAS.get(normalizada)}» (en español, meses, días e idiomas van en minúscula)`);
    } else if (ORTOGRAFIA.errores[minuscula]) {
      errores.add(`«${palabra}» → «${igualarMayuscula(palabra, ORTOGRAFIA.errores[minuscula])}»`);
    } else if (usarDiccionario && diccionario.incorrectas.has(palabra)) {
      // Con una corrección cercana es un error; sin ninguna, solo se marca para revisar.
      // Va antes que la regla de -ción: también corrige la letra ("aplicasion" → "aplicación").
      const sugerencias = diccionario.incorrectas.get(palabra);
      if (sugerencias.length === 1) errores.add(`«${palabra}» → «${sugerencias[0]}»`);
      else if (sugerencias.length > 1) errores.add(`«${palabra}» → ¿«${sugerencias.join("» o «")}»?`);
      else dudosas.add(palabra);
    } else if (/[cs]ion$/.test(minuscula) && !/ssion$/.test(minuscula) && minuscula.length > 4 && !ORTOGRAFIA.excepcionesIon.includes(minuscula)) {
      // Sin diccionario no se sabe si "-sion" era "-sión" o "-ción" ("aplicasion"): se muestran las dos.
      const conTilde = palabra.slice(0, -3) + palabra.slice(-3).replace(/[oO]/, (o) => (o === "o" ? "ó" : "Ó"));
      const conC = conTilde.slice(0, -4) + (conTilde[conTilde.length - 4] === "S" ? "C" : "c") + conTilde.slice(-3);
      errores.add(/cion$/.test(minuscula)
        ? `«${palabra}» → «${conTilde}» (lleva tilde)`
        : `«${palabra}» → ¿«${conTilde}» o «${conC}»? (lleva tilde)`);
    } else if (/[cs]iónes$/.test(minuscula)) {
      errores.add(`«${palabra}» → «${palabra.replace(/ó(?=nes$)/i, "o")}» (en plural no lleva tilde)`);
    }
  }

  // Nombres de tecnologías mal escritos: "javascript" → "JavaScript".
  for (const tecnologia of ORTOGRAFIA.tecnologias) {
    const escapada = tecnologia.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![\\p{L}\\p{N}.])${escapada}(?![\\p{L}\\p{N}])`, "giu");
    for (const m of texto.matchAll(regex)) {
      if (m[0] !== tecnologia) errores.add(`«${m[0]}» → «${tecnologia}»`);
    }
  }

  // Palabras enteras en mayúsculas (salvo siglas y tecnologías).
  const enMayusculas = [...texto.matchAll(/\p{L}[\p{L}\p{N}-]*/gu)]
    .map((m) => m[0])
    .filter((p) => {
      const base = p.replace(/\d+$/, "");
      const letras = base.replace(/[^\p{L}]/gu, "");
      return letras.length >= 4 && base === base.toUpperCase() && !SIGLAS.has(p) && !SIGLAS.has(base) && !TECNOLOGIAS_MINUSCULA.has(base.toLowerCase());
    });
  if (enMayusculas.length) errores.add(`Evitá escribir palabras enteras en mayúsculas: «${[...new Set(enMayusculas)].slice(0, 3).join("», «")}»`);

  // Nombres propios: cada palabra con mayúscula inicial.
  if (tipo === "nombre") {
    for (const m of texto.matchAll(/\p{L}+/gu)) {
      const palabra = m[0];
      if (esMinuscula(palabra.charAt(0)) && !ORTOGRAFIA.conectoresNombre.includes(palabra)) {
        errores.add(`«${palabra}» → «${conMayuscula(palabra)}» (los nombres propios van con mayúscula)`);
      }
    }
  }

  // Mayúscula al empezar cada oración (y cada línea).
  if (tipo === "prosa" || opciones.inicio) {
    for (const m of texto.matchAll(/\p{L}/gu)) {
      if (esMinuscula(m[0]) && inicioDeOracion(texto, m.index)) {
        errores.add(`Empezá con mayúscula: «${fragmento(texto, m.index)}…»`);
      }
      if (tipo !== "prosa") break; // en textos cortos solo importa la primera letra
    }
  }

  // Espacios.
  if (/ {2,}/.test(texto)) errores.add("Hay espacios dobles.");
  for (const m of texto.matchAll(/(\S+) +([,;:!?)]|\.(?![\p{L}\p{N}]))/gu)) {
    errores.add(`Sobra el espacio antes de «${m[2]}»: «${m[1]} ${m[2]}»`);
  }
  for (const m of texto.matchAll(/(\p{L}+)([,;])(\p{L}+)/gu)) {
    errores.add(`Falta un espacio después de «${m[2]}»: «${m[0]}»`);
  }
  for (const m of texto.matchAll(/(\p{Ll}{2,})\.(\p{Lu}\p{Ll}{2,})/gu)) {
    errores.add(`Falta un espacio después del punto: «${m[0]}»`);
  }

  // Signos repetidos, signos de apertura y paréntesis.
  for (const m of texto.matchAll(/([!?¡¿,;:])\1+|(?<!\.)\.\.(?!\.)/g)) {
    errores.add(`Signo repetido: «${m[0]}»`);
  }
  for (const [abre, cierra] of [["¿", "?"], ["¡", "!"]]) {
    let abierto = false;
    let anterior = "";
    for (const caracter of texto) {
      if (caracter === abre) abierto = true;
      else if (caracter === cierra && anterior !== cierra) {  // "!!" ya se marca como signo repetido
        if (!abierto) errores.add(`Falta el signo de apertura «${abre}» (en español se abre y se cierra).`);
        abierto = false;
      } else if (caracter === "\n") abierto = false;
      anterior = caracter;
    }
  }
  const abiertos = (texto.match(/\(/g) || []).length;
  const cerrados = (texto.match(/\)/g) || []).length;
  if (abiertos > cerrados) errores.add("Hay un paréntesis sin cerrar.");
  if (cerrados > abiertos) errores.add("Sobra un paréntesis de cierre.");

  if (opciones.puntoFinal && !/[.!?…)]$/.test(texto.trim())) errores.add("Terminá el texto con un punto.");

  return { errores: [...errores], dudosas: [...dudosas] };
}

// Todos los textos del CV que se revisan, agrupados por sección del semáforo.
function camposParaRevisar(cv) {
  const campos = { perfil: [], experiencia: [], habilidades: [], proyectos: [] };
  const agregar = (seccion, lugar, texto, tipo, opciones) => campos[seccion].push({ lugar, texto, tipo, opciones });

  agregar("perfil", "Nombre", cv.datos.nombre, "nombre");
  agregar("perfil", "Título", cv.datos.titulo, "corto", { inicio: true });
  agregar("perfil", "Ubicación", cv.datos.ubicacion, "nombre");
  agregar("perfil", "Perfil", cv.perfil, "prosa", { puntoFinal: true });

  cv.experiencias.forEach((e, i) => {
    agregar("experiencia", `Experiencia ${i + 1} · puesto`, e.puesto, "corto", { inicio: true });
    agregar("experiencia", `Experiencia ${i + 1} · empresa`, e.empresa, "corto", { diccionario: false });
    agregar("experiencia", `Experiencia ${i + 1} · descripción`, e.descripcion, "prosa");
  });
  cv.educacion.forEach((e, i) => {
    agregar("experiencia", `Educación ${i + 1} · título`, e.titulo, "corto", { inicio: true });
    agregar("experiencia", `Educación ${i + 1} · institución`, e.institucion, "corto", { diccionario: false });
  });

  agregar("habilidades", "Otras habilidades", cv.otrasHabilidades, "corto");

  cv.proyectos.forEach((p, i) => {
    agregar("proyectos", `Proyecto ${i + 1} · nombre`, p.nombre, "corto", { diccionario: false });
    agregar("proyectos", `Proyecto ${i + 1} · tecnologías`, p.tecnologias, "corto", { diccionario: false });
    agregar("proyectos", `Proyecto ${i + 1} · descripción`, p.descripcion, "prosa");
  });
  return campos;
}

// C5: cada sección tiene sus puntos; 1 error resta la mitad y 2 o más, todo.
// Las palabras dudosas (no están en el diccionario y no tienen corrección cercana) no restan.
function evaluarOrtografia(regla, cv, diccionario) {
  const campos = camposParaRevisar(cv);
  return Object.keys(campos).map((seccion) => {
    const detalles = [];
    const dudosas = [];
    campos[seccion].forEach((campo) => {
      const revision = revisarTexto(campo.texto, campo.tipo, campo.opciones, diccionario);
      revision.errores.forEach((error) => detalles.push(`${campo.lugar}: ${error}`));
      revision.dudosas.forEach((palabra) => dudosas.push({ lugar: campo.lugar, palabra }));
    });
    const obtenidos = detalles.length === 0 ? regla.puntosPorSeccion : detalles.length === 1 ? regla.puntosPorSeccion / 2 : 0;
    return { seccion, obtenidos, detalles, dudosas };
  });
}

// ---------- Diccionario Hunspell (en un Web Worker, ver js/ortografia-worker.js) ----------

// Palabras bien escritas que el diccionario no trae: la lista blanca, las tecnologías,
// las habilidades y las palabras clave de las reglas. Se comparan sin tildes ni mayúsculas.
const PERMITIDAS = new Set(
  [
    ...ORTOGRAFIA.permitidas,
    ...ORTOGRAFIA.tecnologias,
    ...ORTOGRAFIA.siglas,
    ...Object.values(HABILIDADES).flat(),
    ...Object.values(REGLAS_AREA).flat().flatMap((regla) => regla.palabras || regla.grupos.flat()),
    ...Object.values(REGLAS_COMUNES.find((regla) => regla.id === "C2").nombresArea).flat()
  ].flatMap((texto) => normalizar(texto).split(/[^\p{L}]+/u)).filter(Boolean)
);

// Palabras del CV que hay que mandar al diccionario. Se saltean las cortas, las que tienen
// mayúsculas en el medio (siglas, "GitHub"), los nombres propios (mayúscula a mitad de oración),
// la lista blanca y las que ya revisan las otras reglas.
function palabrasParaDiccionario(cv) {
  const palabras = new Set();
  Object.values(camposParaRevisar(cv)).flat().forEach((campo) => {
    if (campo.tipo === "nombre" || (campo.opciones && campo.opciones.diccionario === false)) return;
    const texto = sinUrls(campo.texto);
    for (const m of texto.matchAll(/\p{L}+/gu)) {
      const palabra = m[0];
      const minuscula = palabra.toLowerCase();
      if (palabra.length < 3 || /\p{Lu}/u.test(palabra.slice(1))) continue;
      if (esMayuscula(palabra.charAt(0)) && !inicioDeOracion(texto, m.index)) continue;
      if (PERMITIDAS.has(normalizar(palabra)) || ORTOGRAFIA.errores[minuscula] || MINUSCULAS_NORMALIZADAS.has(normalizar(palabra))) continue;
      palabras.add(palabra);
    }
  });
  return [...palabras];
}

const Diccionario = {
  worker: null,
  pendientes: new Map(),
  ultimoId: 0,

  // Arranca el worker y la carga del diccionario en segundo plano (se llama al abrir el formulario).
  iniciar() {
    if (this.worker || typeof Worker === "undefined") return;
    try {
      this.worker = new Worker("js/ortografia-worker.js");
    } catch (error) {
      return; // por ejemplo, abriendo index.html como archivo: se sigue sin diccionario
    }
    this.worker.onmessage = (evento) => {
      const resolver = this.pendientes.get(evento.data.id);
      if (resolver) resolver(evento.data);
    };
    this.worker.onerror = () => {
      this.pendientes.forEach((resolver) => resolver({ error: "worker" }));
      this.pendientes.clear();
    };
    this.consultar([]); // la primera consulta dispara la carga
  },

  consultar(palabras, espera = 10000) {
    return new Promise((resolver) => {
      if (!this.worker) return resolver({ error: "sin worker" });
      const id = ++this.ultimoId;
      const plazo = setTimeout(() => terminar({ error: "tiempo" }), espera);
      const terminar = (datos) => {
        clearTimeout(plazo);
        this.pendientes.delete(id);
        resolver(datos);
      };
      this.pendientes.set(id, terminar);
      this.worker.postMessage({ id, palabras });
    });
  },

  // Devuelve { disponible, incorrectas: Map(palabra → [sugerencias]) }.
  async revisar(cv) {
    this.iniciar();
    const respuesta = await this.consultar(palabrasParaDiccionario(cv));
    if (respuesta.error) return { disponible: false, incorrectas: new Map() };
    const incorrectas = respuesta.resultados.filter((r) => !r.correcta).map((r) => [r.palabra, r.sugerencias]);
    return { disponible: true, incorrectas: new Map(incorrectas) };
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

// diccionario: el resultado de Diccionario.revisar(cv), o null para criticar sin diccionario.
function criticar(cv, diccionario = null) {
  const textos = textosDelCv(cv);
  const secciones = {};
  for (const clave in SECCIONES) {
    secciones[clave] = { obtenidos: 0, posibles: 0, porcentaje: 0 };
  }

  const evaluadas = [
    ...REGLAS_COMUNES.filter((regla) => LOGICA_COMUN[regla.id]).map((regla) => ({ regla, ...LOGICA_COMUN[regla.id](regla, cv) })),
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

  // C5 reparte sus puntos entre las secciones: una mejora por cada sección con errores.
  const reglaOrtografia = REGLAS_COMUNES.find((regla) => regla.id === "C5");
  const dudosas = [];
  evaluarOrtografia(reglaOrtografia, cv, diccionario).forEach(({ seccion, obtenidos, detalles, dudosas: dudosasSeccion }) => {
    dudosas.push(...dudosasSeccion);
    puntaje += obtenidos;
    secciones[seccion].obtenidos += obtenidos;
    secciones[seccion].posibles += reglaOrtografia.puntosPorSeccion;

    if (detalles.length) {
      mejoras.push({
        id: `C5-${seccion}`,
        seccion,
        mensaje: reglaOrtografia.mensaje.replace("{seccion}", SECCIONES[seccion].toLowerCase()),
        perdidos: reglaOrtografia.puntosPorSeccion - obtenidos,
        pista: detalles.length === 1 ? "1 error." : `${detalles.length} errores.`,
        detalles
      });
    }
  });

  for (const clave in secciones) {
    const s = secciones[clave];
    s.porcentaje = s.posibles ? Math.round((s.obtenidos / s.posibles) * 100) : 0;
  }

  // De mayor a menor por puntos perdidos; si empatan, queda el orden de las reglas.
  mejoras.sort((a, b) => b.perdidos - a.perdidos);

  return {
    puntaje: Math.round(puntaje),
    secciones,
    mejoras,
    dudosas,
    diccionario: diccionario ? (diccionario.disponible ? "completo" : "no-disponible") : "sin-diccionario"
  };
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
            ${m.detalles ? `<ul class="mejora__detalles">${m.detalles.map((d) => `<li>${escapar(d)}</li>`).join("")}</ul>` : ""}
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
    ${listaMejoras}
    ${resultado.dudosas && resultado.dudosas.length ? `
      <h3>Palabras para revisar</h3>
      <p class="mejora__pista">No están en el diccionario y no encontramos una corrección parecida. Si están bien escritas (un nombre, un término técnico), ignoralas: no restan puntos.</p>
      <ul class="mejora__detalles">${resultado.dudosas.map((d) => `<li>${escapar(d.lugar)}: «${escapar(d.palabra)}»</li>`).join("")}</ul>` : ""}
    ${resultado.diccionario === "no-disponible" ? `<p class="mejora__pista">No se pudo cargar el diccionario: la ortografía se revisó solo con la lista de errores frecuentes.</p>` : ""}`;
}
