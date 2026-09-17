// FAQ Accordion Toggle
function toggleFaq(element) {
  const isActive = element.classList.contains('active');

  // Close all other open FAQs
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active');
  });

  // Toggle current FAQ
  if (!isActive) {
    element.classList.add('active');
  }
}

// Interactive Booking Demo Selector
function selectDemoService(serviceName) {
  // Update button active state
  document.querySelectorAll('.btn-demo-opt').forEach(btn => {
    btn.classList.remove('active');
  });

  event.currentTarget.classList.add('active');

  // Update display text
  const displayText = document.getElementById('selectedServiceText');
  if (displayText) {
    displayText.textContent = serviceName;
  }
}

// Navbar Scroll Effect (Light Theme)
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 30) {
    nav.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.1)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
