const questions = [
    {
        question: "What is compound interest?",
        options: [
            "Interest earned only on the original amount invested",
            "Interest earned on both the original amount and previously earned interest",
            "A type of bank fee",
            "Interest that decreases over time"
        ],
        correct: 1,
        explanation: "Compound interest is interest earned on both your original investment and on the interest that has already been earned, creating exponential growth over time."
    },
    {
        question: "What makes compound interest so powerful for long-term wealth building?",
        options: [
            "It guarantees you'll never lose money",
            "The growth accelerates over time as interest earns interest",
            "It only works with large amounts of money",
            "Banks pay higher rates for compound interest"
        ],
        correct: 1,
        explanation: "Compound interest becomes more powerful over time because your money grows exponentially - you earn interest on your interest, creating a snowball effect."
    },
    {
        question: "If you invest $1,000 at 10% annual compound interest, approximately how much will you have after 10 years?",
        options: [
            "$2,000",
            "$2,594",
            "$1,500",
            "$3,000"
        ],
        correct: 1,
        explanation: "With compound interest at 10% annually, $1,000 grows to approximately $2,594 after 10 years. This demonstrates the power of compounding over time."
    },
    {
        question: "What is the most important factor for maximizing compound interest?",
        options: [
            "Starting with a large amount of money",
            "Finding the highest interest rate possible",
            "Starting early and giving time for compounding to work",
            "Checking your account balance daily"
        ],
        correct: 2,
        explanation: "Time is the most critical factor in compound interest. Starting early, even with small amounts, gives your money more time to compound and grow exponentially."
    },
    {
        question: "How does compound interest differ from simple interest?",
        options: [
            "Simple interest is calculated on the original amount only",
            "Compound interest is always lower than simple interest",
            "There is no difference between them",
            "Simple interest is only for savings accounts"
        ],
        correct: 0,
        explanation: "Simple interest is calculated only on the original principal amount, while compound interest is calculated on the principal plus any previously earned interest."
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
        <p class="performance-text">Practice makes perfect! Try again to master compound interest.</p>
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
            <p class="performance-text">Excellent! You're ready to harness the power of compound growth.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📈</div>
            <p class="performance-text">Good job! You understand the basics of compound interest.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📚</div>
            <p class="performance-text">Keep learning! Compound interest is your best friend for wealth building.</p>
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
    document.querySelector('.final-icon').textContent = '📈';
    document.querySelector('.final-title').textContent = 'Compound Interest Mastered!';
    document.querySelector('.final-subtitle').textContent = 'You now understand how to make your money work for you';

    loadQuestion();
}

// Initialize the quiz
loadQuestion();