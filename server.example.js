const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Configuración OAuth
const oauthConfig = {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
    },
    microsoft: {
        clientId: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        userInfoUrl: 'https://graph.microsoft.com/v1.0/me'
    },
    apple: {
        clientId: process.env.APPLE_CLIENT_ID,
        teamId: process.env.APPLE_TEAM_ID,
        keyId: process.env.APPLE_KEY_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        tokenUrl: 'https://appleid.apple.com/auth/token'
    }
};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro';

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Aquí implementarías la lógica de autenticación real
        // Por ejemplo, verificar contra tu base de datos
        
        if (email === 'test@example.com' && password === 'password') {
            const token = jwt.sign({ email, id: '123' }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, user: { email, id: '123' } });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Callback de Google OAuth
app.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.redirect('/?error=no_code');
        }
        
        // Intercambiar código por token
        const tokenResponse = await axios.post(oauthConfig.google.tokenUrl, {
            client_id: oauthConfig.google.clientId,
            client_secret: oauthConfig.google.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${req.protocol}://${req.get('host')}/auth/google/callback`
        });
        
        const { access_token } = tokenResponse.data;
        
        // Obtener información del usuario
        const userResponse = await axios.get(oauthConfig.google.userInfoUrl, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        
        const userData = userResponse.data;
        
        // Crear JWT y redirigir
        const token = jwt.sign({ 
            id: userData.id, 
            email: userData.email, 
            name: userData.name,
            provider: 'google' 
        }, JWT_SECRET, { expiresIn: '24h' });
        
        res.redirect(`/?token=${token}`);
        
    } catch (error) {
        console.error('Error en Google callback:', error);
        res.redirect('/?error=google_auth_failed');
    }
});

// Callback de Microsoft OAuth
app.get('/auth/microsoft/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.redirect('/?error=no_code');
        }
        
        // Intercambiar código por token
        const tokenResponse = await axios.post(oauthConfig.microsoft.tokenUrl, {
            client_id: oauthConfig.microsoft.clientId,
            client_secret: oauthConfig.microsoft.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${req.protocol}://${req.get('host')}/auth/microsoft/callback`
        });
        
        const { access_token } = tokenResponse.data;
        
        // Obtener información del usuario
        const userResponse = await axios.get(oauthConfig.microsoft.userInfoUrl, {
            headers: { 
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const userData = userResponse.data;
        
        // Crear JWT y redirigir
        const token = jwt.sign({ 
            id: userData.id, 
            email: userData.mail || userData.userPrincipalName, 
            name: userData.displayName,
            provider: 'microsoft' 
        }, JWT_SECRET, { expiresIn: '24h' });
        
        res.redirect(`/?token=${token}`);
        
    } catch (error) {
        console.error('Error en Microsoft callback:', error);
        res.redirect('/?error=microsoft_auth_failed');
    }
});

// Callback de Apple OAuth
app.get('/auth/apple/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.redirect('/?error=no_code');
        }
        
        // Para Apple, necesitarías implementar la lógica específica
        // ya que usa JWT para la autenticación del cliente
        
        // Por ahora, redirigimos con un mensaje
        res.redirect('/?error=apple_not_implemented');
        
    } catch (error) {
        console.error('Error en Apple callback:', error);
        res.redirect('/?error=apple_auth_failed');
    }
});

// Endpoint para intercambiar código por token (usado por el frontend)
app.post('/api/auth/token', async (req, res) => {
    try {
        const { code, provider } = req.body;
        
        if (!code || !provider) {
            return res.status(400).json({ error: 'Código y proveedor requeridos' });
        }
        
        // Aquí implementarías la lógica específica para cada proveedor
        // Por simplicidad, devolvemos un token de ejemplo
        
        const token = jwt.sign({ 
            id: 'temp_id', 
            provider,
            code 
        }, JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ access_token: token });
        
    } catch (error) {
        console.error('Error al intercambiar token:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Ruta protegida de ejemplo
app.get('/api/profile', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Perfil accedido correctamente',
        user: req.user 
    });
});

// Ruta para cerrar sesión
app.post('/api/auth/logout', (req, res) => {
    // En un entorno real, podrías invalidar el token
    res.json({ message: 'Sesión cerrada correctamente' });
});

// Servir la página de inicio de sesión
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Sign in.html');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('📱 OAuth configurado para Google, Microsoft y Apple');
    console.log('🔐 JWT configurado para autenticación');
});

module.exports = app;