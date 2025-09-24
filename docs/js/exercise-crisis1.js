const questions = [
    {
        title: "Life is Unpredictable: Build Your Safety Net!",
        subtitle: "Emergency funds are your financial lifeline. Test your knowledge about building a solid safety net for unexpected situations.",
        budget: "Emergency Fund",
        question: "What is an emergency fund?",
        options: [
            "Money saved to buy things we want",
            "Money reserved for unexpected and urgent expenses",
            "A high-risk investment account",
            "Money for annual vacations"
        ],
        correct: 1,
        explanation: "An emergency fund is money reserved specifically to cover unexpected expenses such as job loss, medical emergencies, or urgent repairs."
    },
    {
        title: "Life is Unpredictable: Build Your Safety Net!",
        subtitle: "Emergency funds are your financial lifeline. Test your knowledge about building a solid safety net for unexpected situations.",
        budget: "Emergency Fund",
        question: "How much money should I have in my emergency fund?",
        options: [
            "1 month of basic expenses",
            "3-6 months of basic expenses",
            "1 year of basic expenses",
            "Only $500"
        ],
        correct: 1,
        explanation: "Experts recommend having between 3-6 months of basic expenses in your emergency fund. This gives you enough time to recover from most financial crises."
    },
    {
        title: "Life is Unpredictable: Build Your Safety Net!",
        subtitle: "Emergency funds are your financial lifeline. Test your knowledge about building a solid safety net for unexpected situations.",
        budget: "Emergency Fund",
        question: "Where is it best to keep emergency fund money?",
        options: [
            "In stock market investments",
            "In an easily accessible savings account",
            "In real estate",
            "In cryptocurrencies"
        ],
        correct: 1,
        explanation: "The emergency fund should be in a liquid and easily accessible savings account. It should not be in risky investments that could lose value when you need it most."
    },
    {
        title: "Life is Unpredictable: Build Your Safety Net!",
        subtitle: "Emergency funds are your financial lifeline. Test your knowledge about building a solid safety net for unexpected situations.",
        budget: "Emergency Fund",
        question: "Which of these situations justifies using the emergency fund?",
        options: [
            "I want to buy a new TV on sale",
            "My car engine broke and I need to repair it to work",
            "My friends are going on a trip and I want to join them",
            "I saw some shoes I really liked"
        ],
        correct: 1,
        explanation: "The emergency fund is only for true emergencies that affect your ability to work, your health, or your safety. Repairing your car to be able to work is a legitimate emergency."
    },
    {
        title: "Life is Unpredictable: Build Your Safety Net!",
        subtitle: "Emergency funds are your financial lifeline. Test your knowledge about building a solid safety net for unexpected situations.",
        budget: "Emergency Fund",
        question: "What is the best strategy to build an emergency fund?",
        options: [
            "Wait to have a lot of extra money all at once",
            "Save small amounts consistently each month",
            "Borrow money from family members",
            "Use credit cards as an emergency fund"
        ],
        correct: 1,
        explanation: "The best strategy is to save small amounts consistently. Even $25-50 per month can build a solid fund over time."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = -1;
let lives = 3;

function loadQuestion() {
    const question = questions[currentQuestionIndex];

    document.getElementById('progressText').textContent = `${currentQuestionIndex + 1}/5`;
    document.getElementById('questionTitle').textContent = question.title;
    document.getElementById('questionSubtitle').textContent = question.subtitle;
    document.getElementById('budgetBadge').textContent = question.budget;
    document.getElementById('currentQuestion').textContent = question.question;

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
        option.classList.toggle('selected', i === index);
    });

    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correct;
    
    if (isCorrect) {
        score++;
        showResult(true);
    } else {
        lives--;
        if (lives <= 0) {
            // Game over - show final screen with failure message
            showGameOver();
            return;
        }
        showResult(false);
        // Don't advance to next question if wrong answer
        return;
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
        resultText.textContent = 'Great! You understand the importance of emergency preparedness.';
        
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                document.getElementById('resultScreen').classList.add('hidden');
                document.getElementById('questionScreen').classList.remove('hidden');
                loadQuestion();
            } else {
                showFinalScreen();
            }
        }, 2000);
    } else {
        resultIcon.textContent = '✗';
        resultIcon.className = 'result-icon incorrect';
        resultTitle.textContent = 'Incorrect!';
        resultTitle.className = 'result-title incorrect';
        resultText.textContent = `${questions[currentQuestionIndex].explanation} You have ${lives} lives remaining.`;
        
        setTimeout(() => {
            // Return to same question
            document.getElementById('resultScreen').classList.add('hidden');
            document.getElementById('questionScreen').classList.remove('hidden');
            loadQuestion();
        }, 3000);
    }
}

function showGameOver() {
    document.getElementById('questionScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('finalScreen').classList.remove('hidden');

    document.getElementById('finalScore').textContent = `${score}/${questions.length}`;
    document.getElementById('finalPercentage').textContent = '0% - Game Over';

    const performanceMessage = document.getElementById('performanceMessage');
    performanceMessage.innerHTML = `
        <div class="performance-icon">😞</div>
        <p class="performance-text">Don't give up! Practice makes perfect in financial education.</p>
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
            <p class="performance-text">Excellent! You're prepared for life's unexpected challenges.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📊</div>
            <p class="performance-text">Well done! You have good emergency preparedness knowledge.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📈</div>
            <p class="performance-text">Keep learning! Building financial security takes practice.</p>
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

    loadQuestion();
}

// Initialize the quiz
loadQuestion();