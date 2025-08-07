const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('show');
});

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
        setInterval(() => this.nextSlide(), 5000);

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

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProjectCarousel();
});
