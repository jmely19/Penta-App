const questions = [
    {
        title: "The Budget: Your Financial Map",
        subtitle: "A budget is like a map that guides you through your expenses and helps you make better financial decisions. Discover how well you navigate!",
        budget: "Route: Smart Planning",
        question: "Question 1/5: What is the first step to create your 'financial map'?",
        options: [
            "Start spending without control",
            "Write down all your monthly income",
            "Buy things you want immediately"
        ],
        correct: 1
    },
    {
        title: "Perfect! Let's continue tracing the route",
        subtitle: "Excellent, you know the starting point. Now you need to mark the mandatory stops on your financial map.",
        budget: "Route: Essential Expenses",
        question: "Question 2/5: On your financial map, what are the 'mandatory stops'?",
        options: [
            "Only entertainment and fun",
            "Fixed expenses like rent, utilities, and food",
            "Only impulse purchases"
        ],
        correct: 1
    },
    {
        title: "Excellent navigation! Let's keep going",
        subtitle: "Very good, you identify the priority routes. Now let's see how you handle detours and changes in your financial path.",
        budget: "Route: Adaptability",
        question: "Question 3/5: If your 'financial map' shows you are spending more than planned, what do you do?",
        options: [
            "Ignore the problem and keep spending the same way",
            "Review the budget and adjust spending routes",
            "Completely abandon the financial plan"
        ],
        correct: 1
    },
    {
        title: "You navigate like an expert! We're almost there",
        subtitle: "Perfect, you know how to recalculate the route when necessary. Now let's see if you know the important long-term destinations.",
        budget: "Route: Future Goals",
        question: "Question 4/5: On your financial map, where should savings appear?",
        options: [
            "Only if there's money left at the end of the month",
            "As a prioritized 'scheduled stop' every month",
            "It's not necessary to include it on the map"
        ],
        correct: 1
    },
    {
        title: "Last destination! You are an exceptional navigator",
        subtitle: "You have shown mastery of financial navigation. One last question about the effective use of your budget map.",
        budget: "Route: Financial Mastery",
        question: "Question 5/5: How often should you check your 'financial map'?",
        options: [
            "Only once a year",
            "Regularly, at least once a month",
            "Never, once done it's not touched"
        ],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = -1;

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
    if (isCorrect) score++;

    showResult(isCorrect);
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

        const correctMessages = [
            'Excellent! You know how to start navigating your finances.',
            'Perfect! You correctly identify the priority routes.',
            'Very good! You know how to recalculate when the plan changes.',
            'Great! You understand that savings should be a mandatory stop.',
            'Fantastic! You know the map should be reviewed regularly.'
        ];
        resultText.textContent = correctMessages[currentQuestionIndex];
    } else {
        resultIcon.textContent = '✗';
        resultIcon.className = 'result-icon incorrect';
        resultTitle.textContent = 'Incorrect!';
        resultTitle.className = 'result-title incorrect';
        resultText.textContent = `The correct answer was: ${questions[currentQuestionIndex].options[questions[currentQuestionIndex].correct]}`;
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
    }, 2500);
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
            <div class="performance-icon">🧭</div>
            <p class="performance-text">Excellent! You are an expert navigator in personal finance.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">🗺️</div>
            <p class="performance-text">Good! You know how to use your budget as a financial guide.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📍</div>
            <p class="performance-text">Keep learning! Soon you will master financial navigation.</p>
        `;
    }
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = -1;

    document.getElementById('finalScreen').classList.add('hidden');
    document.getElementById('questionScreen').classList.remove('hidden');

    loadQuestion();
}

// Initialize the quiz
loadQuestion();
