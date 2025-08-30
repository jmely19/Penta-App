const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const CloseChatbot = document.querySelector("#close-chatbot");

// API Setup
// API Configuración
const API_KEY = "AIzaSyAAMnZEeHAs4tuBmJ_kBgYSpK5v26Gpd7g";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

// Scroll to the latest message
// Desplácese hasta el último mensaje
const scrollToLatestMessage = () => { chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"}) };

// Create message element with dynamic classes and return it
// Crea un elemento de mensaje con clases dinámicas y devuélvelo
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Generate bot response using API
// Generar respuesta de bot usando API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    // Add user message to chat history
    // Agregar mensaje de usuario al historial de chat
    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])]
    });

    // API request options
    // Opciones de solicitud de solicitud
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory
        })
    }

    try {
        // Fetch bot response from API
        // Obtener la respuesta del bot desde la API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        // Extract and display bot's response text
        // Extraer y mostrar el texto de respuesta del bot
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;

        // Add bot response to chat history
        // Agregar la respuesta del bot al historial de chat
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }]
        });

    } catch (error) {
        // Handle error in API response
        // Manejar error en respuesta API
        console.error(error);
        messageElement.innerText = "Lo siento, no pude procesar tu solicitud. Por favor, intenta de nuevo.";
        messageElement.style.color = "#ff0000";
    } finally {
        // Reset user's file data, removing thinking indicator and scroll chat to bottom
        // Restablecer los datos del archivo del usuario, eliminar el indicador de pensamiento y desplazar el chat hasta el final
        userData.file = {};
        incomingMessageDiv.classList.remove("thinking");
        scrollToLatestMessage();
    }
}

// Handle outgoing user messages
// Gestionar mensajes salientes de usuario
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    // Create display user message
    // Crear mensaje de usuario para mostrar
    const messageContent = `<div class="message-text"></div>
                            ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    scrollToLatestMessage();

    // Check local FAQ first
    const faqAnswer = getFAQAnswer(userData.message);
    if (faqAnswer) {
        // Show FAQ answer instantly
        setTimeout(() => {
            const botContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg><div class="message-text">${faqAnswer}</div>`;
            const incomingMessageDiv = createMessageElement(botContent, "bot-message");
            chatBody.appendChild(incomingMessageDiv);
            scrollToLatestMessage();
        }, 400);
    } else {
        // Simulate bot response with thinking indicator after a delay, then call API
        setTimeout(() => {
            const messageContent = `
                <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
            const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
            chatBody.appendChild(incomingMessageDiv);
            scrollToLatestMessage();
            generateBotResponse(incomingMessageDiv);
        }, 600);
    }
};

// Handle Enter key press for sending messages
// Manejar la pulsación de la tecla 'Enter' para enviar mensajes
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768){
        handleOutgoingMessage(e);
    }
});

// Adjust input field height dynamically
// Ajustar la altura del campo de entrada dinámicamente
messageInput.addEventListener("input",() => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Handle file input change and preview the selected file
// Manejar el cambio de entrada del archivo y obtener una vista previa del archivo seleccionado
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if(!file) return;
   
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];

        // Store file data in userData
        // Almacenar datos de archivos en userData
        userData.file = {
            data: base64String,
            mime_type: file.type
        }

        fileInput.value = "";
    }

    reader.readAsDataURL(file);
});

// Cancel file upload
// Cancelar la carga de archivos
fileCancelButton.addEventListener("click", () => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});

// Initialize emoji picker and handle emoji selection
// Inicializar el selector de emojis y manejar la selección de emojis
let picker;
try {
    picker = new EmojiMart.Picker({
        theme: "light",
        skinTonePosition: "none",
        previewPosition: "none",
        onEmojiSelect: (emoji) => {
            const { selectionStart: start, selectionEnd: end } = messageInput;
            messageInput.setRangeText(emoji.native, start, end, "end");
            messageInput.focus();
        },
        onClickOutside: (e) => {
            if(e.target.id === "emoji-picker") {
                document.body.classList.toggle("show-emoji-picker");
            } else {
                document.body.classList.remove("show-emoji-picker");
            }
        }
    });

    document.querySelector(".chat-form").appendChild(picker);
} catch (error) {
    console.log("Emoji picker not available, continuing without it");
}

// Event listeners
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
CloseChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// FAQ System - Built into the JavaScript
// Sistema FAQ - Integrado en el JavaScript
const aiFAQ = [
  // Información general
  { "q": "What is health?", "a": "Health is a state of complete physical, mental, and social well-being, not merely the absence of disease or infirmity." },
  { "q": "What is education?", "a": "Education is the process of receiving or giving systematic instruction, especially at a school or university." },
  { "q": "What is culture?", "a": "Culture is the social behavior, norms, beliefs, and traditions found in human societies." },
  { "q": "What is history?", "a": "History is the study of past events, particularly in human affairs." },
  { "q": "What is geography?", "a": "Geography is the study of places and the relationships between people and their environments." },
  { "q": "How can I stay motivated?", "a": "Set clear goals, celebrate small achievements, and surround yourself with positive influences." },
  { "q": "How do I manage stress?", "a": "Practice relaxation techniques, exercise regularly, and talk to someone you trust about your feelings." },
  { "q": "What is recycling?", "a": "Recycling is the process of converting waste materials into new materials and objects." },
  { "q": "What is climate change?", "a": "Climate change refers to long-term shifts in temperatures and weather patterns, mainly caused by human activities." },
  { "q": "What is democracy?", "a": "Democracy is a system of government where the citizens exercise power by voting." },
  { "q": "What is a computer?", "a": "A computer is an electronic device that manipulates information or data, and can store, retrieve, and process data." },
  { "q": "What is a smartphone app?", "a": "A smartphone app is a software application designed to run on mobile devices such as smartphones and tablets." },
  { "q": "How do I create a strong password?", "a": "Use a mix of letters, numbers, and symbols, and avoid using easily guessed information like birthdays or names." },
  { "q": "What is teamwork?", "a": "Teamwork is the collaborative effort of a group to achieve a common goal or to complete a task in the most effective way." },
  { "q": "What is leadership?", "a": "Leadership is the ability to guide, inspire, and influence others towards achieving a goal." },
  { "q": "What is volunteering?", "a": "Volunteering is offering your time and services to help others without payment." },
  { "q": "What is a hobby?", "a": "A hobby is an activity done regularly in one's leisure time for pleasure." },
  { "q": "How do I learn a new language?", "a": "Practice regularly, use language learning apps, and try to speak with native speakers." },
  { "q": "What is a resume?", "a": "A resume is a document that summarizes your education, work experience, skills, and achievements for job applications." },
  { "q": "What is an interview?", "a": "An interview is a formal meeting in which one or more persons question, consult, or evaluate another person." },
  // Respuesta especial para PENTA
  { "q": "What is PENTA?", "a": "PENTA is a financial technology application currently under development, designed to help users learn and manage their finances in an innovative way." },
  { "q": "Tell me about PENTA", "a": "PENTA is a tech-based finance app in progress, focused on financial education and smart money management for youth and adults." },
  { "q": "What does PENTA do?", "a": "PENTA aims to provide financial education, tools, and resources to help users make better financial decisions." },
  // Más información financiera
  { "q": "What is an investment?", "a": "An investment is an asset or item acquired with the goal of generating income or appreciation." },
  { "q": "What is a credit score?", "a": "A credit score is a number that represents a person's creditworthiness, based on their credit history." },
  { "q": "What is a debit card?", "a": "A debit card is a payment card that deducts money directly from a consumer's checking account to pay for a purchase." },
  { "q": "What is a credit card?", "a": "A credit card allows you to borrow funds up to a certain limit to pay for goods and services, with the obligation to pay back later, often with interest." },
  { "q": "What is financial planning?", "a": "Financial planning is the process of setting goals, assessing assets and resources, estimating future financial needs, and making plans to achieve monetary goals." },
  { "q": "What is insurance?", "a": "Insurance is a contract in which an individual receives financial protection or reimbursement against losses from an insurance company." },
  { "q": "What is retirement planning?", "a": "Retirement planning is the process of determining retirement income goals and the actions necessary to achieve those goals." },
  { "q": "What is inflation?", "a": "Inflation is the rate at which the general level of prices for goods and services is rising, and, subsequently, purchasing power is falling." },
  { "q": "What is a mortgage?", "a": "A mortgage is a loan used to purchase a home or other real estate, which is paid back over time with interest." },
  // Cotidianas
  { "q": "What is the weather today?", "a": "I can't provide real-time weather, but you can check a weather app or website for current conditions." },
  { "q": "How do I make a good breakfast?", "a": "A good breakfast includes protein, whole grains, and fruit. Examples: eggs with toast and fruit, or oatmeal with nuts and berries." },
  { "q": "How can I improve my sleep?", "a": "Maintain a regular sleep schedule, avoid screens before bed, and create a relaxing bedtime routine." },
  { "q": "What are some healthy habits?", "a": "Exercise regularly, eat balanced meals, stay hydrated, and get enough sleep." },
  // Tecnológicas
  { "q": "What is a smartphone?", "a": "A smartphone is a mobile device that combines cellular and mobile computing functions into one unit." },
  { "q": "What is the Internet?", "a": "The Internet is a global network that connects millions of private, public, academic, business, and government networks." },
  { "q": "What is Wi-Fi?", "a": "Wi-Fi is a technology that allows devices to connect to the Internet wirelessly using radio waves." },
  { "q": "What is a computer virus?", "a": "A computer virus is a type of malicious software that can replicate itself and spread to other computers." },
  // Científicas
  { "q": "What is photosynthesis?", "a": "Photosynthesis is the process by which green plants use sunlight to synthesize food from carbon dioxide and water." },
  { "q": "What is gravity?", "a": "Gravity is a force that attracts two bodies toward each other, such as the Earth and objects near its surface." },
  { "q": "What is the water cycle?", "a": "The water cycle describes how water evaporates, condenses, and precipitates, moving between the atmosphere, land, and oceans." },
  { "q": "What is DNA?", "a": "DNA is the molecule that carries genetic instructions in all living things." },
  // Financieras
  { "q": "What is a budget?", "a": "A budget is a plan for managing your money, tracking income and expenses over a period of time." },
  { "q": "What is saving?", "a": "Saving is setting aside money for future use, often in a bank account or investment." },
  { "q": "What is a loan?", "a": "A loan is money that is borrowed and must be paid back, usually with interest." },
  { "q": "What is interest?", "a": "Interest is the cost of borrowing money, or the earnings from lending money, usually expressed as a percentage." },
  // AI y tecnología
  { "q": "What is AI ethics?", "a": "AI ethics is a set of moral principles and techniques intended to inform the development and responsible use of artificial intelligence technologies." },
  { "q": "What is bias in AI?", "a": "Bias in AI refers to systematic errors in the output of AI systems due to prejudiced assumptions in the training data or algorithms." },
  { "q": "What is explainable AI?", "a": "Explainable AI refers to methods and techniques in the application of AI such that the results of the solution can be understood by human experts." },
  { "q": "What is a dataset?", "a": "A dataset is a collection of data, often presented in tabular form, used for training or testing AI models." },
  { "q": "What is a model in AI?", "a": "A model in AI is a mathematical representation of a real-world process, trained to make predictions or decisions based on data." },
  { "q": "What is transfer learning?", "a": "Transfer learning is a technique in machine learning where a model developed for one task is reused as the starting point for a model on a second task." },
  { "q": "What is a confusion matrix?", "a": "A confusion matrix is a table used to describe the performance of a classification model on a set of test data for which the true values are known." },
  { "q": "What is precision in machine learning?", "a": "Precision is the ratio of correctly predicted positive observations to the total predicted positive observations." },
  { "q": "What is recall in machine learning?", "a": "Recall is the ratio of correctly predicted positive observations to all observations in the actual class." },
  { "q": "What is F1 score?", "a": "The F1 score is the harmonic mean of precision and recall, used as a measure of a model's accuracy." },
  { "q": "What is clustering?", "a": "Clustering is a machine learning technique that involves grouping sets of objects in such a way that objects in the same group are more similar to each other than to those in other groups." },
  { "q": "What is regression?", "a": "Regression is a type of predictive modeling technique which estimates relationships among variables." },
  { "q": "What is classification?", "a": "Classification is a machine learning technique used to assign categories to a collection of data points." },
  { "q": "What is dimensionality reduction?", "a": "Dimensionality reduction is the process of reducing the number of random variables under consideration, by obtaining a set of principal variables." },
  { "q": "What is feature engineering?", "a": "Feature engineering is the process of using domain knowledge to select, modify, or create new features from raw data to increase the predictive power of learning algorithms." },
  { "q": "What is hyperparameter tuning?", "a": "Hyperparameter tuning is the process of optimizing the parameters that govern the training process of a machine learning model." },
  { "q": "What is cross-validation?", "a": "Cross-validation is a technique for assessing how the results of a statistical analysis will generalize to an independent data set." },
  { "q": "What is a random forest?", "a": "A random forest is an ensemble learning method for classification, regression and other tasks that operates by constructing a multitude of decision trees." },
  { "q": "What is a support vector machine?", "a": "A support vector machine (SVM) is a supervised machine learning algorithm used for classification and regression tasks." },
  { "q": "What is k-means clustering?", "a": "K-means clustering is a method of vector quantization, originally from signal processing, that is popular for cluster analysis in data mining." },
  { "q": "What is artificial intelligence?", "a": "Artificial intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn like humans." },
  { "q": "What are the types of AI?", "a": "The main types of AI are narrow AI, general AI, and superintelligent AI." },
  { "q": "What is machine learning?", "a": "Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed." },
  { "q": "What is deep learning?", "a": "Deep learning is a subset of machine learning that uses neural networks with many layers to analyze various factors of data." },
  { "q": "What is a neural network?", "a": "A neural network is a series of algorithms that attempt to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates." },
  { "q": "What is supervised learning?", "a": "Supervised learning is a type of machine learning where the model is trained on labeled data." },
  { "q": "What is unsupervised learning?", "a": "Unsupervised learning is a type of machine learning where the model learns patterns from unlabeled data." },
  { "q": "What is reinforcement learning?", "a": "Reinforcement learning is a type of machine learning where an agent learns to make decisions by receiving rewards or penalties." },
  { "q": "What is natural language processing?", "a": "Natural language processing (NLP) is a field of AI that focuses on the interaction between computers and humans using natural language." },
  { "q": "What is computer vision?", "a": "Computer vision is a field of AI that enables computers to interpret and understand visual information from the world." },
  { "q": "What is data science?", "a": "Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from data." },
  { "q": "What is big data?", "a": "Big data refers to extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations." },
  { "q": "What is a chatbot?", "a": "A chatbot is a computer program designed to simulate conversation with human users, especially over the Internet." },
  { "q": "What is an algorithm?", "a": "An algorithm is a set of rules or instructions given to an AI, computer or other machine to help it learn on its own." },
  { "q": "What is training data?", "a": "Training data is the initial set of data used to help AI models learn and make predictions." },
  { "q": "What is prediction in AI?", "a": "Prediction in AI refers to the process of using a trained model to estimate outcomes based on new input data." },
  { "q": "What is accuracy in machine learning?", "a": "Accuracy is a measure of how often a machine learning model correctly predicts or classifies data." },
  { "q": "What is overfitting?", "a": "Overfitting occurs when a machine learning model learns the training data too well, including its noise and outliers, and performs poorly on new data." },
  { "q": "What is underfitting?", "a": "Underfitting occurs when a machine learning model is too simple to capture the underlying patterns in the data." },
  { "q": "What is a feature in machine learning?", "a": "A feature is an individual measurable property or characteristic of a phenomenon being observed." }
];

function getFAQAnswer(userQuestion) {
    userQuestion = userQuestion.toLowerCase();
    const match = aiFAQ.find(item => item.q.toLowerCase().includes(userQuestion));
    return match ? match.a : null;
}