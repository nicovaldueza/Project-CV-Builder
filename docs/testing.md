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
| RF07 | Dejar campos vacíos y criticar: mensaje con la cantidad, campos en rojo, foco en el primero. | ✅ 20/10 |
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

