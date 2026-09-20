/* ═══════════════════════════════════════════════════
   resources.js — resources page init
   Handles: category filter button, search input
   Note: search is also handled in main.js via #res-search
   guard. This file is the dedicated resources entry point.
═══════════════════════════════════════════════════ */

/* ── CATEGORY FILTER ─────────────────────────────── */
function filterRes(cat, btn) {
  document.querySelectorAll('.filt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.res-card').forEach(c => {
    c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
  });
}
