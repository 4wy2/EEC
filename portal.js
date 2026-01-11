/* =========================
   Portal Sidebar (index.html)
========================= */

(function(){
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('overlay');
  const openBtn  = document.getElementById('openSidebar');
  const closeBtn = document.getElementById('closeSidebar');

  if (!sidebar || !overlay || !openBtn || !closeBtn) return;

  function openSidebar(){
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    openBtn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar(){
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    openBtn.setAttribute('aria-expanded', 'false');
  }

  openBtn.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });
})();
