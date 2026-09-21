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

// ─── Demo Shop: Carrito Interactivo ────────────────────
const cart = {};

function addToCart(tile) {
  // Toggle selected visual
  document.querySelectorAll('.product-tile').forEach(t => t.classList.remove('selected'));
  tile.classList.add('selected');

  const name  = tile.dataset.name;
  const price = parseInt(tile.dataset.price.replace('.', ''));

  if (cart[name]) {
    cart[name].qty += 1;
  } else {
    cart[name] = { price, qty: 1 };
  }

  renderCart();
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const totalEl   = document.getElementById('cartTotal');
  const waBtnEl   = document.getElementById('btnWhatsapp');

  const items = Object.entries(cart);
  if (items.length === 0) {
    container.innerHTML = '<div class="cart-item"><strong>Selecciona un producto arriba</strong><span>—</span></div>';
    totalEl.textContent = '$0';
    return;
  }

  let total = 0;
  let waText = 'Hola LK Pets! Quiero pedir:%0A';

  container.innerHTML = items.map(([name, {price, qty}]) => {
    const sub = price * qty;
    total += sub;
    waText += `- ${name} x${qty}: $${(sub).toLocaleString('es-CO')}%0A`;
    return `
      <div class="cart-item">
        <span>${name} <em style="color:var(--text-muted);">x${qty}</em></span>
        <span>$${(sub).toLocaleString('es-CO')}</span>
      </div>`;
  }).join('');

  totalEl.textContent = '$' + total.toLocaleString('es-CO');
  waBtnEl.onclick = () => window.open(`https://wa.me/573222417218?text=${waText}`, '_blank');
}

// ─── Demo Shop: Filtro de Categorías ───────────────────
function filterCategory(cat, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.product-tile').forEach(tile => {
    if (cat === 'Todos' || tile.dataset.cat === cat) {
      tile.style.display = 'block';
    } else {
      tile.style.display = 'none';
    }
  });
}

// ─── Navbar Scroll Effect ───────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 30) {
    nav.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.12)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
