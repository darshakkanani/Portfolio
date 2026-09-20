/* ═══════════════════════════════════════════════════
   blog.js — blog page init
   Handles: search input, category filter buttons
   Note: search + filter are also wired in main.js via
   element guards. This file is the dedicated blog entry point.
═══════════════════════════════════════════════════ */

/* ── SEARCH ──────────────────────────────────────── */
(function () {
  const input = document.getElementById('blog-search');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    let vis = 0;
    document.querySelectorAll('.blog-card').forEach(c => {
      const match = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = match ? '' : 'none';
      if (match) vis++;
    });
    const nr = document.getElementById('no-results');
    if (nr) nr.classList.toggle('visible', vis === 0);
  });
})();

/* ── CATEGORY FILTER ─────────────────────────────── */
(function () {
  document.querySelectorAll('.blog-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.blog-card').forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
})();
