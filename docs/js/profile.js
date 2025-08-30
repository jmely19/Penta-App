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
    // Actualizar barras de habilidades
    for (const skill in lessonProgress.skills) {
        const percent = lessonProgress.skills[skill];
        document.getElementById(`${skill}-percent`).textContent = `${percent}%`;
        document.getElementById(`${skill}-bar`).style.width = `${percent}%`;
    }
    
    // Actualizar progreso general
    const totalLessons = 9; // 3 temas × 3 lecciones
    const completedLessons = lessonProgress.completed.length;
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);
    
    document.getElementById('lessons-completed').textContent = `${completedLessons}/${totalLessons}`;
    document.getElementById('general-progress-bar').style.width = `${progressPercent}%`;
    
    // Actualizar mensaje de progreso
    const progressMessage = document.getElementById('progress-message');
    if (progressPercent < 30) {
        progressMessage.textContent = '¡Empieza a aprender para mejorar tus habilidades!';
    } else if (progressPercent < 70) {
        progressMessage.textContent = '¡Vas por buen camino! Sigue aprendiendo.';
    } else {
        progressMessage.textContent = '¡Excelente trabajo! Estás casi listo.';
    }
}

// Actualizar recomendaciones
function updateRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    recommendationsContainer.innerHTML = '';
    
    if (lessonProgress.completed.length === 0) {
        recommendationsContainer.innerHTML = '<p class="text-gray-300 text-center col-span-2">Completa más lecciones para recibir recomendaciones personalizadas.</p>';
        return;
    }
    
    // Recomendar lecciones no completadas
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
    
    // Marcar lecciones completadas
    allLessons.forEach(lesson => {
        lesson.completed = lessonProgress.completed.includes(lesson.id);
    });
    
    // Filtrar lecciones no completadas
    const recommendedLessons = allLessons.filter(lesson => !lesson.completed);
    
    if (recommendedLessons.length === 0) {
        recommendationsContainer.innerHTML = '<p class="text-green-300 text-center col-span-2">¡Felicidades! Has completado todas las lecciones.</p>';
        return;
    }
    
    // Mostrar hasta 4 recomendaciones
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

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', loadProgress);
