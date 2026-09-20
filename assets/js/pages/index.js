/* ═══════════════════════════════════════════════════
   index.js — homepage init
   Handles: typewriter, terminal animation, stat counters
   Note: these are also wired in main.js via element guards
   (if !el return). This file is the dedicated entry point
   for homepage-only enhancements.
═══════════════════════════════════════════════════ */

/* ── ACTIVE NAV LINK ─────────────────────────────── */
(function () {
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === 'index.html') a.classList.add('active');
  });
})();
