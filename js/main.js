// ============================================
// Aguaribai IA — main.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Menú mobile ----------
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.classList.toggle('is-active', isOpen);
    });

    // Cerrar el menú mobile al clickear un link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Resaltar link activo del nav según scroll ----------
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  // ---------- FAQ accordion ----------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ---------- Secuencia animada del mockup de chat ----------
  const chatBody = document.querySelector('.chat-body');
  if (chatBody) {
    const chatObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chatBody.classList.add('is-playing');
          chatObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    chatObserver.observe(chatBody);
  }

  // ---------- Conteo animado de números al entrar en pantalla ----------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countEls = document.querySelectorAll('.count-target');

  function animateCount(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return; // texto sin número (no se anima, queda como está)

    const [, sign, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const isDecimal = numStr.includes('.');
    const duration = 1100;
    const start = performance.now();

    if (prefersReducedMotion) {
      el.textContent = `${sign}${numStr}${suffix}`;
      return;
    }

    function tick(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
      const current = target * eased;
      const display = isDecimal ? current.toFixed(1) : Math.round(current).toString();
      el.textContent = `${sign}${display}${suffix}`;
      if (elapsed < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${sign}${numStr}${suffix}`;
      }
    }
    requestAnimationFrame(tick);
  }

  if (countEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    countEls.forEach(el => countObserver.observe(el));
  }

  // ---------- Formulario de contacto (Web3Forms) ----------
  const form = document.getElementById('contactForm');
  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const accessKey = form.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === 'TU_ACCESS_KEY_DE_WEB3FORMS') {
        statusBox.textContent = 'Falta configurar el formulario: agregá tu clave de Web3Forms en el HTML (ver instrucciones en el README).';
        statusBox.className = 'form-status error';
        return;
      }

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';
      statusBox.className = 'form-status';
      statusBox.textContent = '';

      try {
        const formData = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        const result = await res.json();

        if (result.success) {
          statusBox.textContent = '¡Listo! Recibimos tu consulta. Te contactamos dentro de las próximas 24hs hábiles.';
          statusBox.className = 'form-status success';
          form.reset();
        } else {
          throw new Error(result.message || 'Error al enviar');
        }
      } catch (err) {
        statusBox.textContent = 'Hubo un problema al enviar el formulario. Por favor, intentá de nuevo o escribinos a contacto@aguaribai.com.';
        statusBox.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

});
