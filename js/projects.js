/**
 * PROJECTS DATA — i18n-aware
 * ─────────────────────────────────────────────
 * Cada proyecto tiene `description_es` y `description_en`.
 * i18n.js expone getProjectDesc(project) para obtener el texto
 * en el idioma activo.
 * ─────────────────────────────────────────────
 */
const PROJECTS = [
  {
    id: 1,
    title: "Striker & Vigilante (Algo Trading)",
    description_es: "Bots cuantitativos de alta frecuencia para Polymarket. Extracción de datos en tiempo real mediante Web Scraping y uso de modelos IA locales (Ollama, Gemma 4) para decisiones.",
    description_en: "High-frequency quantitative bots for Polymarket. Real-time data extraction via Web Scraping and local AI models (Ollama, Gemma 4) for decision-making.",
    tags: ["Python", "Web Scraping", "Local LLM", "Algo Trading"],
    accent: "#00c8ff",
    accentAlt: "#7de8ff",
    year: "2023",
    link: "#",
    github: null,
    image: "assets/thumb_trading_1780362471415.png",
    featured: true,
  },
  {
    id: 2,
    title: "Osem Insurance App",
    description_es: "Aplicación de seguro médico desarrollada en 3 meses. Arquitectura de API en Firebase, optimizando el tiempo de respuesta de notificaciones de 2 minutos a 2 segundos.",
    description_en: "Medical insurance app built in 3 months. Firebase API architecture, reducing notification response time from 2 minutes to 2 seconds.",
    tags: ["Node.js", "React", "Firebase", "API"],
    accent: "#b3f0ff",
    accentAlt: "#00c8ff",
    year: "2022",
    link: "https://osem-web.vercel.app?_vercel_share=rVtzdHueGfuwAfkvkFWuAvBOtMHeoWEe",
    github: "https://github.com/JeremiasGutierrez",
    image: "assets/thumb_medical_1780362486305.png",
    featured: true,
  },
  {
    id: 3,
    title: "Innova Space Aerospace Data",
    description_es: "App para procesar y visualizar datos aeroespaciales y de satélites. API RESTful nativa en InfluxDB e interfaces gráficas en React Native para diversos sectores.",
    description_en: "App to process and visualize aerospace and satellite data. Native RESTful API in InfluxDB and React Native graphical interfaces for multiple sectors.",
    tags: ["React Native", "InfluxDB", "REST API"],
    accent: "#7de8ff",
    accentAlt: "#ffffff",
    year: "2022",
    link: "#",
    github: null,
    image: "assets/thumb_aerospace_1780362502270.png",
    featured: false,
  },
  {
    id: 4,
    title: "Jeremias Gutierrez - Real Estate",
    description_es: "Plataforma web para gestión inmobiliaria. Desarrollada de manera modular con Vite, integrando Web Scraping de propiedades y un frontend optimizado.",
    description_en: "Web platform for real estate management. Built modularly with Vite, integrating property Web Scraping and an optimized frontend.",
    tags: ["Vite", "JavaScript", "HTML/CSS", "Web Scraping"],
    accent: "#00e5ff",
    accentAlt: "#00c8ff",
    year: "2024",
    link: "https://propiedadesdemos.netlify.app/client",
    github: "https://github.com/JeremiasGutierrez",
    image: "assets/thumb_realestate_1780362514536.png",
    featured: true,
  },
  {
    id: 5,
    title: "Beelup Doble Cámara (Streaming)",
    description_es: "Reproductor y sincronizador de doble cámara en tiempo real con HLS.js, visor de highlights y control sincronizado de streaming deportivo.",
    description_en: "Real-time dual-camera player and synchronizer with HLS.js, highlights viewer and synchronized control for sports streaming.",
    tags: ["JavaScript", "HLS.js", "Video Streaming", "HTML5/CSS3"],
    accent: "#f5a623",
    accentAlt: "#ffbe53",
    year: "2024",
    link: "./proyectos/BeelupDoble/index.html",
    github: "https://github.com/JeremiasGutierrez",
    image: "assets/thumb_realestate_1780362514536.png",
    featured: true,
  }
];
