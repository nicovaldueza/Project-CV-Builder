# Match Dev — Tasks

Estados: `[ ]` pendiente · `[~]` en progreso · `[x]` completada · `[!]` bloqueada.

> No marcar una tarea como completada solo porque exista código: debe estar implementada y verificada.

## Documentación
- [x] `specs.md` definido y actualizado.
- [ ] Incorporar `plan.md`.
- [ ] Incorporar `tasks.md`.
- [ ] Incorporar `design.md`.
- [ ] Incorporar `progress.md`.
- [ ] Completar resultados reales en `testing.md`.
- [ ] Mantener `README.md`.

## HTML
- [ ] Landing y botón “Empezar”.
- [ ] Selector Backend / Frontend / Data / UX/UI.
- [ ] Datos + Perfil.
- [ ] Experiencia + Educación.
- [ ] Habilidades.
- [ ] Proyectos + Links.
- [ ] Vista previa.
- [ ] “Criticar mi CV”.
- [ ] Panel de resultado.
- [ ] “Probar con otra área”.
- [ ] “Descargar PDF”.
- [ ] Mensajes de validación.
- [ ] Labels y HTML semántico.
- [ ] `aria-describedby` en errores.
- [ ] `aria-live="polite"` en resultados.

## CSS
- [ ] Variables en `:root`.
- [ ] `#4F46E5`, `#4338CA`, `#EEF2FF`.
- [ ] Colores de texto, borde, fondo, superficie y semáforo de `specs.md`.
- [ ] `#DC2626` para errores.
- [ ] Inter 400/500/600/700, fallback `system-ui, sans-serif`.
- [ ] Base 16 px; títulos 32/24/20; interlineado 1.5.
- [ ] `:focus-visible`.
- [ ] Contraste mínimo 4.5:1.
- [ ] Responsive desde 360 px.
- [ ] Botones mínimo 44×44 px.
- [ ] Resultado debajo de vista previa en celular.
- [ ] `@media print`, A4 y solo CV.

## `formulario.js`
- [ ] Seleccionar área y mostrar habilidades correspondientes.
- [ ] Mantener habilidades al cambiar de área.
- [ ] Leer datos y perfil.
- [ ] Agregar/eliminar experiencias.
- [ ] Agregar/eliminar educación.
- [ ] Agregar/eliminar proyectos.
- [ ] Opción “Todavía no tengo experiencia laboral”.
- [ ] Validar obligatorios.
- [ ] Mostrar cantidad de faltantes.
- [ ] Marcar faltantes en rojo y enfocar el primero.
- [ ] Quitar error al completar.
- [ ] Construir `cv`.
- [ ] Actualizar vista previa sin recargar.
- [ ] Guardar/cargar `localStorage`.
- [ ] Usar `try/catch` para `localStorage`.
- [ ] Preparar impresión.

## `reglas.js`
### Comunes — 40 pts
- [ ] C1 GitHub/GitLab/Behance/Dribbble/portfolio — 10.
- [ ] C2 Perfil ≥40 palabras + área/tecnología — 10.
- [ ] C3 Proyectos con link + ≥2 tecnologías — 10.
- [ ] C4 Resultados concretos — 10.

### Backend — 60 pts
- [ ] B1 Lenguaje backend — 15.
- [ ] B2 Base de datos — 15.
- [ ] B3 APIs — 10.
- [ ] B4 Control de versiones — 10.
- [ ] B5 Linux/Docker/cloud — 10.

### Frontend — 60 pts
- [ ] F1 HTML + CSS + JavaScript — 15.
- [ ] F2 Framework moderno — 15.
- [ ] F3 Responsive — 10.
- [ ] F4 APIs — 10.
- [ ] F5 Control de versiones — 10.

### Data — 60 pts
- [ ] D1 SQL — 20.
- [ ] D2 Visualización — 15.
- [ ] D3 Excel/Sheets/Power Query — 10.
- [ ] D4 Dashboard/reporte — 10.
- [ ] D5 Python para datos — 5.

### UX/UI — 60 pts
- [ ] U1 Figma/prototipado — 15.
- [ ] U2 Wireframes/flujos/prototipos — 15.
- [ ] U3 Investigación/testing con usuarios — 10.
- [ ] U4 Design systems/componentes — 10.
- [ ] U5 Accesibilidad — 5.
- [ ] U6 HTML/CSS básicos — 5.

## `critica.js`
- [ ] Recibir `cv`.
- [ ] Ejecutar reglas comunes y del área.
- [ ] Aplicar puntuación parcial.
- [ ] Calcular 0–100.
- [ ] Calcular secciones.
- [ ] Semáforo `<50`, `50–79`, `>=80`.
- [ ] Mostrar color y texto Bajo/Medio/Bien.
- [ ] Crear mejoras por reglas incumplidas/parciales.
- [ ] Ordenar por puntos perdidos.
- [ ] Mostrar felicitación si todo se cumple.
- [ ] Recalcular con otra área.

## Accesibilidad, rendimiento y compatibilidad
- [ ] Recorrido completo con teclado.
- [ ] Foco visible.
- [ ] WCAG AA.
- [ ] Semáforo con color + texto.
- [ ] Errores comprensibles.
- [ ] `aria-live`.
- [ ] `lang="es"` y HTML semántico.
- [ ] Lighthouse móvil: 90+ Rendimiento.
- [ ] Lighthouse móvil: 90+ Accesibilidad.
- [ ] Página <500 KB sin mockup.
- [ ] Inter con `display=swap`.
- [ ] Chrome/Edge/Firefox/Safari según `specs.md`.

## Testing y publicación
- [ ] Recorrido completo.
- [ ] Cuatro áreas.
- [ ] Validación.
- [ ] Sin experiencia.
- [ ] `localStorage`.
- [ ] Puntuación/semáforos/mejoras.
- [ ] Cambio de área.
- [ ] PDF.
- [ ] 360 px.
- [ ] Registrar resultados en `testing.md`.
- [ ] Verificar `index.html` en raíz.
- [ ] Verificar GitHub Pages, rutas y consola.
