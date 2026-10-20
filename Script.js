/*
  ICIAA WEBSITE INTERACTIONS
  This file controls the mobile menu, active navigation state, advisory committee accordion,
  and the gallery image viewer. Text, email addresses and photo sources are mainly edited
  in index.html. Keep this file unchanged unless modifying interactive behaviour.
*/
(() => {
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = [...document.querySelectorAll('.nav-link, .nav-contact')];

  function closeMenu() {
    if (!menuToggle || !primaryNav) return;
    primaryNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
  }
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Highlight the current section while scrolling.
  const sections = [...document.querySelectorAll('main > section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) link.classList.toggle('active', href === `#${id}`);
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Advisory committee accordion.
  const committeeToggle = document.getElementById('committeeToggle');
  const committeeDetails = document.getElementById('committeeDetails');
  if (committeeToggle && committeeDetails) {
    committeeToggle.addEventListener('click', () => {
      const expanded = committeeToggle.getAttribute('aria-expanded') === 'true';
      committeeToggle.setAttribute('aria-expanded', String(!expanded));
      committeeDetails.hidden = expanded;
    });
  }

  // Accessible gallery lightbox.
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  let previousFocus = null;

  function openLightbox(button) {
    const img = button.querySelector('img');
    if (!img || !lightbox || !lightboxImage || !lightboxCaption || !lightboxClose) return;
    previousFocus = document.activeElement;
    lightboxImage.src = button.dataset.image || img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = button.dataset.caption || img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImage) lightboxImage.src = '';
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  document.querySelectorAll('.gallery-item').forEach(button => button.addEventListener('click', () => openLightbox(button)));
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  // Keep a graceful visual fallback if a architectural photograph fails to load.
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.dataset.failed = 'true';
      if (img.closest('.gallery-item') || img.classList.contains('hero-image')) {
        img.style.background = 'linear-gradient(135deg, #17494a, #c5a16a)';
      }
    }, { once: true });
  });
})();
