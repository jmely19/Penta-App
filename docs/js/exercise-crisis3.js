const questions = [
    {
        question: "What is inflation?",
        options: [
            "When prices of goods and services decrease over time",
            "When prices of goods and services increase over time",
            "When your salary increases automatically",
            "When banks give you more interest"
        ],
        correct: 1,
        explanation: "Inflation is the general increase in prices of goods and services over time, which reduces the purchasing power of money."
    },
    {
        question: "How does inflation affect your savings?",
        options: [
            "It makes your savings grow faster",
            "It has no effect on savings",
            "It reduces the purchasing power of your saved money",
            "It only affects checking accounts"
        ],
        correct: 2,
        explanation: "Inflation reduces the purchasing power of your savings. Money saved today will buy less in the future if inflation exceeds your savings growth rate."
    },
    {
        question: "What is a good strategy to protect against inflation?",
        options: [
            "Keep all money in cash under your mattress",
            "Invest in assets that typically grow faster than inflation",
            "Stop saving money completely",
            "Only buy things when prices are high"
        ],
        correct: 1,
        explanation: "Investing in assets like stocks, real estate, or inflation-protected bonds that historically grow faster than inflation helps preserve purchasing power."
    },
    {
        question: "What typically happens to fixed-rate debt during inflation?",
        options: [
            "The debt becomes more expensive to pay off",
            "The debt becomes easier to pay off with inflated dollars",
            "The debt disappears automatically",
            "Interest rates on the debt increase"
        ],
        correct: 1,
        explanation: "Fixed-rate debt becomes easier to pay off during inflation because you're paying back with dollars that are worth less than when you borrowed them."
    },
    {
        question: "Which group is most hurt by unexpected inflation?",
        options: [
            "People with variable-rate mortgages",
            "People with fixed incomes and cash savings",
            "People who own real estate",
            "People with student loans"
        ],
        correct: 1,
        explanation: "People with fixed incomes and cash savings are hurt most by inflation because their purchasing power decreases while their income stays the same."
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
        <p class="performance-text">Practice makes perfect! Try again to master inflation protection.</p>
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
            <p class="performance-text">Excellent! You're prepared to protect your purchasing power.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📈</div>
            <p class="performance-text">Good job! You understand the basics of inflation protection.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📚</div>
            <p class="performance-text">Keep learning! Understanding inflation is crucial for financial planning.</p>
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
    document.querySelector('.final-title').textContent = 'Inflation Mastered!';
    document.querySelector('.final-subtitle').textContent = 'You now understand how to protect your money from inflation';

    loadQuestion();
}

// Initialize the quiz
loadQuestion();