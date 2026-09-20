/* ═══════════════════════════════════════════════════
   tools.js — category filter + search
═══════════════════════════════════════════════════ */

/* ── CATEGORY FILTER ─────────────────────────────── */
function filterTools(cat, btn) {
  document.querySelectorAll('.filt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tool-card').forEach(c => {
    c.classList.toggle('t-hidden', cat !== 'all' && c.dataset.cat !== cat);
  });
  document.querySelectorAll('.tools-section').forEach(s => {
    const sec = s.dataset.section;
    const hasVisible = cat === 'all' || sec === cat;
    s.style.display = hasVisible ? '' : 'none';
  });
  checkNoResults();
}

/* ── SEARCH ──────────────────────────────────────── */
(function () {
  const input = document.getElementById('tools-search');
  if (!input) return;
  input.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    document.querySelectorAll('.tool-card').forEach(c => {
      const match = !q || c.textContent.toLowerCase().includes(q);
      c.classList.toggle('t-hidden', !match);
    });
    document.querySelectorAll('.tools-section').forEach(s => {
      const hasVisible = [...s.querySelectorAll('.tool-card')].some(c => !c.classList.contains('t-hidden'));
      s.style.display = hasVisible ? '' : 'none';
    });
    checkNoResults();
  });
})();

/* ── EMPTY STATE ─────────────────────────────────── */
function checkNoResults() {
  const anyVisible = [...document.querySelectorAll('.tool-card')].some(c => !c.classList.contains('t-hidden'));
  const noTools = document.getElementById('no-tools');
  if (noTools) noTools.classList.toggle('visible', !anyVisible);
}
