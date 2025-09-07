// --- Sistema de progreso del usuario mejorado ---
const lessonProgress = {
    completed: [],
    skills: {
        'critical-thinking': 0,
        'problem-solving': 0,
        'financial-decision-making': 0
    }
};

// Mapeo de habilidades a nombres en español
const skillNames = {
    'critical-thinking': 'Critical Thinking',
    'problem-solving': 'Problem-Solving',
    'financial-decision-making': 'Financial Decision-Making'
};

function loadProgress() {
    // Lee el progreso guardado por our-lessons.js
    const lessonsProgress = JSON.parse(localStorage.getItem('lessonsProgress')) || {};
    lessonProgress.completed = Object.keys(lessonsProgress).filter(id => 
        lessonsProgress[id] && lessonsProgress[id].status === 'completed'
    );

    // Cargar habilidades desde pentaProgress
    const savedProgress = localStorage.getItem('pentaProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        lessonProgress.skills = progress.skills || lessonProgress.skills;
    }

    updateProgressDisplay();
    updateRecommendations();
}

function updateProgressDisplay() {
    // Habilidades - usar los valores calculados dinámicamente
    for (const skill in lessonProgress.skills) {
        const percent = lessonProgress.skills[skill];
        const percentElement = document.getElementById(`${skill}-percent`);
        const barElement = document.getElementById(`${skill}-bar`);
        
        if (percentElement && barElement) {
            percentElement.textContent = `${percent}%`;
            barElement.style.width = `${percent}%`;
            
            // Agregar animación a la barra
            barElement.style.transition = 'width 1s ease-in-out';
        }
    }

    // Progreso general
    const totalLessons = 9;
    const completedLessons = lessonProgress.completed.length;
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);

    const lessonsCompletedElement = document.getElementById('lessons-completed');
    const generalProgressBarElement = document.getElementById('general-progress-bar');
    
    if (lessonsCompletedElement) {
        lessonsCompletedElement.textContent = `${completedLessons}/${totalLessons}`;
    }
    
    if (generalProgressBarElement) {
        generalProgressBarElement.style.width = `${progressPercent}%`;
        generalProgressBarElement.style.transition = 'width 1.5s ease-in-out';
    }

    // Mensaje de progreso
    const progressMessage = document.getElementById('progress-message');
    if (progressMessage) {
        if (progressPercent === 0) {
            progressMessage.textContent = 'Start learning to improve your skills!';
            progressMessage.className = 'text-sm text-gray-300 mt-4 ml-4';
        } else if (progressPercent < 33) {
            progressMessage.textContent = '🌱 Great start! Keep learning to unlock your potential.';
            progressMessage.className = 'text-sm text-blue-300 mt-4 ml-4';
        } else if (progressPercent < 66) {
            progressMessage.textContent = '🚀 You\'re making excellent progress! Keep it up.';
            progressMessage.className = 'text-sm text-yellow-300 mt-4 ml-4';
        } else if (progressPercent < 100) {
            progressMessage.textContent = '⭐ Amazing! You\'re almost there. Finish strong!';
            progressMessage.className = 'text-sm text-orange-300 mt-4 ml-4';
        } else {
            progressMessage.textContent = '🎉 Congratulations! You\'ve completed all lessons!';
            progressMessage.className = 'text-sm text-green-300 mt-4 ml-4 font-semibold';
        }
    }
}

function updateRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (!recommendationsContainer) return;
    
    recommendationsContainer.innerHTML = '';

    if (lessonProgress.completed.length === 0) {
        recommendationsContainer.innerHTML = `
            <div class="col-span-2 text-center">
                <div class="bg-white/10 rounded-lg p-6">
                    <i class="fas fa-lightbulb text-yellow-300 text-3xl mb-3"></i>
                    <p class="text-gray-300 mb-4">Complete your first lesson to receive personalized recommendations!</p>
                    <a href="our-lessons.html" class="inline-block bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
                        Start Learning
                    </a>
                </div>
            </div>
        `;
        return;
    }

    // Obtener recomendaciones desde our-lessons.js
    let recommendations = [];
    if (window.getRecommendations) {
        recommendations = window.getRecommendations();
    }

    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = `
            <div class="col-span-2 text-center">
                <div class="bg-white/10 rounded-lg p-6">
                    <i class="fas fa-trophy text-gold-300 text-3xl mb-3"></i>
                    <p class="text-green-300 font-semibold">🎉 Congratulations! You've completed all lessons!</p>
                    <p class="text-gray-300 mt-2">You're now a PENTA Financial Expert!</p>
                </div>
            </div>
        `;
        return;
    }

    // Mostrar recomendaciones
    recommendations.forEach((recommendation, index) => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105';
        
        // Iconos para diferentes temas
        const topicIcons = {
            'Budget': 'fas fa-calculator',
            'Savings': 'fas fa-piggy-bank',
            'Crisis': 'fas fa-shield-alt'
        };
        
        const icon = topicIcons[recommendation.topic] || 'fas fa-book';
        
        lessonCard.innerHTML = `
            <div class="flex items-start">
                <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-3 mr-4 flex-shrink-0">
                    <i class="${icon}"></i>
                </div>
                <div class="flex-grow">
                    <h4 class="font-semibold text-white mb-1">${recommendation.name}</h4>
                    <p class="text-sm text-blue-300 mb-2">Topic: ${recommendation.topic}</p>
                    <p class="text-xs text-gray-400 mb-3">${recommendation.reason}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                            Recommended
                        </span>
                        <a href="our-lessons.html" class="text-orange-400 hover:text-orange-300 text-sm font-medium">
                            Start →
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar evento click para navegar a la lección
        lessonCard.addEventListener('click', () => {
            window.location.href = 'our-lessons.html';
        });
        
        recommendationsContainer.appendChild(lessonCard);
    });
}

// Función para actualizar estadísticas en tiempo real
function refreshStats() {
    loadProgress();
    
    // Mostrar notificación de actualización
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-sync-alt mr-2"></i>
            <span class="text-sm">Progress updated!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 2 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Agregar botón de actualización
function addRefreshButton() {
    const progressSection = document.querySelector('.mt-10.bg-white\\/10');
    if (progressSection && !document.getElementById('refresh-stats-btn')) {
        const refreshButton = document.createElement('button');
        refreshButton.id = 'refresh-stats-btn';
        refreshButton.className = 'mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition text-sm';
        refreshButton.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Update Progress';
        refreshButton.addEventListener('click', refreshStats);
        
        progressSection.appendChild(refreshButton);
    }
}

// Función para mostrar detalles de habilidades
function showSkillDetails(skillId) {
    const skillDescriptions = {
        'critical-thinking': 'Ability to analyze information objectively and make reasoned judgments about financial decisions.',
        'problem-solving': 'Capacity to identify financial problems and develop effective solutions.',
        'financial-decision-making': 'Skill to evaluate financial options and make informed choices about money management.'
    };
    
    const description = skillDescriptions[skillId];
    const skillName = skillNames[skillId];
    const percentage = lessonProgress.skills[skillId];
    
    alert(`${skillName}\n\nCurrent Level: ${percentage}%\n\n${description}`);
}

// Agregar eventos click a las habilidades
function addSkillClickEvents() {
    const skillElements = document.querySelectorAll('[id$="-percent"]');
    skillElements.forEach(element => {
        const skillId = element.id.replace('-percent', '');
        if (skillNames[skillId]) {
            element.style.cursor = 'pointer';
            element.title = 'Click for more details';
            element.addEventListener('click', () => showSkillDetails(skillId));
        }
    });
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    addRefreshButton();
    addSkillClickEvents();
    
    // Actualizar progreso cada 30 segundos si hay cambios
    setInterval(() => {
        const currentCompleted = lessonProgress.completed.length;
        loadProgress();
        if (lessonProgress.completed.length !== currentCompleted) {
            // Solo actualizar si hay cambios
            updateProgressDisplay();
            updateRecommendations();
        }
    }, 30000);
});

// Escuchar cambios en localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'lessonsProgress' || e.key === 'pentaProgress') {
        loadProgress();
    }
});