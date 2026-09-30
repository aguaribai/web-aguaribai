// ============================================
// Aguaribai IA — red de nodos animada (fondo del hero)
// Canvas liviano, sin dependencias, respeta prefers-reduced-motion
// ============================================

(function () {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let nodes = [];
  let animationId = null;

  const CONFIG = {
    nodeColor: '113, 200, 55',      // verde de marca en formato "r, g, b"
    linkDistance: 150,               // distancia máxima para dibujar una conexión
    nodeSpeed: 0.18,                 // velocidad de deriva de cada nodo
    nodeRadius: [1.4, 2.6],          // radio mín/máx de cada nodo
    density: 9000,                   // 1 nodo cada N px² de área (más alto = menos nodos)
    maxNodes: 70,
    linkOpacity: 0.16,
    nodeOpacity: 0.55,
  };

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function initNodes() {
    const count = Math.min(CONFIG.maxNodes, Math.floor((width * height) / CONFIG.density));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.nodeSpeed,
      vy: (Math.random() - 0.5) * CONFIG.nodeSpeed,
      r: CONFIG.nodeRadius[0] + Math.random() * (CONFIG.nodeRadius[1] - CONFIG.nodeRadius[0]),
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Mover nodos
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    // Dibujar conexiones entre nodos cercanos
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.linkDistance) {
          const opacity = (1 - dist / CONFIG.linkDistance) * CONFIG.linkOpacity;
          ctx.strokeStyle = `rgba(${CONFIG.nodeColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Dibujar nodos
    for (const n of nodes) {
      ctx.fillStyle = `rgba(${CONFIG.nodeColor}, ${CONFIG.nodeOpacity})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    animationId = requestAnimationFrame(step);
  }

  function start() {
    if (animationId) cancelAnimationFrame(animationId);
    resize();
    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(step);
    } else {
      // Con reduced-motion dibujamos un solo frame estático, sin loop
      step();
      cancelAnimationFrame(animationId);
    }
  }

  // Pausar cuando la pestaña no está visible (ahorra batería/CPU)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
    } else if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(step);
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 200);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
