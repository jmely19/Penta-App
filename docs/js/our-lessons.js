// --- Sistema de Progreso del Usuario ---
const lessonProgress = {
    completed: [],
    skills: {
        'critical-thinking': 48,
        'problem-solving': 67,
        'financial-decision-making': 34
    }
};

// Cargar progreso desde localStorage
function loadProgress() {
    const savedProgress = localStorage.getItem('pentaProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        lessonProgress.completed = progress.completed || [];
        lessonProgress.skills = progress.skills || lessonProgress.skills;
    }
    updateProgressDisplay();
    updateRecommendations();
}

// Guardar progreso en localStorage
function saveProgress() {
    localStorage.setItem('pentaProgress', JSON.stringify(lessonProgress));
}

// Actualizar visualización del progreso
function updateProgressDisplay() {
    for (const skill in lessonProgress.skills) {
        const percent = lessonProgress.skills[skill];
        const percentEl = document.getElementById(`${skill}-percent`);
        const barEl = document.getElementById(`${skill}-bar`);
        if (percentEl) percentEl.textContent = `${percent}%`;
        if (barEl) barEl.style.width = `${percent}%`;
    }
    
    const totalLessons = 9;
    const completedLessons = lessonProgress.completed.length;
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);
    
    const lessonsCompletedEl = document.getElementById('lessons-completed');
    const generalProgressBar = document.getElementById('general-progress-bar');
    if (lessonsCompletedEl) lessonsCompletedEl.textContent = `${completedLessons}/${totalLessons}`;
    if (generalProgressBar) generalProgressBar.style.width = `${progressPercent}%`;
    
    const progressMessage = document.getElementById('progress-message');
    if (progressMessage) {
        if (progressPercent < 30) {
            progressMessage.textContent = '¡Empieza a aprender para mejorar tus habilidades!';
        } else if (progressPercent < 70) {
            progressMessage.textContent = '¡Vas por buen camino! Sigue aprendiendo.';
        } else {
            progressMessage.textContent = '¡Excelente trabajo! Estás casi listo.';
        }
    }
}

// Actualizar recomendaciones
function updateRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (!recommendationsContainer) return;

    recommendationsContainer.innerHTML = '';
    
    if (lessonProgress.completed.length === 0) {
        recommendationsContainer.innerHTML = '<p class="text-gray-300 text-center col-span-2">Completa más lecciones para recibir recomendaciones personalizadas.</p>';
        return;
    }
    
    const allLessons = [
        { id: 'presupuesto-1', name: 'Lección 1: Conoce dónde va tu dinero', topic: 'Presupuesto', completed: false },
        { id: 'presupuesto-2', name: 'Lección 2: Necesidades vs. Deseos', topic: 'Presupuesto', completed: false },
        { id: 'presupuesto-3', name: 'Lección 3: El presupuesto es un mapa', topic: 'Presupuesto', completed: false },
        { id: 'ahorro-1', name: 'Lección 1: El poder del "pagarte a ti mismo"', topic: 'Ahorro', completed: false },
        { id: 'ahorro-2', name: 'Lección 2: El efecto bola de nieve', topic: 'Ahorro', completed: false },
        { id: 'ahorro-3', name: 'Lección 3: Ahorrar con un propósito', topic: 'Ahorro', completed: false },
        { id: 'crisis-1', name: 'Lección 1: La vida es impredecible', topic: 'Crisis', completed: false },
        { id: 'crisis-2', name: 'Lección 2: No todo lo que brilla es oro', topic: 'Crisis', completed: false },
        { id: 'crisis-3', name: 'Lección 3: El costo invisible de la vida', topic: 'Crisis', completed: false }
    ];
    
    allLessons.forEach(lesson => {
        lesson.completed = lessonProgress.completed.includes(lesson.id);
    });
    
    const recommendedLessons = allLessons.filter(lesson => !lesson.completed);
    
    if (recommendedLessons.length === 0) {
        recommendationsContainer.innerHTML = '<p class="text-green-300 text-center col-span-2">¡Felicidades! Has completado todas las lecciones.</p>';
        return;
    }
    
    recommendedLessons.slice(0, 4).forEach(lesson => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'bg-white/10 rounded-lg p-4 flex items-center';
        lessonCard.innerHTML = `
            <div class="bg-blue-800 text-white rounded-full p-2 mr-3">
                <i class="fas fa-book"></i>
            </div>
            <div>
                <h4 class="font-semibold text-white">${lesson.name}</h4>
                <p class="text-sm text-blue-300">Tema: ${lesson.topic}</p>
            </div>
            <a href="our-lessons.html#${lesson.topic.toLowerCase()}" class="ml-auto bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-600 transition">
                Ver
            </a>
        `;
        recommendationsContainer.appendChild(lessonCard);
    });
}

// --- Variables globales para el sistema de navegación ---
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

// Mapeo de lecciones a historias
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

// Mostrar/ocultar temas
function showTema(index) {
    document.querySelectorAll('.tema').forEach(tema => {
        tema.classList.add('hidden');
    });
    const temaToShow = document.querySelector(`[data-index="${index}"]`);
    if (temaToShow) temaToShow.classList.remove('hidden');
    updateNavigationButtons();
}

// Botones de navegación
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
function nextTema() {
    if (currentTemaIndex < totalTemas - 1) {
        currentTemaIndex++;
        showTema(currentTemaIndex);
    }
}
function prevTema() {
    if (currentTemaIndex > 0) {
        currentTemaIndex--;
        showTema(currentTemaIndex);
    }
}

// Iniciar lección
function startLesson(lessonId) {
    const exerciseFile = lessonToExerciseMap[lessonId];
    const storyFile = lessonToStoryMap[lessonId];

    // 👉 Registrar progreso
    if (!lessonProgress.completed.includes(lessonId)) {
        lessonProgress.completed.push(lessonId);
        saveProgress();
        updateProgressDisplay();
        updateRecommendations();
    }

    if (exerciseFile) {
        document.getElementById('learning-modal').classList.remove('hidden');
        const storyLink = document.querySelector('.story-btn');
        const exercisesLink = document.querySelector('.exercises-btn');
        exercisesLink.href = exerciseFile;
        storyLink.href = '#';
        storyLink.onclick = function(e) {
            e.preventDefault();
            alert('The story option is not available yet.');
        };
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('next-btn').addEventListener('click', nextTema);
    document.getElementById('prev-btn').addEventListener('click', prevTema);
    document.querySelectorAll('.start-lesson-btn').forEach(button => {
        button.addEventListener('click', function() {
            const lessonCard = this.closest('[data-lesson-id]');
            const lessonId = lessonCard.getAttribute('data-lesson-id');
            startLesson(lessonId);
        });
    });
    document.getElementById('close-modal-btn').addEventListener('click', function() {
        document.getElementById('learning-modal').classList.add('hidden');
    });
    document.getElementById('learning-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
    showTema(0);

    // 👉 Inicializar progreso
    loadProgress();
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

// Scroll suave con hover
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

// Scroll suave con offset
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

// Toggle menú móvil
const mobileMenuButton = document.querySelector('nav button.md\\:hidden');
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        console.log('Mobile menu would open');
    });
}
