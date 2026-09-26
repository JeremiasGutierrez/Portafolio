/**
 * UI.JS — Navigation, Scroll, Interactions, Project Renderer
 */

(function () {
  "use strict";

  // ── Nav behavior ──────────────────────────
  function initNav() {
    const nav = document.getElementById("main-nav");
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");

    if (!nav) return;

    // Scroll: add .scrolled class
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) {
        nav.classList.add("nav-glass", "scrolled");
      } else {
        nav.classList.remove("nav-glass", "scrolled");
      }
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        links.classList.toggle("open");
        toggle.classList.toggle("active");
      });

      // Close on link click
      links.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          links.classList.remove("open");
          toggle.classList.remove("active");
        });
      });
    }

    // Active link tracking
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // ── Scroll Reveal ─────────────────────────
  function initReveal() {
    const els = document.querySelectorAll(".reveal, .reveal-scale");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => io.observe(el));
  }

  // ── Card 3D Tilt ──────────────────────────
  function initCardTilt() {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -8;
        const rotY = ((x - cx) / cx) * 8;

        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.01)`;

        // Mouse position for gradient spotlight
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${pctX}%`);
        card.style.setProperty("--mouse-y", `${pctY}%`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // ── Typewriter Hero ───────────────────────
  function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;

    const words = ["Full-Stack Developer", "Systems Analyst", "Algo Trading Dev", "Data Architect"];
    let wi = 0;
    let ci = 0;
    let deleting = false;

    function tick() {
      const word = words[wi];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 70 + Math.random() * 40);
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 35);
      }
    }

    setTimeout(tick, 600);
  }

  // ── Counter Animation ─────────────────────
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1800;
          const start = performance.now();

          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + (el.dataset.suffix || "");
            if (progress < 1) requestAnimationFrame(step);
          }

          requestAnimationFrame(step);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => io.observe(c));
  }

  // ── Project Cards Renderer ────────────────
  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid || typeof PROJECTS === "undefined") return;

    // Detect active language (set by i18n.js)
    const lang = document.documentElement.getAttribute("lang") || "es";
    const isEn = lang === "en";

    const icons = ["📈", "😷", "🔮", "🏡", "📸", "🛡️", "🔥", "💎", "🧠", "⚙️"];

    // Clear existing cards before re-render
    grid.innerHTML = "";

    PROJECTS.forEach((project, i) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("role", "listitem");
      card.style.animationDelay = `${i * 0.08}s`;
      card.style.setProperty("--card-accent", hexToRgba(project.accent, 0.3));
      card.style.setProperty("--card-accent-alt", hexToRgba(project.accentAlt, 0.2));

      const iconBg  = hexToRgba(project.accent, 0.15);
      const icon    = icons[i % icons.length];
      const hasLink = project.link && project.link !== "#";

      // Pick localized description
      const desc = isEn
        ? (project.description_en || project.description_es || "")
        : (project.description_es || project.description_en || "");

      // Localized link label
      const linkLabel = isEn ? "View project" : "Ver proyecto";

      card.innerHTML = `
        <div class="card-header">
          <div class="card-icon" style="background:${iconBg}; color:${project.accent};">${icon}</div>
          <span class="card-year">${project.year}</span>
        </div>
        <h3 class="card-title">${project.title}</h3>
        <p class="card-desc">${desc}</p>
        <div class="card-tags">
          ${project.tags.map((t) => `<span class="badge">${t}</span>`).join("")}
        </div>
        <div class="card-footer">
          ${hasLink ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="card-link" id="project-link-${project.id}">${linkLabel} <span>&#8599;</span></a>` : ""}
          ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="card-link" id="project-github-${project.id}">GitHub <span>&#8599;</span></a>` : ""}
        </div>
      `;

      grid.appendChild(card);
    });

    // Re-init tilt after cards are rendered
    initCardTilt();
  }

  // Expose globally so i18n.js can re-render on lang change
  window.__renderProjects = renderProjects;

  // ── Skill logos (inline SVG) ─────────────
  const SKILLS = [
    {
      name: "JavaScript",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#F7DF1E"/><path d="M18.774 24.382c.297.484.684.84 1.369.84.576 0 .945-.287.945-.684 0-.476-.379-.644-1.018-.921l-.349-.15c-1.01-.43-1.681-.97-1.681-2.109 0-1.051.8-1.85 2.05-1.85.891 0 1.531.309 1.991 1.119l-1.091.7c-.24-.43-.5-.598-.9-.598-.41 0-.67.26-.67.598 0 .419.26.588.86.848l.35.149c1.19.51 1.861 1.03 1.861 2.2 0 1.26-.989 1.951-2.319 1.951-1.301 0-2.141-.619-2.551-1.431l1.153-.662zM12.88 24.528c.219.389.419.718.9.718.459 0 .75-.179.75-.877v-4.746h1.411v4.769c0 1.449-.85 2.108-2.091 2.108-1.12 0-1.77-.58-2.1-1.279l1.13-.693z" fill="#000"/></svg>`
    },
    {
      name: "Python",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#1e415e"/><path d="M15.885 6C11.46 6 11.73 7.897 11.73 7.897l.005 1.964h4.224v.59H9.986S7 10.12 7 14.59c0 4.47 2.475 4.31 2.475 4.31h1.477v-2.073s-.08-2.474 2.435-2.474h4.199s2.355.038 2.355-2.277V8.34S20.346 6 15.885 6zm-2.33 1.348c.42 0 .762.342.762.764a.763.763 0 0 1-.762.762.763.763 0 0 1-.763-.762c0-.422.342-.764.763-.764z" fill="#4B8BBE"/><path d="M16.115 26c4.425 0 4.155-1.897 4.155-1.897l-.005-1.964h-4.224v-.59h5.973S25 21.88 25 17.41c0-4.47-2.475-4.31-2.475-4.31h-1.477v2.073s.08 2.474-2.435 2.474h-4.199s-2.355-.038-2.355 2.277V23.66S11.654 26 16.115 26zm2.33-1.348a.763.763 0 0 1-.762-.764c0-.422.342-.764.762-.764.421 0 .763.342.763.764a.763.763 0 0 1-.763.764z" fill="#FFD43B"/></svg>`
    },
    {
      name: "React",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#20232a"/><circle cx="16" cy="16" r="2.2" fill="#61DAFB"/><g stroke="#61DAFB" stroke-width="1.1" fill="none"><ellipse rx="9" ry="3.4" cx="16" cy="16"/><ellipse rx="9" ry="3.4" cx="16" cy="16" transform="rotate(60 16 16)"/><ellipse rx="9" ry="3.4" cx="16" cy="16" transform="rotate(120 16 16)"/></g></svg>`
    },
    {
      name: "Node.js",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#1a1a1a"/><path d="M16 6l9 5.2v10.4L16 27l-9-5.2V11.2L16 6z" fill="none" stroke="#339933" stroke-width="1.5"/><path d="M16 10.5l5.5 3.17v6.34L16 23l-5.5-2.99V13.67L16 10.5z" fill="#339933"/></svg>`
    },
    {
      name: "HTML5",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#e44d26"/><path d="M7 7l1.8 20.2L16 29l7.2-1.8L25 7H7zm14.5 5.5H12l.2 2.5h9.1l-.7 7.5-4.6 1.3-4.6-1.3-.3-3.5h2.4l.2 1.6 2.3.6 2.3-.6.3-3H11.5l-.6-6H21l-.5 1.4z" fill="#fff"/></svg>`
    },
    {
      name: "CSS3",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#264de4"/><path d="M7 7l1.8 20.2L16 29l7.2-1.8L25 7H7zm13.3 14.1l-4.3 1.2-4.3-1.2-.3-3.3h2.4l.1 1.5 2.1.6 2.1-.6.2-2.6H11.7l-.6-6.8h9.8l-.2 2.5h-7l.2 2h6.9l-.5 6.7z" fill="#fff"/></svg>`
    },
    {
      name: "Firebase",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#1a1a1a"/><path d="M11.077 22.83L8 17.855l4.308-8.086 2.323 4.327L11.077 22.83z" fill="#FFA000"/><path d="M14.308 10.096l1.154 2.154-5.385 10.58L14.308 10.096z" fill="#F57F17"/><path d="M12.308 14.097l7.077-1.847L24 22.83 10.077 22.83l2.231-8.733z" fill="#FFCA28"/><path d="M19.385 12.25L24 22.83 10.077 22.83 19.385 12.25z" fill="#FFA000" opacity=".6"/></svg>`
    },
    {
      name: "Git",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#F05032"/><path d="M27.2 14.8l-10-10a1.7 1.7 0 0 0-2.4 0L12.6 7l2.9 2.9a2 2 0 0 1 2.6 2.6l2.8 2.8a2 2 0 1 1-1.2 1.2l-2.6-2.6v6.8a2 2 0 1 1-1.6 0v-6.9a2 2 0 0 1-1.1-2.6L11.6 8.1l-6.8 6.8a1.7 1.7 0 0 0 0 2.4l10 10a1.7 1.7 0 0 0 2.4 0l10-10a1.7 1.7 0 0 0 0-2.5z" fill="#fff"/></svg>`
    },
    {
      name: "Next.js",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#000"/><path d="M13.5 10h2v8.5l6.5-8.5h2.3L16.5 20.8 24 31h-2.4l-8.1-11V10z" fill="#fff"/><path d="M9 10h2v12H9V10z" fill="#fff"/></svg>`
    },
    {
      name: "Vite",
      icon: `<svg viewBox="0 0 32 32" width="52" height="52"><rect width="32" height="32" rx="4" fill="#1a1a2e"/><path d="M27 7L16.5 26.5 14 22l8-4-5-11h2.5L27 7z" fill="#646CFF"/><path d="M5 7l6.5 11.5L14 22 6 11.5 5 7z" fill="#FFBD2E"/><path d="M14 22L16.5 26.5 19 22l-2.5-4.5L14 22z" fill="#646CFF" opacity=".5"/></svg>`
    },
  ];


  function renderSkills() {
    const grid = document.getElementById("skills-grid");
    if (!grid) return;

    SKILLS.forEach((skill) => {
      const item = document.createElement("div");
      item.className = "skill-item";
      item.innerHTML = `
        <div class="skill-icon">${skill.icon}</div>
        <span class="skill-name">${skill.name}</span>
      `;
      grid.appendChild(item);
    });
  }

  // ── Contact actions ──────────────────────
  function initContactActions() {
    const copyBtn = document.getElementById("copy-number-btn");
    const copyText = document.getElementById("copy-btn-text");
    if (!copyBtn) return;

    copyBtn.addEventListener("click", async () => {
      const phoneNumber = "+54 9 2235 12-6578";
      try {
        await navigator.clipboard.writeText(phoneNumber);
        copyBtn.classList.add("copied");
        if (copyText) copyText.textContent = "¡Copiado!";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          if (copyText) copyText.textContent = "Copiar";
        }, 2200);
      } catch (err) {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = phoneNumber;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        copyBtn.classList.add("copied");
        if (copyText) copyText.textContent = "¡Copiado!";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          if (copyText) copyText.textContent = "Copiar";
        }, 2200);
      }
    });
  }

  // ── Smooth cursor glow ────────────────────
  function initCursorGlow() {
    const glow = document.createElement("div");
    glow.id = "cursor-glow";
    glow.style.cssText = `
      position: fixed;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,180,255,0.1) 0%, rgba(0,120,220,0.05) 40%, transparent 70%);
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: left 0.12s ease, top 0.12s ease;
      z-index: 0;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);

    window.addEventListener("mousemove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top  = e.clientY + "px";
    }, { passive: true });
  }

  // ── Utils ─────────────────────────────────
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ── Boot ──────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initTypewriter();
    initCounters();
    renderProjects();
    renderSkills();
    initContactActions();
    initCursorGlow();

    // Stagger reveal on load
    document.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.05}s`;
    });
  });
})();

