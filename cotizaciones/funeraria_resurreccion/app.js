// ─── FAQ Accordion ─────────────────────────────────────
function toggleFaq(element) {
  const isActive = element.classList.contains('active');

  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });

  if (!isActive) {
    element.classList.add('active');
  }
}

// ─── Demo Services: Filtro de Categorías ───────────────
function filterServices(cat, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.service-tile').forEach(tile => {
    if (cat === 'Todos' || tile.dataset.cat === cat) {
      tile.style.display = 'block';
    } else {
      tile.style.display = 'none';
    }
  });
}

// ─── Demo Services: Selección de Servicio ──────────────
function selectService(tile) {
  document.querySelectorAll('.service-tile').forEach(t => t.classList.remove('selected'));
  tile.classList.add('selected');

  const serviceName = tile.querySelector('.svc-name').textContent;
  const waBtn = document.getElementById('btnWhatsapp');

  const waText = encodeURIComponent(
    `Hola, vengo de la página web de Servicios La Resurrección. Me interesa conocer más sobre: ${serviceName}. ¿Me podrían brindar información?`
  );

  waBtn.onclick = () => window.open(`https://wa.me/573023729204?text=${waText}`, '_blank');
}

// ─── Navbar Scroll Effect ───────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 30) {
    nav.style.boxShadow = '0 4px 20px rgba(180, 142, 73, 0.12)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
