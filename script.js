const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('show');
    });
}




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

