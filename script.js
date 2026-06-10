const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const siteHeader = document.querySelector('.site-header');

function setNavExpanded(expanded) {
  if (!siteNav || !navToggle) return;
  siteNav.classList.toggle('nav-open', expanded);
  navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function closeNav() {
  setNavExpanded(false);
}

if (navToggle && siteNav) {
  // Toggle on hamburger click
  navToggle.addEventListener('click', () => {
    const expanded = siteNav.classList.contains('nav-open');
    setNavExpanded(!expanded);
  });

  // Close nav after clicking any section link (so navigation is immediate on mobile)
  siteNav.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a[href^="#"], a[href="#"]');
    if (!link) return;

    setTimeout(closeNav, 0);
  });
}

// Sticky header glassmorphism after scrolling
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle('header-scrolled', window.scrollY > 8);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Active section highlighting (while scrolling)
const navLinks = document.querySelectorAll('.nav-link');
const sectionIds = Array.from(navLinks)
  .map((a) => a.getAttribute('href'))
  .filter((href) => href && href.startsWith('#'))
  .map((href) => href.slice(1));

if (navLinks.length && sectionIds.length) {
  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

      if (!visible.length) return;
      setActive(visible[0].target.id);
    },
    {
      root: null,
      threshold: [0.2, 0.35, 0.5, 0.65],
      // account for fixed/sticky header height
      rootMargin: '-88px 0px -60% 0px'
    }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

// Section reveal animations
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--in');
          revealIo.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  revealEls.forEach((el) => revealIo.observe(el));
}




