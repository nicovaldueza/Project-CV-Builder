// Datos de la crítica: áreas, secciones, habilidades para elegir y reglas.
// Solo datos, sin lógica. Todo sale de docs/specs.md (Motor de crítica).
// Las palabras clave van en minúsculas y sin acentos.

const AREAS = {
  backend: "Backend",
  frontend: "Frontend",
  data: "Data",
  uxui: "UX/UI"
};

// Secciones del CV: cada regla cuenta para el semáforo de una de ellas.
const SECCIONES = {
  perfil: "Datos y perfil",
  experiencia: "Experiencia y educación",
  habilidades: "Habilidades",
  proyectos: "Proyectos y links"
};

const HABILIDADES = {
  backend: ["Node.js", "Python", "Java", "C#", ".NET", "PHP", "Go", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Express", "Django", "Spring", "APIs REST", "Git", "GitHub", "Linux", "Docker", "AWS"],
  frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue", "Next.js", "Sass", "Tailwind", "Responsive", "APIs REST", "Git", "GitHub", "Figma"],
  data: ["SQL", "PostgreSQL", "BigQuery", "Excel", "Google Sheets", "Power Query", "Power BI", "Tableau", "Looker Studio", "Python", "Pandas", "NumPy", "Jupyter", "Estadística", "Git"],
  uxui: ["Figma", "Adobe XD", "Penpot", "Wireframes", "Prototipos", "User Research", "Tests de usabilidad", "Design System", "Accesibilidad", "HTML", "CSS", "Illustrator", "Photoshop"]
};

// Reglas comunes (40 puntos). La lógica de cada una está en critica.js, por su id.
const REGLAS_COMUNES = [
  {
    id: "C1",
    seccion: "proyectos",
    descripcion: "Link a GitHub o portfolio",
    puntos: 10,
    mensaje: "Sumá un link a tu GitHub o portfolio: es lo primero que mira quien te entrevista."
  },
  {
    id: "C2",
    seccion: "perfil",
    descripcion: "Perfil con sustancia",
    puntos: 10,
    minimoPalabras: 40,
    // Palabras que cuentan como "menciona el área" (además de las habilidades del área).
    nombresArea: {
      backend: ["backend", "back-end", "back end"],
      frontend: ["frontend", "front-end", "front end"],
      data: ["data", "datos", "analista de datos", "data analyst"],
      uxui: ["ux", "ui", "ux/ui", "experiencia de usuario"]
    },
    mensaje: "Tu perfil es muy corto o genérico: contá en 3 o 4 líneas qué hacés y qué buscás en {area}."
  },
  {
    id: "C3",
    seccion: "proyectos",
    descripcion: "Proyectos con link y tecnologías",
    puntos: 10,
    minimoTecnologias: 2,
    mensaje: "Agregá a cada proyecto el link y las tecnologías que usaste."
  },
  {
    id: "C4",
    seccion: "experiencia",
    descripcion: "Descripciones con resultados",
    puntos: 10,
    verbosLogro: ["logre", "reduje", "aumente", "mejore", "optimice", "automatice"],
    mensaje: "Contá resultados, no solo tareas: por ejemplo, 'reduje el tiempo de carga un 30 %'."
  }
];

// Reglas por área (60 puntos cada área).
// "grupos" (solo F1): da puntos por cada grupo de palabras que aparezca.
const REGLAS_AREA = {
  backend: [
    {
      id: "B1",
      seccion: "habilidades",
      descripcion: "Un lenguaje de backend",
      palabras: ["node.js", "node", "python", "java", "c#", ".net", "php", "go", "golang", "ruby", "kotlin"],
      puntos: 15,
      mensaje: "Para Backend se espera que manejes al menos un lenguaje de servidor (Node.js, Python, Java, C#…)."
    },
    {
      id: "B2",
      seccion: "habilidades",
      descripcion: "Una base de datos",
      palabras: ["sql", "postgresql", "mysql", "sql server", "mongodb", "sqlite", "oracle"],
      puntos: 15,
      mensaje: "Para Backend se espera que manejes al menos una base de datos."
    },
    {
      id: "B3",
      seccion: "proyectos",
      descripcion: "Desarrolló o consumió APIs",
      palabras: ["api", "apis", "rest", "express", "fastapi", "django", "flask", "spring", "asp.net", "endpoint"],
      puntos: 10,
      mensaje: "Mostrá un proyecto donde hayas armado una API REST."
    },
    {
      id: "B4",
      seccion: "habilidades",
      descripcion: "Control de versiones",
      palabras: ["git", "github", "gitlab"],
      puntos: 10,
      mensaje: "Agregá Git: casi todos los avisos lo piden."
    },
    {
      id: "B5",
      seccion: "habilidades",
      descripcion: "Linux, Docker o cloud",
      palabras: ["linux", "docker", "aws", "azure", "gcp", "railway", "render"],
      puntos: 10,
      mensaje: "Sumá algo de Linux, Docker o deploy en la nube; los avisos lo valoran."
    }
  ],

  frontend: [
    {
      id: "F1",
      seccion: "habilidades",
      descripcion: "HTML, CSS y JavaScript",
      grupos: [["html"], ["css"], ["javascript", "js"]],
      nombresGrupos: ["HTML", "CSS", "JavaScript"],
      puntos: 15,
      mensaje: "Para Frontend se espera que manejes HTML, CSS y JavaScript."
    },
    {
      id: "F2",
      seccion: "habilidades",
      descripcion: "Un framework moderno",
      palabras: ["react", "angular", "vue", "next.js", "svelte", "typescript"],
      puntos: 15,
      mensaje: "Aprendé y mostrá un framework (React, Angular o Vue): lo piden casi todos los avisos."
    },
    {
      id: "F3",
      seccion: "proyectos",
      descripcion: "Diseño responsive",
      palabras: ["responsive", "mobile first", "media queries", "adaptable"],
      puntos: 10,
      mensaje: "Contá en tus proyectos que son responsive (se adaptan a celular)."
    },
    {
      id: "F4",
      seccion: "proyectos",
      descripcion: "Consume APIs",
      palabras: ["api", "apis", "fetch", "axios", "rest", "json"],
      puntos: 10,
      mensaje: "Mostrá un proyecto que consuma una API."
    },
    {
      id: "F5",
      seccion: "habilidades",
      descripcion: "Control de versiones",
      palabras: ["git", "github", "gitlab"],
      puntos: 10,
      mensaje: "Agregá Git: es básico para trabajar en equipo."
    }
  ],

  data: [
    {
      id: "D1",
      seccion: "habilidades",
      descripcion: "SQL",
      palabras: ["sql", "postgresql", "mysql", "sql server", "bigquery"],
      puntos: 20,
      mensaje: "Para Data, SQL es excluyente en casi todos los avisos."
    },
    {
      id: "D2",
      seccion: "habilidades",
      descripcion: "Una herramienta de visualización",
      palabras: ["power bi", "tableau", "looker", "looker studio", "qlik"],
      puntos: 15,
      mensaje: "Sumá Power BI, Tableau o Looker: casi todos los avisos piden una."
    },
    {
      id: "D3",
      seccion: "habilidades",
      descripcion: "Excel",
      palabras: ["excel", "google sheets", "power query"],
      puntos: 10,
      mensaje: "Agregá Excel; en Data Junior lo piden casi siempre."
    },
    {
      id: "D4",
      seccion: "proyectos",
      descripcion: "Dashboards o reportes",
      palabras: ["dashboard", "dashboards", "tablero", "tableros", "reporte", "reportes", "kpi", "kpis"],
      puntos: 10,
      mensaje: "Mostrá un proyecto con un dashboard o reporte y qué conclusión sacaste."
    },
    {
      id: "D5",
      seccion: "habilidades",
      descripcion: "Python para datos",
      palabras: ["python", "pandas", "numpy", "jupyter"],
      puntos: 5,
      mensaje: "Python con pandas suma puntos para Data."
    }
  ],

  uxui: [
    {
      id: "U1",
      seccion: "habilidades",
      descripcion: "Figma u otra herramienta de prototipado",
      palabras: ["figma", "adobe xd", "sketch", "penpot"],
      puntos: 15,
      mensaje: "Para UX/UI se espera que manejes Figma."
    },
    {
      id: "U2",
      seccion: "proyectos",
      descripcion: "Wireframes, flujos o prototipos",
      palabras: ["wireframe", "wireframes", "prototipo", "prototipos", "mockup", "mockups", "user flow", "flujo de usuario"],
      puntos: 15,
      mensaje: "Contá en tus proyectos el proceso: wireframes, flujos y prototipos."
    },
    {
      id: "U3",
      seccion: "proyectos",
      descripcion: "Investigación o tests con usuarios",
      palabras: ["research", "investigacion", "entrevistas", "encuestas", "usabilidad", "test de usuario", "user testing"],
      puntos: 10,
      mensaje: "Mostrá cómo validaste tu diseño con usuarios (entrevistas, tests de usabilidad)."
    },
    {
      id: "U4",
      seccion: "habilidades",
      descripcion: "Design systems o componentes",
      palabras: ["design system", "sistema de diseno", "componentes", "guia de estilos", "style guide"],
      puntos: 10,
      mensaje: "Mencioná si trabajaste con un design system o componentes."
    },
    {
      id: "U5",
      seccion: "habilidades",
      descripcion: "Accesibilidad",
      palabras: ["accesibilidad", "accessibility", "wcag", "a11y"],
      puntos: 5,
      mensaje: "Sumá nociones de accesibilidad: varios avisos las piden."
    },
    {
      id: "U6",
      seccion: "habilidades",
      descripcion: "HTML y CSS básicos",
      palabras: ["html", "css"],
      puntos: 5,
      mensaje: "Saber HTML/CSS básico te ayuda a trabajar con developers."
    }
  ]
};
