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

// Reglas comunes (40 puntos: 5 reglas de 8). La lógica de cada una está en critica.js, por su id.
const REGLAS_COMUNES = [
  {
    id: "C1",
    seccion: "proyectos",
    descripcion: "Link a GitHub o portfolio",
    puntos: 8,
    mensaje: "Sumá un link a tu GitHub o portfolio: es lo primero que mira quien te entrevista."
  },
  {
    id: "C2",
    seccion: "perfil",
    descripcion: "Perfil con sustancia",
    puntos: 8,
    minimoPalabras: 40,
    // Palabras que cuentan como "menciona el área" (además de las habilidades del área).
    nombresArea: {
      backend: ["backend", "back-end", "back end"],
      frontend: ["frontend", "front-end", "front end"],
      // "datos" solo no cuenta: "bases de datos" no es mencionar el área.
      data: ["data", "analista de datos", "analisis de datos", "ciencia de datos", "data analyst"],
      uxui: ["ux", "ui", "ux/ui", "experiencia de usuario"]
    },
    mensaje: "Tu perfil es muy corto o genérico: contá en 3 o 4 líneas qué hacés y qué buscás en {area}."
  },
  {
    id: "C3",
    seccion: "proyectos",
    descripcion: "Proyectos con link y tecnologías",
    puntos: 8,
    minimoTecnologias: 2,
    mensaje: "Agregá a cada proyecto el link y las tecnologías que usaste."
  },
  {
    id: "C4",
    seccion: "experiencia",
    descripcion: "Descripciones con resultados",
    puntos: 8,
    verbosLogro: ["logre", "reduje", "aumente", "mejore", "optimice", "automatice"],
    mensaje: "Contá resultados, no solo tareas: por ejemplo, 'reduje el tiempo de carga un 30 %'."
  },
  {
    // Reparte sus puntos entre las 4 secciones: cada una pierde los suyos si tiene errores.
    id: "C5",
    seccion: null,
    descripcion: "Ortografía, mayúsculas y puntuación",
    puntos: 8,
    puntosPorSeccion: 2,
    mensaje: "Revisá la ortografía y la puntuación en {seccion}: un CV con errores se descarta rápido."
  }
];

// Datos para la regla C5. No es un diccionario completo: son los errores más comunes en CVs.
const ORTOGRAFIA = {
  // Errores frecuentes → forma correcta (en minúsculas; se respeta la mayúscula inicial al sugerir).
  // Sin verbos que sin tilde también son válidos ("critica", "practico", "publico").
  errores: {
    desarollo: "desarrollo", desarrolo: "desarrollo", desarollador: "desarrollador", desarolladora: "desarrolladora",
    desarrolador: "desarrollador", desarroladora: "desarrolladora",
    experencia: "experiencia", esperiencia: "experiencia", experiensia: "experiencia",
    exelente: "excelente", exelentes: "excelentes", escelente: "excelente",
    aprendisaje: "aprendizaje", aprendisajes: "aprendizajes",
    habilidadades: "habilidades", conosimiento: "conocimiento", conosimientos: "conocimientos",
    conocimento: "conocimiento", conocimentos: "conocimientos",
    responsavilidad: "responsabilidad",
    proactibo: "proactivo", proactiba: "proactiva",
    atravez: "a través", atraves: "a través", aveces: "a veces",
    haci: "así", asi: "así", tambien: "también", ademas: "además", despues: "después",
    mas: "más", facil: "fácil", dificil: "difícil", util: "útil", utiles: "útiles",
    area: "área", areas: "áreas", analisis: "análisis", basico: "básico", basicos: "básicos",
    basica: "básica", basicas: "básicas", tecnico: "técnico", tecnicos: "técnicos", tecnica: "técnica",
    tecnicas: "técnicas",
    dinamico: "dinámico", dinamica: "dinámica", analitico: "analítico",
    analitica: "analítica", logico: "lógico", logica: "lógica", grafico: "gráfico", graficos: "gráficos",
    unico: "único", unica: "única", rapido: "rápido",
    rapida: "rápida", metodo: "método", metodos: "métodos", codigo: "código", codigos: "códigos",
    pagina: "página", paginas: "páginas", numero: "número", numeros: "números", ultimo: "último",
    ultima: "última", proximo: "próximo", maximo: "máximo", minimo: "mínimo", academico: "académico",
    academica: "académica", academicos: "académicos", electronica: "electrónica", informatica: "informática",
    matematica: "matemática", matematicas: "matemáticas", estadistica: "estadística", fisica: "física",
    economia: "economía", ingenieria: "ingeniería", tecnologia: "tecnología", tecnologias: "tecnologías",
    metodologia: "metodología", metodologias: "metodologías", categoria: "categoría", compania: "compañía",
    diseno: "diseño", disenos: "diseños", disenador: "diseñador", disenadora: "diseñadora", ano: "año",
    anos: "años", espanol: "español", ingles: "inglés", frances: "francés", aleman: "alemán",
    portugues: "portugués", gestion: "gestión", busqueda: "búsqueda", busquedas: "búsquedas",
    caracteristicas: "características", interes: "interés", traves: "través", ambito: "ámbito",
    logistica: "logística", energia: "energía",
    cientifico: "científico", especifico: "específico", optimo: "óptimo",
    sintesis: "síntesis", hipotesis: "hipótesis", movil: "móvil", moviles: "móviles"
  },
  // Excepciones del control de palabras terminadas en "-cion" / "-sion".
  excepcionesIon: ["guion", "ion"],
  // Nombres de tecnologías: si aparecen escritos distinto (mayúsculas), se sugiere esta forma.
  tecnologias: ["JavaScript", "TypeScript", "HTML", "CSS", "SQL", "PostgreSQL", "MySQL", "MongoDB", "SQLite",
    "GitHub", "GitLab", "LinkedIn", "Git", "Node.js", "Next.js", "React", "Vue", "Python", "Java", "PHP",
    "Django", "Flask", "FastAPI", "Docker", "Linux", "AWS", "Azure", "GCP", "API", "APIs", "REST", "JSON",
    "Figma", "Excel", "Power BI", "Tableau", "Looker", "BigQuery", "NumPy", "Jupyter", "UX", "UI", "KPI",
    "KPIs", "Scrum", "Sass", "Tailwind", "Bootstrap", "WordPress", "Photoshop", "Illustrator", ".NET", "C#"],
  // Siglas permitidas en mayúsculas (además de las tecnologías en mayúsculas).
  siglas: ["UTN", "UBA", "UNC", "UNLP", "UADE", "ITBA", "UNR", "UNS", "UNT", "UCA", "UP", "UB", "IBM", "SAP",
    "CRUD", "MVC", "SOLID", "JWT", "HTTP", "HTTPS", "DNS", "SEO", "SAAS", "ERP", "CRM", "WCAG", "IOT", "ETL",
    "QA", "TDD", "MERN", "MEAN", "LAMP", "POO", "OOP", "CV", "PDF", "USA", "CABA", "AMBA", "IT", "TI", "B1",
    "B2", "C1", "C2", "FCE", "CAE", "TOEFL", "IELTS", "PL-300"],
  // En español van en minúscula en medio de una oración.
  minusculas: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre",
    "setiembre", "octubre", "noviembre", "diciembre", "lunes", "martes", "miércoles", "jueves", "viernes",
    "sábado", "domingo", "inglés", "español", "portugués", "francés", "alemán", "italiano", "chino", "japonés"],
  // Palabras que pueden ir en minúscula dentro de un nombre propio.
  conectoresNombre: ["de", "del", "la", "las", "los", "y", "e", "da", "do", "dos", "van", "von"]
};

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
