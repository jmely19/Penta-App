// Backend API integration
async function callChatAPI(prompt) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: prompt
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Details:', errorData);
            throw new Error(`API request failed with status ${response.status}: ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Chat API Error:", error);
        if (error.message.includes('Failed to fetch')) {
            return "Sorry, I can't connect to the server. Please make sure the backend is running.";
        } else {
            return "Sorry, I encountered an error processing your request. Please try again later.";
        }
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
                const botResponse = await callChatAPI(message);
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
});