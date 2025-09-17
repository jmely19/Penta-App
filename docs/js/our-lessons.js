// Variables globales para el sistema de navegación
let currentTemaIndex = 0;
const totalTemas = 3;

// Mapeo de lecciones a ejercicios - ACTUALIZADO
const lessonToExerciseMap = {
    'presupuesto-1': 'exercise1.html',
    'presupuesto-2': 'exercise2.html',
    'presupuesto-3': 'exercise3.html',
    'ahorro-1': 'exercise1.html',
    'ahorro-2': 'exercise-ahorro2.html',
    'ahorro-3': 'exercise3.html',
    'crisis-1': 'exercise-crisis1.html',
    'crisis-2': 'exercise2.html',
    'crisis-3': 'exercise-crisis3.html'
};

// Mapeo de lecciones a historias - ACTUALIZADO PARA CRISIS
const lessonToStoryMap = {
    'presupuesto-1': 'story1.html',
    'presupuesto-2': 'story2.html',
    'presupuesto-3': 'story3.html',
    'ahorro-1': 'story1.html',
    'ahorro-2': 'story2.html',
    'ahorro-3': 'story3.html',
    'crisis-1': 'story-crisis.html?lesson=crisis-1',
    'crisis-2': 'story-crisis.html?lesson=crisis-2',
    'crisis-3': 'story-crisis.html?lesson=crisis-3'
};

// Mapeo de lecciones a habilidades
const lessonToSkillMap = {
    'presupuesto-1': 'critical-thinking',
    'presupuesto-2': 'critical-thinking',
    'presupuesto-3': 'financial-decision-making',
    'ahorro-1': 'financial-decision-making',
    'ahorro-2': 'problem-solving',
    'ahorro-3': 'financial-decision-making',
    'crisis-1': 'problem-solving',
    'crisis-2': 'critical-thinking',
    'crisis-3': 'problem-solving'
};

// Información detallada de las lecciones
const lessonDetails = {
    'presupuesto-1': { name: 'Know where your money goes: The truth behind every expense', topic: 'Budget', topicEs: 'Presupuesto' },
    'presupuesto-2': { name: 'Needs vs. Wants: The Art of Conscious Choice', topic: 'Budget', topicEs: 'Presupuesto' },
    'presupuesto-3': { name: 'A budget is a map: Navigating your expenses and making choices', topic: 'Budget', topicEs: 'Presupuesto' },
    'ahorro-1': { name: 'The power of "paying yourself first"', topic: 'Savings', topicEs: 'Ahorro' },
    'ahorro-2': { name: 'The snowball effect: Discover compound interest', topic: 'Savings', topicEs: 'Ahorro' },
    'ahorro-3': { name: 'Saving with a purpose: Your goals, your motivation', topic: 'Savings', topicEs: 'Ahorro' },
    'crisis-1': { name: 'Life is unpredictable: Build your safety net', topic: 'Crisis', topicEs: 'Crisis' },
    'crisis-2': { name: 'Not all that glitters is gold: Protect your money from fraud', topic: 'Crisis', topicEs: 'Crisis' },
    'crisis-3': { name: 'The invisible cost of living: Understanding inflation', topic: 'Crisis', topicEs: 'Crisis' }
};

// Guardar progreso de una lección
function saveLessonProgress(lessonId, status) {
    let progress = JSON.parse(localStorage.getItem('lessonsProgress')) || {};
    progress[lessonId] = {
        status: status,
        completedAt: new Date().toISOString(),
        skill: lessonToSkillMap[lessonId]
    };
    localStorage.setItem('lessonsProgress', JSON.stringify(progress));
    
    // Actualizar habilidades
    updateSkillProgress();
    
    // Mostrar notificación de progreso
    showProgressNotification(lessonId);
}

// Actualizar progreso de habilidades basado en lecciones completadas
function updateSkillProgress() {
    const progress = getAllLessonProgress();
    const skills = {
        'critical-thinking': 0,
        'problem-solving': 0,
        'financial-decision-making': 0
    };
    
    // Contar lecciones completadas por habilidad
    const skillCounts = {
        'critical-thinking': 0,
        'problem-solving': 0,
        'financial-decision-making': 0
    };
    
    const skillTotals = {
        'critical-thinking': 3, // presupuesto-1, presupuesto-2, crisis-2
        'problem-solving': 3,   // ahorro-2, crisis-1, crisis-3
        'financial-decision-making': 3 // presupuesto-3, ahorro-1, ahorro-3
    };
    
    Object.keys(progress).forEach(lessonId => {
        if (progress[lessonId].status === 'completed') {
            const skill = lessonToSkillMap[lessonId];
            if (skill) {
                skillCounts[skill]++;
            }
        }
    });
    
    // Calcular porcentajes
    Object.keys(skills).forEach(skill => {
        skills[skill] = Math.round((skillCounts[skill] / skillTotals[skill]) * 100);
    });
    
    // Guardar habilidades actualizadas
    let pentaProgress = JSON.parse(localStorage.getItem('pentaProgress')) || {};
    pentaProgress.skills = skills;
    localStorage.setItem('pentaProgress', JSON.stringify(pentaProgress));
}

// Mostrar notificación de progreso
function showProgressNotification(lessonId) {
    const lesson = lessonDetails[lessonId];
    const skill = lessonToSkillMap[lessonId];
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <div>
                <div class="font-semibold">¡Lección completada!</div>
                <div class="text-sm">${lesson.name}</div>
                <div class="text-xs opacity-75">Habilidad mejorada: ${skill}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Obtener progreso de todas las lecciones
function getAllLessonProgress() {
    return JSON.parse(localStorage.getItem('lessonsProgress')) || {};
}

// Calcular porcentaje de progreso general
function getProgressPercentage() {
    const lessonIds = Object.keys(lessonToExerciseMap);
    const progress = getAllLessonProgress();
    const completed = lessonIds.filter(id => progress[id] && progress[id].status === 'completed').length;
    return Math.round((completed / lessonIds.length) * 100);
}

// Obtener lecciones completadas
function getCompletedLessonsCount() {
    const lessonIds = Object.keys(lessonToExerciseMap);
    const progress = getAllLessonProgress();
    return lessonIds.filter(id => progress[id] && progress[id].status === 'completed').length;
}

// Generar recomendaciones según el progreso
function getRecommendations() {
    const progress = getAllLessonProgress();
    const allLessons = Object.keys(lessonDetails);
    const completedLessons = allLessons.filter(id => progress[id] && progress[id].status === 'completed');
    const pendingLessons = allLessons.filter(id => !progress[id] || progress[id].status !== 'completed');
    
    if (completedLessons.length === 0) {
        return [{
            id: 'presupuesto-1',
            name: 'Know where your money goes: The truth behind every expense',
            topic: 'Budget',
            reason: 'Perfect starting point for financial education'
        }];
    }
    
    // Recomendar lecciones del mismo tema primero
    const lastCompleted = completedLessons[completedLessons.length - 1];
    const lastTopic = lessonDetails[lastCompleted].topic;
    
    const sameTopicPending = pendingLessons.filter(id => 
        lessonDetails[id].topic === lastTopic
    );
    
    const recommendations = [];
    
    if (sameTopicPending.length > 0) {
        recommendations.push({
            id: sameTopicPending[0],
            name: lessonDetails[sameTopicPending[0]].name,
            topic: lessonDetails[sameTopicPending[0]].topic,
            reason: `Continue with ${lastTopic} lessons`
        });
    }
    
    // Agregar lecciones de otros temas
    const otherTopicPending = pendingLessons.filter(id => 
        lessonDetails[id].topic !== lastTopic
    );
    
    otherTopicPending.slice(0, 3).forEach(id => {
        recommendations.push({
            id: id,
            name: lessonDetails[id].name,
            topic: lessonDetails[id].topic,
            reason: `Expand your knowledge with ${lessonDetails[id].topic}`
        });
    });
    
    return recommendations.slice(0, 4);
}

// Mostrar/ocultar temas
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

// Actualizar botones de navegación
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

// Ir al siguiente tema
function nextTema() {
    if (currentTemaIndex < totalTemas - 1) {
        currentTemaIndex++;
        showTema(currentTemaIndex);
    }
}

// Ir al tema anterior
function prevTema() {
    if (currentTemaIndex > 0) {
        currentTemaIndex--;
        showTema(currentTemaIndex);
    }
}

// Variable global para saber qué lección está activa
let currentLessonId = null;

// Iniciar lección (abre modal y guarda progreso)
function startLesson(lessonId) {
    const exerciseFile = lessonToExerciseMap[lessonId];
    const storyFile = lessonToStoryMap[lessonId];

    currentLessonId = lessonId;

    if (exerciseFile || storyFile) {
        document.getElementById('learning-modal').classList.remove('hidden');
    }
}

// Marcar lección como completada (llamar desde ejercicios)
function markLessonCompleted(lessonId) {
    saveLessonProgress(lessonId, 'completed');
    
    // Actualizar UI
    const card = document.querySelector(`[data-lesson-id="${lessonId}"]`);
    if (card) {
        const badge = card.querySelector('.completed-badge');
        if (badge) badge.classList.remove('hidden');
        
        const button = card.querySelector('.start-lesson-btn');
        if (button) {
            button.textContent = 'Completed';
            button.classList.remove('bg-orange-500', 'hover:bg-orange-600');
            button.classList.add('bg-green-500', 'cursor-default');
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Botones de navegación
    document.getElementById('next-btn').addEventListener('click', nextTema);
    document.getElementById('prev-btn').addEventListener('click', prevTema);

    // Botones de inicio de lecciones
    document.querySelectorAll('.start-lesson-btn').forEach(button => {
        button.addEventListener('click', function() {
            const lessonCard = this.closest('[data-lesson-id]');
            const lessonId = lessonCard.getAttribute('data-lesson-id');
            startLesson(lessonId);
        });
    });

    // Botón de cerrar modal
    document.getElementById('close-modal-btn').addEventListener('click', function() {
        document.getElementById('learning-modal').classList.add('hidden');
    });

    // Cerrar modal al hacer clic fuera
    document.getElementById('learning-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });

    // Botones del modal para redirigir según la lección activa
    document.querySelector('#learning-modal a.bg-blue-600').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentLessonId && lessonToStoryMap[currentLessonId]) {
            // Marcar como completada al iniciar
            markLessonCompleted(currentLessonId);
            window.location.href = lessonToStoryMap[currentLessonId];
        }
    });
    
    document.querySelector('#learning-modal a.bg-indigo-600').addEventListener('click', function(e) {
        e.preventDefault();
        if (currentLessonId && lessonToExerciseMap[currentLessonId]) {
            // Marcar como completada al iniciar
            markLessonCompleted(currentLessonId);
            window.location.href = lessonToExerciseMap[currentLessonId];
        }
    });

    // Inicializar navegación
    showTema(0);

    // Mostrar progreso visual en las lecciones
    const progress = getAllLessonProgress();
    Object.keys(progress).forEach(lessonId => {
        if (progress[lessonId].status === 'completed') {
            const card = document.querySelector(`[data-lesson-id="${lessonId}"]`);
            if (card) {
                const badge = card.querySelector('.completed-badge');
                if (badge) badge.classList.remove('hidden');
                
                const button = card.querySelector('.start-lesson-btn');
                if (button) {
                    button.textContent = 'Completed';
                    button.classList.remove('bg-orange-500', 'hover:bg-orange-600');
                    button.classList.add('bg-green-500', 'cursor-default');
                }
            }
        }
    });
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

// Exportar funciones para profile.html
window.getAllLessonProgress = getAllLessonProgress;
window.getProgressPercentage = getProgressPercentage;
window.getCompletedLessonsCount = getCompletedLessonsCount;
window.getRecommendations = getRecommendations;
window.lessonDetails = lessonDetails;
window.markLessonCompleted = markLessonCompleted;
