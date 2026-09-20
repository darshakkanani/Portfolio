/* ═══════════════════════════════════════════════════
   expertise.js — expertise page init
   Handles: domain section scroll-reveal stagger
═══════════════════════════════════════════════════ */

/* ── DOMAIN SECTION STAGGER ──────────────────────── */
(function () {
  const sections = document.querySelectorAll('.domain-section');
  if (!sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.06 });

  sections.forEach((s, i) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(18px)';
    setTimeout(() => obs.observe(s), i * 40);
  });
})();
