# Match Dev — Progress

## Estado general
**Proyecto:** Match Dev  
**Versión:** MVP v1  
**Entrega:** lunes 26/10/2026  
**Producción (GitHub Pages):** sábado 24/10/2026, como límite. Hasta entonces se trabaja en desarrollo.  
**Última actualización de `specs.md`:** 20/10/2026  
**Última actualización de este archivo:** 22/10/2026

> No se inventan estados de implementación. Una tarea se marca completada solo con evidencia de implementación y verificación.

## Documentación
- [x] `specs.md` actualizado.
- [x] Incorporar `plan.md`.
- [x] Incorporar `tasks.md`.
- [x] Incorporar `design.md`.
- [x] Incorporar `progress.md`.
- [~] Completar resultados reales en `testing.md` (falta el diálogo de impresión en Chrome, Firefox y Safari).
- [x] Mantener `README.md`.

## Estructura observada del repositorio
Existen:
- `index.html`
- `css/style.css`
- `js/formulario.js`
- `js/reglas.js`
- `js/critica.js`
- `docs/specs.md`
- `docs/testing.md`
- `assets/`
- `README.md`

La existencia de un archivo no significa que su funcionalidad esté verificada.

## Especificación
- [x] Problema y público objetivo.
- [x] Recorrido del usuario.
- [x] Objetivos.
- [x] MVP y fuera de alcance.
- [x] Criterios de aceptación.
- [x] Objeto `cv`.
- [x] Persistencia.
- [x] Reglas comunes.
- [x] Reglas Backend/Frontend/Data/UX/UI.
- [x] Sistema de puntuación.
- [x] Semáforo.
- [x] Mejoras.
- [x] Colores.
- [x] Tipografía.
- [x] Responsive.
- [x] Accesibilidad.
- [x] Rendimiento.
- [x] Compatibilidad.
- [x] Impresión/PDF.

## Implementación
Implementada en los PR #2 (estructura base y motor de crítica) y en el PR de esta actualización (errores accesibles). La verificación de cada punto está en `testing.md`.

### HTML
- [x] Landing.
- [x] Selector de área.
- [x] Formulario.
- [x] Vista previa.
- [x] Resultados.
- [x] Accesibilidad: labels, `aria-describedby` en ayudas y errores, `aria-invalid`, `aria-live` en el resultado.

### CSS
- [x] Variables.
- [x] Diseño visual.
- [x] Responsive.
- [x] Focus/error.
- [x] Impresión: hoja A4 con solo el CV, verificada con Edge.

### JavaScript
- [x] `formulario.js`.
- [x] `reglas.js`.
- [x] `critica.js`.
- [x] Comunicación mediante `cv`.
- [x] `localStorage`.
- [x] Validación.
- [x] Cambio de área.
- [x] Puntuación.

## Testing
- [x] RF01 datos/vista previa.
- [x] RF02 área.
- [x] RF03 crítica.
- [x] RF04 puntaje (además, 34 casos automatizados del motor).
- [x] RF05 semáforo.
- [x] RF06 mejoras.
- [x] RF07 validación.
- [~] RF08 PDF: hoja verificada con Edge; falta el diálogo en Chrome.
- [x] RF09 persistencia.
- [x] Responsive 360 px.
- [x] Accesibilidad: Lighthouse 100 en portada, formulario y resultado; recorrido completo con teclado; contraste AA.
- [x] Rendimiento: Lighthouse móvil 100; ~80 KB con la fuente (límite 500 KB).
- [~] Compatibilidad: probado en Chromium (Edge); faltan Firefox y Safari.

Los resultados reales deben quedar en `testing.md`.

## Publicación
- [x] Confirmar `index.html` en raíz.
- [ ] Confirmar GitHub Pages.
- [ ] Probar URL publicada.
- [ ] Revisar rutas.
- [ ] Revisar consola.

## Próximos pasos
1. Probar "Descargar PDF" con el diálogo de impresión de Chrome (RF08).
2. Probar en Firefox y Safari.
3. **Sábado 24/10:** hacer público el repo (en el plan Free, Pages no funciona con repos privados), activar GitHub Pages y probar la URL publicada.
4. Registrar resultados en `testing.md`.
5. Preparar entrega y defensa.

## Registro de cambios
### 21/10/2026
- Revisada la última versión disponible de `specs.md`.
- Reconstruidos `plan.md`, `tasks.md`, `design.md` y `progress.md` a partir de esa especificación.
- No se agregaron decisiones de diseño o funcionalidades no respaldadas por `specs.md`.

### 22/10/2026
- `tasks.md` y `progress.md` actualizados con lo implementado y verificado.
- Cada campo con error muestra su propio mensaje, vinculado con `aria-describedby` (antes había solo un aviso general).
- Corregido: el borde rojo de error no se veía en los `<input>`, solo en los `<textarea>`.
- Corregido: el texto de ejemplo de la vista previa ("Tu nombre") no llegaba a contraste AA; pasó de `#9CA3AF` a `#6B7280`.
- Cierre del MVP: Lighthouse móvil 100 en Rendimiento y Accesibilidad (portada, formulario y resultado), recorrido completo con teclado y PDF verificado con Edge.
- Agregado el favicon (`assets/favicon.svg`): su 404 era el único error de consola.
- Corregido el borde de foco de los campos de mes cuando el foco pasa a la parte del año.

- **Ortografía (C5):** el crítico ya no deja pasar faltas de ortografía, mayúsculas mal puestas ni errores de puntuación. Es una nueva regla común de 8 puntos (2 por sección); las comunes pasan de 4 × 10 a 5 × 8 y siguen sumando 40. Cada error aparece en las mejoras con su ubicación y la corrección.

### 23/10/2026
- **Diccionario de ortografía:** C5 usa además el diccionario Hunspell de español de Argentina (el de LibreOffice, con voseo), leído con `nspell` en un Web Worker. Revisa todas las palabras, no solo la lista de errores frecuentes. Pesa ~230 KB comprimido y se carga al abrir el formulario, así que la portada sigue con Lighthouse 100.
- Para no castigar el vocabulario técnico: lista blanca (inglés del rubro, anglicismos, tecnologías), no se revisan nombres propios ni tecnologías, y una palabra solo resta puntos si hay una corrección cercana; si no, aparece en "Palabras para revisar" sin descuento.
- Excepción a "sin librerías externas" de `specs.md`/`design.md`: `nspell` (MIT, ~10 KB, copiada en el repo). **A confirmar con el equipo.**
- **Formulario en pasos:** se ve un paso por vez, con barra de pasos (1 Datos · 2 Experiencia · 3 Habilidades · 4 Proyectos), "Anterior" y "Siguiente". "Siguiente" valida solo el paso actual; al criticar, si falta algo en otro paso, lleva a ese paso. Con un CV guardado completo, todos los pasos quedan habilitados.
