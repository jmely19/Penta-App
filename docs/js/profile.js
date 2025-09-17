// --- Sistema de progreso del usuario mejorado ---
const lessonProgress = {
    completed: [],
    skills: {
        'critical-thinking': 0,
        'problem-solving': 0,
        'financial-decision-making': 0
    }
};

// Mapeo de habilidades a nombres en español
const skillNames = {
    'critical-thinking': 'Critical Thinking',
    'problem-solving': 'Problem-Solving',
    'financial-decision-making': 'Financial Decision-Making'
};

function loadProgress() {
    // Lee el progreso guardado por our-lessons.js
    const lessonsProgress = JSON.parse(localStorage.getItem('lessonsProgress')) || {};
    lessonProgress.completed = Object.keys(lessonsProgress).filter(id => 
        lessonsProgress[id] && lessonsProgress[id].status === 'completed'
    );

    // Cargar habilidades desde pentaProgress
    const savedProgress = localStorage.getItem('pentaProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        lessonProgress.skills = progress.skills || lessonProgress.skills;
    }

    updateProgressDisplay();
    updateRecommendations();
}

function updateProgressDisplay() {
    // Habilidades - usar los valores calculados dinámicamente
    for (const skill in lessonProgress.skills) {
        const percent = lessonProgress.skills[skill];
        const percentElement = document.getElementById(`${skill}-percent`);
        const barElement = document.getElementById(`${skill}-bar`);
        
        if (percentElement && barElement) {
            percentElement.textContent = `${percent}%`;
            barElement.style.width = `${percent}%`;
            
            // Agregar animación a la barra
            barElement.style.transition = 'width 1s ease-in-out';
        }
    }

    // Progreso general
    const totalLessons = 9;
    const completedLessons = lessonProgress.completed.length;
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);

    const lessonsCompletedElement = document.getElementById('lessons-completed');
    const generalProgressBarElement = document.getElementById('general-progress-bar');
    
    if (lessonsCompletedElement) {
        lessonsCompletedElement.textContent = `${completedLessons}/${totalLessons}`;
    }
    
    if (generalProgressBarElement) {
        generalProgressBarElement.style.width = `${progressPercent}%`;
        generalProgressBarElement.style.transition = 'width 1.5s ease-in-out';
    }

    // Mensaje de progreso
    const progressMessage = document.getElementById('progress-message');
    if (progressMessage) {
        if (progressPercent === 0) {
            progressMessage.textContent = 'Start learning to improve your skills!';
            progressMessage.className = 'text-sm text-gray-300 mt-4 ml-4';
        } else if (progressPercent < 33) {
            progressMessage.textContent = '🌱 Great start! Keep learning to unlock your potential.';
            progressMessage.className = 'text-sm text-blue-300 mt-4 ml-4';
        } else if (progressPercent < 66) {
            progressMessage.textContent = '🚀 You\'re making excellent progress! Keep it up.';
            progressMessage.className = 'text-sm text-yellow-300 mt-4 ml-4';
        } else if (progressPercent < 100) {
            progressMessage.textContent = '⭐ Amazing! You\'re almost there. Finish strong!';
            progressMessage.className = 'text-sm text-orange-300 mt-4 ml-4';
        } else {
            progressMessage.textContent = '🎉 Congratulations! You\'ve completed all lessons!';
            progressMessage.className = 'text-sm text-green-300 mt-4 ml-4 font-semibold';
        }
    }
}

function updateRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (!recommendationsContainer) return;
    
    recommendationsContainer.innerHTML = '';

    if (lessonProgress.completed.length === 0) {
        recommendationsContainer.innerHTML = `
            <div class="col-span-2 text-center">
                <div class="bg-white/10 rounded-lg p-6">
                    <i class="fas fa-lightbulb text-yellow-300 text-3xl mb-3"></i>
                    <p class="text-gray-300 mb-4">Complete your first lesson to receive personalized recommendations!</p>
                    <a href="our-lessons.html" class="inline-block bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition">
                        Start Learning
                    </a>
                </div>
            </div>
        `;
        return;
    }

    // Obtener recomendaciones desde our-lessons.js
    let recommendations = [];
    if (window.getRecommendations) {
        recommendations = window.getRecommendations();
    }

    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = `
            <div class="col-span-2 text-center">
                <div class="bg-white/10 rounded-lg p-6">
                    <i class="fas fa-trophy text-gold-300 text-3xl mb-3"></i>
                    <p class="text-green-300 font-semibold">🎉 Congratulations! You've completed all lessons!</p>
                    <p class="text-gray-300 mt-2">You're now a PENTA Financial Expert!</p>
                </div>
            </div>
        `;
        return;
    }

    // Mostrar recomendaciones
    recommendations.forEach((recommendation, index) => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105';
        
        // Iconos para diferentes temas
        const topicIcons = {
            'Budget': 'fas fa-calculator',
            'Savings': 'fas fa-piggy-bank',
            'Crisis': 'fas fa-shield-alt'
        };
        
        const icon = topicIcons[recommendation.topic] || 'fas fa-book';
        
        lessonCard.innerHTML = `
            <div class="flex items-start">
                <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-3 mr-4 flex-shrink-0">
                    <i class="${icon}"></i>
                </div>
                <div class="flex-grow">
                    <h4 class="font-semibold text-white mb-1">${recommendation.name}</h4>
                    <p class="text-sm text-blue-300 mb-2">Topic: ${recommendation.topic}</p>
                    <p class="text-xs text-gray-400 mb-3">${recommendation.reason}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                            Recommended
                        </span>
                        <a href="our-lessons.html" class="text-orange-400 hover:text-orange-300 text-sm font-medium">
                            Start →
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar evento click para navegar a la lección
        lessonCard.addEventListener('click', () => {
            window.location.href = 'our-lessons.html';
        });
        
        recommendationsContainer.appendChild(lessonCard);
    });
}

// Función para actualizar estadísticas en tiempo real
function refreshStats() {
    loadProgress();
    
    // Mostrar notificación de actualización
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-sync-alt mr-2"></i>
            <span class="text-sm">Progress updated!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 2 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Agregar botón de actualización
function addRefreshButton() {
    const progressSection = document.querySelector('.mt-10.bg-white\\/10');
    if (progressSection && !document.getElementById('refresh-stats-btn')) {
        const refreshButton = document.createElement('button');
        refreshButton.id = 'refresh-stats-btn';
        refreshButton.className = 'mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition text-sm';
        refreshButton.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Update Progress';
        refreshButton.addEventListener('click', refreshStats);
        
        progressSection.appendChild(refreshButton);
    }
}

// Función para mostrar detalles de habilidades
function showSkillDetails(skillId) {
    const skillDescriptions = {
        'critical-thinking': 'Ability to analyze information objectively and make reasoned judgments about financial decisions.',
        'problem-solving': 'Capacity to identify financial problems and develop effective solutions.',
        'financial-decision-making': 'Skill to evaluate financial options and make informed choices about money management.'
    };
    
    const description = skillDescriptions[skillId];
    const skillName = skillNames[skillId];
    const percentage = lessonProgress.skills[skillId];
    
    alert(`${skillName}\n\nCurrent Level: ${percentage}%\n\n${description}`);
}

// Agregar eventos click a las habilidades
function addSkillClickEvents() {
    const skillElements = document.querySelectorAll('[id$="-percent"]');
    skillElements.forEach(element => {
        const skillId = element.id.replace('-percent', '');
        if (skillNames[skillId]) {
            element.style.cursor = 'pointer';
            element.title = 'Click for more details';
            element.addEventListener('click', () => showSkillDetails(skillId));
        }
    });
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    addRefreshButton();
    addSkillClickEvents();

    // Sincronizar encabezado de perfil con usuario logueado
    try {
        const firstName = localStorage.getItem('userFirstName') || '';
        const lastName = localStorage.getItem('userLastName') || '';
        const email = localStorage.getItem('userEmail') || '';
        let photoUrl = localStorage.getItem('userPhotoUrl') || '';

        const displayName = (firstName || lastName)
            ? `${firstName}${lastName ? ' ' + lastName : ''}`.trim()
            : (email ? email.split('@')[0] : 'Guest');

        const nameEl = document.getElementById('profile-name');
        if (nameEl) nameEl.textContent = displayName;

        const photoEl = document.getElementById('profile-photo');
        if (photoEl) {
            const trySetPhoto = (url) => new Promise((resolve) => {
                const tester = new Image();
                tester.onload = function() { resolve(url); };
                tester.onerror = function() { resolve(null); };
                tester.src = url;
            });

            (async () => {
                let resolvedUrl = null;

                // 1) Priorizar foto guardada manualmente
                if (photoUrl) {
                    resolvedUrl = await trySetPhoto(photoUrl);
                }

                // 2) Gravatar directo como primer intento por email
                if (!resolvedUrl && email) {
                    const md5 = (s) => {
                        // Implementación MD5 pequeña para Gravatar
                        function rhex(n){var s="",j;for(j=0;j<4;j++)s+=("0"+((n>>>(j*8))&255).toString(16)).slice(-2);return s}
                        function ad(x,y){var l=(x&65535)+(y&65535),m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&65535)}
                        function rl(n,c){return (n<<c)|(n>>>(32-c))}
                        function cm(q,a,b,x,s,t){return ad(rl(ad(ad(a,q),ad(x,t)),s),b)}
                        function ff(a,b,c,d,x,s,t){return cm((b&c)|((~b)&d),a,b,x,s,t)}
                        function gg(a,b,c,d,x,s,t){return cm((b&d)|(c&(~d)),a,b,x,s,t)}
                        function hh(a,b,c,d,x,s,t){return cm(b^c^d,a,b,x,s,t)}
                        function ii(a,b,c,d,x,s,t){return cm(c^(b|(~d)),a,b,x,s,t)}
                        function sb(x){var i;var n=((x.length+8)>>6)+1;var b=new Array(n*16);for(i=0;i<n*16;i++)b[i]=0;b[0]=x.length*8;for(i=0;i<x.length;i++)b[(i>>2)+1]|=x.charCodeAt(i)<<((i%4)*8);b[(x.length>>2)+1]|=0x80<<((x.length%4)*8);return b}
                        var i,x=sb(unescape(encodeURIComponent(s))),a=1732584193,b=4023233417,c=2562383102,d=271733878;for(i=0;i<x.length;i+=16){var oa=a,ob=b,oc=c,od=d;a=ff(a,b,c,d,x[i+1],7,-680876936);d=ff(d,a,b,c,x[i+2],12,-389564586);c=ff(c,d,a,b,x[i+3],17,606105819);b=ff(b,c,d,a,x[i+4],22,-1044525330);a=ff(a,b,c,d,x[i+5],7,-176418897);d=ff(d,a,b,c,x[i+6],12,1200080426);c=ff(c,d,a,b,x[i+7],17,-1473231341);b=ff(b,c,d,a,x[i+8],22,-45705983);a=ff(a,b,c,d,x[i+9],7,1770035416);d=ff(d,a,b,c,x[i+10],12,-1958414417);c=ff(c,d,a,b,x[i+11],17,-42063);b=ff(b,c,d,a,x[i+12],22,-1990404162);a=ff(a,b,c,d,x[i+13],7,1804603682);d=ff(d,a,b,c,x[i+14],12,-40341101);c=ff(c,d,a,b,x[i+15],17,-1502002290);b=ff(b,c,d,a,x[i],22,1236535329);a=gg(a,b,c,d,x[i+1],5,-165796510);d=gg(d,a,b,c,x[i+6],9,-1069501632);c=gg(c,d,a,b,x[i+11],14,643717713);b=gg(b,c,d,a,x[i],20,-373897302);a=gg(a,b,c,d,x[i+5],5,-701558691);d=gg(d,a,b,c,x[i+10],9,38016083);c=gg(c,d,a,b,x[i+15],14,-660478335);b=gg(b,c,d,a,x[i+4],20,-405537848);a=gg(a,b,c,d,x[i+9],5,568446438);d=gg(d,a,b,c,x[i+14],9,-1019803690);c=gg(c,d,a,b,x[i+3],14,-187363961);b=gg(b,c,d,a,x[i+8],20,1163531501);a=hh(a,b,c,d,x[i+1],4,-1444681467);d=hh(d,a,b,c,x[i+4],11,-51403784);c=hh(c,d,a,b,x[i+7],16,1735328473);b=hh(b,c,d,a,x[i+10],23,-1926607734);a=hh(a,b,c,d,x[i+13],4,-378558);d=hh(d,a,b,c,x[i],11,-2022574463);c=hh(c,d,a,b,x[i+8],16,1839030562);b=hh(b,c,d,a,x[i+12],23,-35309556);a=ii(a,b,c,d,x[i+5],6,4096336452);d=ii(d,a,b,c,x[i+8],10,-1204292793);c=ii(c,d,a,b,x[i+11],15,-1341970488);b=ii(b,c,d,a,x[i+14],21,1163531501);a=ii(a,b,c,d,x[i+1],6,-1521486534);d=ii(d,a,b,c,x[i+4],10,1859775393);c=ii(c,d,a,b,x[i+7],15,-1894007588);b=ii(b,c,d,a,x[i+10],21,-35309556);a=ad(a,oa);b=ad(b,ob);c=ad(c,oc);d=ad(d,od);}return [rhex(a),rhex(b),rhex(c),rhex(d)].join("");
                    };
                    const hash = md5(email.trim().toLowerCase());
                    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404&s=200`;
                    resolvedUrl = await trySetPhoto(gravatarUrl);
                }

                // 3) Generar avatar con iniciales como último recurso
                if (!resolvedUrl) {
                    const initials = (firstName || email || 'U')
                        .split(' ')
                        .map(p => p[0] ? p[0].toUpperCase() : '')
                        .join('')
                        .slice(0, 2) || 'U';
                    const bg = 'F97316'; // naranja Tailwind
                    const fg = 'ffffff';
                    resolvedUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=${fg}&size=200&bold=true`;
                }

                photoEl.src = resolvedUrl;
                photoEl.style.visibility = 'visible';
            })();
        }

        // Soporte para subir una foto personalizada
        const changeBtn = document.getElementById('change-photo-btn');
        const fileInput = document.getElementById('profile-photo-input');
        if (changeBtn && fileInput) {
            changeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                fileInput.click();
            });

            fileInput.addEventListener('change', function() {
                const file = this.files && this.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(ev) {
                    const dataUrl = ev.target && ev.target.result ? ev.target.result.toString() : '';
                    if (!dataUrl) return;
                    try {
                        localStorage.setItem('userPhotoUrl', dataUrl);
                        const img = document.getElementById('profile-photo');
                        if (img) {
                            img.src = dataUrl;
                            img.style.visibility = 'visible';
                        }
                    } catch (e) {
                        console.error('Unable to save profile photo', e);
                        alert('Could not save the photo. Try a smaller image.');
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        // Acción de Log out
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userFirstName');
                localStorage.removeItem('userLastName');
                localStorage.removeItem('loginTime');
                // Mantener cualquier progreso almacenado aparte
                window.location.href = 'index.html';
            });
        }
    } catch (err) {
        console.error('Error loading profile header:', err);
    }
    
    // Actualizar progreso cada 30 segundos si hay cambios
    setInterval(() => {
        const currentCompleted = lessonProgress.completed.length;
        loadProgress();
        if (lessonProgress.completed.length !== currentCompleted) {
            // Solo actualizar si hay cambios
            updateProgressDisplay();
            updateRecommendations();
        }
    }, 30000);
});

// Escuchar cambios en localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'lessonsProgress' || e.key === 'pentaProgress') {
        loadProgress();
    }
});