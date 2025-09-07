// Script para manejar el progreso en las páginas de ejercicios
// Este archivo debe ser incluido en exercise1.html, exercise2.html, exercise3.html

// Función para marcar ejercicio como completado
function completeExercise() {
    // Obtener el ID de la lección desde la URL o parámetros
    const urlParams = new URLSearchParams(window.location.search);
    let lessonId = urlParams.get('lesson');
    
    // Si no hay parámetro, intentar determinar desde el referrer o usar un mapeo por defecto
    if (!lessonId) {
        const referrer = document.referrer;
        if (referrer.includes('our-lessons.html')) {
            // Mapeo por defecto basado en el archivo actual
            const currentFile = window.location.pathname.split('/').pop();
            const exerciseToLessonMap = {
                'exercise1.html': 'presupuesto-1', // Por defecto, puede ser modificado
                'exercise2.html': 'presupuesto-2',
                'exercise3.html': 'presupuesto-3'
            };
            lessonId = exerciseToLessonMap[currentFile];
        }
    }
    
    if (lessonId && window.markLessonCompleted) {
        window.markLessonCompleted(lessonId);
        showCompletionMessage(lessonId);
    } else {
        // Fallback: guardar progreso directamente
        saveLessonProgressLocal(lessonId || 'unknown-lesson');
    }
}

// Función local para guardar progreso si no está disponible la función global
function saveLessonProgressLocal(lessonId) {
    let progress = JSON.parse(localStorage.getItem('lessonsProgress')) || {};
    progress[lessonId] = {
        status: 'completed',
        completedAt: new Date().toISOString(),
        completedVia: 'exercise'
    };
    localStorage.setItem('lessonsProgress', JSON.stringify(progress));
}

// Mostrar mensaje de finalización
function showCompletionMessage(lessonId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div class="mb-6">
                <i class="fas fa-trophy text-yellow-500 text-6xl mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Excelente trabajo!</h2>
                <p class="text-gray-600">Has completado esta lección exitosamente.</p>
            </div>
            <div class="space-y-3">
                <button onclick="goToProfile()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    <i class="fas fa-user mr-2"></i>Ver mi progreso
                </button>
                <button onclick="goToLessons()" class="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                    <i class="fas fa-book mr-2"></i>Continuar aprendiendo
                </button>
                <button onclick="closeCompletionModal()" class="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentCompletionModal = modal;
}

// Funciones de navegación
function goToProfile() {
    window.location.href = 'profile.html';
}

function goToLessons() {
    window.location.href = 'our-lessons.html';
}

function closeCompletionModal() {
    if (window.currentCompletionModal) {
        document.body.removeChild(window.currentCompletionModal);
        window.currentCompletionModal = null;
    }
}

// Función para agregar botón de completar a cualquier ejercicio
function addCompleteButton(containerId = 'exercise-container') {
    const container = document.getElementById(containerId) || document.body;
    
    const completeButton = document.createElement('button');
    completeButton.id = 'complete-exercise-btn';
    completeButton.className = 'fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-105 z-40';
    completeButton.innerHTML = '<i class="fas fa-check mr-2"></i>Completar Lección';
    completeButton.onclick = completeExercise;
    
    document.body.appendChild(completeButton);
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Agregar botón de completar automáticamente
    addCompleteButton();
    
    // Escuchar tecla Enter para completar rápidamente
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            completeExercise();
        }
    });
});

// Exportar funciones para uso global
window.completeExercise = completeExercise;
window.goToProfile = goToProfile;
window.goToLessons = goToLessons;