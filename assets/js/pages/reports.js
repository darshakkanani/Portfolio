/* ═══════════════════════════════════════════════════
   reports.js — Security Reports section
   Works on: expertise.html AND resources.html
   Loads assets/data/reports.json, renders paginated
   category-filtered + searchable cards.
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────── */
  const PAGE_SIZE = 12;
  const JSON_PATH = 'assets/data/reports.json';

  /* ── DOM refs ────────────────────────────────────── */
  let elGrid, elTabs, elMeta, elSearch, elSort, elPagination, elSection;

  /* ── State ───────────────────────────────────────── */
  let allData        = null;
  let activeCategory = 'All';
  let searchQuery    = '';
  let sortKey        = 'upvotes';
  let currentPage    = 1;

  /* ── Helpers ─────────────────────────────────────── */
  function sevFromType(vt) {
    if (!vt) return 'info';
    const t = vt.toLowerCase();
    if (/rce|remote code|command injection|deserialization|heap|memory corruption|out-of-bounds/.test(t)) return 'critical';
    if (/sql injection|ssrf|xxe|privilege escalation|authentication|idor|path traversal/.test(t))        return 'high';
    if (/xss|csrf|open redirect|information disclosure|business logic/.test(t))                          return 'medium';
    if (/clickjacking|uncontrolled resource|misconfiguration|design/.test(t))                             return 'low';
    return 'info';
  }

  function esc(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function fmtBounty(b) {
    if (b == null) return null;
    return b % 1 === 0 ? '$' + b : '$' + b.toFixed(2);
  }

  /* ── Filtered + sorted list ──────────────────────── */
  function getFiltered() {
    if (!allData) return [];
    let pool = [];
    if (activeCategory === 'All') {
      allData.categories.forEach(c => pool.push(...c.reports));
    } else {
      const cat = allData.categories.find(c => c.category === activeCategory);
      if (cat) pool = cat.reports.slice();
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(r =>
        (r.title    && r.title.toLowerCase().includes(q))    ||
        (r.program  && r.program.toLowerCase().includes(q))  ||
        (r.vuln_type && r.vuln_type.toLowerCase().includes(q))
      );
    }
    pool.sort((a, b) => {
      if (sortKey === 'upvotes')     return b.upvotes - a.upvotes;
      if (sortKey === 'upvotes-asc') return a.upvotes - b.upvotes;
      if (sortKey === 'bounty')      return (b.bounty || 0) - (a.bounty || 0);
      if (sortKey === 'title')       return (a.title || '').localeCompare(b.title || '');
      return 0;
    });
    return pool;
  }

  /* ── Card HTML ───────────────────────────────────── */
  function renderCard(r) {
    const sev    = sevFromType(r.vuln_type);
    const bounty = fmtBounty(r.bounty);
    const idText = r.id ? '#' + r.id : '';
    const typesBadge   = r.vuln_type ? '<span class="rc-badge type">' + esc(r.vuln_type) + '</span>' : '';
    const bountyBadge  = bounty      ? '<span class="rc-badge bounty">' + esc(bounty) + '</span>'    : '';
    const upvotesBadge = r.upvotes > 0 ? '<span class="rc-badge upvotes">▲ ' + r.upvotes + '</span>' : '';
    const viewBtn = r.url
      ? '<a class="rc-link" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">View Report ↗</a>'
      : '';
    return '<div class="report-card" data-sev="' + sev + '">' +
      '<div class="rc-top"><span class="rc-program">' + (esc(r.program) || '—') + '</span><span class="rc-id">' + idText + '</span></div>' +
      '<div class="rc-title">' + esc(r.title) + '</div>' +
      '<div class="rc-badges">' + typesBadge + bountyBadge + upvotesBadge + '</div>' +
      '<div class="rc-footer"><span class="rc-program-full">' + (esc(r.program) || '') + '</span>' + viewBtn + '</div>' +
      '</div>';
  }

  /* ── Render grid ─────────────────────────────────── */
  function renderGrid() {
    const pool  = getFiltered();
    const total = pool.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > pages) currentPage = pages;
    const slice = pool.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    elGrid.innerHTML = slice.length
      ? slice.map(renderCard).join('')
      : '<div class="reports-empty">No reports match your filter.</div>';
    renderPagination(pages, total);
  }

  /* ── Pagination ──────────────────────────────────── */
  function renderPagination(pages, total) {
    if (pages <= 1) { elPagination.innerHTML = ''; return; }
    const start = (currentPage - 1) * PAGE_SIZE + 1;
    const end   = Math.min(currentPage * PAGE_SIZE, total);
    let html = '<span class="rp-info">' + start + '–' + end + ' of ' + total + '</span>';
    html += '<button class="rp-btn" id="rp-prev"' + (currentPage === 1 ? ' disabled' : '') + '>‹ Prev</button>';
    const W = 5;
    let ps = Math.max(1, currentPage - Math.floor(W / 2));
    let pe = Math.min(pages, ps + W - 1);
    if (pe - ps < W - 1) ps = Math.max(1, pe - W + 1);
    if (ps > 1) html += '<button class="rp-btn" data-page="1">1</button><span class="rp-info">…</span>';
    for (let p = ps; p <= pe; p++)
      html += '<button class="rp-btn' + (p === currentPage ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
    if (pe < pages) html += '<span class="rp-info">…</span><button class="rp-btn" data-page="' + pages + '">' + pages + '</button>';
    html += '<button class="rp-btn" id="rp-next"' + (currentPage === pages ? ' disabled' : '') + '>Next ›</button>';
    elPagination.innerHTML = html;

    const scrollTarget = () => elGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    elPagination.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => { currentPage = +btn.dataset.page; renderGrid(); scrollTarget(); });
    });
    const prev = elPagination.querySelector('#rp-prev');
    const next = elPagination.querySelector('#rp-next');
    if (prev) prev.addEventListener('click', () => { currentPage--; renderGrid(); scrollTarget(); });
    if (next) next.addEventListener('click', () => { currentPage++; renderGrid(); scrollTarget(); });
  }

  /* ── Category tabs ───────────────────────────────── */
  function renderTabs() {
    const total      = allData.total;
    const uniqueCats = allData.categories.length;
    elMeta.innerHTML = '<span>' + total.toLocaleString() + '</span> reports &middot; <span>' + uniqueCats + '</span> vulnerability types';

    // Update the resources.html filter button count if present
    const countEl = document.getElementById('reports-filter-count');
    if (countEl) countEl.textContent = '(' + total.toLocaleString() + ')';

    let html = '<button class="reports-tab active" data-cat="All">All<span class="reports-tab-count">' + total.toLocaleString() + '</span></button>';
    allData.categories.forEach(c => {
      html += '<button class="reports-tab" data-cat="' + esc(c.category) + '">' + esc(c.category) + '<span class="reports-tab-count">' + c.reports.length + '</span></button>';
    });
    elTabs.innerHTML = html;

    elTabs.querySelectorAll('.reports-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        elTabs.querySelectorAll('.reports-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.cat;
        currentPage    = 1;
        renderGrid();
      });
    });
  }

  /* ── resources.html integration ─────────────────── */
  // The existing filterRes() hides/shows .res-card elements by data-cat.
  // We patch it to also toggle the reports section when cat === 'webapp' or 'reports' or 'all'.
  function patchResourcesFilter() {
    if (typeof window.filterRes !== 'function') return;
    const original = window.filterRes;
    window.filterRes = function (cat, btn) {
      original(cat, btn);
      if (!elSection) return;
      // Show the reports block when: all, webapp, or the dedicated 'reports' filter
      const show = (cat === 'all' || cat === 'webapp' || cat === 'reports');
      elSection.classList.toggle('hidden', !show);
      // When filtered to 'reports' only, also hide res-cat headings and res-grids
      document.querySelectorAll('.res-cat-heading, .res-grid').forEach(el => {
        if (cat === 'reports') {
          el.classList.add('hidden');
        } else {
          el.classList.remove('hidden');
        }
      });
    };
  }

  // Also wire the page-level #res-search into report search
  function patchResourcesSearch() {
    const pageSearch = document.getElementById('res-search');
    if (!pageSearch) return;
    let t;
    pageSearch.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        searchQuery = pageSearch.value.trim();
        // also sync inner search box if present
        if (elSearch) elSearch.value = searchQuery;
        currentPage = 1;
        renderGrid();
      }, 280);
    });
  }

  /* ── Load JSON ───────────────────────────────────── */
  function loadReports() {
    fetch(JSON_PATH)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => {
        allData = data;
        renderTabs();
        renderGrid();
        patchResourcesFilter();
        patchResourcesSearch();
      })
      .catch(err => {
        elGrid.innerHTML = '<div class="reports-empty">Could not load reports (' + err.message + ').</div>';
      });
  }

  /* ── Init ────────────────────────────────────────── */
  function init() {
    elGrid       = document.getElementById('reports-grid');
    elTabs       = document.getElementById('reports-tabs');
    elMeta       = document.getElementById('reports-meta');
    elSearch     = document.getElementById('reports-search-inner') || document.getElementById('reports-search');
    elSort       = document.getElementById('reports-sort');
    elPagination = document.getElementById('reports-pagination');
    elSection    = document.getElementById('reports-section');

    if (!elGrid) return; // reports section not on this page

    // Inner search box (expertise page has its own; resources uses the page-level one)
    if (elSearch) {
      let t;
      elSearch.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => { searchQuery = elSearch.value.trim(); currentPage = 1; renderGrid(); }, 280);
      });
    }

    if (elSort) {
      elSort.addEventListener('change', () => { sortKey = elSort.value; currentPage = 1; renderGrid(); });
    }

    loadReports();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
