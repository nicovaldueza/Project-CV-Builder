# Match Dev — Plan técnico

## 1. Objetivo
Construir Match Dev, una landing page interactiva que permite a perfiles Trainee/Junior cargar un CV, elegir Backend, Frontend, Data o UX/UI, recibir una crítica basada en reglas predefinidas y descargar/imprimir el CV en PDF. Funciona completamente en el navegador, sin backend ni base de datos.

## 2. Tecnologías y restricciones
- HTML5 semántico.
- CSS puro con Flexbox, Grid y variables CSS.
- JavaScript puro, sin frameworks.
- `localStorage`.
- GitHub Pages.
- `@media print`.
- Sin APIs externas ni claves secretas.
- Sin Bootstrap, Tailwind u otros frameworks CSS.
- Responsive desde 360 px.
- Entrega indicada en `specs.md`: lunes 26/10/2026.

## 3. Arquitectura
```text
Usuario → Landing → Área → Formulario → objeto cv → critica.js ← reglas.js
                                      ↓
                       puntaje + semáforo + mejoras
                                      ↓
                       corregir / cambiar área / PDF
```

## 4. Responsabilidades
### `index.html`
Landing, selector de área, formulario, vista previa y resultados.

### `css/style.css`
Diseño definido en `specs.md`, responsive, foco/error, vista previa, resultados y `@media print`.

### `js/formulario.js`
Campos, experiencias, educación, proyectos, validación, objeto `cv`, vista previa, `localStorage`, cambio de área e impresión.

### `js/reglas.js`
Reglas comunes y de las cuatro áreas, palabras clave y mensajes. Sin manipulación del DOM.

### `js/critica.js`
Recibe `cv`, ejecuta reglas, calcula puntos/estados, genera y ordena mejoras y actualiza el resultado.

## 5. Punto de unión
```text
formulario.js → cv → critica.js → resultado → panel
```
El motor no debe depender directamente de los inputs HTML.

## 6. Persistencia
El objeto `cv` se guarda como JSON en `localStorage` con la clave `matchdev-cv`. Si `localStorage` no está disponible, la aplicación sigue funcionando sin guardar.

## 7. Orden de scripts
```html
<script src="js/reglas.js"></script>
<script src="js/critica.js"></script>
<script src="js/formulario.js"></script>
```

## 8. Orden de implementación
1. Revisar estructura contra `specs.md`.
2. Completar HTML.
3. Aplicar CSS.
4. Implementar formulario, validación, vista previa y persistencia.
5. Implementar reglas.
6. Implementar motor de crítica.
7. Integrar mediante `cv`.
8. Verificar criterios de aceptación.
9. Completar `testing.md` con resultados reales.
10. Revisar GitHub Pages.

No agregar funcionalidades v2 hasta terminar y probar el MVP.

## 9. Git
- Una rama por persona.
- Integración a `main` mediante Pull Request.
- Al comenzar: `git pull origin main`.
- Al terminar: `commit` y `push`.
- Revisión cruzada antes de unir a `main`.

## 10. División funcional
**Parte A:** selector, formulario, validación, vista previa, `localStorage`, PDF.

**Parte B:** reglas de las cuatro áreas, motor, semáforo, mejoras y probar otra área.

**Compartido:** `specs.md`, mockup, `testing.md`, `README.md`, revisión y defensa.

## 11. Finalización
El MVP termina cuando las funcionalidades definidas en `specs.md` están implementadas y los criterios de aceptación pueden verificarse mediante `testing.md`.
