/* =========================================================
   Sukma Wijayanti — interaction layer
   ========================================================= */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var html = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  var themeToggle = doc.getElementById('theme-toggle');
  var themeColor = doc.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#0a0f0d' : '#0e6e52');
  }

  applyTheme(html.getAttribute('data-theme') || 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Header state ---------- */
  var header = doc.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuToggle = doc.getElementById('menu-toggle');
  var nav = doc.getElementById('primary-nav');

  function closeMenu() {
    body.classList.remove('nav-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    }
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated counters ---------- */
  var counters = doc.querySelectorAll('.count');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    var start = null;
    var duration = 1100;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counters.length) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Scroll spy ---------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return doc.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if (sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Project filter ---------- */
  var filterButtons = Array.prototype.slice.call(doc.querySelectorAll('.filter'));
  var projectRows = Array.prototype.slice.call(doc.querySelectorAll('.project-row'));
  var filterStatus = doc.getElementById('filter-status');

  // Keep filter counts in sync with the actual index.
  var projectCounts = {};
  projectRows.forEach(function (row) {
    var tag = row.getAttribute('data-tag');
    projectCounts[tag] = (projectCounts[tag] || 0) + 1;
  });
  projectCounts.all = projectRows.length;
  filterButtons.forEach(function (button) {
    var key = button.getAttribute('data-filter');
    var countEl = button.querySelector('.filter-count');
    if (countEl && typeof projectCounts[key] === 'number') {
      countEl.textContent = String(projectCounts[key]);
    }
  });

  function applyFilter(filter) {
    var visible = 0;
    projectRows.forEach(function (row) {
      var match = filter === 'all' || row.getAttribute('data-tag') === filter;
      row.classList.toggle('is-hidden', !match);
      if (match) {
        visible += 1;
        row.style.animation = 'none';
        void row.offsetWidth;
        row.style.animation = '';
      }
    });
    filterButtons.forEach(function (button) {
      var active = button.getAttribute('data-filter') === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (filterStatus) {
      filterStatus.textContent = visible + (visible === 1 ? ' workstream' : ' workstreams');
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button.getAttribute('data-filter'));
    });
  });

  /* ---------- Copy email ---------- */
  var copyBtn = doc.getElementById('copy-email');
  var toast = doc.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  body.appendChild(toast);
  var toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = doc.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      body.appendChild(area);
      area.select();
      try {
        var ok = doc.execCommand('copy');
        body.removeChild(area);
        ok ? resolve() : reject(new Error('copy failed'));
      } catch (error) {
        body.removeChild(area);
        reject(error);
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      copyText(email).then(function () {
        showToast('Email copied — ' + email);
        var label = copyBtn.querySelector('span');
        if (label) {
          var original = label.textContent;
          label.textContent = 'Copied';
          setTimeout(function () { label.textContent = original; }, 2000);
        }
      }).catch(function () {
        showToast('Copy failed — email is ' + email);
      });
    });
  }

  /* ---------- Year ---------- */
  var yearEl = doc.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
