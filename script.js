const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('show');
    });
}

class ProjectCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.cards = document.querySelectorAll('.project-card');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('indicators');

        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);

        this.init();
    }

    getCardsPerView() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    }

    init() {
        this.createIndicators();
        this.updateCarousel();
        this.addEventListeners();
    }

    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    updateCarousel() {
        const translateX = -(this.currentIndex * 100);
        this.track.style.transform = `translateX(${translateX}%)`;

        // Actualizar clases active
        this.cards.forEach((card, index) => {
            const isVisible = index >= this.currentIndex * this.cardsPerView &&
                index < (this.currentIndex + 1) * this.cardsPerView;
            card.classList.toggle('active', isVisible);
        });

        // Actualizar indicadores
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentIndex = this.currentIndex === 0 ? this.totalSlides - 1 : this.currentIndex - 1;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    addEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());

        // Auto-play (opcional)
        // setInterval(() => this.nextSlide(), 5000);

        // Responsive
        window.addEventListener('resize', () => {
            const newCardsPerView = this.getCardsPerView();
            if (newCardsPerView !== this.cardsPerView) {
                this.cardsPerView = newCardsPerView;
                this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
                this.currentIndex = 0;
                this.createIndicators();
                this.updateCarousel();
            }
        });

        // Touch support para móviles
        let startX = 0;
        let endX = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
}

// Inicializar el carrusel solo si existe en la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('carouselTrack')) {
        new ProjectCarousel();
    }
});




// Simulación de envío de formulario de solicitud de CV
// document.addEventListener('DOMContentLoaded', function() {
//     var form = document.getElementById('formSolicitarCV');
//     if (form) {
//     form.addEventListener('submit', function(e) {
//         e.preventDefault();
//         document.getElementById('cvFormMsg').innerHTML =
//         '<div class="alert alert-success">¡Solicitud enviada! Te contactaré pronto.</div>';
//         form.reset();
//     });
//     }
// });





/* =========================================================
   FUNCIONES PARA EL MODAL DE VIDEO (FULLSCREEN)
   ========================================================= */
function openVideoModal(videoSrc) {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('modalVideoPlayer');
    const videoSource = document.getElementById('modalVideoSource');

    if (modal && videoPlayer && videoSource) {
        videoSource.src = videoSrc;
        videoPlayer.load(); // Cargar la nueva ruta
        modal.classList.add('active');
        videoPlayer.play();

        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('modalVideoPlayer');

    if (modal && videoPlayer) {
        videoPlayer.pause();
        modal.classList.remove('active');

        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
    }
}

// Cerrar modal al hacer clic fuera del video
window.onclick = function (event) {
    const modal = document.getElementById('videoModal');
    if (event.target == modal) {
        closeVideoModal();
    }
}

/* =========================================================
   ANIMACIÓN DE MARCA PERSONAL (degnisDev)
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const brandContainer = document.getElementById('brand-typing');
    if (!brandContainer) return;

    const brandName = "degnisDev";
    brandContainer.innerHTML = ''; // Limpiar

    brandName.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'brand-char';
        brandContainer.appendChild(span);

        setTimeout(() => {
            span.classList.add('active');
        }, 800 + (index * 120));
    });
});

function toggleStack(button) {
    // Buscamos el div del stack que está justo después del botón
    const stack = button.nextElementSibling;

    if (stack.classList.contains('d-none')) {
        stack.classList.remove('d-none');
        button.innerHTML = '<i class="bi bi-code-slash me-1"></i> Ocultar Stack';
        // Cambiamos el color del botón para que resalte que está activo
        button.classList.replace('btn-outline-dark', 'btn-dark');
    } else {
        stack.classList.add('d-none');
        button.innerHTML = '<i class="bi bi-code-slash me-1"></i> Ver Stack';
        button.classList.replace('btn-dark', 'btn-outline-dark');
    }
}

