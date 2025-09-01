const questions = [
    {
        title: "Needs vs Wants: Discover How Well You Can Tell the Difference!",
        subtitle: "Learning to distinguish between needs and wants is key to making smart financial decisions. Test your knowledge!",
        budget: "Situation: You have $500",
        question: "Question 1/5: Which of these options is a NEED?",
        options: [
            "A new iPhone when yours works fine",
            "Food and basic groceries",
            "A Netflix subscription"
        ],
        correct: 1
    },
    {
        title: "Perfect! Let's keep identifying priorities",
        subtitle: "Great, you recognize basic needs. Now let's see if you can clearly identify a want.",
        budget: "Situation: Mid-month",
        question: "Question 2/5: Which of these is clearly a WANT?",
        options: [
            "Paying rent for your home",
            "Buying premium brand sports shoes",
            "Medicine for an illness"
        ],
        correct: 1
    },
    {
        title: "Excellent! Let's tackle more complex situations",
        subtitle: "Great, you've mastered the obvious cases. Now let's look at situations where the line between need and want is thinner.",
        budget: "Situation: Tight budget",
        question: "Question 3/5: If you have a limited budget, what would you prioritize?",
        options: [
            "An expensive dinner at a fancy restaurant",
            "Cleaning products for your home",
            "Designer clothes on sale"
        ],
        correct: 1
    },
    {
        title: "Very good! We're almost done",
        subtitle: "Your decisions show that you understand financial priorities. One more question about smart spending.",
        budget: "Situation: Planning expenses",
        question: "Question 4/5: Which best represents a long-term need?",
        options: [
            "Education or professional training",
            "Video games and entertainment",
            "Expensive home decoration"
        ],
        correct: 0
    },
    {
        title: "Last question! You're an expert",
        subtitle: "You've shown great skill in distinguishing needs from wants. Let's finish with a common practical situation.",
        budget: "Situation: Purchase decision",
        question: "Question 5/5: Your car works fine, but you see a newer one on sale. What is it?",
        options: [
            "An urgent need",
            "A want you can consider if you have extra money",
            "A necessary investment always"
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
            'Excellent! You know how to correctly identify needs.',
            'Perfect! You clearly recognize what is a want.',
            'Very good! You prioritize your expenses correctly.',
            'Great! You understand necessary long-term investments.',
            'Fantastic! You know when something is truly a want.'
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
            <div class="performance-icon">🏆</div>
            <p class="performance-text">Excellent! You have a clear understanding of what's important in your finances.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">🎯</div>
            <p class="performance-text">Good! You already identify most needs and wants.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📚</div>
            <p class="performance-text">Keep practicing! Soon you'll master these important differences.</p>
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

