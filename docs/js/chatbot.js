// Chatbot toggler and logic
const minimized = document.getElementById('chatbotMinimized');
const windowEl = document.getElementById('chatbotWindow');
const closeBtn = document.getElementById('chatbotClose');
const messagesEl = document.getElementById('chatbotMessages');
const form = document.getElementById('chatbotForm');
const input = document.getElementById('chatbotInput');

// Show/hide chatbot
minimized.onclick = () => {
    minimized.style.display = 'none';
    windowEl.style.display = 'flex';
    input.focus();
    if (messagesEl.childElementCount === 0) {
        addBotMessage("¡Hola! Soy Penta Assistance. Pregúntame sobre finanzas, tecnología, Panamá y más.");
    }
};
closeBtn.onclick = () => {
    windowEl.style.display = 'none';
    minimized.style.display = 'flex';
};

// Add message to chat
function addMessage(text, sender = 'bot') {
    const msg = document.createElement('div');
    msg.className = 'message ' + (sender === 'bot' ? 'bot-message' : 'user-message');
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}
function addBotMessage(text) { addMessage(text, 'bot'); }
function addUserMessage(text) { addMessage(text, 'user'); }

// Typing indicator
function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return typing;
}

// Find answer from FAQ
function findAnswer(question) {
    question = question.trim().toLowerCase();
    let best = null;
    let maxScore = 0;
    for (const item of window.aiFAQ) {
        let q = item.q.trim().toLowerCase();
        if (q === question) return item.a;
        // Simple fuzzy match
        let score = 0;
        if (question.includes(q)) score += q.length;
        if (q.includes(question)) score += question.length;
        if (score > maxScore) { maxScore = score; best = item.a; }
    }
    return best || "Lo siento, no tengo una respuesta para esa pregunta. ¿Puedes intentar con otra?";
}

// Handle form submit
form.onsubmit = (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;
    addUserMessage(userText);
    input.value = '';
    const typing = showTyping();
    setTimeout(() => {
        typing.remove();
        const answer = findAnswer(userText);
        addBotMessage(answer);
    }, 600 + Math.random() * 400);
};