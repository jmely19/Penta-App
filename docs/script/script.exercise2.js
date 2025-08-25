
        const questions = [
            {
                title: "Necesidades vs Deseos: ¡Descubre qué tan bien sabes diferenciar!",
                subtitle: "Aprender a distinguir entre necesidades y deseos es clave para tomar decisiones financieras inteligentes. ¡Pon a prueba tu conocimiento!",
                budget: "Situación: Tienes $500",
                question: "Pregunta 1/5: ¿Cuál de estas opciones es una NECESIDAD?",
                options: [
                    "Un nuevo iPhone cuando el tuyo funciona bien",
                    "Comida y productos básicos de alimentación",
                    "Una suscripción a Netflix"
                ],
                correct: 1
            },
            {
                title: "¡Perfecto! Sigamos identificando prioridades",
                subtitle: "Muy bien, reconoces las necesidades básicas. Ahora veamos si puedes identificar un deseo claramente.",
                budget: "Situación: Mes de quincena",
                question: "Pregunta 2/5: ¿Cuál de estos es claramente un DESEO?",
                options: [
                    "Pagar el alquiler de tu casa",
                    "Comprar zapatos deportivos de marca premium",
                    "Medicinas para una enfermedad"
                ],
                correct: 1
            },
            {
                title: "¡Excelente! Vamos con situaciones más complejas",
                subtitle: "Genial, ya dominas los casos obvios. Ahora veremos situaciones donde la línea entre necesidad y deseo es más delgada.",
                budget: "Situación: Presupuesto ajustado",
                question: "Pregunta 3/5: Si tienes presupuesto limitado, ¿qué priorizarías?",
                options: [
                    "Una cena cara en un restaurante elegante",
                    "Productos de limpieza para tu hogar",
                    "Ropa de diseñador en oferta"
                ],
                correct: 1
            },
            {
                title: "¡Muy bien! Casi terminamos",
                subtitle: "Tus decisiones demuestran que entiendes las prioridades financieras. Una pregunta más sobre gastos inteligentes.",
                budget: "Situación: Planificando gastos",
                question: "Pregunta 4/5: ¿Cuál representa mejor una necesidad a largo plazo?",
                options: [
                    "Educación o capacitación profesional",
                    "Videojuegos y entretenimiento",
                    "Decoración costosa para tu casa"
                ],
                correct: 0
            },
            {
                title: "¡Última pregunta! Eres un experto",
                subtitle: "Has demostrado gran habilidad para distinguir necesidades y deseos. Terminemos con una situación práctica común.",
                budget: "Situación: Decisión de compra",
                question: "Pregunta 5/5: Tu auto funciona bien, pero ves uno más nuevo en oferta. ¿Qué es?",
                options: [
                    "Una necesidad urgente",
                    "Un deseo que puedes considerar si tienes dinero extra",
                    "Una inversión necesaria siempre"
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
                    '¡Excelente! Sabes identificar correctamente las necesidades.',
                    '¡Perfecto! Reconoces claramente qué es un deseo.',
                    '¡Muy bien! Priorizas correctamente tus gastos.',
                    '¡Genial! Entiendes las inversiones necesarias a largo plazo.',
                    '¡Fantástico! Sabes cuándo algo es realmente un deseo.'
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
                    <div class="performance-icon">🏆</div>
                    <p class="performance-text">¡Excelente! Tienes muy claro qué es importante en tus finanzas.</p>
                `;
            } else if (percentage >= 60) {
                performanceMessage.innerHTML = `
                    <div class="performance-icon">🎯</div>
                    <p class="performance-text">¡Bien! Ya identificas la mayoría de necesidades y deseos.</p>
                `;
            } else {
                performanceMessage.innerHTML = `
                    <div class="performance-icon">📚</div>
                    <p class="performance-text">¡Sigue practicando! Pronto dominarás estas diferencias importantes.</p>
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