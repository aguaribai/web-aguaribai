/* ============================================
   Aguaribai IA — Medición del sitio
   - Google Analytics 4 y Microsoft Clarity: se cargan SOLO si la persona acepta las cookies.
   - Origen de la visita (UTM / sitio de referencia): se guarda en la pestaña, sin cookies,
     para saber de dónde viene cada consulta.
   ============================================ */
(function () {
  'use strict';

  var GA_ID = 'G-S887YD2EZ1';
  var CLARITY_ID = 'zjc7f8ztu9';
  var CONSENT_KEY = 'aguaribai_cookies';   // 'granted' | 'denied'
  var ATTR_KEY = 'aguaribai_origen';

  var loaded = false;

  // ---------- Origen de la visita (sin cookies) ----------
  function readAttribution() {
    try {
      var saved = sessionStorage.getItem(ATTR_KEY);
      if (saved) return JSON.parse(saved);

      var p = new URLSearchParams(location.search);
      var host = '';
      try { host = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) { host = ''; }
      if (host === location.hostname) host = '';

      var data = {
        utm_source: (p.get('utm_source') || '').slice(0, 80),
        utm_medium: (p.get('utm_medium') || '').slice(0, 80),
        utm_campaign: (p.get('utm_campaign') || '').slice(0, 120),
        utm_content: (p.get('utm_content') || '').slice(0, 120),
        referrer: host.slice(0, 120)
      };
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(data));
      return data;
    } catch (e) {
      return {};
    }
  }
  var attribution = readAttribution();

  // ---------- Carga de herramientas (solo con consentimiento) ----------
  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    // Google Analytics 4
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window['ga-disable-' + GA_ID] = false;
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(ga);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);

    // Microsoft Clarity
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function clearAnalyticsCookies() {
    window['ga-disable-' + GA_ID] = true;
    var names = document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); });
    var host = location.hostname.replace(/^www\./, '');
    names.forEach(function (n) {
      if (/^(_ga|_gid|_clck|_clsk|CLID|ANONCHK|MR|MUID|SM|_gat)/.test(n)) {
        [location.hostname, '.' + host, ''].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* sin almacenamiento */ }
  }

  // ---------- Eventos ----------
  function track(name, params) {
    if (loaded && typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  }
  window.aguaribaiTrack = track;
  window.aguaribaiOrigen = function () { return attribution; };

  // ---------- Aviso de cookies ----------
  var banner = null;

  function injectStyles() {
    if (document.getElementById('cookie-banner-styles')) return;
    var css = '' +
      '.cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:1000;max-width:720px;margin:0 auto;' +
      'background:#141d2e;border:1px solid #232f45;border-radius:16px;padding:18px 20px;color:#f3f5f8;' +
      'box-shadow:0 20px 50px rgba(0,0,0,.45);font-family:var(--font-sans,Poppins,sans-serif);' +
      'display:flex;gap:16px;align-items:center;flex-wrap:wrap}' +
      '.cookie-banner p{flex:1 1 320px;margin:0;font-size:.88rem;line-height:1.55;color:#aab3c5}' +
      '.cookie-banner a{color:#8fe356;text-decoration:underline}' +
      '.cookie-banner .cookie-actions{display:flex;gap:10px;flex:0 0 auto}' +
      '.cookie-banner button{font:inherit;font-size:.88rem;font-weight:600;border-radius:999px;padding:10px 20px;cursor:pointer;' +
      'border:1px solid #232f45;background:transparent;color:#f3f5f8}' +
      '.cookie-banner button.cookie-accept{background:#71c837;border-color:#71c837;color:#0a0e17}' +
      '.cookie-banner button:hover{filter:brightness(1.1)}' +
      '.cookie-banner button:focus-visible,.cookie-banner a:focus-visible{outline:2px solid #8fe356;outline-offset:2px}' +
      '@media (max-width:520px){.cookie-banner .cookie-actions{width:100%}.cookie-banner button{flex:1}}';
    var style = document.createElement('style');
    style.id = 'cookie-banner-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function hideBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function showBanner() {
    if (banner) return;
    injectStyles();
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferencias de cookies');
    banner.innerHTML =
      '<p>Usamos cookies de medición (Google Analytics y Microsoft Clarity) para entender cómo se usa el sitio y mejorarlo. ' +
      'Solo se activan si las aceptás. <a href="politica-de-cookies.html">Más información</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="cookie-reject">Rechazar</button>' +
      '<button type="button" class="cookie-accept">Aceptar</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('.cookie-accept').addEventListener('click', function () {
      setConsent('granted');
      hideBanner();
      loadAnalytics();
    });
    banner.querySelector('.cookie-reject').addEventListener('click', function () {
      setConsent('denied');
      hideBanner();
      clearAnalyticsCookies();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var consent = getConsent();
    if (consent === 'granted') loadAnalytics();
    else if (consent !== 'denied') showBanner();

    // Enlace del pie para cambiar la decisión
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showBanner();
      });
    });

    // Clic en los botones que llevan al formulario
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a.btn[href="#contacto"]') : null;
      if (link) track('click_cta_diagnostico', { texto: (link.textContent || '').trim().slice(0, 60) });
    });

    // Primer contacto con el formulario (para ver cuánta gente lo empieza y no lo envía)
    var form = document.getElementById('contactForm');
    if (form) {
      var started = false;
      form.addEventListener('focusin', function () {
        if (started) return;
        started = true;
        track('form_start');
      });
    }
  });
})();
