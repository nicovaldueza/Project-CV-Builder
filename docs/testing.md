# Match Dev — Pruebas

Pruebas manuales contra los criterios de aceptación de [specs.md](specs.md#6-criterios-de-aceptación).
Completar la columna "Resultado" con ✅ / ❌ y la fecha.

| ID | Prueba | Resultado |
| --- | --- | --- |
| RF01 | Escribir en cada campo y ver que aparece en la vista previa. Agregar y quitar experiencias, estudios y proyectos. | ✅ 20/10 |
| RF02 | Apretar "Cargar mi CV" sin elegir área: aparece el error. Elegir cada área: cambia la lista de habilidades. | ✅ 20/10 |
| RF03 | Completar todo y apretar "Criticar mi CV": aparece la crítica del área elegida. | ✅ 20/10 |
| RF04 | CV que cumple todas las reglas → 100. CV que no cumple ninguna → 0. | ✅ 20/10 |
| RF05 | Ver las 4 secciones con color y texto (Bajo / Medio / Bien). | ✅ 20/10 |
| RF06 | Las mejoras aparecen ordenadas por puntos perdidos, de mayor a menor. | ✅ 20/10 |
| C5 | CV con faltas de ortografía, mayúsculas y puntuación: cada error aparece en su sección con la corrección; un CV bien escrito no tiene marcas. | ✅ 22/10 |
| C5 diccionario | Con el diccionario cargado se detectan faltas fuera de la lista ("poblemas", "Hize", "pruevas"); el voseo y el vocabulario técnico no se marcan; sin diccionario, la crítica avisa y sigue con las reglas. | ✅ 23/10 |
| RF07 | Dejar campos vacíos y criticar: mensaje con la cantidad, campos en rojo, foco en el primero. | ✅ 20/10 |
| Pasos | "Siguiente" con el paso incompleto no avanza y marca solo ese paso; Enter = Siguiente; "Anterior" vuelve; la barra salta a pasos alcanzados y no a los bloqueados; criticar con un error en el paso 1 lleva al paso 1; con un CV guardado completo, todos los pasos habilitados. | ✅ 23/10 |
| RF08 | "Descargar PDF": la hoja muestra solo el CV, en A4. | ✅ 22/10 (PDF generado con Edge); falta el diálogo en Chrome |
| RF09 | Completar campos, recargar la página: el CV y el área siguen ahí. | ✅ 20/10 |
| Otra área | "Probar con otra área": la crítica se recalcula con el mismo CV. | ✅ 20/10 |
| RNF01 | A 360 px no hay scroll horizontal y el resultado queda debajo de la vista previa. | ✅ 20/10 |
| RNF02 | Recorrido completo con teclado. Lighthouse celular ≥ 90 en Rendimiento y Accesibilidad. | ✅ 22/10 |

## Notas del 20/10

- RF04–RF06 se verificaron además con un script que carga `reglas.js` y `critica.js` en Node: CV completo da 100 en las 4 áreas, CV vacío da 0, la detección por palabra completa (`java` ≠ `javascript`), el 50 % cuando una palabra aparece en un solo lugar, F1 por grupos, C2–C4 y el orden de las mejoras.
- Caso real en el navegador (Backend, CV de prueba "Ana Pérez"): 80/100, con las secciones en 50 / 100 / 80 / 83, que coincide con el cálculo a mano.
- Pendientes: RF08 (probar la impresión en Chrome) y RNF02 (correr Lighthouse).

## Notas del 22/10

- RF07: cada campo con error muestra su mensaje ("Completá este campo.", email o link inválido, "Falta un link…", "Elegí al menos una habilidad.") vinculado con `aria-describedby`, sin pisar el texto de ayuda. El mensaje se va al corregir el campo. Se corrigió que el borde rojo no se veía en los `<input>`.
- RNF02, contraste: medido con la fórmula de WCAG para todos los pares de colores de la paleta; todos ≥ 4.5:1. El texto de ejemplo de la vista previa estaba en 2.5:1 y se corrigió a 4.8:1.
- RNF02, peso: ~80 KB con la fuente Inter (límite 500 KB).
- RNF02, teclado: landing → área (flechas) → formulario funciona con Tab/Enter y el foco se ve. Falta el recorrido completo hasta el resultado.
- RF06: con un CV que cumple todo (Frontend, 100/100) aparece el mensaje de felicitación.

## Notas del 22/10 (cierre del MVP)

Herramientas: Microsoft Edge (Chromium) en modo headless, Lighthouse 12 y puppeteer, contra `http://localhost:5500`.

- **Lighthouse en celular, portada:** Rendimiento 100, Accesibilidad 100, Buenas prácticas 96 → 100 después de agregar el favicon (el 404 de `/favicon.ico` era el único error de consola), SEO 100.
- **Lighthouse, accesibilidad por estado:** formulario completo 100; resultado de la crítica 100.
- **Recorrido completo con teclado (1280 px):** Tab → "Empezar" → áreas con flechas + Espacio → "Cargar mi CV" → 47 paradas de Tab completando todos los campos (texto, email, mes con flechas, casillas de habilidades con Espacio) → Enter en "Criticar mi CV" → el foco va al título del resultado → "Probar con otra área" con flechas + Enter recalcula. Foco visible en todas las paradas.
- **Corregido:** en los campos de mes, cuando el foco pasaba a la parte del año, se perdía el borde de foco (el campo deja de ser `:focus`). Se usa `:focus-within`.
- **RF08:** `page.pdf()` con los estilos de impresión da una sola hoja A4 con solo el CV: sin formulario, sin resultado y sin botones, aunque se imprima con el resultado en pantalla. Falta probar el diálogo de impresión en Chrome.
- **Compatibilidad:** probado en Chromium (Edge y el navegador integrado). Faltan Firefox y Safari.

## Notas del 22/10 (ortografía, C5)

- Script del motor: 49 casos OK. Incluye CV completo y bien escrito = 100 en las 4 áreas, los puntajes nuevos de C1–C4 (8 pts) y 26 casos de `revisarTexto`: errores frecuentes, tildes en -ción, plurales, tecnologías, idiomas en minúscula, mayúsculas sostenidas, siglas, inicio de oración, viñetas, abreviaturas ("ej."), espacios, signos repetidos, "¿"/"¡", paréntesis, punto final, nombres propios y links/emails ignorados.
- Falsos positivos: 17 textos de CV bien escritos (perfiles, descripciones con viñetas, títulos, tecnologías, nombres con "del", "Node.js", "ASP.NET", "UX/UI", "CI/CD") → ninguna marca indebida.
- Navegador: CV de prueba con errores (Frontend) → 74/100 y 20 errores detectados, cada uno en su sección y con su corrección.

## Notas del 23/10 (diccionario)

- **Worker real en Node** (con `importScripts` y `fetch` simulados): carga en ~0,6 s; las consultas siguientes, ~9 ms. Corrige "habia" → "había", "hize" → "hice", "aprendisaje" → "aprendizaje", "acer" → "hacer", "nesesario" → "necesario", "sertificado" → "certificado", entre otras.
- **Voseo:** el diccionario general de español marcaba "querés", "tenés", "armá" y "contame"; se cambió por el de Argentina, que los trae. "podés" se agregó a la lista blanca.
- **Falsos positivos:** 4 CVs completos bien escritos (Backend, Frontend, Data y UX/UI, con anglicismos, voseo, nombres propios, "Node.js", "CI/CD", "E-commerce") → 0 errores y 0 palabras para revisar. Los 17 textos de la prueba del 22/10 → solo el error real que tenían a propósito ("Version").
- **CV mal escrito:** 14 de 14 errores detectados, con la corrección justa ("Aplicasion" → "Aplicación").
- **Navegador:** con el worker real, la crítica tarda ~0,6 s, incluida la carga del diccionario, y el botón muestra "Revisando ortografía…". Sin worker, avisa "No se pudo cargar el diccionario" y sigue con la lista de errores frecuentes.
- Recorrido con teclado y Lighthouse (portada 100/100/100/100, formulario y resultado 100 de accesibilidad) sin cambios.

## Notas del 23/10 (formulario en pasos)

- Navegador: todos los casos de la fila "Pasos", a 360 px y a 1366 px, sin scroll horizontal.
- Teclado: el recorrido completo avanza con Enter en "Siguiente" por los 4 pasos (53 paradas de Tab) y critica. Lighthouse accesibilidad del formulario y del resultado: 100. Se corrigió el aviso `label-content-name-mismatch` de la barra de pasos (el nombre accesible ahora incluye el texto visible).
- Lighthouse de la portada: 100 en las 4 categorías.
