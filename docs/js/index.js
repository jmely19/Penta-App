// Verificar estado de autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initializeVideo();
});

// Función para inicializar y manejar el video de fondo
function initializeVideo() {
    const video = document.querySelector('video');
    if (!video) return;
    
    // Intentar reproducir el video
    video.addEventListener('loadeddata', function() {
        console.log('Video loaded successfully');
        // Forzar reproducción en dispositivos móviles
        if (video.paused) {
            video.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
                // Si falla el autoplay, mostrar la imagen de fallback
                showFallbackImage();
            });
        }
    });
    
    // Manejar errores del video
    video.addEventListener('error', function(e) {
        console.error('Video error:', e);
        showFallbackImage();
    });
    
    // Manejar cuando el video no puede reproducirse
    video.addEventListener('canplay', function() {
        console.log('Video can play');
    });
    
    // Verificar si el video se está reproduciendo
    setInterval(function() {
        if (video.readyState >= 2 && video.paused) {
            console.log('Video paused, attempting to resume...');
            video.play().catch(function(error) {
                console.log('Failed to resume video:', error);
            });
        }
    }, 5000);
}

// Función para mostrar imagen de fallback
function showFallbackImage() {
    const video = document.querySelector('video');
    if (video) {
        video.style.display = 'none';
        // La imagen de fallback ya está configurada en el HTML
    }
}

// Función para verificar si el usuario está logueado
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userFirstName = localStorage.getItem('userFirstName');
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn === 'true' && userEmail) {
        // Usuario está logueado, mostrar información del usuario
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userInfo').style.display = 'flex';
        
        // Mostrar el nombre si está disponible, sino mostrar el email
        const displayName = userFirstName || userEmail.split('@')[0];
        document.getElementById('userName').textContent = `Hi, ${displayName}!`;
    } else {
        // Usuario no está logueado, mostrar botones de login/signup
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userInfo').style.display = 'none';
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('loginTime');
    window.location.reload();
}

// Validación del formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if(!name || !email || !message) {
        alert('Please complete all required fields');
        return;
    }
    
    if(!/^S+@S+\.S+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Aquí iría la lógica para enviar el formulario
    alert('Thank you for your message! We will contact you shortly.');
    this.reset();
});

// Scroll suave mejorado con offset para el header fijo
document.querySelectorAll('.quick-access a').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
});

/* Desplazamiento suave para enlaces internos con offset para el header */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            const headerHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Actualizar URL sin recargar la página
            history.pushState(null, null, targetId);
        }
    });
});

/* Toggle para menú móvil (necesitaría elementos HTML adicionales)
   Esto es solo un marcador de posición - se necesitaría implementar la estructura del menú móvil */
const mobileMenuButton = document.querySelector('nav button.md\\:hidden');
mobileMenuButton.addEventListener('click', () => {
    // This would toggle a mobile menu
    console.log('Mobile menu would open');
});
