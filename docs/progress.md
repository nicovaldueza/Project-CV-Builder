# Match Dev — Progress

## Estado general
**Proyecto:** Match Dev  
**Versión:** MVP v1  
**Entrega:** lunes 26/10/2026  
**Última actualización de `specs.md`:** 20/10/2026  
**Última actualización de este archivo:** 22/10/2026

> No se inventan estados de implementación. Una tarea se marca completada solo con evidencia de implementación y verificación.

## Documentación
- [x] `specs.md` actualizado.
- [x] Incorporar `plan.md`.
- [x] Incorporar `tasks.md`.
- [x] Incorporar `design.md`.
- [x] Incorporar `progress.md`.
- [~] Completar resultados reales en `testing.md` (faltan RF08 y Lighthouse).
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
- [~] Impresión: `@media print` hecho, falta probar en Chrome.

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
- [ ] RF08 PDF.
- [x] RF09 persistencia.
- [x] Responsive 360 px.
- [~] Accesibilidad: contraste AA medido y recorrido inicial con teclado OK; falta Lighthouse y recorrido completo.
- [~] Rendimiento: ~80 KB con la fuente (límite 500 KB); falta Lighthouse.
- [ ] Compatibilidad: probado solo en Chromium.

Los resultados reales deben quedar en `testing.md`.

## Publicación
- [x] Confirmar `index.html` en raíz.
- [ ] Confirmar GitHub Pages.
- [ ] Probar URL publicada.
- [ ] Revisar rutas.
- [ ] Revisar consola.

## Próximos pasos
1. Probar "Descargar PDF" en Chrome (RF08).
2. Correr Lighthouse en celular (Rendimiento y Accesibilidad).
3. Recorrido completo solo con teclado.
4. Probar en Firefox y Safari.
5. Activar GitHub Pages y probar la URL publicada.
6. Registrar resultados en `testing.md`.
7. Preparar entrega y defensa.

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
