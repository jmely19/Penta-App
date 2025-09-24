// Script to handle progress in exercise pages
// This file should be included in exercise1.html, exercise2.html, exercise3.html

// Function to mark exercise as completed
function completeExercise() {
    // Get lesson ID from URL or parameters
    const urlParams = new URLSearchParams(window.location.search);
    let lessonId = urlParams.get('lesson');
    
    // If no parameter, try to determine from referrer or use default mapping
    if (!lessonId) {
        const referrer = document.referrer;
        if (referrer.includes('our-lessons.html')) {
            // Default mapping based on current file
            const currentFile = window.location.pathname.split('/').pop();
            const exerciseToLessonMap = {
                'exercise1.html': 'presupuesto-1', // Default, can be modified
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
        // Fallback: save progress directly
        saveLessonProgressLocal(lessonId || 'unknown-lesson');
    }
}

// Local function to save progress if global function is not available
function saveLessonProgressLocal(lessonId) {
    let progress = JSON.parse(localStorage.getItem('lessonsProgress')) || {};
    progress[lessonId] = {
        status: 'completed',
        completedAt: new Date().toISOString(),
        completedVia: 'exercise'
    };
    localStorage.setItem('lessonsProgress', JSON.stringify(progress));
}

// Show completion message
function showCompletionMessage(lessonId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div class="mb-6">
                <i class="fas fa-trophy text-yellow-500 text-6xl mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Excellent work!</h2>
                <p class="text-gray-600">You have successfully completed this lesson.</p>
            </div>
            <div class="space-y-3">
                <button onclick="goToProfile()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    <i class="fas fa-user mr-2"></i>View my progress
                </button>
                <button onclick="goToLessons()" class="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                    <i class="fas fa-book mr-2"></i>Continue learning
                </button>
                <button onclick="closeCompletionModal()" class="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentCompletionModal = modal;
}

// Navigation functions
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

// Function to add complete button to any exercise
function addCompleteButton(containerId = 'exercise-container') {
    const container = document.getElementById(containerId) || document.body;
    
    const completeButton = document.createElement('button');
    completeButton.id = 'complete-exercise-btn';
    completeButton.className = 'fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-105 z-40';
    completeButton.innerHTML = '<i class="fas fa-check mr-2"></i>Complete Lesson';
    completeButton.onclick = completeExercise;
    
    document.body.appendChild(completeButton);
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', function() {
    // Add complete button automatically
    addCompleteButton();
    
    // Listen for Enter key to complete quickly
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            completeExercise();
        }
    });
});

// Export functions for global use
window.completeExercise = completeExercise;
window.goToProfile = goToProfile;
window.goToLessons = goToLessons;