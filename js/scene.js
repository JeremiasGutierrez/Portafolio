/**
 * SCENE.JS — Three.js Background Animation
 * ─────────────────────────────────────────
 * Floating liquid glass spheres + particle network
 * with mouse parallax interaction.
 */

(function () {
  "use strict";

  // ── Config ───────────────────────────────
  const CONFIG = {
    sphereCount: 12,
    particleCount: 120,
    connectionDistance: 120,
    mouseStrength: 0.04,
    rotationSpeed: 0.0008,
    bloomStrength: 1.2,
  };

  let scene, camera, renderer;
  let spheres = [];
  let particles, particlePositions, particleConnections;
  let mouse = { x: 0, y: 0 };
  let targetMouse = { x: 0, y: 0 };
  let animId;
  let clock;

  // ── Init ─────────────────────────────────
  function init() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    clock = new THREE.Clock();

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Lighting
    buildLights();

    // Objects
    buildSpheres();
    buildParticles();

    // Events
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    // Start loop
    animate();
  }

  // ── Lights ───────────────────────────────
  function buildLights() {
    const ambient = new THREE.AmbientLight(0x0a4080, 0.6);
    scene.add(ambient);

    const point1 = new THREE.PointLight(0x1a90e8, 4, 130);
    point1.position.set(-20, 20, 30);
    scene.add(point1);

    const point2 = new THREE.PointLight(0x00d4ff, 3, 110);
    point2.position.set(25, -15, 20);
    scene.add(point2);

    const point3 = new THREE.PointLight(0xffffff, 2, 90);
    point3.position.set(0, 30, 25);
    scene.add(point3);

    const point4 = new THREE.PointLight(0x5cc8ff, 1.8, 80);
    point4.position.set(10, -25, 15);
    scene.add(point4);
  }

  // ── Liquid Glass Spheres ──────────────────
  function buildSpheres() {
    const palette = [
      { color: 0x5cc8ff, emissive: 0x1a88cc, opacity: 0.18 },
      { color: 0x00d4ff, emissive: 0x0090bb, opacity: 0.15 },
      { color: 0xaae8ff, emissive: 0x3399cc, opacity: 0.16 },
      { color: 0xffffff, emissive: 0x6699cc, opacity: 0.12 },
      { color: 0x1a90e8, emissive: 0x0060aa, opacity: 0.14 },
    ];

    for (let i = 0; i < CONFIG.sphereCount; i++) {
      const p = palette[i % palette.length];
      const radius = 1.5 + Math.random() * 5;
      const geo = new THREE.SphereGeometry(radius, 32, 32);

      // Outer glass shell
      const mat = new THREE.MeshPhysicalMaterial({
        color: p.color,
        emissive: p.emissive,
        emissiveIntensity: 0.2,
        metalness: 0.05,
        roughness: 0.0,
        transmission: 0.95,
        thickness: radius * 0.5,
        transparent: true,
        opacity: p.opacity + Math.random() * 0.06,
        envMapIntensity: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        ior: 1.5,
        reflectivity: 0.7,
        side: THREE.FrontSide,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geo, mat);

      // Random position spread
      const spread = 40;
      mesh.position.set(
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread * 1.2,
        (Math.random() - 0.5) * spread * 0.5 - 10
      );

      // Store velocity & phase for animation
      mesh.userData = {
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.01,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        radius,
      };

      scene.add(mesh);
      spheres.push(mesh);

      // Inner glow core
      const innerGeo = new THREE.SphereGeometry(radius * 0.4, 16, 16);
      const innerMat = new THREE.MeshBasicMaterial({
        color: p.color,
        transparent: true,
        opacity: 0.06,
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      mesh.add(inner);
    }
  }

  // ── Particle Network ──────────────────────
  function buildParticles() {
    const count = CONFIG.particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const spread = 55;

    const colorOptions = [
      new THREE.Color(0x1a90e8),
      new THREE.Color(0x00d4ff),
      new THREE.Color(0x5cc8ff),
      new THREE.Color(0xaae8ff),
    ];

    particlePositions = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread * 2;
      const y = (Math.random() - 0.5) * spread * 1.5;
      const z = (Math.random() - 0.5) * 30 - 15;

      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      particlePositions.push({ x, y, z, vx: (Math.random() - 0.5) * 0.012, vy: (Math.random() - 0.5) * 0.008 });

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Line segments para conexiones — DESACTIVADO
    // (se quitan los rayos/líneas de la escena)
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(count * count * 6);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x5cc8ff,
      transparent: true,
      opacity: 0,
      visible: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    particleConnections = new THREE.LineSegments(lineGeo, lineMat);
    // No se agrega al scene — líneas removidas
    // scene.add(particleConnections);
  }

  // ── Animate ───────────────────────────────
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    mouse.x += (targetMouse.x - mouse.x) * 0.06;
    mouse.y += (targetMouse.y - mouse.y) * 0.06;

    // Camera gentle parallax
    camera.position.x += (mouse.x * 8 - camera.position.x) * 0.025;
    camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);

    // Animate spheres
    spheres.forEach((sphere) => {
      const d = sphere.userData;
      sphere.position.x += d.vx;
      sphere.position.y += d.vy + Math.sin(t * d.speed + d.phase) * 0.012;

      // Slow rotation
      sphere.rotation.x += CONFIG.rotationSpeed * d.speed;
      sphere.rotation.y += CONFIG.rotationSpeed * d.speed * 0.7;

      // Bounds wrap
      if (sphere.position.x > 50)  sphere.position.x = -50;
      if (sphere.position.x < -50) sphere.position.x = 50;
      if (sphere.position.y > 35)  sphere.position.y = -35;
      if (sphere.position.y < -35) sphere.position.y = 35;

      // Pulse opacity
      sphere.material.opacity =
        (sphere.userData.baseOpacity || 0.12) + Math.sin(t * 0.8 + d.phase) * 0.03;
    });

    // Animate particles
    if (particles && particlePositions) {
      const pos = particles.geometry.attributes.position;
      for (let i = 0; i < particlePositions.length; i++) {
        const p = particlePositions[i];
        p.x += p.vx + Math.sin(t * 0.3 + i) * 0.004;
        p.y += p.vy + Math.cos(t * 0.2 + i * 0.5) * 0.004;

        if (p.x > 55)  p.x = -55;
        if (p.x < -55) p.x = 55;
        if (p.y > 40)  p.y = -40;
        if (p.y < -40) p.y = 40;

        pos.setXYZ(i, p.x, p.y, p.z);
      }
      pos.needsUpdate = true;

      // Update connections
      updateConnections();
    }

    renderer.render(scene, camera);
  }

  // ── Particle Connections ──────────────────
  let connectionUpdateCounter = 0;
  function updateConnections() {
    connectionUpdateCounter++;
    if (connectionUpdateCounter % 2 !== 0) return; // update every 2 frames

    const linePos = particleConnections.geometry.attributes.position;
    const arr = linePos.array;
    let idx = 0;

    const pts = particlePositions;
    const dist = CONFIG.connectionDistance * 0.35;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < dist && idx + 5 < arr.length) {
          arr[idx++] = pts[i].x;
          arr[idx++] = pts[i].y;
          arr[idx++] = pts[i].z;
          arr[idx++] = pts[j].x;
          arr[idx++] = pts[j].y;
          arr[idx++] = pts[j].z;
        }
      }
    }

    // Clear remaining
    for (let k = idx; k < arr.length; k++) arr[k] = 0;

    linePos.needsUpdate = true;
    particleConnections.geometry.setDrawRange(0, idx / 3);
  }

  // ── Events ────────────────────────────────
  function onMouseMove(e) {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  // ── Start ─────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
