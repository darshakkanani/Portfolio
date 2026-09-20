/* ═══════════════════════════════════════════════════
   contact.js — form submit handler
═══════════════════════════════════════════════════ */
function handleSubmit() {
  const btn = document.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.style.display = 'none';
    document.getElementById('form-success').classList.add('visible');
  }, 1200);
}
