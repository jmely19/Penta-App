const questions = [
    {
        question: "What is goal-based saving?",
        options: [
            "Saving money without any specific purpose",
            "Setting aside money for specific objectives with a timeline",
            "Only saving for retirement",
            "Saving whatever is left at the end of the month"
        ],
        correct: 1,
        explanation: "Goal-based saving means setting aside money for specific objectives with clear timelines, making your savings more purposeful and motivating."
    },
    {
        question: "What makes a savings goal effective?",
        options: [
            "It should be vague and flexible",
            "It should be specific, measurable, and time-bound",
            "It should be impossible to achieve",
            "It should change every month"
        ],
        correct: 1,
        explanation: "Effective savings goals are SMART: Specific, Measurable, Achievable, Relevant, and Time-bound. This clarity helps you stay focused and motivated."
    },
    {
        question: "How should you prioritize multiple savings goals?",
        options: [
            "Save for all goals equally at the same time",
            "Only focus on the most expensive goal",
            "Prioritize by importance and timeline, starting with urgent needs",
            "Choose goals randomly"
        ],
        correct: 2,
        explanation: "Prioritize savings goals by importance and timeline. Start with urgent needs (emergency fund), then short-term goals, followed by long-term objectives."
    },
    {
        question: "What's a good strategy for staying motivated with long-term savings goals?",
        options: [
            "Ignore progress until you reach the goal",
            "Break the goal into smaller milestones and celebrate progress",
            "Change the goal frequently to keep it interesting",
            "Only think about the goal once a year"
        ],
        correct: 1,
        explanation: "Breaking long-term goals into smaller milestones and celebrating progress helps maintain motivation and makes large goals feel more achievable."
    },
    {
        question: "What should you do if you're struggling to save for a goal?",
        options: [
            "Give up on the goal completely",
            "Borrow money to reach the goal faster",
            "Review your budget, reduce expenses, or adjust the timeline",
            "Ignore the goal and hope for the best"
        ],
        correct: 2,
        explanation: "If struggling to save, review your budget to find areas to cut expenses, consider increasing income, or adjust the timeline to make the goal more realistic."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = -1;
let lives = 3;

function loadQuestion() {
    const question = questions[currentQuestionIndex];

    // Update progress
    document.getElementById('progressText').textContent = `${currentQuestionIndex + 1}/5`;
    
    // Update the current question
    document.getElementById('currentQuestion').textContent = `Question ${currentQuestionIndex + 1}/5: ${question.question}`;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });

    selectedAnswer = -1;
    document.getElementById('nextBtn').disabled = true;
}

function selectAnswer(index) {
    selectedAnswer = index;

    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
        option.classList.remove('selected', 'correct', 'incorrect');
        if (i === index) {
            option.classList.add('selected');
        }
    });

    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correct;
    
    // Show correct/incorrect immediately
    const options = document.querySelectorAll('.option');
    options.forEach((option, i) => {
        if (i === questions[currentQuestionIndex].correct) {
            option.classList.add('correct');
        } else if (i === selectedAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
    });

    if (isCorrect) {
        score++;
        setTimeout(() => {
            showResult(true);
        }, 1000);
    } else {
        lives--;
        if (lives <= 0) {
            setTimeout(() => {
                showGameOver();
            }, 1000);
            return;
        }
        setTimeout(() => {
            showResult(false);
        }, 1000);
    }
}

function showResult(isCorrect) {
    document.getElementById('questionScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');

    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');

    if (isCorrect) {
        resultIcon.textContent = '✓';
        resultIcon.className = 'result-icon correct';
        resultTitle.textContent = 'Correct!';
        resultTitle.className = 'result-title correct';
        resultText.textContent = questions[currentQuestionIndex].explanation;
    } else {
        resultIcon.textContent = '✗';
        resultIcon.className = 'result-icon incorrect';
        resultTitle.textContent = 'Incorrect!';
        resultTitle.className = 'result-title incorrect';
        resultText.textContent = `${questions[currentQuestionIndex].explanation} Lives remaining: ${lives}`;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            document.getElementById('resultScreen').classList.add('hidden');
            document.getElementById('questionScreen').classList.remove('hidden');
            loadQuestion();
        } else {
            showFinalScreen();
        }
    }, 3000);
}

function showGameOver() {
    document.getElementById('questionScreen').classList.add('hidden');
    document.getElementById('finalScreen').classList.remove('hidden');
    
    // Change final screen to show game over
    document.querySelector('.final-icon').textContent = '😞';
    document.querySelector('.final-title').textContent = 'Game Over';
    document.querySelector('.final-subtitle').textContent = "Don't worry, you can try again!";
    document.getElementById('finalScore').textContent = `${score}/${currentQuestionIndex + 1}`;
    document.getElementById('finalPercentage').textContent = 'Try Again';
    
    const performanceMessage = document.getElementById('performanceMessage');
    performanceMessage.innerHTML = `
        <div class="performance-icon">🔄</div>
        <p class="performance-text">Practice makes perfect! Try again to master goal-based saving.</p>
    `;
}

function showFinalScreen() {
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('finalScreen').classList.remove('hidden');

    const percentage = (score / questions.length) * 100;

    document.getElementById('finalScore').textContent = `${score}/${questions.length}`;
    document.getElementById('finalPercentage').textContent = `${percentage}% Correct`;

    const performanceMessage = document.getElementById('performanceMessage');
    if (percentage >= 80) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">🏆</div>
            <p class="performance-text">Excellent! You're ready to turn your dreams into achievable goals.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">🎯</div>
            <p class="performance-text">Good job! You understand the basics of purposeful saving.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📈</div>
            <p class="performance-text">Keep learning! Goal-based saving is the key to achieving your dreams.</p>
        `;
    }
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = -1;
    lives = 3;

    document.getElementById('finalScreen').classList.add('hidden');
    document.getElementById('questionScreen').classList.remove('hidden');

    // Reset final screen elements
    document.querySelector('.final-icon').textContent = '🎯';
    document.querySelector('.final-title').textContent = 'Savings Goals Mastered!';
    document.querySelector('.final-subtitle').textContent = 'You now know how to save with purpose and achieve your dreams';

    loadQuestion();
}

// Initialize the quiz
loadQuestion();