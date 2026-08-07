/**
 * particles.js
 * ------------------------------------------------------------------
 * Componente reutilizable: fondo de partículas azules sobre <canvas>.
 * Sin dependencias externas — vanilla Canvas API. Se detiene solo
 * si el usuario tiene "prefers-reduced-motion" activado.
 * ------------------------------------------------------------------
 */

export function initParticles(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  const cfg = {
    count: options.count ?? (window.innerWidth < 768 ? 35 : 70),
    color: options.color ?? "0, 168, 255",
    maxSpeed: options.maxSpeed ?? 0.35,
    linkDistance: options.linkDistance ?? 130,
  };

  let particles = [];
  let width, height, animationId;

  function resize() {
    width = canvas.width = canvas.offsetWidth * devicePixelRatio;
    height = canvas.height = canvas.offsetHeight * devicePixelRatio;
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
      ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cfg.color}, 0.8)`;
      ctx.fill();
    }

    // Líneas sutiles entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < cfg.linkDistance * devicePixelRatio) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${cfg.color}, ${0.12 * (1 - dist / (cfg.linkDistance * devicePixelRatio))})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(step);
  }

  resize();
  createParticles();
  if (!reduceMotion) step();
  else {
    // Dibuja un frame estático para no dejar el canvas vacío.
    step();
    cancelAnimationFrame(animationId);
  }

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}
