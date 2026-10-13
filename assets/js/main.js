// Amirthalingam P — Portfolio interactions
// Vanilla JS only. Respects prefers-reduced-motion.

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Navbar scroll state ---- */
  const nav = document.getElementById('mainNav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Active section indicator via IntersectionObserver ---- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('#navigation .nav-link');
  const setActive = (id) => {
    navLinks.forEach((link) => {
      const match = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', match);
    });
  };
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---- Close mobile navbar on link click ---- */
  const navCollapse = document.getElementById('navigation');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
        const collapse = window.bootstrap
          ? window.bootstrap.Collapse.getOrCreateInstance(navCollapse)
          : null;
        if (collapse) collapse.hide();
        else navCollapse.classList.remove('show');
      }
    });
  });

  /* ---- Smooth anchor scrolling fallback (in case native is blocked) ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  /* ---- Hero entrance animation ---- */
  if (!prefersReduced) {
    const heroCopy = document.querySelector('.hero-copy.reveal');
    const heroVisual = document.querySelector('.hero-visual.reveal');
    if (heroCopy) heroCopy.classList.add('visible');
    if (heroVisual) heroVisual.classList.add('visible');
  }

  /* ---- Update footer year ---- */
  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));
})();
