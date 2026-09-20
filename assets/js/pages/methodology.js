/* ═══════════════════════════════════════════════════
   methodology.js — scroll-reveal for phase blocks
═══════════════════════════════════════════════════ */
(function () {
  const phases = document.querySelectorAll('.mth-phase, .mth-index');
  if (!phases.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.06 });
  phases.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    setTimeout(() => obs.observe(el), i * 40);
  });
})();
