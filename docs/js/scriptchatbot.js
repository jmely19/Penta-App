// Elementos del DOM
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

// Función para agregar mensaje al chat
function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para mostrar indicador de typing
function showTypingIndicator() {
    typingIndicator.classList.add('active');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para ocultar indicador de typing
function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

// Función para procesar la pregunta del usuario
function processQuestion(question) {
    if (!question.trim()) return;
    
    // Agregar mensaje del usuario
    addMessage(question, true);
    
    // Limpiar input
    userInput.value = '';
    
    // Mostrar que el bot está escribiendo
    showTypingIndicator();
    
    // Simular delay de respuesta
    setTimeout(() => {
        hideTypingIndicator();
        
        // Obtener respuesta
        const answer = getFAQAnswer(question);
        
        // Agregar respuesta del bot
        addMessage(answer);
    }, 1000);
}

// Event Listeners
sendButton.addEventListener('click', () => {
    processQuestion(userInput.value);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        processQuestion(userInput.value);
    }
});

// Agregar event listeners a los chips de sugerencia
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const question = chip.getAttribute('data-question');
        processQuestion(question);
    });
});