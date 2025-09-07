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

// Mapeo de lecciones a historias (opcional, si existen páginas específicas para historias)
const lessonToStoryMap = {
    'presupuesto-1': 'story1.html',
    'presupuesto-2': 'story2.html',
    'presupuesto-3': 'story3.html',
    'ahorro-1': 'story1.html',
    'ahorro-2': 'story2.html',
    'ahorro-3': 'story3.html',
    'crisis-1': 'story1.html',
    'crisis-2': 'story2.html',
    'crisis-3': 'story3.html'
};

// Guardar progreso de una lección
function saveLessonProgress(lessonId, status) {
    let progress = JSON.parse(localStorage.getItem('lessonsProgress')) || {};
    progress[lessonId] = status;
    localStorage.setItem('lessonsProgress', JSON.stringify(progress));
}

// Obtener progreso de todas las lecciones
function getAllLessonProgress() {
    return JSON.parse(localStorage.getItem('lessonsProgress')) || {};
}

// Calcular porcentaje de progreso
function getProgressPercentage() {
    const lessonIds = Object.keys(lessonToExerciseMap);
    const progress = getAllLessonProgress();
    const completed = lessonIds.filter(id => progress[id] === 'completed').length;
    return Math.round((completed / lessonIds.length) * 100);
}

// Generar recomendaciones según el progreso
function getRecommendations() {
    const percentage = getProgressPercentage();
    if (percentage === 0) return "¡Comienza tu primera lección para avanzar!";
    if (percentage < 50) return "¡Sigue así! Intenta completar más lecciones para mejorar tu aprendizaje.";
    if (percentage < 100) return "¡Vas muy bien! Ya casi completas todas las lecciones.";
    return "¡Felicidades! Has completado todas las lecciones.";
}

// Función para mostrar/ocultar temas
function showTema(index) {
    document.querySelectorAll('.tema').forEach(tema => {
        tema.classList.add('hidden');
    });

    const temaToShow = document.querySelector(`[data-index="${index}"]`);
    if (temaToShow) {
        temaToShow.classList.remove('hidden');
    }

    updateNavigationButtons();
}

// Función para actualizar botones de navegación
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (currentTemaIndex === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }

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
// ...existing code...
function startLesson(lessonId) {
    const exerciseFile = lessonToExerciseMap[lessonId];
    const storyFile = lessonToStoryMap[lessonId];

    // Guardar progreso como completado al iniciar la lección
    saveLessonProgress(lessonId, 'completed');

    if (exerciseFile) {
        document.getElementById('learning-modal').classList.remove('hidden');
        // ...existing code...
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
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if(!name || !email || !message) {
            alert('Please complete all required fields.');
            return;
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        alert('Thank you for your message! We will be in contact soon.');
        this.reset();
    });
}

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

// Desplazamiento suave para enlaces internos con offset para el header
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

            history.pushState(null, null, targetId);
        }
    });
});

// Toggle para menú móvil
const mobileMenuButton = document.querySelector('nav button.md\\:hidden');
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        console.log('Mobile menu would open');
    });
}
