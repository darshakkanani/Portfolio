/* ═══════════════════════════════════════════════════
   certifications.js — certifications page init
   Handles: PDF certificate modal viewer,
            card keyboard accessibility
═══════════════════════════════════════════════════ */

/* ── PDF MODAL ───────────────────────────────────── */
(function () {
  const backdrop = document.getElementById('cert-modal-backdrop');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalBody = document.getElementById('cert-modal-body');
  const modalDownload = document.getElementById('cert-modal-download');
  if (!backdrop) return;

  /* Open modal — resolve whether PDF exists first */
  function openModal(pdfPath, title) {
    modalTitle.textContent = title;
    modalDownload.href = pdfPath;
    modalDownload.download = pdfPath.split('/').pop();

    /* Try to load the PDF; show placeholder if not found */
    fetch(pdfPath, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          modalBody.innerHTML = `<iframe src="${pdfPath}" title="${title}"></iframe>`;
        } else {
          showPlaceholder(pdfPath);
        }
      })
      .catch(() => showPlaceholder(pdfPath));

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function showPlaceholder(pdfPath) {
    const filename = pdfPath.split('/').pop();
    modalBody.innerHTML = `
      <div class="cert-modal-placeholder">
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
        <p>Certificate PDF not uploaded yet.<br>Add <code>${filename}</code> to the <code>assets/certificates/</code> folder.</p>
      </div>`;
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modalBody.innerHTML = ''; }, 260);
  }

  /* Close on backdrop click or Escape */
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });
  document.getElementById('cert-modal-close').addEventListener('click', closeModal);

  /* Wire all [data-cert-pdf] links */
  document.querySelectorAll('[data-cert-pdf]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      openModal(link.dataset.certPdf, link.dataset.certTitle || 'Certificate');
    });
  });
})();

/* ── KEYBOARD ACCESSIBILITY ──────────────────────── */
(function () {
  document.querySelectorAll('.cert-big-card, .course-row').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const link = card.querySelector('[data-cert-pdf], a');
        if (link) link.click();
      }
    });
  });
})();
