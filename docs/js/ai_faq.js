// Base de datos de preguntas y respuestas para PENTA
const aiFAQ = [
    { "q": "what is penta?", "a": "Penta is a gamified web platform designed to teach teenagers (ages 14–18) how to manage personal finances through interactive storytelling, roleplay, and practical simulations.\n\nInstead of traditional, boring financial lessons, Penta turns learning into a fun and engaging experience. Teens are placed in realistic financial scenarios — like budgeting, saving, and spending — and must make decisions that mirror real-life consequences." },
    { "q": "tell me about penta", "a": "Penta is an educational application focused on helping teenagers understand and manage their personal finances to achieve financial success in life." },
    { "q": "what does penta do?", "a": "Penta teaches financial concepts, saving habits, investing, and responsible use of money, all tailored for young people." },
    { "q": "how can penta help me?", "a": "Penta helps you learn about real-world finance, how to save, invest, and make smart decisions for your financial future." },
    { "q": "why should i use penta?", "a": "Using Penta prepares you to face the financial challenges of adult life, avoid common mistakes, and improve your economic well-being." },
    { "q": "what are some key features of penta?", "a": "Key Features of Penta:\n• Gamified Learning: Roleplay-based stories that simulate everyday financial decisions.\n• Interactive Tools: Quizzes, simulations, and progress tracking to reinforce learning.\n• Real-Life Topics: Banking systems, smart saving, spending control, and personal budgeting.\n• Bilingual Access: Available in both English and Spanish.\n• Safe & Educational: A structured environment that promotes financial independence." },
    { "q": "who founded penta?", "a": "Penta was founded by a team of educators and technologists passionate about youth financial literacy." },
    { "q": "when was penta created?", "a": "Penta was launched in 2025 to address the gap in practical financial education for teens." },
    { "q": "has penta won any awards?", "a": "Penta has been recognized for innovation in financial education and youth empowerment." },
    { "q": "does penta partner with schools?", "a": "Yes, Penta partners with schools and educational organizations to integrate financial literacy into curricula." },
    { "q": "is penta available outside panama?", "a": "Penta is designed for Panamanian teens but is scalable and can be adapted for global audiences." },
    { "q": "how does penta compare to everfi?", "a": "Penta uses gamification and local context for teens, while EverFi offers a broader range of digital courses for all ages." },
    { "q": "how does penta compare to junior achievement?", "a": "Junior Achievement focuses on entrepreneurship and work readiness globally; Penta specializes in practical financial skills for teens in Panama." },
    { "q": "what does penta teach?", "a": "Core financial topics:\n\n• Banking Systems: Types of accounts, digital banking.\n• Smart Saving: Emergency funds, interest, goal setting.\n• Spending Control: Needs vs. wants, impulse buying.\n• Personal Budgeting: Creating and managing a budget, tracking expenses.\n\nThese lessons are practical, relatable, and actionable, not just theoretical." },
    { "q": "who is penta for?", "a": "Teenagers aged 14–18.\n\nThis age group is ideal for developing financial habits and is highly responsive to interactive digital content.\nThe platform is designed to be engaging, age-appropriate, and educational." },
    { "q": "what is penta's solution?", "a": "A gamified web platform for financial education.\n\nPenta uses interactive storytelling and roleplay to simulate real-life financial decisions.\nTeens face scenarios like managing a budget, choosing between saving or spending, and understanding banking systems.\nIncludes quizzes, simulations, and progress tracking to reinforce learning." },
    { "q": "what problem does penta solve?", "a": "Teenagers lack financial literacy.\n\nAccording to studies, 75% of teens feel unprepared to manage personal finances.\nIn Panama, many teens enter adulthood without basic financial skills, leading to poor saving habits, impulsive spending, and long-term financial instability.\nTraditional education focuses on theoretical finance, not practical life skills like budgeting or saving." },
    { "q": "what makes penta different?", "a": "Combines education with entertainment.\nFocuses on real-life application, not just theory.\nOffers bilingual accessibility (English and Spanish).\nDesigned with Panamanian teens in mind, but scalable globally." },
    { "q": "why should parents invest in penta?", "a": "It's a smart investment in their children's future.\n\nEarly financial education = lifelong benefits.\nHelps teens avoid debt, build savings, and make smart decisions.\nFills the gap left by traditional schooling.\nProvides peace of mind knowing teens are gaining essential life skills." },
    { "q": "what is penta's mission?", "a": "To build a financially informed generation.\n\nPenta aims to prepare teens for real-life financial challenges, not just business finance taught in schools.\nPromotes financial independence, smart habits, and responsible decision-making.\nEnvisions a future where young adults confidently manage their income, avoid debt, and make informed choices." },
    { "q": "what is penta's platform like?", "a": "Fun, interactive, and educational.\n\nCombines gamification with real-life relevance.\nOffers a safe space for teens to learn and practice financial skills.\nDesigned to be accessible and engaging, turning financial education into a positive experience." },
    { "q": "what's penta's purpose", "a": "To empower the next generation with the financial knowledge they need to make smart decisions, avoid debt, and build a stable future — starting from their teenage years." },
    { "q": "what is penta's purpose", "a": "To empower the next generation with the financial knowledge they need to make smart decisions, avoid debt, and build a stable future — starting from their teenage years." },
    
    // Finanzas básicas
    { "q": "what is a budget?", "a": "A budget is a plan for how to spend and save money based on income and expenses." },
    { "q": "how do i start saving money?", "a": "Set a savings goal, track your expenses, and set aside a fixed amount regularly in a safe account." },
    { "q": "what is financial literacy?", "a": "Financial literacy is the ability to understand and use various financial skills, including personal financial management, budgeting, and investing." },
    { "q": "how can i avoid debt?", "a": "Spend less than you earn, use credit responsibly, and pay your bills on time." },
    { "q": "what is compound interest?", "a": "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods." },
    
    // Preguntas adicionales en español
    { "q": "qué es penta?", "a": "Penta es una plataforma web gamificada diseñada para enseñar a adolescentes (14-18 años) cómo administrar sus finanzas personales a través de narrativas interactivas, juegos de roles y simulaciones prácticas." },
    { "q": "habla español?", "a": "¡Sí! Penta está disponible tanto en inglés como en español. ¿En qué puedo ayudarte?" },
    { "q": "cómo funciona penta?", "a": "Penta utiliza juegos, simulaciones y narrativas interactivas para enseñar conceptos financieros de manera divertida y práctica para jóvenes." }
];

// Función para buscar respuesta
function getFAQAnswer(userQuestion) {
    userQuestion = userQuestion.toLowerCase().trim();
    
    // Primero buscar coincidencia exacta
    let match = aiFAQ.find(item => item.q.toLowerCase() === userQuestion);
    
    // Si no hay coincidencia exacta, buscar coincidencias parciales
    if (!match) {
        match = aiFAQ.find(item => userQuestion.includes(item.q.toLowerCase()));
    }
    
    // Si aún no hay coincidencia, buscar por palabras clave
    if (!match) {
        const keywords = userQuestion.split(' ');
        for (const keyword of keywords) {
            if (keyword.length > 3) { // Solo palabras con más de 3 caracteres
                match = aiFAQ.find(item => item.q.toLowerCase().includes(keyword));
                if (match) break;
            }
        }
    }
    
    return match ? match.a : "Lo siento, no tengo información sobre eso. ¿Podrías intentar con otra pregunta? Pregúntame sobre PENTA, educación financiera o temas relacionados.";
}