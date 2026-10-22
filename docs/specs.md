# Match Dev — Especificaciones del Proyecto

> Versión 1 (MVP). Entrega: lunes 26/10/2026.
> Última actualización: 22/10/2026 (se agregó la regla C5 de ortografía; las reglas comunes pasan a 8 puntos).
> Antes: 20/10/2026 (reglas por área, objeto `cv`, estilo visual, RNF02 y criterios de aceptación).

## 1. Descripción general

Match Dev es un crítico de CV según el área a la que te postulás. El usuario elige el área (Backend, Frontend, Data o UX/UI), carga su CV en un formulario por secciones y, al apretar "Criticar mi CV", recibe un puntaje de 0 a 100, un semáforo por sección y una lista de mejoras con lo que le falta para ese puesto. También puede descargar su CV en PDF.

Es una landing page interactiva hecha con HTML, CSS y JavaScript puro, publicada en GitHub Pages.

### Problema

Los Juniors mandan el mismo CV genérico a cualquier puesto y no saben qué le falta para el área a la que se postulan, así que los descartan sin feedback.

### Público objetivo

Perfiles Trainee/Junior que buscan su primer trabajo en Backend, Frontend, Data o UX/UI.

### Recorrido del usuario

1. Landing: qué es Match Dev y botón "Empezar".
2. Elegir el área: Backend, Frontend, Data o UX/UI.
3. Completar el CV por secciones (Datos + Perfil, Experiencia + Educación, Habilidades, Proyectos + Links). Mientras tanto se ve la vista previa.
4. Apretar "Criticar mi CV".
5. Ver el resultado en un panel al lado de la vista previa (en celular, debajo): puntaje 0–100, semáforo por sección y lista de mejoras.
6. Corregir el CV y volver a criticar, probar con otra área, o descargar el CV en PDF.

## 2. Objetivos

- Que el usuario sepa qué mejorar en su CV para el área elegida.
- Que se lleve su CV en PDF, listo para mandar.

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF01 | Completar el CV por secciones: Datos + Perfil, Experiencia + Educación, Habilidades, Proyectos + Links. Los campos son obligatorios salvo las excepciones de [Datos del CV](#datos-del-cv). | Alta |
| RF02 | Elegir el área de postulación (Backend, Frontend, Data, UX/UI) al principio del recorrido. | Alta |
| RF03 | Criticar el CV según las reglas comunes y las reglas del área elegida, al apretar "Criticar mi CV". | Alta |
| RF04 | Mostrar el puntaje de 0 a 100. | Alta |
| RF05 | Mostrar el semáforo por sección. | Alta |
| RF06 | Mostrar la lista de mejoras ordenada por puntos perdidos, de mayor a menor. | Alta |
| RF07 | Validar los campos obligatorios: si hay campos vacíos, no se critica; se muestra un mensaje, se marcan en rojo los campos vacíos y se lleva al primero. | Alta |
| RF08 | Descargar el CV en PDF (solo el CV, sin la crítica), usando la impresión del navegador. | Media |
| RF09 | Guardar el CV automáticamente en localStorage cada vez que cambia un campo. | Alta |
| RF10 | Cambiar el idioma (español / inglés) de la página, el CV y la crítica. | Baja (v2) |

### Habilidades

- Se cargan de forma mixta: una lista para elegir con las tecnologías del área y un campo "Otras" en texto libre.
- Lo que se escribe en "Otras" aparece en el CV pero no suma puntos.

### Cambiar de área

- En el resultado hay un botón "Probar con otra área" que recalcula la crítica con el mismo CV.

### Motor de crítica

- El puntaje total es 100: **40 puntos** de reglas comunes y **60 puntos** de reglas del área.
- Cada regla pertenece a una sección del CV (Datos + Perfil, Experiencia + Educación, Habilidades, Proyectos + Links).
- **Mejoras:** cada regla que no se cumple, o se cumple a medias, agrega una mejora a la lista con los puntos que se perdieron.

#### Detección de palabras clave

- Antes de comparar, los textos se pasan a minúsculas y se les sacan los acentos (`toLowerCase()` + `normalize("NFD")`).
- Las palabras se buscan como **palabra completa**, no con `includes()` a secas, para evitar falsos positivos: `java` no tiene que coincidir con `javascript`, ni `api` con `capital`. Se usa una función `contiene(texto, palabra)` con una expresión regular que exige que antes y después de la palabra no haya una letra o número.
- **Dónde se busca:** en la lista de habilidades elegidas y en los textos de proyectos (descripción + tecnologías) y experiencia (descripción). "Otras habilidades" no se revisa.
- Las palabras clave de `reglas.js` se escriben en minúsculas y sin acentos.
- **Puntaje de cada regla de área** (alcanza con que aparezca una de sus palabras clave):
  - Aparece en habilidades **y** en proyectos/experiencia → 100 % de los puntos.
  - Aparece en uno solo de los dos → 50 % de los puntos (redondeado hacia abajo).
  - No aparece → 0 puntos.
- Si la regla se cumple a medias, la mejora agrega una pista: "Ya lo tenés en tus habilidades; mostralo también en un proyecto" (o al revés).
- La columna "Sección" de cada regla indica en qué semáforo cuenta, no dónde se busca.

#### Semáforo por sección

- Puntaje de la sección = puntos obtenidos ÷ puntos posibles de las reglas de esa sección × 100.
- Rojo menos de 50, amarillo de 50 a 79, verde 80 o más.
- El semáforo muestra color **y** texto ("Bajo", "Medio", "Bien"), para no depender solo del color.

#### Reglas comunes (40 puntos: 5 reglas de 8)

| # | Sección | Qué revisa | Puntos | Mensaje si falla |
| --- | --- | --- | --- | --- |
| C1 | Proyectos + Links | Hay un link a GitHub, GitLab, Behance, Dribbble o un portfolio (una URL que empiece con `http`). | 8 | "Sumá un link a tu GitHub o portfolio: es lo primero que mira quien te entrevista." |
| C2 | Datos + Perfil | El perfil tiene al menos 40 palabras (4 pts) y menciona el área o una tecnología de la lista del área (4 pts). | 8 | "Tu perfil es muy corto o genérico: contá en 3 o 4 líneas qué hacés y qué buscás en {área}." |
| C3 | Proyectos + Links | Cada proyecto tiene un link válido y al menos 2 tecnologías. Puntos proporcionales a los proyectos que cumplen. | 8 | "Agregá a cada proyecto el link y las tecnologías que usaste." |
| C4 | Experiencia + Educación | Las descripciones de experiencia y proyectos muestran resultados: un número, un `%` o un verbo de logro (logré, reduje, aumenté, mejoré, optimicé, automaticé). 8 pts si la mitad o más lo cumple, 4 pts si al menos una. | 8 | "Contá resultados, no solo tareas: por ejemplo, 'reduje el tiempo de carga un 30 %'." |
| C5 | Las 4 secciones (2 pts cada una) | Ortografía, mayúsculas y puntuación (detalle abajo). En cada sección: sin errores 2 pts, 1 error 1 pt, 2 o más 0 pts. | 8 | "Revisá la ortografía y la puntuación en {sección}: un CV con errores se descarta rápido." + la lista de errores con su corrección. |

#### C5: ortografía, mayúsculas y puntuación

Es un crítico de CV: no puede dejar pasar faltas de ortografía. Como el sitio no tiene servidor ni API, no hay un diccionario completo de español (pesaría varios MB); se detectan los errores más comunes con reglas en JavaScript. Los datos están en `ORTOGRAFIA` (`reglas.js`).

- **Qué se revisa:** nombre, título, ubicación, perfil, puesto, empresa y descripción de cada experiencia, título e institución de cada estudio, "Otras habilidades" y nombre, tecnologías y descripción de cada proyecto. Los links y emails se ignoran.
- **Ortografía:** lista de errores frecuentes en CVs ("desarollo" → "desarrollo", "codigo" → "código"…), palabras terminadas en "-cion"/"-sion" sin tilde ("programacion" → "programación") y plurales con tilde de más ("aplicaciónes"). Se dejaron afuera los verbos que sin tilde también son válidos ("critica", "practico", "publico").
- **Mayúsculas:** oración o línea que empieza en minúscula (perfil, descripciones, título, puesto y título de estudio); palabras enteras en mayúsculas, salvo siglas (UTN, HTML5…); tecnologías mal escritas ("javascript" → "JavaScript", "github" → "GitHub"); meses, días e idiomas en mayúscula en medio de una oración ("Nivel de Inglés" → "inglés"); nombre y ubicación sin mayúscula inicial.
- **Puntuación y espacios:** espacios dobles; espacio antes de `,` `.` `;` `:`; falta de espacio después de `,` `;` o del punto ("carga.Busco"); signos repetidos ("!!", ",,"); falta de "¿" o "¡"; paréntesis sin cerrar; perfil sin punto final.
- **Mejoras:** una por sección con errores, con la lista de cada error, dónde está y cómo corregirlo (por ejemplo, "Proyecto 1 · tecnologías: «javascript» → «JavaScript»").
- **Límite:** no detecta palabras mal escritas que no estén en la lista ni errores de concordancia o de tildes diacríticas (tú/tu, más/mas, sí/si).

#### Reglas por área (60 puntos)

Salen de 4 avisos Junior reales por área, publicados en Computrabajo y LinkedIn y consultados el 20/10/2026 (ver [Anexo: fuentes](#anexo-fuentes-de-las-reglas-por-área)). Cada regla lleva entre paréntesis en cuántos de los 4 avisos aparece.

**Backend**

| # | Sección | Qué revisa | Palabras clave | Puntos | Mensaje si falla |
| --- | --- | --- | --- | --- | --- |
| B1 | Habilidades | Un lenguaje de backend (4/4) | node.js, node, python, java, c#, .net, php, go, golang, ruby, kotlin | 15 | "Para Backend se espera que manejes al menos un lenguaje de servidor (Node.js, Python, Java, C#…)." |
| B2 | Habilidades | Una base de datos (4/4) | sql, postgresql, mysql, sql server, mongodb, sqlite, oracle | 15 | "Para Backend se espera que manejes al menos una base de datos." |
| B3 | Proyectos + Links | Desarrolló o consumió APIs (2/4) | api, apis, rest, express, fastapi, django, flask, spring, asp.net, endpoint | 10 | "Mostrá un proyecto donde hayas armado una API REST." |
| B4 | Habilidades | Control de versiones (3/4) | git, github, gitlab | 10 | "Agregá Git: casi todos los avisos lo piden." |
| B5 | Habilidades | Linux, Docker o cloud (3/4) | linux, docker, aws, azure, gcp, railway, render | 10 | "Sumá algo de Linux, Docker o deploy en la nube; los avisos lo valoran." |

**Frontend**

| # | Sección | Qué revisa | Palabras clave | Puntos | Mensaje si falla |
| --- | --- | --- | --- | --- | --- |
| F1 | Habilidades | HTML, CSS y JavaScript, las tres (3/4) | html, css, javascript, js | 15 | "Para Frontend se espera que manejes HTML, CSS y JavaScript." |
| F2 | Habilidades | Un framework moderno (3/4) | react, angular, vue, next.js, svelte, typescript | 15 | "Aprendé y mostrá un framework (React, Angular o Vue): lo piden casi todos los avisos." |
| F3 | Proyectos + Links | Hizo diseño responsive (3/4) | responsive, mobile first, media queries, adaptable | 10 | "Contá en tus proyectos que son responsive (se adaptan a celular)." |
| F4 | Proyectos + Links | Consume APIs (3/4) | api, apis, fetch, axios, rest, json | 10 | "Mostrá un proyecto que consuma una API." |
| F5 | Habilidades | Control de versiones (2/4) | git, github, gitlab | 10 | "Agregá Git: es básico para trabajar en equipo." |

F1 es la excepción: da 5 puntos por cada una de las tres tecnologías que aparezca en cualquiera de los dos lugares (`js` cuenta como JavaScript).

**Data**

| # | Sección | Qué revisa | Palabras clave | Puntos | Mensaje si falla |
| --- | --- | --- | --- | --- | --- |
| D1 | Habilidades | SQL (3/4) | sql, postgresql, mysql, sql server, bigquery | 20 | "Para Data, SQL es excluyente en casi todos los avisos." |
| D2 | Habilidades | Una herramienta de visualización (4/4) | power bi, tableau, looker, looker studio, qlik | 15 | "Sumá Power BI, Tableau o Looker: casi todos los avisos piden una." |
| D3 | Habilidades | Excel (2/4) | excel, google sheets, power query | 10 | "Agregá Excel; en Data Junior lo piden casi siempre." |
| D4 | Proyectos + Links | Armó dashboards o reportes (4/4) | dashboard, dashboards, tablero, tableros, reporte, reportes, kpi, kpis | 10 | "Mostrá un proyecto con un dashboard o reporte y qué conclusión sacaste." |
| D5 | Habilidades | Python para datos (1/4, valorado) | python, pandas, numpy, jupyter | 5 | "Python con pandas suma puntos para Data." |

**UX/UI**

| # | Sección | Qué revisa | Palabras clave | Puntos | Mensaje si falla |
| --- | --- | --- | --- | --- | --- |
| U1 | Habilidades | Figma u otra herramienta de prototipado (3/4) | figma, adobe xd, sketch, penpot | 15 | "Para UX/UI se espera que manejes Figma." |
| U2 | Proyectos + Links | Hizo wireframes, flujos o prototipos (3/4) | wireframe, wireframes, prototipo, prototipos, mockup, mockups, user flow, flujo de usuario | 15 | "Contá en tus proyectos el proceso: wireframes, flujos y prototipos." |
| U3 | Proyectos + Links | Investigó o testeó con usuarios (4/4) | research, investigacion, entrevistas, encuestas, usabilidad, test de usuario, user testing | 10 | "Mostrá cómo validaste tu diseño con usuarios (entrevistas, tests de usabilidad)." |
| U4 | Habilidades | Design systems o componentes (2/4) | design system, sistema de diseno, componentes, guia de estilos, style guide | 10 | "Mencioná si trabajaste con un design system o componentes." |
| U5 | Habilidades | Accesibilidad (2/4) | accesibilidad, accessibility, wcag, a11y | 5 | "Sumá nociones de accesibilidad: varios avisos las piden." |
| U6 | Habilidades | HTML y CSS básicos (1/4, valorado) | html, css | 5 | "Saber HTML/CSS básico te ayuda a trabajar con developers." |

#### Lista de habilidades por área

Es la lista para elegir en el formulario. Sale de las palabras clave de las reglas:

| Área | Habilidades para elegir |
| --- | --- |
| Backend | Node.js, Python, Java, C#, .NET, PHP, Go, SQL, PostgreSQL, MySQL, MongoDB, Express, Django, Spring, APIs REST, Git, GitHub, Linux, Docker, AWS |
| Frontend | HTML, CSS, JavaScript, TypeScript, React, Angular, Vue, Next.js, Sass, Tailwind, Responsive, APIs REST, Git, GitHub, Figma |
| Data | SQL, PostgreSQL, BigQuery, Excel, Google Sheets, Power Query, Power BI, Tableau, Looker Studio, Python, Pandas, NumPy, Jupyter, Estadística, Git |
| UX/UI | Figma, Adobe XD, Penpot, Wireframes, Prototipos, User Research, Tests de usabilidad, Design System, Accesibilidad, HTML, CSS, Illustrator, Photoshop |

Si el usuario cambia de área, las habilidades que ya eligió se mantienen en el CV aunque no estén en la lista de la nueva área.

### Datos del CV

El formulario le entrega a la crítica los datos del CV en un objeto `cv`. Es el mismo objeto que se guarda en localStorage con la clave `matchdev-cv` (como JSON).

```js
const cv = {
  area: "backend",            // "backend" | "frontend" | "data" | "uxui"
  datos: {
    nombre: "",
    titulo: "",               // ej. "Desarrollador Backend Junior"
    email: "",
    telefono: "",
    ubicacion: ""             // ej. "Córdoba, Argentina"
  },
  perfil: "",
  experiencias: [
    { puesto: "", empresa: "", desde: "", hasta: "", descripcion: "" }
  ],
  educacion: [
    { titulo: "", institucion: "", desde: "", hasta: "" }
  ],
  habilidades: [],            // nombres elegidos de la lista del área, ej. ["Node.js", "Git"]
  otrasHabilidades: "",       // texto libre; aparece en el CV pero no suma puntos
  proyectos: [
    { nombre: "", descripcion: "", tecnologias: "", link: "" }  // tecnologias separadas por coma
  ],
  links: {
    github: "",
    linkedin: "",
    portfolio: ""
  }
};
```

- Fechas: texto con formato `AAAA-MM` (el valor de un `<input type="month">`). `hasta` vacío significa "Actualidad".
- `experiencias`, `educacion` y `proyectos` son listas: el formulario permite agregar y quitar ítems. Tiene que haber al menos uno de cada uno.
- Campos obligatorios (RF01 y RF07): todos, salvo `datos.telefono`, `otrasHabilidades`, `hasta` y los links de `linkedin` y `portfolio`. De `links` se pide al menos uno (`github` o `portfolio`).
- **Sin experiencia laboral:** un Trainee puede no tener experiencia. Hay una casilla "Todavía no tengo experiencia laboral" que deja `experiencias` vacía y saltea su validación. La regla C4 se calcula entonces solo con los proyectos.

## 4. Requerimientos no funcionales

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RNF01 | Diseño responsive: tiene que verse bien desde 360 px de ancho. | Alta |
| RNF02 | Accesibilidad, rendimiento y compatibilidad (detalle abajo). | Media |

### RNF02 en detalle

**Accesibilidad**

- Cada campo tiene su `<label>` asociado; los mensajes de error se vinculan con `aria-describedby`.
- Todo se puede usar con teclado (Tab, Enter, Espacio) y el foco se ve siempre (`:focus-visible` con el color de acento).
- Contraste mínimo 4.5:1 para texto (WCAG AA).
- El semáforo no depende solo del color: muestra también el texto "Bajo / Medio / Bien".
- El panel de resultado usa `aria-live="polite"` para que un lector de pantalla anuncie el puntaje.
- `<html lang="es">` y HTML semántico (`header`, `main`, `section`, `form`, `fieldset`).

**Rendimiento**

- Lighthouse en celular: 90 o más en Rendimiento y en Accesibilidad.
- Sin librerías externas; la única dependencia es la fuente Inter de Google Fonts, con `display=swap`.
- Peso total de la página menor a 500 KB (sin contar el mockup en `assets/`).

**Compatibilidad**

- Últimas 2 versiones de Chrome, Edge, Firefox y Safari, en escritorio y en celular.
- Si localStorage no está disponible (modo privado, bloqueado), la página funciona igual pero no guarda: el acceso va dentro de `try/catch`.

### Estilo visual

Claro y limpio, con fondo blanco, un color de acento y mucho espacio. Los colores van como variables CSS en `:root`.

| Uso | Variable | Color |
| --- | --- | --- |
| Acento (botones, links, foco) | `--color-acento` | `#4F46E5` (índigo) |
| Acento al pasar el mouse | `--color-acento-hover` | `#4338CA` |
| Acento suave (fondos) | `--color-acento-suave` | `#EEF2FF` |
| Texto principal | `--color-texto` | `#111827` |
| Texto secundario | `--color-texto-suave` | `#4B5563` |
| Bordes | `--color-borde` | `#E5E7EB` |
| Fondo | `--color-fondo` | `#FFFFFF` |
| Fondo de tarjetas y paneles | `--color-superficie` | `#F9FAFB` |
| Semáforo rojo (fondo / texto) | `--rojo-fondo` / `--rojo-texto` | `#FEE2E2` / `#991B1B` |
| Semáforo amarillo (fondo / texto) | `--amarillo-fondo` / `--amarillo-texto` | `#FEF3C7` / `#92400E` |
| Semáforo verde (fondo / texto) | `--verde-fondo` / `--verde-texto` | `#DCFCE7` / `#166534` |
| Error en campos | `--color-error` | `#DC2626` |

- **Tipografía:** Inter (Google Fonts), pesos 400, 500, 600 y 700. Si no carga, `system-ui, sans-serif`.
- Tamaño base 16 px; títulos 32 / 24 / 20 px; interlineado 1.5.
- El índigo no se confunde con los colores del semáforo, y el texto blanco sobre `#4F46E5` cumple contraste AA.

## 5. Alcance

### MVP (v1)

- Formulario de CV por secciones con vista previa.
- Selector de área: Backend, Frontend, Data, UX/UI.
- Botón "Criticar mi CV" que aplica las reglas del área elegida.
- Resultado con puntaje 0–100, semáforo por sección y lista de mejoras.
- Descargar el CV en PDF.
- Diseño responsive.
- Guardado automático en localStorage.

### Extras posibles (v2)

Si sobra tiempo, se hace primero el tono elegible.

- Tono elegible: crítico amable o sin filtro.
- Crítica en vivo mientras se escribe.
- Comparación "lo que tenés vs. lo que falta" para el área.
- Niveles Trainee / Junior / Semi Senior.
- Más áreas (QA, DevOps, Mobile).
- Bilingüe: página, CV y crítica en español e inglés. Los textos del MVP van en un objeto de JS para facilitar la traducción.

### Fuera del alcance

- IA real por API, porque expone la API key.
- Subir o leer un CV en PDF.
- Login, cuentas o backend.
- Varios CVs guardados.
- Plantillas de diseño del CV.
- Compartir por link.

## 6. Criterios de aceptación

| ID | Criterio |
| --- | --- |
| RF01 | Al escribir en un campo, el dato aparece en la vista previa. Si agrego o quito una experiencia, educación o proyecto, la vista previa se actualiza. |
| RF02 | Si elijo un área, veo la lista de habilidades de esa área y el área elegida queda marcada. Si no elijo ninguna, no puedo avanzar al formulario. |
| RF03 | Si aprieto "Criticar mi CV" con todo completo, veo la crítica calculada con las reglas comunes y las del área elegida. |
| RF04 | Veo un puntaje entero de 0 a 100. Un CV que cumple todas las reglas da 100; uno que no cumple ninguna da 0. |
| RF05 | Veo las 4 secciones, cada una con su color y su texto (Bajo / Medio / Bien), según los rangos <50, 50–79 y ≥80. |
| RF06 | Veo una mejora por cada regla no cumplida o cumplida a medias, con los puntos perdidos, ordenadas de mayor a menor. Si cumplo todo, veo un mensaje de felicitación en lugar de la lista. |
| RF07 | Si aprieto "Criticar mi CV" con campos obligatorios vacíos, no se calcula la crítica: veo un mensaje con la cantidad de campos que faltan, esos campos se marcan en rojo y el foco va al primero. Al completarlo, deja de estar en rojo. |
| RF08 | Si aprieto "Descargar PDF", se abre la impresión del navegador y la hoja muestra solo el CV (sin formulario, crítica ni botones), en A4 y legible. |
| RF09 | Si completo campos y recargo la página o la cierro y la vuelvo a abrir, veo el CV y el área como los dejé. |
| RF10 (v2) | Si cambio el idioma, la página, el CV y la crítica pasan a inglés y la elección se mantiene al recargar. |
| Cambiar de área | Si aprieto "Probar con otra área" y elijo otra, veo la crítica recalculada con el mismo CV, sin volver a cargar nada. |
| RNF01 | A 360 px de ancho no hay scroll horizontal, los botones se pueden tocar (mínimo 44 × 44 px) y el resultado aparece debajo de la vista previa. |
| RNF02 | Puedo completar todo el recorrido solo con teclado; Lighthouse en celular da 90 o más en Rendimiento y Accesibilidad; la página funciona en Chrome, Edge, Firefox y Safari actuales. |

## 7. Restricciones

| Tipo | Restricción |
| --- | --- |
| Tecnología | HTML, CSS puro (Flexbox, Grid, variables) y JavaScript puro. Sin frameworks. |
| Hosting | GitHub Pages: solo archivos estáticos, sin servidor. |
| Datos | Sin backend ni base de datos; el CV se guarda en el localStorage del navegador. |
| Dispositivos | Tiene que verse bien desde 360 px de ancho. |
| Equipo y tiempo | 2 personas, de 2 a 4 horas por día cada una; entrega el lunes 26/10. |
| Uso de IA | IDE + asistente para el código y prototipo HTML con IA para el mockup. Todo lo generado se revisa contra specs.md. |

## Estructura del proyecto

```
├── index.html          # estructura de la página
├── css/
│   └── style.css       # diseño, responsive y @media print
├── js/
│   ├── reglas.js       # reglas comunes y de cada área (solo datos)
│   ├── critica.js      # motor de puntaje, semáforo, panel de resultado
│   └── formulario.js   # formulario, validación, vista previa, localStorage, PDF
├── assets/             # mockup e imágenes
├── docs/
│   ├── specs.md        # este archivo
│   └── testing.md      # pruebas y resultados
└── README.md
```

Los scripts se cargan en este orden: `reglas.js`, `critica.js` y `formulario.js`.

## Anexo: fuentes de las reglas por área

Avisos consultados el 20/10/2026. Los avisos se dan de baja con el tiempo, así que acá queda resumido lo que pedía cada uno.

**Backend**

1. [Desarrollador Full Stack Junior — Julio Bellone y Asociados, Córdoba](https://ar.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-desarrollador-full-stack-junior-presencial-en-cordoba-365ABF4A3CEAF48861373E686DCF3405) (Computrabajo). Node.js, Express, APIs REST, JWT, MySQL/PostgreSQL, Git/GitHub; deseable Railway o GCP.
2. [Desarrollador .NET Jr — Ecosistemas Global, CABA](https://ar.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-desarrollador-net-jr-en-retiro-7A3A17E5ED1BB8E361373E686DCF3405) (Computrabajo). C#, VB.NET, ASP.NET, JavaScript, HTML, SQL; estudiante avanzado.
3. [Programador Junior — Palermo, CABA](https://ar.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-programador-junior-en-palermo-54FE2A9AB7D7AF2561373E686DCF3405) (Computrabajo). C/C++, Java, Python, SQL, Git, Linux; valora proyectos personales o académicos.
4. [Desarrollador/a Full Stack .NET — Grupo Dinosaurio, Córdoba](https://ar.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-desarrolladora-full-stack-net-en-cordoba-ECD2E54C7DA8CC1E61373E686DCF3405) (Computrabajo, en la búsqueda "backend junior"). C#, .NET, APIs REST, SQL Server, Git (pull requests), Docker.

**Frontend**

1. Desarrollador Full Stack Junior — Julio Bellone y Asociados (el mismo aviso de Backend 1, también publicado [en LinkedIn](https://www.linkedin.com/jobs/view/4460330760)). React, HTML5, CSS3, JavaScript ES6+, interfaces responsivas, consumo de APIs REST, Git.
2. [Programador Full Stack Junior — Campy, Salta](https://www.linkedin.com/jobs/view/4478232678) (LinkedIn, sin experiencia). HTML, CSS, JavaScript, un framework moderno, APIs REST, Git; valora proyectos personales.
3. [Junior Fullstack Developer (.NET Core/Angular) — Capgemini Engineering, Buenos Aires](https://www.linkedin.com/jobs/view/4469136239) (LinkedIn). Angular, TypeScript (o React), APIs RESTful, aplicaciones responsivas, testing, inglés avanzado.
4. [Digital Designer & Front-End Developer — Apply Minds, Argentina remoto](https://www.linkedin.com/jobs/view/4479620702) (LinkedIn). HTML5, CSS3, JavaScript, diseño responsive, portfolio, inglés.

**Data**

1. [Analista Jr CRM — Cencosud, Martínez](https://www.linkedin.com/jobs/view/4475222807) (LinkedIn). SQL intermedio, Power BI intermedio, Excel intermedio/avanzado, reportes y tableros; valora Python y AWS/Redshift.
2. [Smart Manufacturing Solutions Analyst Jr — Bunge, Santa Fe](https://www.linkedin.com/jobs/view/4470608398) (LinkedIn). SQL y bases de datos (excluyente), dashboards (excluyente), Power BI / Tableau / Looker (deseable), inglés intermedio.
3. [Data Insights Associate — Assurant, Buenos Aires](https://www.linkedin.com/jobs/view/4461411151) (LinkedIn, nivel inicial). Power BI, SQL, Excel avanzado, dashboards, inglés.
4. [Analista de datos (Microsoft Fabric y Power BI) — Nueva Pompeya, CABA](https://ar.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-analista-de-datos-con-experiencia-en-microsoft-fabric-y-power-bi-en-nueva-pompeya-17DB6D0F62C2CA4E61373E686DCF3405) (Computrabajo, 1 año de experiencia). Power BI, tableros y reportes.

**UX/UI**

1. [UX/UI Designer Jr — Raona, remoto (Córdoba)](https://empleo.raona.com/jobs/8207757-ux-ui-designer-jr) (sitio de empleo de la empresa). Figma, wireframes, user flows, prototipos, design systems, accesibilidad, UX Research básico; deseable portfolio.
2. [Analista Diseño Digital y Experiencias de Marca — YPF, Puerto Madero](https://www.linkedin.com/jobs/view/4472629387) (LinkedIn, estudiante avanzado o recién graduado). Mockups y prototipos, herramientas de prototipado, Adobe CC, investigación de experiencia de usuario, portfolio.
3. [UX Designer — Avature, remoto](https://www.linkedin.com/jobs/view/4469174844) (LinkedIn, nivel inicial). Wireframes, prototipos, testing e iteración, design systems, accesibilidad, HTML y CSS básicos, inglés B1.
4. [Analista UX — Perfumerías Pigmento, CABA](https://www.linkedin.com/jobs/view/4447313103) (LinkedIn). Investigación del comportamiento de usuarios, optimización de conversión, especialización en UX.

**Notas**

- En Computrabajo casi no había avisos de Frontend, Data y UX/UI con la palabra "Junior", así que esas áreas salen sobre todo de LinkedIn (filtro "Sin experiencia / Prácticas").
- El **inglés** aparece en 7 de los 15 avisos distintos (el de Bellone cuenta para Backend y Frontend). No es una regla porque el CV no tiene un campo de idiomas; queda como posible mejora para la v2.
