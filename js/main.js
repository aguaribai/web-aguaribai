// ============================================
// Aguaribai IA — main.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Año dinámico en el footer (rango 2025–actual) ----------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.textContent = currentYear;
    // Si todavía estamos en 2025, no mostramos el rango (evita "2025–2025")
    if (currentYear <= 2025) {
      yearEl.previousSibling.textContent = yearEl.previousSibling.textContent.replace('2025–', '');
    }
  }

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

  // ---------- Ventana de confirmación del formulario ----------
  function showFormModal(tipo, titulo, texto) {
    const previo = document.getElementById('formModal');
    if (previo) previo.remove();
    const foco = document.activeElement;
    const ok = tipo === 'success';
    const overlay = document.createElement('div');
    overlay.id = 'formModal';
    overlay.className = 'form-modal ' + (ok ? 'is-success' : 'is-error');
    overlay.innerHTML =
      '<div class="form-modal__box" role="dialog" aria-modal="true" aria-labelledby="formModalTitle" aria-describedby="formModalText">' +
        '<div class="form-modal__icon" aria-hidden="true">' +
          (ok
            ? '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
            : '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v6M12 17h.01"/></svg>') +
        '</div>' +
        '<h3 id="formModalTitle"></h3>' +
        '<p id="formModalText"></p>' +
        '<button type="button" class="btn btn-primary form-modal__btn">Entendido</button>' +
      '</div>';
    overlay.querySelector('#formModalTitle').textContent = titulo;
    overlay.querySelector('#formModalText').textContent = texto;
    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');

    const btn = overlay.querySelector('.form-modal__btn');
    function cerrar() {
      overlay.remove();
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
      if (foco && typeof foco.focus === 'function') foco.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') cerrar();
      if (e.key === 'Tab') { e.preventDefault(); btn.focus(); }
    }
    btn.addEventListener('click', cerrar);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
    document.addEventListener('keydown', onKey);
    btn.focus();
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

        // Origen de la visita (UTM / sitio de referencia), para saber de dónde viene cada consulta
        const origen = typeof window.aguaribaiOrigen === 'function' ? window.aguaribaiOrigen() : {};
        Object.keys(origen || {}).forEach((k) => {
          if (origen[k]) formData.append(k, origen[k]);
        });

        // 1) CRM: carga el contacto y la oportunidad directamente
        const crmUrl = form.dataset.crm;
        const crmRequest = crmUrl
          ? fetch(crmUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(Object.fromEntries(formData.entries())),
              signal: AbortSignal.timeout(15000)
            }).then(async (r) => {
              const data = await r.json().catch(() => ({}));
              return r.ok && data.ok === true;
            }).catch(() => false)
          : Promise.resolve(false);

        // 2) Web3Forms: aviso por mail y respaldo si el CRM falla
        const mailRequest = fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        }).then(async (r) => {
          const data = await r.json().catch(() => ({}));
          return data.success === true;
        }).catch(() => false);

        const [crmOk, mailOk] = await Promise.all([crmRequest, mailRequest]);

        if (crmOk || mailOk) {
          if (typeof window.aguaribaiTrack === 'function') {
            window.aguaribaiTrack('generate_lead', {
              area: formData.get('servicio') || '',
              origen: origen.utm_source || origen.referrer || 'directo'
            });
          }
          form.reset();
          showFormModal('success', '¡Consulta enviada!', 'Recibimos tu consulta. Te contactamos dentro de las próximas 24hs hábiles.');
        } else {
          throw new Error('Error al enviar');
        }
      } catch (err) {
        showFormModal('error', 'No pudimos enviar tu consulta', 'Por favor, intentá de nuevo o escribinos a contacto@aguaribai.com.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

});
