# Match Dev — Design

> Este documento deriva de las decisiones visuales ya definidas en `specs.md`. No agrega colores, tipografías ni comportamientos visuales nuevos.

## 1. Dirección visual
Diseño claro y limpio, fondo blanco, un color de acento y mucho espacio.

## 2. Colores
| Uso | Variable | Valor |
|---|---|---|
| Acento | `--color-acento` | `#4F46E5` |
| Hover | `--color-acento-hover` | `#4338CA` |
| Acento suave | `--color-acento-suave` | `#EEF2FF` |
| Texto | `--color-texto` | `#111827` |
| Texto secundario | `--color-texto-suave` | `#4B5563` |
| Bordes | `--color-borde` | `#E5E7EB` |
| Fondo | `--color-fondo` | `#FFFFFF` |
| Superficie | `--color-superficie` | `#F9FAFB` |
| Rojo | `--rojo-fondo` / `--rojo-texto` | `#FEE2E2` / `#991B1B` |
| Amarillo | `--amarillo-fondo` / `--amarillo-texto` | `#FEF3C7` / `#92400E` |
| Verde | `--verde-fondo` / `--verde-texto` | `#DCFCE7` / `#166534` |
| Error | `--color-error` | `#DC2626` |

## 3. Tipografía
- Inter.
- Pesos 400, 500, 600 y 700.
- Fallback `system-ui, sans-serif`.
- Base 16 px.
- Títulos 32 / 24 / 20 px.
- Interlineado 1.5.
- Google Fonts con `display=swap`.

## 4. Recorrido
```text
LANDING
  ↓
ELEGIR ÁREA
  ↓
FORMULARIO + VISTA PREVIA
  ↓
CRITICAR MI CV
  ↓
VISTA PREVIA + RESULTADO
```

En celular:
```text
FORMULARIO
   ↓
VISTA PREVIA
   ↓
RESULTADO
```

## 5. Landing
Debe explicar qué es Match Dev, para quién está pensado y qué problema resuelve. Debe incluir “Empezar”.

Si hay un CV guardado, el botón dice “Continuar mi CV” y aparece al lado “Empezar uno nuevo” (secundario).

**Empezar un CV nuevo** (portada, barra del formulario y resultado): abre un diálogo de confirmación (`<dialog>` modal) con “Cancelar” (con el foco al abrir) y “Sí, empezar de cero” en rojo (`--color-error`). Se cierra con Esc o con un clic en el fondo.

## 6. Selección de área
Backend, Frontend, Data y UX/UI. La seleccionada queda marcada. Se muestran las habilidades del área. Sin área seleccionada no se avanza.

## 7. Formulario
Grupos:
1. Datos + Perfil.
2. Experiencia + Educación.
3. Habilidades.
4. Proyectos + Links.

Se muestra **un paso por vez**:
- **Barra de pasos** arriba (1 Datos · 2 Experiencia · 3 Habilidades · 4 Proyectos): el actual en índigo, los completos con ✓, los que todavía no se alcanzaron deshabilitados. Se puede saltar a cualquier paso ya alcanzado.
- **"Siguiente"** valida solo el paso actual; **"Anterior"** siempre vuelve. Enter en un campo equivale a "Siguiente".
- En el último paso: **"Criticar mi CV"** y **"Descargar PDF"**.
- Al cambiar de paso, el foco va al título del paso y se anuncia "Paso N de 4" (`aria-live`).

Experiencias, estudios y proyectos se pueden agregar/quitar. La vista previa se mantiene visible mientras se completa.

## 8. Resultado
Mostrar:
- Puntaje 0–100.
- Semáforo por sección.
- Mejoras ordenadas por puntos perdidos.

En escritorio: resultado al lado de la vista previa. En celular: debajo.

El panel usa `aria-live="polite"`.

## 9. Semáforo
- `<50`: rojo + “Bajo”.
- `50–79`: amarillo + “Medio”.
- `>=80`: verde + “Bien”.

Nunca depende solo del color.

## 10. Validación
Con campos obligatorios vacíos:
- Mostrar cantidad de campos faltantes.
- Marcar campos en rojo.
- Llevar foco al primero.
- Quitar error al completarlo.
- Vincular errores con `aria-describedby`.

## 11. Accesibilidad
- `label` en cada campo.
- Recorrido completo con teclado.
- `:focus-visible`.
- Contraste mínimo 4.5:1.
- Botones mínimo 44×44 px.
- `html lang="es"`.
- HTML semántico.
- No comunicar estados solo mediante color.

## 12. Responsive
Desde 360 px:
- Sin scroll horizontal.
- Botones utilizables.
- Resultado debajo de la vista previa.

## 13. Impresión/PDF
“Descargar PDF” abre la impresión del navegador. `@media print` oculta formulario, crítica y botones; muestra solamente el CV, en A4 y legible.

## 14. Rendimiento y compatibilidad
- Lighthouse móvil: 90+ Rendimiento y Accesibilidad.
- Página <500 KB sin mockup.
- Sin librerías externas adicionales. Excepción: `nspell` (MIT, ~10 KB, copiada en `js/vendor/`) para el diccionario de ortografía, que se carga al abrir el formulario (ver `specs.md`, C5).
- Inter con `display=swap`.
- Últimas 2 versiones de Chrome, Edge y Firefox; Safari actual según `specs.md`.
- Si `localStorage` no está disponible, la aplicación sigue funcionando sin guardar.
