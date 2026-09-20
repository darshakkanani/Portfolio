/* ═══════════════════════════════════════════════════
   achievements.js — achievements page init
   Handles: stat number counter animation
═══════════════════════════════════════════════════ */

/* ── STAT COUNTER ANIMATION ──────────────────────── */
(function () {
  const stats = document.querySelectorAll('.ach-stat-num[data-target]');
  if (!stats.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '+';
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(t);
      }, 28);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => obs.observe(el));
})();
