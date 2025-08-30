const questions = [
    {
        title: "Es hora de la verdad: ¿Qué tanto aprendiste?",
        subtitle: "¡Llegó el momento de poner a prueba tus conocimientos! Este quiz es tu oportunidad para demostrar cuánto dominas la lección.",
        budget: "$100",
        question: "Pregunta 1/5: ¿Qué es un presupuesto?",
        options: [
            "Un gasto innecesario",
            "Un plan para organizar tus ingresos y gastos",
            "Una forma de gastar dinero"
        ],
        correct: 1
    },
    {
        title: "¡Muy bien! Sigamos con la siguiente",
        subtitle: "Excelente respuesta. Ahora vamos a profundizar un poco más en conceptos financieros importantes.",
        budget: "$200",
        question: "Pregunta 2/5: ¿Cuál es la regla 50/30/20?",
        options: [
            "50% gastos necesarios, 30% gastos personales, 20% ahorros",
            "50% ahorros, 30% gastos, 20% inversiones",
            "50% inversiones, 30% gastos, 20% ahorros"
        ],
        correct: 0
    },
    {
        title: "¡Perfecto! Continuemos aprendiendo",
        subtitle: "Tu conocimiento sobre finanzas personales va muy bien. Sigamos con el siguiente concepto.",
        budget: "$300",
        question: "Pregunta 3/5: ¿Qué es un fondo de emergencia?",
        options: [
            "Dinero para gastos innecesarios",
            "Dinero reservado para situaciones imprevistas",
            "Un tipo de inversión arriesgada"
        ],
        correct: 1
    },
    {
        title: "¡Excelente progreso!",
        subtitle: "Vas dominando los conceptos básicos. Ahora vamos con algo sobre inversiones.",
        budget: "$400",
        question: "Pregunta 4/5: ¿Qué significa diversificar inversiones?",
        options: [
            "Invertir todo en una sola opción",
            "Repartir el dinero en diferentes tipos de inversión",
            "Solo invertir en acciones"
        ],
        correct: 1
    },
    {
        title: "¡Fantástico! Última pregunta",
        subtitle: "Solo queda una pregunta más. ¡Sigues demostrando que sabes mucho sobre finanzas!",
        budget: "$500",
        question: "Pregunta 5/5: ¿Qué es el interés compuesto?",
        options: [
            "Interés que se paga solo una vez",
            "Interés que se genera sobre el capital inicial y los intereses acumulados",
            "Un tipo de préstamo"
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
    document.getElementById('budgetBadge').textContent = `Presupuesto: ${question.budget}`;
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
        resultTitle.textContent = '¡Correcto!';
        resultTitle.className = 'result-title correct';
        resultText.textContent = 'Excelente respuesta. ¡Sigues demostrando tus conocimientos!';
    } else {
        resultIcon.textContent = '✗';
        resultIcon.className = 'result-icon incorrect';
        resultTitle.textContent = '¡Incorrecto!';
        resultTitle.className = 'result-title incorrect';
        resultText.textContent = `La respuesta correcta era: ${questions[currentQuestionIndex].options[questions[currentQuestionIndex].correct]}`;
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
    document.getElementById('finalPercentage').textContent = `${percentage}% Correcto`;
    
    const performanceMessage = document.getElementById('performanceMessage');
    if (percentage >= 80) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">🏆</div>
            <p class="performance-text">¡Excelente! Dominas muy bien las finanzas personales.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📊</div>
            <p class="performance-text">¡Bien hecho! Tienes buenos conocimientos financieros.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📈</div>
            <p class="performance-text">¡Sigue aprendiendo! Cada paso cuenta en educación financiera.</p>
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
