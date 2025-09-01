const questions = [
    {
        title: "Moment of Truth: How Much Did You Learn?",
        subtitle: "It's time to test your knowledge! This quiz is your chance to show how well you've mastered the lesson.",
        budget: "$100",
        question: "Question 1/5: What is a budget?",
        options: [
            "An unnecessary expense",
            "A plan to organize your income and expenses",
            "A way to spend money"
        ],
        correct: 1
    },
    {
        title: "Very good! Let's move to the next one",
        subtitle: "Excellent answer. Now let's delve a little deeper into important financial concepts.",
        budget: "$200",
        question: "Question 2/5: What is the 50/30/20 rule?",
        options: [
            "50% needs, 30% wants, 20% savings",
            "50% savings, 30% expenses, 20% investments",
            "50% investments, 30% expenses, 20% savings"
        ],
        correct: 0
    },
    {
        title: "Perfect! Let's keep learning",
        subtitle: "Your knowledge of personal finance is going very well. Let's continue with the next concept.",
        budget: "$300",
        question: "Question 3/5: What is an emergency fund?",
        options: [
            "Money for unnecessary expenses",
            "Money set aside for unexpected situations",
            "A type of risky investment"
        ],
        correct: 1
    },
    {
        title: "Excellent progress!",
        subtitle: "You are mastering the basic concepts. Now let's move on to something about investments.",
        budget: "$400",
        question: "Question 4/5: What does diversifying investments mean?",
        options: [
            "Investing everything in a single option",
            "Spreading money across different types of investments",
            "Only investing in stocks"
        ],
        correct: 1
    },
    {
        title: "Fantastic! Last question",
        subtitle: "Only one more question left. You keep showing that you know a lot about finance!",
        budget: "$500",
        question: "Question 5/5: What is compound interest?",
        options: [
            "Interest that is paid only once",
            "Interest that is earned on the initial capital and accumulated interest",
            "A type of loan"
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
    document.getElementById('budgetBadge').textContent = `Budget: $${question.budget}`;
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
        resultText.textContent = 'Excellent answer. You keep demonstrating your knowledge!';
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
    }, 2000);
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
            <p class="performance-text">Excellent! You have a very good grasp of personal finance.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📊</div>
            <p class="performance-text">Well done! You have good financial knowledge.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📈</div>
            <p class="performance-text">Keep learning! Every step counts in financial education.</p>
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
