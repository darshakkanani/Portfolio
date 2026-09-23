/* ═══════════════════════════════════════════════════
   checklist.js — interactive checklist behaviours
   Features:
   - Scroll-reveal for phase blocks
   - Live stats bar (total / checked / crit / high / med / pct)
   - Severity + unchecked filter buttons
   - Full-text search across item text + code elements
   - Checkbox persistence via localStorage (per page)
   - Reset all button
═══════════════════════════════════════════════════ */
(function () {

  /* ── 1. Scroll reveal ────────────────────────────── */
  const revealEls = document.querySelectorAll('.mth-phase, .mth-index, .mth-callout, .cl-owasp-map');
  if (revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        obs.unobserve(e.target);
      });
    }, { threshold: 0.04 });
    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      setTimeout(() => obs.observe(el), i * 35);
    });
  }

  /* ── 2. State ────────────────────────────────────── */
  const PAGE_KEY = 'cl2_' + window.location.pathname.replace(/\//g, '_');
  let currentFilter = 'all';
  let currentSearch = '';

  /* ── 3. Load persisted checkbox state ───────────── */
  function loadState() {
    let state;
    try { state = JSON.parse(localStorage.getItem(PAGE_KEY)); } catch (e) {}
    if (!state) return;
    document.querySelectorAll('.cl-item input[type="checkbox"]').forEach((cb, i) => {
      if (state[i]) cb.checked = true;
    });
  }

  function saveState() {
    const state = {};
    document.querySelectorAll('.cl-item input[type="checkbox"]').forEach((cb, i) => {
      state[i] = cb.checked;
    });
    try { localStorage.setItem(PAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ── 4. Stats update ─────────────────────────────── */
  function updateStats() {
    const all = document.querySelectorAll('.cl-item');
    const checked = document.querySelectorAll('.cl-item input:checked');
    let crit = 0, high = 0, med = 0;
    all.forEach(item => {
      const sev = item.getAttribute('data-sev');
      if (sev === 'crit') crit++;
      else if (sev === 'high') high++;
      else if (sev === 'med') med++;
    });
    const total = all.length;
    const done = checked.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const el = id => document.getElementById(id);
    if (el('st-total')) el('st-total').textContent = total;
    if (el('st-done'))  el('st-done').textContent  = done;
    if (el('st-crit'))  el('st-crit').textContent  = crit;
    if (el('st-high'))  el('st-high').textContent  = high;
    if (el('st-med'))   el('st-med').textContent   = med;
    if (el('st-pct'))   el('st-pct').textContent   = pct + '%';
    const fill = el('cl-prog-fill');
    if (fill) fill.style.width = pct + '%';
  }

  /* ── 5. Filter + Search visibility ──────────────── */
  function applyVisibility() {
    const items = document.querySelectorAll('.cl-item');
    let anyVisible = false;

    items.forEach(item => {
      const sev = item.getAttribute('data-sev') || '';
      const isChecked = item.querySelector('input').checked;
      const text = item.innerText.toLowerCase();

      // Filter logic
      let showFilter = true;
      if (currentFilter === 'crit')      showFilter = sev === 'crit';
      else if (currentFilter === 'high') showFilter = sev === 'high';
      else if (currentFilter === 'med')  showFilter = sev === 'med';
      else if (currentFilter === 'low')  showFilter = sev === 'low';
      else if (currentFilter === 'unchecked') showFilter = !isChecked;

      // Search logic
      const showSearch = currentSearch === '' || text.includes(currentSearch);

      const show = showFilter && showSearch;
      item.classList.toggle('hidden', !show);
      if (show) anyVisible = true;
    });

    // Hide/show entire sections if all their items are hidden
    document.querySelectorAll('.mth-phase').forEach(section => {
      const visibleItems = section.querySelectorAll('.cl-item:not(.hidden)');
      section.classList.toggle('cl-section-hidden', visibleItems.length === 0);
    });

    const noRes = document.getElementById('cl-no-results');
    if (noRes) noRes.classList.toggle('visible', !anyVisible);
  }

  /* ── 6. Filter buttons ───────────────────────────── */
  document.querySelectorAll('.cl-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cl-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      applyVisibility();
    });
  });

  /* ── 7. Search ───────────────────────────────────── */
  const searchInput = document.getElementById('cl-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.toLowerCase().trim();
      applyVisibility();
    });
  }

  /* ── 8. Reset button ─────────────────────────────── */
  const resetBtn = document.getElementById('cl-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Reset all checkboxes for this checklist?')) return;
      document.querySelectorAll('.cl-item input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      saveState();
      updateStats();
    });
  }

  /* ── 9. Checkbox change listener ────────────────── */
  document.addEventListener('change', e => {
    if (e.target.matches('.cl-item input[type="checkbox"]')) {
      saveState();
      updateStats();
      // Reapply visibility for "unchecked" filter
      if (currentFilter === 'unchecked') applyVisibility();
    }
  });

  /* ── 10. Init ────────────────────────────────────── */
  loadState();
  updateStats();
  applyVisibility();

})();
