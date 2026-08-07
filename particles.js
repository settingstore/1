/**
 * particles.js
 * ------------------------------------------------------------------
 * Componente reutilizable: fondo de partículas azules sobre <canvas>.
 * Sin dependencias externas — vanilla Canvas API. Se detiene solo
 * si el usuario tiene "prefers-reduced-motion" activado.
 *
 * Optimizado para que se sienta fluido en celulares: limita la
 * densidad de píxeles del canvas, baja la cantidad de partículas y
 * las líneas de conexión en pantallas chicas, y evita recrear todo
 * en cada evento de resize (los navegadores móviles disparan resize
 * seguido al mostrar/ocultar la barra de direcciones).
 * ------------------------------------------------------------------
 */

export function initParticles(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const isMobile = window.innerWidth < 768;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });

  // Limitar el pixel ratio evita que un celular con pantalla 3x tenga
  // que pintar 9 veces más píxeles por frame que uno estándar.
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

  const cfg = {
    count: options.count ?? (isMobile ? 22 : 70),
    color: options.color ?? "0, 168, 255",
    maxSpeed: options.maxSpeed ?? 0.35,
    linkDistance: options.linkDistance ?? (isMobile ? 0 : 130), // sin líneas en mobile
  };

  let particles = [];
  let width, height, animationId;
  let lastW = 0, lastH = 0;

  function resize() {
    width = canvas.width = canvas.offsetWidth * dpr;
    height = canvas.height = canvas.offsetHeight * dpr;
  }

  function createParticles() {
    particles = Array.from({ length: cfg.count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * cfg.maxSpeed,
      vy: (Math.random() - 0.5) * cfg.maxSpeed,
      r: Math.random() * 1.8 + 0.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cfg.color}, 0.8)`;
      ctx.fill();
    }

    if (cfg.linkDistance > 0) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < cfg.linkDistance * dpr) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${cfg.color}, ${0.12 * (1 - dist / (cfg.linkDistance * dpr))})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    animationId = requestAnimationFrame(step);
  }

  resize();
  lastW = width;
  lastH = height;
  createParticles();

  if (!reduceMotion) {
    step();
  } else {
    // Dibuja un frame estático para no dejar el canvas vacío.
    step();
    cancelAnimationFrame(animationId);
  }

  // Debounce: solo recrea partículas si el tamaño realmente cambió
  // (evita trabajo extra por el resize que dispara el scroll en mobile).
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (Math.abs(width - lastW) > 20 || Math.abs(height - lastH) > 20) {
        createParticles();
        lastW = width;
        lastH = height;
      }
    }, 200);
  });
}
