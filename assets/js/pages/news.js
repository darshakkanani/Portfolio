/* ═══════════════════════════════════════════════════
   news.js — cybersecurity news page
   Tab filtering for curated source cards.
   (Live RSS feed requires a backend/proxy — tabs
    operate on the static curated cards for now.)
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Hide live feed placeholders (no backend) ──── */
  const loading = document.getElementById('news-loading');
  const grid    = document.getElementById('news-grid');
  if (loading) loading.classList.add('hidden');
  if (grid)    grid.classList.add('hidden');

  /* ── Tab filter on curated source cards ─────────── */
  const tabs  = document.querySelectorAll('.news-tab');
  if (!tabs.length) return;

  // Map tab data-cat to keywords to match against card text
  const CAT_KEYWORDS = {
    cve:      ['cve', 'nvd', 'exploit', 'vulnerability', 'rapid7', 'project zero'],
    breach:   ['breach', 'krebs', 'bleeping', 'ransomware'],
    research: ['research', 'project zero', 'rapid7', 'blog'],
    tools:    ['tool', 'exploit-db', 'burp', 'scanner'],
    intel:    ['intel', 'cisa', 'threat', 'dark reading', 'hacker news'],
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      const cards = document.querySelectorAll('.news-source-card');
      cards.forEach(card => {
        if (cat === 'all') {
          card.style.display = '';
          return;
        }
        const keywords = CAT_KEYWORDS[cat] || [];
        const text = card.innerText.toLowerCase();
        const match = keywords.some(kw => text.includes(kw));
        card.style.display = match ? '' : 'none';
      });
    });
  });

  /* ── Scroll reveal for curated section ──────────── */
  const curated = document.querySelector('.news-curated');
  if (!curated) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      e.target.style.opacity = '1';
      e.target.style.transform = 'none';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.04 });
  curated.style.opacity = '0';
  curated.style.transform = 'translateY(16px)';
  obs.observe(curated);
})();
