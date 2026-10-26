// Web Worker de ortografía: carga el diccionario Hunspell de español y revisa palabras
// sin trabar la página. Lo usa critica.js (Diccionario). Ver docs/specs.md (C5).
//
// Mensaje que recibe: { id, palabras: ["desarollo", ...] }
// Mensaje que devuelve: { id, resultados: [{ palabra, correcta, sugerencias: [...] }] } o { id, error }

importScripts("vendor/nspell.min.js");

let corrector = null;

const listo = Promise.all(
  ["../assets/diccionario/es-aff.txt", "../assets/diccionario/es-dic.txt"].map((url) =>
    fetch(url).then((respuesta) => {
      if (!respuesta.ok) throw new Error(`No se pudo cargar ${url} (${respuesta.status})`);
      return respuesta.text();
    })
  )
).then(([aff, dic]) => {
  corrector = nspell(aff, dic);
});

const TILDES = { a: "á", e: "é", i: "í", o: "ó", u: "ú", n: "ñ" };

// Confusiones típicas del español: se prueban de a una.
const CONFUSIONES = [
  ["z", "c"], ["c", "z"], ["s", "c"], ["c", "s"], ["s", "z"], ["z", "s"], ["b", "v"], ["v", "b"],
  ["y", "ll"], ["ll", "y"], ["g", "j"], ["j", "g"], ["rr", "r"], ["r", "rr"], ["cc", "c"], ["c", "cc"],
  ["x", "s"], ["s", "x"], ["ll", "l"], ["l", "ll"], ["nn", "n"], ["mn", "m"], ["k", "c"], ["qu", "c"]
];

// Prefijos que el diccionario no siempre combina: "rediseñé", "autogestionado", "microservicio".
const PREFIJOS = ["re", "des", "auto", "micro", "multi", "sub", "co", "inter", "pre", "sobre", "semi", "mini",
  "super", "anti", "pos", "post", "ciber", "bio", "geo", "tele", "infra", "meta", "hiper"];

function esCorrecta(palabra) {
  const minuscula = palabra.toLowerCase();
  if (corrector.correct(palabra) || corrector.correct(minuscula)) return true;
  return PREFIJOS.some((prefijo) =>
    minuscula.startsWith(prefijo) && minuscula.length - prefijo.length >= 4 && corrector.correct(minuscula.slice(prefijo.length))
  );
}

// Distancia de edición (Levenshtein) sin tener en cuenta tildes ni mayúsculas.
function distancia(a, b) {
  const limpiar = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  a = limpiar(a); b = limpiar(b);
  const fila = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let anterior = fila[0];
    fila[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const guardado = fila[j];
      fila[j] = Math.min(fila[j] + 1, fila[j - 1] + 1, anterior + (a[i - 1] === b[j - 1] ? 0 : 1));
      anterior = guardado;
    }
  }
  return fila[b.length];
}

// Variantes con un solo cambio, en orden de prioridad.
function* candidatos(palabra) {
  // 1. Una tilde (o ñ) que falta: "habia" → "había", "diseno" → "diseño".
  for (let i = 0; i < palabra.length; i++) {
    const conTilde = TILDES[palabra[i]];
    if (conTilde) yield palabra.slice(0, i) + conTilde + palabra.slice(i + 1);
  }
  // 2. Confusiones de letras: "hize" → "hice", "aprendisaje" → "aprendizaje".
  for (const [de, a] of CONFUSIONES) {
    for (let i = palabra.indexOf(de); i !== -1; i = palabra.indexOf(de, i + 1)) {
      const cambiada = palabra.slice(0, i) + a + palabra.slice(i + de.length);
      yield cambiada;
      for (let k = 0; k < cambiada.length; k++) {  // con una tilde además: "tecnologia" → "tecnología"
        const conTilde = TILDES[cambiada[k]];
        if (conTilde) yield cambiada.slice(0, k) + conTilde + cambiada.slice(k + 1);
      }
    }
  }
  // 3. Una "h" de más o de menos: "acer" → "hacer", "ahora" queda igual.
  if (!palabra.startsWith("h")) yield "h" + palabra;
  for (let i = palabra.indexOf("h"); i !== -1; i = palabra.indexOf("h", i + 1)) {
    yield palabra.slice(0, i) + palabra.slice(i + 1);
  }
  // 4. Una letra repetida de más: "desarrolllo" → "desarrollo".
  for (let i = 1; i < palabra.length; i++) {
    if (palabra[i] === palabra[i - 1]) yield palabra.slice(0, i) + palabra.slice(i + 1);
  }
}

// Devuelve las correcciones posibles: una sola si es un error típico (tilde, letra confundida…);
// hasta 3 si Hunspell encuentra varias a un cambio de distancia; [] si no hay ninguna cercana.
function buscarSugerencias(original) {
  const palabra = original.toLowerCase();
  let sugerencias = [];

  for (const candidato of candidatos(palabra)) {
    if (candidato !== palabra && esCorrecta(candidato)) { sugerencias = [candidato]; break; }
  }
  if (!sugerencias.length && palabra.length <= 15) {
    sugerencias = corrector.suggest(palabra)
      .filter((s) => distancia(s, palabra) <= 1 && s.toLowerCase() !== palabra)
      .slice(0, 3);
  }
  // Respeta la mayúscula inicial del original.
  const mayuscula = original[0] !== original[0].toLowerCase();
  return sugerencias.map((s) => (mayuscula ? s[0].toUpperCase() + s.slice(1) : s));
}

onmessage = async (evento) => {
  const { id, palabras } = evento.data;
  try {
    await listo;
    const resultados = palabras.map((palabra) => {
      const correcta = esCorrecta(palabra);
      return { palabra, correcta, sugerencias: correcta ? [] : buscarSugerencias(palabra) };
    });
    postMessage({ id, resultados });
  } catch (error) {
    postMessage({ id, error: String(error && error.message || error) });
  }
};
