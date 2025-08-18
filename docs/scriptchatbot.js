// Gemini API Key - Replace with your actual API key
const GEMINI_API_KEY = 'AIzaSyDL0oTAdc-qdDP2-yERXJk_SimsAygn5Q4';
async function callGeminiAPI(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle the Gemini API response structure
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Unexpected API response structure");
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Sorry, I encountered an error processing your request. Please try again later.";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const minimizedChatbot = document.getElementById('minimizedChatbot');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');
    
    // Show/hide chat
    minimizedChatbot.addEventListener('click', function() {
        chatbotWindow.style.display = 'flex';
        minimizedChatbot.style.display = 'none';
        if (chatMessages.children.length === 0) {
            showWelcomeMessage();
        }
    });
    
    closeChatbot.addEventListener('click', function() {
        chatbotWindow.style.display = 'none';
        minimizedChatbot.style.display = 'flex';
    });
    
    // Send message on Enter
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
    
    // Send message on button click
    sendMessage.addEventListener('click', sendUserMessage);
    
    async function sendUserMessage() {
    const message = userInput.value.trim();
    if (message !== '') {
        displayMessage(message, 'user');
        userInput.value = '';
        
        showTypingIndicator();
        
        try {
            const botResponse = await callGeminiAPI(message);
            removeTypingIndicator();
            displayMessage(botResponse, 'bot');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            removeTypingIndicator();
            displayMessage("Sorry, I'm having trouble connecting to the AI service. Please try again later.", 'bot');
            console.error("Error:", error);
        }
    }
}
    
    function displayMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender + '-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function showWelcomeMessage() {
        const welcomeMessages = [
            "Hello! I'm Penta Assistance, your virtual assistant.",
            "How can I help you today?",
            "You can ask me anything and I'll do my best to assist you."
        ];
        
        welcomeMessages.forEach((msg, index) => {
            setTimeout(() => {
                displayMessage(msg, 'bot');
            }, 500 * (index + 1));
        });
    }
    
    function generateBotResponse(userMessage) {
        // Simple response logic (replace with Gemini API calls)
        const lowerMsg = userMessage.toLowerCase();
        
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('good morning')) {
            return "Hello there! How are you doing today?";
        } else if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye') || lowerMsg.includes('see you')) {
            return "Goodbye! Feel free to come back if you need more assistance.";
        } else if (lowerMsg.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        } else if (lowerMsg.includes('how are you') || lowerMsg.includes("what's up")) {
            return "I'm functioning perfectly, thanks for asking! How about you?";
        } else if (lowerMsg.includes('help') || lowerMsg.includes('support')) {
            return "Of course, I'm here to help. Please describe what you need in more detail.";
        } else if (lowerMsg.includes('what can you do') || lowerMsg.includes('purpose')) {
            return "I can answer questions, provide information, help with basic issues, and guide you through this application. Ask me anything!";
        } else {
            const randomResponses = [
                "Interesting. Could you give me more details?",
                "I'll look into that for you. Is there anything else I can help with?",
                "I understand your question. Let me see how I can assist you with that.",
                "Good question! I'm processing your request.",
                "I'm not entirely sure I understand. Could you rephrase your question?"
            ];
            return randomResponses[Math.floor(Math.random() * randomResponses.length)];
        }
    }
    
    // TODO: Implement Gemini API integration
    async function callGeminiAPI(prompt) {
        /*
        Implementation example:
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
        */
        
        // For now, using the simple response generator
        return generateBotResponse(prompt);
    }
});