# Match Dev — Especificaciones del Proyecto

> Versión 1 (MVP). Entrega: lunes 26/10/2026.
> Los puntos marcados como **A definir** todavía no están decididos.

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
| RF01 | Completar el CV por secciones: Datos + Perfil, Experiencia + Educación, Habilidades, Proyectos + Links. Todos los campos son obligatorios. | Alta |
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
- **Reglas comunes** (10 puntos cada una):
  1. Link a GitHub o portfolio.
  2. Perfil con sustancia.
  3. Proyectos con link y tecnologías.
  4. Descripciones con resultados.
- **Reglas por área:** entre 4 y 6 reglas por área que sumen 60 puntos, sacadas de 3 o 4 búsquedas Junior reales por área (LinkedIn, Computrabajo, Bumeran). **A definir.**
- **Detección:** las tecnologías se buscan en la lista de habilidades y en los textos de proyectos y experiencia (`toLowerCase()` + `includes()`). Suma más si aparecen en los dos.
- **Semáforo:** rojo menos de 50, amarillo de 50 a 79, verde 80 o más.
- **Mejoras:** cada regla que no se cumple agrega una mejora a la lista.

Formato de una regla (ejemplo):

| Área | Sección | Qué revisa | Puntos | Mensaje si falla |
| --- | --- | --- | --- | --- |
| Backend | Habilidades | Menciona al menos una base de datos (SQL, PostgreSQL, MySQL, MongoDB…) | 15 | "Para Backend se espera que manejes al menos una base de datos." |

### Datos del CV

El formulario le entrega a la crítica los datos del CV en un objeto `cv`. Forma propuesta, **a confirmar**:

```js
cv = { area, datos, perfil, experiencias, educacion, habilidades, otrasHabilidades, proyectos, links }
```

## 4. Requerimientos no funcionales

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RNF01 | Diseño responsive: tiene que verse bien desde 360 px de ancho. | Alta |
| RNF02 | Accesibilidad, rendimiento y compatibilidad. **A definir.** | — |

Estilo visual: claro y limpio, con fondo blanco, un color de acento y mucho espacio. Color de acento y tipografía: **A definir.**

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
| RF01 | Al escribir en un campo, el dato aparece en la vista previa. |
| RF02–RF10 | **A definir** (formato: "si hago X, veo Y"). |
| RNF01–RNF02 | **A definir.** |

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
