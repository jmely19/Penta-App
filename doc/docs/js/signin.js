// OAuth configuration for each provider
const oauthConfig = {
    google: {
        clientId: 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        redirectUri: window.location.origin + '/auth/google/callback',
        scope: 'openid email profile',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
    },
    microsoft: {
        clientId: 'TU_MICROSOFT_CLIENT_ID',
        redirectUri: window.location.origin + '/auth/microsoft/callback',
        scope: 'openid email profile',
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
    },
    apple: {
        clientId: 'com.tuapp.signin',
        redirectUri: window.location.origin + '/auth/apple/callback',
        scope: 'name email',
        authUrl: 'https://appleid.apple.com/auth/authorize'
    }
};

// Function to start authentication with Google
function signInWithGoogle() {
    const config = oauthConfig.google;
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scope,
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent'
    });
    
    const authUrl = `${config.authUrl}?${params.toString()}`;
    window.location.href = authUrl;
}

// Función para iniciar autenticación con Microsoft/Windows
function signInWithMicrosoft() {
    const config = oauthConfig.microsoft;
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scope,
        response_type: 'code',
        response_mode: 'query'
    });
    
    const authUrl = `${config.authUrl}?${params.toString()}`;
    window.location.href = authUrl;
}

// Función para iniciar autenticación con Apple/iCloud
function signInWithApple() {
    const config = oauthConfig.apple;
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scope,
        response_type: 'code',
        response_mode: 'form_post'
    });
    
    const authUrl = `${config.authUrl}?${params.toString()}`;
    window.location.href = authUrl;
}

// Función para manejar el callback de autenticación
function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    if (error) {
        console.error('Error de autenticación:', error);
        alert('Error durante la autenticación. Por favor, intenta de nuevo.');
        return;
    }
    
    if (code) {
        // Aquí intercambiarías el código por un token de acceso
        console.log('Código de autorización recibido:', code);
        exchangeCodeForToken(code);
    }
}

// Función para intercambiar código por token
async function exchangeCodeForToken(code) {
    try {
        // En un entorno real, esto se haría en el backend por seguridad
        const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Token obtenido:', data);
            // Guardar token y redirigir al usuario
            localStorage.setItem('authToken', data.access_token);
            window.location.href = '/dashboard';
        } else {
            throw new Error('Error al obtener token');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al completar la autenticación');
    }
}

// Event listeners para los botones de autenticación
document.querySelectorAll('.auth-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Mostrar indicador de carga
        this.style.opacity = '0.7';
        this.style.pointerEvents = 'none';
        
        if (this.classList.contains('icloud')) {
            signInWithApple();
        } else if (this.classList.contains('google')) {
            signInWithGoogle();
        } else if (this.classList.contains('windows')) {
            signInWithMicrosoft();
        }
    });
});

// Funcionalidad para el formulario de email/password
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        // Mostrar indicador de carga
        const submitBtn = this.querySelector('.signin-btn');
        submitBtn.textContent = 'Iniciando sesión...';
        submitBtn.disabled = true;
        
        // Simular autenticación (en un entorno real, esto se haría con tu backend)
        setTimeout(() => {
            console.log('Iniciando sesión con credenciales:', { email, password });
            
            // Aquí iría la llamada real a tu API
            authenticateUser(email, password);
        }, 1000);
    } else {
        alert('Por favor, completa todos los campos');
    }
});

// Función para autenticación de usuario (simplificada para funcionar sin backend)
function authenticateUser(email, password) {
    // Simular verificación de credenciales
    // En un entorno real, esto se haría con tu backend
    if (email && password) {
        // Verificar si el usuario ya se registró (tiene nombre guardado)
        const userFirstName = localStorage.getItem('userFirstName');
        
        // Guardar información de sesión
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // Si no tiene nombre guardado, usar la primera parte del email
        if (!userFirstName) {
            localStorage.setItem('userFirstName', email.split('@')[0]);
        }
        
        // Redirigir a index.html
        window.location.href = 'index.html';
    } else {
        alert('Error al iniciar sesión. Verifica tus credenciales.');
        
        // Restaurar botón
        const submitBtn = document.querySelector('.signin-btn');
        submitBtn.textContent = 'Iniciar Sesión';
        submitBtn.disabled = false;
    }
}

// Verificar si hay un callback de autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    handleAuthCallback();
});

// Función para cerrar sesión
function signOut() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('loginTime');
    window.location.href = 'index.html';
}

// Verificar estado de autenticación
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Usuario ya está logueado, redirigir a index.html
        window.location.href = 'index.html';
    }
}

// Verificar estado al cargar
checkAuthStatus();
