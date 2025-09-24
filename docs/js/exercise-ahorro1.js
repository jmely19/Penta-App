// Exercise: The Power of Paying Yourself First
// Lesson: ahorro-1 - Financial-decision-making skill

let currentQuestion = 0;
let score = 0;
let lives = 2;
let gameCompleted = false;

const questions = [
    {
        question: "What does 'paying yourself first' mean?",
        options: [
            "Buying yourself something nice before paying bills",
            "Setting aside money for savings before spending on anything else",
            "Paying your salary to yourself as a business owner",
            "Getting paid before your coworkers"
        ],
        correct: 1,
        explanation: "Paying yourself first means prioritizing savings by setting aside money for your future before spending on other expenses. This builds wealth over time."
    },
    {
        question: "What percentage of your income should you ideally save first?",
        options: [
            "50-60%",
            "30-40%", 
            "10-20%",
            "5% or less"
        ],
        correct: 2,
        explanation: "Financial experts recommend saving 10-20% of your income first. Start with what you can afford, even if it's just 5%, and gradually increase it."
    },
    {
        question: "When should you pay yourself first?",
        options: [
            "At the end of the month with leftover money",
            "Only when you get a bonus or extra income",
            "As soon as you receive your paycheck",
            "After paying all your bills and expenses"
        ],
        correct: 2,
        explanation: "Pay yourself first immediately when you receive income, before you're tempted to spend it elsewhere. Automate this process if possible."
    },
    {
        question: "What's the main benefit of paying yourself first?",
        options: [
            "You can buy more expensive things",
            "It guarantees you'll never have financial problems",
            "It builds wealth consistently over time",
            "You can quit your job sooner"
        ],
        correct: 2,
        explanation: "The main benefit is consistent wealth building. By prioritizing savings, you ensure your future self is financially secure, regardless of spending temptations."
    },
    {
        question: "What should you do if you can't afford to save 20% right away?",
        options: [
            "Wait until you earn more money to start saving",
            "Start with whatever amount you can, even 1%",
            "Only save when you have extra money",
            "Focus on paying bills first, save later"
        ],
        correct: 1,
        explanation: "Start with any amount you can afford, even 1%. The habit of paying yourself first is more important than the amount. You can increase it gradually as your income grows."
    }
];

function startExercise() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('exercise-container').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestion];
    document.getElementById('question-number').textContent = currentQuestion + 1;
    document.getElementById('total-questions').textContent = questions.length;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn w-full p-4 text-left bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    
    updateLives();
}

function selectAnswer(selectedIndex) {
    const question = questions[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');
    
    // Disable all buttons
    options.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === question.correct) {
        options[selectedIndex].classList.add('bg-green-100', 'border-green-500', 'text-green-800');
        feedback.innerHTML = `
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <strong>Correct!</strong> ${question.explanation}
            </div>
        `;
        score++;
    } else {
        options[selectedIndex].classList.add('bg-red-100', 'border-red-500', 'text-red-800');
        options[question.correct].classList.add('bg-green-100', 'border-green-500', 'text-green-800');
        
        lives--;
        feedback.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Incorrect.</strong> ${question.explanation}
            </div>
        `;
        
        if (lives <= 0) {
            setTimeout(() => {
                showGameOver();
            }, 2000);
            return;
        }
    }
    
    feedback.style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';
    updateLives();
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function updateLives() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    
    for (let i = 0; i < 2; i++) {
        const heart = document.createElement('span');
        heart.className = i < lives ? 'text-red-500' : 'text-gray-300';
        heart.innerHTML = '❤️';
        livesContainer.appendChild(heart);
    }
}

function showResults() {
    gameCompleted = true;
    document.getElementById('exercise-container').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    
    const percentage = Math.round((score / questions.length) * 100);
    document.getElementById('final-score').textContent = `${score}/${questions.length}`;
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    
    let message = '';
    let messageClass = '';
    
    if (percentage >= 80) {
        message = 'Excellent! You understand the power of paying yourself first. You\'re ready to build wealth consistently.';
        messageClass = 'text-green-600';
    } else if (percentage >= 60) {
        message = 'Good work. You grasp the basics of paying yourself first, but review the concepts to maximize your savings success.';
        messageClass = 'text-yellow-600';
    } else {
        message = 'You need to review the concept of paying yourself first. Remember: save first, spend second = financial success.';
        messageClass = 'text-red-600';
    }
    
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-message').className = `text-lg ${messageClass}`;
    
    // Mark lesson as completed
    if (typeof markLessonCompleted === 'function') {
        markLessonCompleted('ahorro-1');
    }
}

function showGameOver() {
    document.getElementById('exercise-container').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
}

function restartExercise() {
    currentQuestion = 0;
    score = 0;
    lives = 2;
    gameCompleted = false;
    
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('welcome-screen').style.display = 'block';
}

function goToLessons() {
    window.location.href = 'our-lessons.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateLives();
});