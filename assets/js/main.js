// Portfolio interactions
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('mainNav');
  const menuToggle = document.getElementById('menuToggle');
  const navCollapse = document.getElementById('navigation');
  const navLinks = document.querySelectorAll('#navigation .nav-link');

  const updateNav = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  const setActiveSection = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const closeMobileMenu = () => {
    if (!navCollapse || !menuToggle) return;
    navCollapse.classList.remove('mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };

  menuToggle?.addEventListener('click', () => {
    if (!navCollapse) return;
    const isOpen = navCollapse.classList.toggle('mobile-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
  document.addEventListener('click', (event) => {
    if (!nav || !navCollapse || !menuToggle || !navCollapse.classList.contains('mobile-open')) return;
    if (!nav.contains(event.target)) closeMobileMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) closeMobileMenu();
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  if (!prefersReducedMotion) {
    document.querySelector('.hero-copy.reveal')?.classList.add('visible');
    document.querySelector('.hero-visual.reveal')?.classList.add('visible');
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
