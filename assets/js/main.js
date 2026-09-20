/* ═══════════════════════════════════════════════════
   Darshak Patel — Portfolio  |  main.js
═══════════════════════════════════════════════════ */

/* ── PARTICLES ─────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const dots = Array.from({ length: 80 }, () => ({
    x: Math.random() * 1600, y: Math.random() * 900,
    vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
    r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.3 + 0.06,
  }));
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize(); addEventListener('resize', resize);
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${d.a})`; ctx.fill();
      for (let j = i + 1; j < dots.length; j++) {
        const d2 = dots[j], dx = d.x - d2.x, dy = d.y - d2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d2.x, d2.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
})();

/* ── TYPEWRITER ─────────────────────────────────── */
(function () {
  const el = document.getElementById('typed');
  if (!el) return;
  const phrases = ['Cybersecurity Student','Ethical Hacker','Web App Pentester','Blockchain Auditor','AI Security Researcher','CTF Enthusiast'];
  let pi = 0, ci = 0, del = false;
  (function tick() {
    const p = phrases[pi];
    if (!del) { el.textContent = p.slice(0, ++ci); if (ci === p.length) { del = true; setTimeout(tick, 1600); return; } }
    else { el.textContent = p.slice(0, --ci); if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; } }
    setTimeout(tick, del ? 42 : 78);
  })();
})();

/* ── TERMINAL ───────────────────────────────────── */
(function () {
  const body = document.getElementById('term-body');
  if (!body) return;
  const lines = [
    { t: 'p', v: 'whoami' },
    { t: 'ok', v: 'darshak_patel  —  B.Tech CSE · Cybersecurity' },
    { t: 'p', v: 'cat focus.txt' },
    { t: 'out', v: '  Ethical Hacking & Pentesting' },
    { t: 'out', v: '  Web Application Security' },
    { t: 'out', v: '  Blockchain / Smart Contract Auditing' },
    { t: 'out', v: '  AI / LLM Security Research' },
    { t: 'p', v: 'nmap -sV --open target.io' },
    { t: 'out', v: '  PORT    STATE  SERVICE   VERSION' },
    { t: 'out', v: '  80/tcp  open   http      nginx 1.26' },
    { t: 'out', v: '  443/tcp open   https     TLSv1.3' },
    { t: 'ok', v: '  Analysis complete.' },
    { t: 'p', v: 'echo "Ready to secure your systems."' },
    { t: 'hi', v: '  Ready to secure your systems.' },
  ];
  let i = 0;
  function add() {
    if (i >= lines.length) return;
    const l = lines[i++];
    const s = document.createElement('span');
    s.className = 'term-line';
    if (l.t === 'p') s.innerHTML = `<span class="term-prompt">~</span> <span class="term-cmd">${l.v}</span>`;
    else { s.className = `term-line term-out ${l.t}`; s.textContent = l.v; }
    body.appendChild(s); body.scrollTop = body.scrollHeight;
    setTimeout(add, l.t === 'p' ? 600 : 160);
  }
  setTimeout(add, 700);
})();

/* ── COUNTERS ───────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.stat-num[data-target]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.target;
      const suffix = target === 100 ? '%' : '+';
      let cur = 0; const step = Math.max(1, Math.ceil(target / 45));
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(t);
      }, 26);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(n => obs.observe(n));
})();

/* ── RESOURCE FILTER ────────────────────────────── */
function filterRes(cat, btn) {
  document.querySelectorAll('.filt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.res-card').forEach(c => {
    c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
  });
}

/* ── SCROLL REVEAL ──────────────────────────────── */
(function () {
  const targets = document.querySelectorAll('.exp-card,.res-card,.domain-row,.blog-card,.reveal,.ci-card,.open-card,.cert-card,.domain-section,.check-item');
  targets.forEach((el, i) => { el.style.opacity = '0'; el.style.transform = 'translateY(14px)'; });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = (+e.target.dataset.delay || 0) * 55;
      setTimeout(() => {
        e.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        e.target.style.opacity = '1'; e.target.style.transform = 'none';
      }, delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  targets.forEach((el, i) => { el.dataset.delay = i % 5; obs.observe(el); });
})();

/* ── HAMBURGER ──────────────────────────────────── */
(function () {
  const btn = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-links');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ── BLOG SEARCH & FILTER ───────────────────────── */
(function () {
  const input = document.getElementById('blog-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    let vis = 0;
    document.querySelectorAll('.blog-card').forEach(c => {
      const m = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = m ? '' : 'none'; if (m) vis++;
    });
    const nr = document.getElementById('no-results');
    if (nr) nr.classList.toggle('visible', vis === 0);
  });
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

/* ── RESOURCES PAGE SEARCH ──────────────────────── */
(function () {
  const input = document.getElementById('res-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    let vis = 0;
    document.querySelectorAll('.res-card').forEach(c => {
      const m = !q || c.textContent.toLowerCase().includes(q);
      c.classList.toggle('hidden', !m); if (m) vis++;
    });
    document.querySelectorAll('[data-cat-group]').forEach(h => {
      const cat = h.dataset.catGroup;
      const hasVis = [...document.querySelectorAll(`.res-card[data-cat="${cat}"]`)].some(c => !c.classList.contains('hidden'));
      h.style.display = hasVis ? '' : 'none';
    });
    const nr = document.getElementById('no-res');
    if (nr) nr.classList.toggle('visible', vis === 0);
  });
})();
