// Variables globales para el sistema de navegación
let currentTemaIndex = 0;
const totalTemas = 3;

// Mapeo de lecciones a ejercicios
const lessonToExerciseMap = {
    'presupuesto-1': 'exercise1.html',
    'presupuesto-2': 'exercise2.html', 
    'presupuesto-3': 'exercise3.html',
    'ahorro-1': 'exercise1.html',
    'ahorro-2': 'exercise2.html',
    'ahorro-3': 'exercise3.html',
    'crisis-1': 'exercise1.html',
    'crisis-2': 'exercise2.html',
    'crisis-3': 'exercise3.html'
};

// Función para mostrar/ocultar temas
function showTema(index) {
    // Ocultar todos los temas
    document.querySelectorAll('.tema').forEach(tema => {
        tema.classList.add('hidden');
    });
    
    // Mostrar el tema seleccionado
    const temaToShow = document.querySelector(`[data-index="${index}"]`);
    if (temaToShow) {
        temaToShow.classList.remove('hidden');
    }
    
    // Actualizar botones de navegación
    updateNavigationButtons();
}

// Función para actualizar botones de navegación
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Mostrar/ocultar botón anterior
    if (currentTemaIndex === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }
    
    // Mostrar/ocultar botón siguiente
    if (currentTemaIndex === totalTemas - 1) {
        nextBtn.classList.add('hidden');
    } else {
        nextBtn.classList.remove('hidden');
    }
}

// Función para ir al siguiente tema
function nextTema() {
    if (currentTemaIndex < totalTemas - 1) {
        currentTemaIndex++;
        showTema(currentTemaIndex);
    }
}

// Función para ir al tema anterior
function prevTema() {
    if (currentTemaIndex > 0) {
        currentTemaIndex--;
        showTema(currentTemaIndex);
    }
}

// Función para manejar el inicio de lecciones
function startLesson(lessonId) {
    const exerciseFile = lessonToExerciseMap[lessonId];
    if (exerciseFile) {
        // Mostrar modal de selección de estilo de aprendizaje
        document.getElementById('learning-modal').classList.remove('hidden');
        
        // Configurar enlaces del modal
        const modalLinks = document.querySelectorAll('#learning-modal a');
        modalLinks.forEach(link => {
            if (link.textContent.includes('Exercises')) {
                link.href = exerciseFile;
            } else if (link.textContent.includes('Story')) {
                link.href = exerciseFile + '?mode=story';
            } else if (link.textContent.includes('Text')) {
                link.href = exerciseFile + '?mode=text';
            }
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones de navegación
    document.getElementById('next-btn').addEventListener('click', nextTema);
    document.getElementById('prev-btn').addEventListener('click', prevTema);
    
    // Configurar botones de inicio de lecciones
    document.querySelectorAll('.start-lesson-btn').forEach(button => {
        button.addEventListener('click', function() {
            const lessonCard = this.closest('[data-lesson-id]');
            const lessonId = lessonCard.getAttribute('data-lesson-id');
            startLesson(lessonId);
        });
    });
    
    // Configurar botón de cerrar modal
    document.getElementById('close-modal-btn').addEventListener('click', function() {
        document.getElementById('learning-modal').classList.add('hidden');
    });
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('learning-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
    
    // Inicializar navegación
    showTema(0);
});

// Validación del formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if(!name || !email || !message) {
        alert('Please complete all required fields.');
        return;
    }
    
    if(!/^S+@S+\.S+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Aquí iría la lógica para enviar el formulario
    alert('Thank you for your message! We will be in contact soon.');
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
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        // This would toggle a mobile menu
        console.log('Mobile menu would open');
    });
}
