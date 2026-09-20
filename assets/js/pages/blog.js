/* ═══════════════════════════════════════════════════
   blog.js — 3-section / vuln-card / post-row layout
   Handles:
     • Vuln-card accordion (expand / collapse)
     • Section filter buttons (All / Hacking / Web App / AI)
     • Full-text search across all post rows
     • Post-count badges on section headers
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Post-count badges ──────────────────────── */
  function updateCounts () {
    document.querySelectorAll('.blog-section').forEach(section => {
      const id  = section.dataset.section;
      const el  = document.getElementById('count-' + id);
      if (!el) return;
      const n   = section.querySelectorAll('.vp-item').length;
      el.textContent = n === 1 ? '1 post' : n + ' posts';
    });
  }

  /* ── 2. Vuln-card accordion ────────────────────── */
  document.querySelectorAll('.vuln-card-head:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panel    = btn.nextElementSibling; // .vuln-posts

      // Collapse all others in the same section (optional: remove for multi-open)
      const section = btn.closest('.blog-section');
      section.querySelectorAll('.vuln-card-head[aria-expanded="true"]').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const p = other.nextElementSibling;
          if (p) p.hidden = true;
        }
      });

      // Toggle clicked card
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  /* ── 3. Section filter buttons ─────────────────── */
  const filterBtns = document.querySelectorAll('.filt-btn[data-section]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.section;
      document.querySelectorAll('.blog-section').forEach(section => {
        const show = target === 'all' || section.dataset.section === target;
        section.hidden = !show;
      });

      // Re-run search in case query is active
      runSearch();
    });
  });

  /* ── 4. Search ──────────────────────────────────── */
  const searchInput = document.getElementById('blog-search');

  function runSearch () {
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

    // Determine active section filter
    const activeBtn = document.querySelector('.filt-btn[data-section].active');
    const activeSection = activeBtn ? activeBtn.dataset.section : 'all';

    let anyVisible = false;

    document.querySelectorAll('.blog-section').forEach(section => {
      const sectionVisible = activeSection === 'all' || section.dataset.section === activeSection;
      if (!sectionVisible) return; // already hidden by filter

      let sectionHasMatch = false;

      section.querySelectorAll('.vuln-card').forEach(card => {
        if (card.classList.contains('vuln-card--empty')) return; // skip placeholders

        let cardHasMatch = false;

        card.querySelectorAll('.vp-item').forEach(post => {
          const title = (post.dataset.title || '').toLowerCase();
          const tags  = (post.dataset.tags  || '').toLowerCase();
          const body  = post.textContent.toLowerCase();
          const match = !q || title.includes(q) || tags.includes(q) || body.includes(q);

          post.classList.toggle('search-hidden', !match);
          if (match) { cardHasMatch = true; sectionHasMatch = true; anyVisible = true; }
        });

        // If searching and card has no match, collapse and hide it
        if (q) {
          card.classList.toggle('search-hidden', !cardHasMatch);
          if (cardHasMatch) {
            // Auto-expand cards that have matches
            const head  = card.querySelector('.vuln-card-head');
            const panel = card.querySelector('.vuln-posts');
            if (head && panel) {
              head.setAttribute('aria-expanded', 'true');
              panel.hidden = false;
            }
          }
        } else {
          card.classList.remove('search-hidden');
          // Don't forcibly collapse on clear — leave user's open state
        }
      });

      // Hide/show the whole section if searching and nothing matches
      if (q) section.hidden = !sectionHasMatch;
    });

    // No-results banner
    const noResults = document.getElementById('no-results');
    if (noResults) noResults.classList.toggle('visible', q !== '' && !anyVisible);
  }

  if (searchInput) {
    searchInput.addEventListener('input', runSearch);
  }

  /* ── Init ───────────────────────────────────────── */
  updateCounts();

})();
