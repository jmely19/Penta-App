// --- Sistema de progreso del usuario ---
const lessonProgress = {
    completed: [],
    skills: {
        'critical-thinking': 48,
        'problem-solving': 67,
        'financial-decision-making': 34
    }
};

function loadProgress() {
    // Lee el progreso guardado por our-lessons.js
    const lessonsProgress = JSON.parse(localStorage.getItem('lessonsProgress')) || {};
    lessonProgress.completed = Object.keys(lessonsProgress).filter(id => lessonsProgress[id] === 'completed');

    // Si tienes skills guardadas en pentaProgress, puedes mantener esa parte:
    const savedProgress = localStorage.getItem('pentaProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        lessonProgress.skills = progress.skills || lessonProgress.skills;
    }

    updateProgressDisplay();
    updateRecommendations();
}

function updateProgressDisplay() {
    // Habilidades
    for (const skill in lessonProgress.skills) {
        const percent = lessonProgress.skills[skill];
        document.getElementById(`${skill}-percent`).textContent = `${percent}%`;
        document.getElementById(`${skill}-bar`).style.width = `${percent}%`;
    }

    // Progreso general
    const totalLessons = 9;
    const completedLessons = lessonProgress.completed.length;
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);

    document.getElementById('lessons-completed').textContent = `${completedLessons}/${totalLessons}`;
    document.getElementById('general-progress-bar').style.width = `${progressPercent}%`;

    const progressMessage = document.getElementById('progress-message');
    if (progressPercent === 0) {
        progressMessage.textContent = '¡Empieza a aprender para mejorar tus habilidades!';
    } else if (progressPercent < 50) {
        progressMessage.textContent = '¡Vas por buen camino! Sigue aprendiendo.';
    } else if (progressPercent < 100) {
        progressMessage.textContent = '¡Genial! Estás cerca de completar todas las lecciones.';
    } else {
        progressMessage.textContent = '🎉 ¡Felicidades! Completaste todas las lecciones.';
    }
}

function updateRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    recommendationsContainer.innerHTML = '';

    if (lessonProgress.completed.length === 0) {
        recommendationsContainer.innerHTML =
          '<p class="text-gray-300 text-center col-span-2">Completa más lecciones para recibir recomendaciones personalizadas.</p>';
        return;
    }

    // Lista de todas las lecciones
    const allLessons = [
        { id: 'presupuesto-1', name: 'Lección 1: Conoce dónde va tu dinero', topic: 'Presupuesto' },
        { id: 'presupuesto-2', name: 'Lección 2: Necesidades vs. Deseos', topic: 'Presupuesto' },
        { id: 'presupuesto-3', name: 'Lección 3: El presupuesto es un mapa', topic: 'Presupuesto' },
        { id: 'ahorro-1', name: 'Lección 1: El poder del "pagarte a ti mismo"', topic: 'Ahorro' },
        { id: 'ahorro-2', name: 'Lección 2: El efecto bola de nieve', topic: 'Ahorro' },
        { id: 'ahorro-3', name: 'Lección 3: Ahorrar con un propósito', topic: 'Ahorro' },
        { id: 'crisis-1', name: 'Lección 1: La vida es impredecible', topic: 'Crisis' },
        { id: 'crisis-2', name: 'Lección 2: No todo lo que brilla es oro', topic: 'Crisis' },
        { id: 'crisis-3', name: 'Lección 3: El costo invisible de la vida', topic: 'Crisis' }
    ];

    const recommended = allLessons.filter(lesson => !lessonProgress.completed.includes(lesson.id));

    if (recommended.length === 0) {
        recommendationsContainer.innerHTML =
          '<p class="text-green-300 text-center col-span-2">¡Felicidades! Has completado todas las lecciones.</p>';
        return;
    }

    recommended.slice(0, 4).forEach(lesson => {
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

document.addEventListener('DOMContentLoaded', loadProgress);
