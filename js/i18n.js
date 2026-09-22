/* ═══════════════════════════════════════════
   I18N.JS — Internacionalización ES / EN
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Diccionario ──────────────────────── */
  const TRANSLATIONS = {
    es: {
      'nav.about': 'Sobre mí',
      'nav.projects': 'Proyectos',
      'nav.skills': 'Habilidades',
      'nav.contact': 'Contacto',

      'hero.badge': 'Disponible para proyectos freelance',
      'hero.greeting': 'Hola, soy',
      'hero.subtitle': 'Desarrollador Full-Stack orientado a resultados con experiencia en Node.js, React y Python, respaldado por más de 7 años de programación continua. Apasionado por construir aplicaciones escalables y soluciones basadas en datos.',
      'hero.cta.projects': 'Ver proyectos →',
      'hero.cta.contact': 'Hablemos',
      'hero.stat1': 'Años programando',
      'hero.stat2': 'Proyectos clave',
      'hero.stat3': 'LLMs integrados',
      'hero.stat4': 'Adaptabilidad',

      'about.label': 'Sobre mí',
      'about.title': 'Construyo software que',
      'about.titleHighlight': 'importa.',
      'about.p1': 'Mi enfoque está en crear soluciones centradas en el usuario, automatizaciones complejas y arquitecturas eficientes. Desde bots de trading algorítmico hasta aplicaciones web e infraestructura backend.',
      'about.p2': 'Cuento con formación como Analista de Sistemas (ISFT 151) y Técnico en Programación. Además, mi reciente experiencia internacional en Japón me ha forjado con una adaptabilidad y resiliencia extremas en entornos multiculturales y de alta presión.',
      'about.cv': 'Descargar CV',

      'projects.label': 'Proyectos',
      'projects.title': 'Lo que he construido',
      'projects.subtitle': 'Selección de proyectos que muestran mi enfoque en calidad, rendimiento y diseño de sistemas.',

      'skills.label': 'Habilidades',
      'skills.title': 'Tecnologías',
      'skills.subtitle': 'Herramientas y lenguajes con los que trabajo a diario.',

      'contact.label': 'Contacto',
      'contact.title': '¿Tenés un proyecto',
      'contact.titleHighlight': 'en mente?',
      'contact.subtitle': 'Disponible para contrataciones, desarrollo a medida y colaboraciones. Podés escribirme directamente por WhatsApp de forma rápida.',
      'contact.emailLabel': 'Email',
      'contact.locationLabel': 'Ubicación',
      'contact.whatsappLabel': 'Hablame directo!',
      'contact.whatsappTitle': '¿Hablamos?',
      'contact.whatsappDesc': 'Hacé click abajo para escribirme y empezar a planear tu proyecto.',
      'contact.whatsappBtn': 'Escribime al WhatsApp',
    },

    en: {
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.skills': 'Skills',
      'nav.contact': 'Contact',

      'hero.badge': 'Available for freelance projects',
      'hero.greeting': 'Hi, I\'m',
      'hero.subtitle': 'Results-driven Full-Stack Developer with experience in Node.js, React and Python, backed by 7+ years of continuous programming. Passionate about building scalable applications and data-driven solutions.',
      'hero.cta.projects': 'View projects →',
      'hero.cta.contact': 'Let\'s talk',
      'hero.stat1': 'Years coding',
      'hero.stat2': 'Key projects',
      'hero.stat3': 'LLMs integrated',
      'hero.stat4': 'Adaptability',

      'about.label': 'About me',
      'about.title': 'I build software that',
      'about.titleHighlight': 'matters.',
      'about.p1': 'My focus is on creating user-centric solutions, complex automations and efficient architectures. From algorithmic trading bots to web applications and backend infrastructure.',
      'about.p2': 'I hold a Systems Analyst degree (ISFT 151) and a Programming Technician certificate. My recent international experience in Japan has forged me with extreme adaptability and resilience in multicultural, high-pressure environments.',
      'about.cv': 'Download CV',

      'projects.label': 'Projects',
      'projects.title': 'What I\'ve built',
      'projects.subtitle': 'A curated selection of projects showcasing my focus on quality, performance and systems design.',

      'skills.label': 'Skills',
      'skills.title': 'Technologies',
      'skills.subtitle': 'Tools and languages I work with on a daily basis.',

      'contact.label': 'Contact',
      'contact.title': 'Got a project',
      'contact.titleHighlight': 'in mind?',
      'contact.subtitle': 'Available for hiring, custom development and collaborations. You can reach me directly via WhatsApp.',
      'contact.emailLabel': 'Email',
      'contact.locationLabel': 'Location',
      'contact.whatsappLabel': 'Reach out directly!',
      'contact.whatsappTitle': 'Let\'s talk?',
      'contact.whatsappDesc': 'Click below to message me and start planning your project.',
      'contact.whatsappBtn': 'Message on WhatsApp',
    },
  };

  /* ─── Estado ───────────────────────────── */
  let currentLang = localStorage.getItem('lang') || 'es';

  /* ─── Aplicar traducciones al DOM ──────── */
  function applyLang(lang) {
    const dict = TRANSLATIONS[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    /* Actualizar atributo lang en <html> */
    document.documentElement.setAttribute('lang', lang);

    /* Actualizar botón */
    const flag = document.getElementById('lang-flag');
    const label = document.getElementById('lang-label');
    if (flag && label) {
      if (lang === 'es') {
        flag.textContent = '🇬🇧';
        label.textContent = 'EN';
      } else {
        flag.textContent = '🇦🇷';
        label.textContent = 'ES';
      }
    }

    currentLang = lang;
    localStorage.setItem('lang', lang);

    /* Re-renderizar project cards (descripciones y etiquetas localizadas) */
    if (typeof window.__renderProjects === 'function') {
      window.__renderProjects();
    }
  }

  /* ─── Toggle ───────────────────────────── */
  function toggleLang() {
    applyLang(currentLang === 'es' ? 'en' : 'es');
  }

  /* ─── Init ─────────────────────────────── */
  function init() {
    /* Aplicar idioma guardado (o español por defecto) */
    applyLang(currentLang);

    /* Conectar botón */
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', toggleLang);
    }
  }

  /* Esperar a que el DOM esté listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
