# Match Dev — Tasks

Estados: `[ ]` pendiente · `[~]` en progreso · `[x]` completada · `[!]` bloqueada.

> No marcar una tarea como completada solo porque exista código: debe estar implementada y verificada.
>
> Última actualización: 22/10/2026. La evidencia de cada tarea está en [testing.md](testing.md).

## Documentación
- [x] `specs.md` definido y actualizado.
- [x] Incorporar `plan.md`.
- [x] Incorporar `tasks.md`.
- [x] Incorporar `design.md`.
- [x] Incorporar `progress.md`.
- [~] Completar resultados reales en `testing.md`.
- [x] Mantener `README.md`.

## HTML
- [x] Landing y botón “Empezar”.
- [x] Selector Backend / Frontend / Data / UX/UI.
- [x] Datos + Perfil.
- [x] Experiencia + Educación.
- [x] Habilidades.
- [x] Proyectos + Links.
- [x] Vista previa.
- [x] “Criticar mi CV”.
- [x] Panel de resultado.
- [x] “Probar con otra área”.
- [x] “Descargar PDF”.
- [x] Mensajes de validación.
- [x] Labels y HTML semántico.
- [x] `aria-describedby` en errores.
- [x] `aria-live="polite"` en resultados.

## CSS
- [x] Variables en `:root`.
- [x] `#4F46E5`, `#4338CA`, `#EEF2FF`.
- [x] Colores de texto, borde, fondo, superficie y semáforo de `specs.md`.
- [x] `#DC2626` para errores.
- [x] Inter 400/500/600/700, fallback `system-ui, sans-serif`.
- [x] Base 16 px; títulos 32/24/20; interlineado 1.5.
- [x] `:focus-visible`.
- [x] Contraste mínimo 4.5:1.
- [x] Responsive desde 360 px.
- [x] Botones mínimo 44×44 px.
- [x] Resultado debajo de vista previa en celular.
- [x] `@media print`, A4 y solo CV.

## `formulario.js`
- [x] Seleccionar área y mostrar habilidades correspondientes.
- [x] Mantener habilidades al cambiar de área.
- [x] Leer datos y perfil.
- [x] Agregar/eliminar experiencias.
- [x] Agregar/eliminar educación.
- [x] Agregar/eliminar proyectos.
- [x] Opción “Todavía no tengo experiencia laboral”.
- [x] Validar obligatorios.
- [x] Mostrar cantidad de faltantes.
- [x] Marcar faltantes en rojo y enfocar el primero.
- [x] Quitar error al completar.
- [x] Construir `cv`.
- [x] Actualizar vista previa sin recargar.
- [x] Guardar/cargar `localStorage`.
- [x] Usar `try/catch` para `localStorage`.
- [x] Preparar impresión.

## `reglas.js`
### Comunes — 40 pts (5 reglas de 8)
- [x] C1 GitHub/GitLab/Behance/Dribbble/portfolio — 8.
- [x] C2 Perfil ≥40 palabras + área/tecnología — 8.
- [x] C3 Proyectos con link + ≥2 tecnologías — 8.
- [x] C4 Resultados concretos — 8.
- [x] C5 Ortografía, mayúsculas y puntuación — 8 (2 por sección).
- [x] C5 con diccionario Hunspell es-AR (Web Worker, lista blanca, palabras para revisar sin descuento).

### Backend — 60 pts
- [x] B1 Lenguaje backend — 15.
- [x] B2 Base de datos — 15.
- [x] B3 APIs — 10.
- [x] B4 Control de versiones — 10.
- [x] B5 Linux/Docker/cloud — 10.

### Frontend — 60 pts
- [x] F1 HTML + CSS + JavaScript — 15.
- [x] F2 Framework moderno — 15.
- [x] F3 Responsive — 10.
- [x] F4 APIs — 10.
- [x] F5 Control de versiones — 10.

### Data — 60 pts
- [x] D1 SQL — 20.
- [x] D2 Visualización — 15.
- [x] D3 Excel/Sheets/Power Query — 10.
- [x] D4 Dashboard/reporte — 10.
- [x] D5 Python para datos — 5.

### UX/UI — 60 pts
- [x] U1 Figma/prototipado — 15.
- [x] U2 Wireframes/flujos/prototipos — 15.
- [x] U3 Investigación/testing con usuarios — 10.
- [x] U4 Design systems/componentes — 10.
- [x] U5 Accesibilidad — 5.
- [x] U6 HTML/CSS básicos — 5.

## `critica.js`
- [x] Recibir `cv`.
- [x] Ejecutar reglas comunes y del área.
- [x] Aplicar puntuación parcial.
- [x] Calcular 0–100.
- [x] Calcular secciones.
- [x] Semáforo `<50`, `50–79`, `>=80`.
- [x] Mostrar color y texto Bajo/Medio/Bien.
- [x] Crear mejoras por reglas incumplidas/parciales.
- [x] Ordenar por puntos perdidos.
- [x] Mostrar felicitación si todo se cumple.
- [x] Recalcular con otra área.

## Accesibilidad, rendimiento y compatibilidad
- [x] Recorrido completo con teclado.
- [x] Foco visible.
- [x] WCAG AA.
- [x] Semáforo con color + texto.
- [x] Errores comprensibles.
- [x] `aria-live`.
- [x] `lang="es"` y HTML semántico.
- [x] Lighthouse móvil: 90+ Rendimiento.
- [x] Lighthouse móvil: 90+ Accesibilidad.
- [x] Página <500 KB sin mockup.
- [x] Inter con `display=swap`.
- [~] Chrome/Edge/Firefox/Safari según `specs.md` (probado en Chromium/Edge; faltan Firefox y Safari).

## Testing y publicación
- [x] Recorrido completo.
- [x] Cuatro áreas.
- [x] Validación.
- [x] Sin experiencia.
- [x] `localStorage`.
- [x] Puntuación/semáforos/mejoras.
- [x] Cambio de área.
- [~] PDF (hoja A4 verificada con Edge; falta el diálogo de impresión en Chrome).
- [x] 360 px.
- [~] Registrar resultados en `testing.md`.
- [x] Verificar `index.html` en raíz.
- [ ] Hacer público el repo (en el plan Free, Pages no funciona con repos privados). **Límite: sábado 24/10.**
- [ ] Activar GitHub Pages y verificar rutas y consola en la URL publicada. **Límite: sábado 24/10.**
