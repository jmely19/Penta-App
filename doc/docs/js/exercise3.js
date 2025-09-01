const questions = [
    {
        title: "El Presupuesto: Tu Mapa Financiero",
        subtitle: "Un presupuesto es como un mapa que te guía a través de tus gastos y te ayuda a tomar mejores decisiones financieras. ¡Descubre qué tan bien navegas!",
        budget: "Ruta: Planificación Inteligente",
        question: "Pregunta 1/5: ¿Cuál es el primer paso para crear tu 'mapa financiero'?",
        options: [
            "Empezar a gastar sin control",
            "Anotar todos tus ingresos mensuales",
            "Comprar cosas que deseas inmediatamente"
        ],
        correct: 1
    },
    {
        title: "¡Perfecto! Continuemos trazando la ruta",
        subtitle: "Excelente, ya conoces el punto de partida. Ahora necesitas marcar los destinos obligatorios en tu mapa financiero.",
        budget: "Ruta: Gastos Esenciales",
        question: "Pregunta 2/5: En tu mapa financiero, ¿cuáles son las 'paradas obligatorias'?",
        options: [
            "Solo entretenimiento y diversión",
            "Gastos fijos como renta, servicios y comida",
            "Únicamente compras impulsivas"
        ],
        correct: 1
    },
    {
        title: "¡Excelente navegación! Sigamos el rumbo",
        subtitle: "Muy bien, ya identificas las rutas prioritarias. Ahora veamos cómo manejas los desvíos y cambios en tu camino financiero.",
        budget: "Ruta: Adaptabilidad",
        question: "Pregunta 3/5: Si tu 'mapa financiero' muestra que gastas más de lo planeado, ¿qué haces?",
        options: [
            "Ignorar el problema y seguir gastando igual",
            "Revisar el presupuesto y ajustar las rutas de gasto",
            "Abandonar completamente el plan financiero"
        ],
        correct: 1
    },
    {
        title: "¡Navegas como un experto! Casi llegamos",
        subtitle: "Perfecto, sabes cómo recalcular la ruta cuando es necesario. Ahora veamos si conoces los destinos importantes a largo plazo.",
        budget: "Ruta: Metas Futuras",
        question: "Pregunta 4/5: En tu mapa financiero, ¿dónde debe aparecer el ahorro?",
        options: [
            "Solo si sobra dinero al final del mes",
            "Como una 'parada programada' prioritaria cada mes",
            "No es necesario incluirlo en el mapa"
        ],
        correct: 1
    },
    {
        title: "¡Último destino! Eres un navegante excepcional",
        subtitle: "Has demostrado dominar la navegación financiera perfectamente. Una última pregunta sobre el uso efectivo de tu mapa presupuestario.",
        budget: "Ruta: Maestría Financiera",
        question: "Pregunta 5/5: ¿Con qué frecuencia debes consultar tu 'mapa financiero'?",
        options: [
            "Solo una vez al año",
            "Regularmente, al menos una vez al mes",
            "Nunca, una vez hecho no se toca"
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
        resultTitle.textContent = '¡Correcto!';
        resultTitle.className = 'result-title correct';
        
        const correctMessages = [
            '¡Excelente! Sabes cómo empezar a navegar tus finanzas.',
            '¡Perfecto! Identificas correctamente las rutas prioritarias.',
            '¡Muy bien! Sabes cómo recalcular cuando el plan cambia.',
            '¡Genial! Entiendes que el ahorro debe ser una parada obligatoria.',
            '¡Fantástico! Sabes que el mapa debe revisarse regularmente.'
        ];
        resultText.textContent = correctMessages[currentQuestionIndex];
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
    }, 2500);
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
            <div class="performance-icon">🧭</div>
            <p class="performance-text">¡Excelente! Eres un navegante experto en finanzas personales.</p>
        `;
    } else if (percentage >= 60) {
        performanceMessage.innerHTML = `
            <div class="performance-icon">🗺️</div>
            <p class="performance-text">¡Bien! Ya sabes usar tu presupuesto como guía financiera.</p>
        `;
    } else {
        performanceMessage.innerHTML = `
            <div class="performance-icon">📍</div>
            <p class="performance-text">¡Sigue aprendiendo! Pronto dominarás la navegación financiera.</p>
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
