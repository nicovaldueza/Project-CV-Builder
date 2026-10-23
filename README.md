# Match Dev

Crítico de CV para perfiles Trainee/Junior según el área a la que te postulás (Backend, Frontend, Data o UX/UI). Cargás tu CV, apretás "Criticar mi CV" y ves tu puntaje de 0 a 100, un semáforo por sección y qué te falta para ese puesto. También podés descargarlo en PDF.

Hecho con HTML, CSS y JavaScript puro, publicado en GitHub Pages.

## Cómo correrlo

No necesita instalación. Abrí `index.html` en el navegador, o levantá un servidor local:

```bash
python -m http.server 5500
```

y entrá a http://localhost:5500.

El diccionario de ortografía se carga con un Web Worker, que los navegadores no permiten al abrir `index.html` como archivo. En ese caso la crítica funciona igual, pero revisa la ortografía solo con la lista de errores frecuentes. Con el servidor local o en GitHub Pages se usa el diccionario completo.

## Documentación

- [docs/specs.md](docs/specs.md): especificaciones, reglas de la crítica y criterios de aceptación.
- [docs/testing.md](docs/testing.md): pruebas y resultados.

## Créditos

- Diccionario de español de Argentina para LibreOffice (proyecto RLA-ES), con triple licencia GPL 3 / LGPL 3 / MPL 1.1. Ver `assets/diccionario/LICENSE`.
- [nspell](https://github.com/wooorm/nspell), de Titus Wormer, con licencia MIT.
