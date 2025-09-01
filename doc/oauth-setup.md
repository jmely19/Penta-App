# 🔐 Configuración de OAuth para Autenticación Social

## 📋 Requisitos Previos

Para implementar la autenticación social, necesitarás:

1. **Cuentas de desarrollador** en cada plataforma
2. **Aplicaciones registradas** en cada servicio
3. **Backend** para manejar los callbacks de OAuth
4. **HTTPS** (requerido para OAuth)

## 🚀 Configuración de Google OAuth

### 1. Crear Proyecto en Google Cloud Console
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Crea un nuevo proyecto o selecciona uno existente
- Habilita la API de Google+ 

### 2. Configurar OAuth 2.0
- Ve a "APIs & Services" > "Credentials"
- Haz clic en "Create Credentials" > "OAuth 2.0 Client IDs"
- Selecciona "Web application"
- Agrega las URIs de redirección autorizadas:
  ```
  http://localhost:3000/auth/google/callback
  https://tudominio.com/auth/google/callback
  ```

### 3. Obtener Credenciales
- Copia el **Client ID** y **Client Secret**
- Actualiza `TU_GOOGLE_CLIENT_ID` en el código

## 🪟 Configuración de Microsoft OAuth

### 1. Registrar Aplicación en Azure
- Ve a [Azure Portal](https://portal.azure.com/)
- "Azure Active Directory" > "App registrations"
- "New registration"
- Nombre: "Tu App Sign In"
- Redirect URI: `https://tudominio.com/auth/microsoft/callback`

### 2. Configurar Permisos
- "API permissions" > "Add a permission"
- Selecciona "Microsoft Graph" > "Delegated permissions"
- Agrega: `openid`, `email`, `profile`

### 3. Obtener Credenciales
- Copia el **Application (client) ID**
- Actualiza `TU_MICROSOFT_CLIENT_ID` en el código

## 🍎 Configuración de Apple Sign In

### 1. Crear App ID en Apple Developer
- Ve a [Apple Developer](https://developer.apple.com/)
- "Certificates, Identifiers & Profiles"
- "Identifiers" > "App IDs"
- Crea nuevo App ID con "Sign In with Apple" habilitado

### 2. Configurar Service ID
- "Identifiers" > "Services IDs"
- Crea nuevo Service ID
- Habilita "Sign In with Apple"
- Agrega dominio y URL de redirección

### 3. Obtener Credenciales
- Copia el **Service ID**
- Actualiza `com.tuapp.signin` en el código

## 🔧 Configuración del Backend

### Endpoints Requeridos

```javascript
// POST /api/auth/token
// Intercambia código por token de acceso

// POST /api/auth/login  
// Autenticación con email/password

// GET /auth/google/callback
// Callback de Google OAuth

// GET /auth/microsoft/callback
// Callback de Microsoft OAuth

// GET /auth/apple/callback
// Callback de Apple OAuth
```

### Variables de Entorno

```bash
# .env
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

MICROSOFT_CLIENT_ID=tu_microsoft_client_id
MICROSOFT_CLIENT_SECRET=tu_microsoft_client_secret

APPLE_CLIENT_ID=com.tuapp.signin
APPLE_TEAM_ID=tu_team_id
APPLE_KEY_ID=tu_key_id
APPLE_PRIVATE_KEY=tu_private_key
```

## 🚨 Consideraciones de Seguridad

1. **Nunca expongas** los Client Secrets en el frontend
2. **Valida siempre** los tokens en el backend
3. **Usa HTTPS** en producción
4. **Implementa CSRF protection**
5. **Valida las URIs de redirección**

## 📱 Pruebas

### Local
```bash
# Inicia tu servidor en localhost:3000
npm start

# Prueba la autenticación social
# Los callbacks deben apuntar a localhost:3000
```

### Producción
- Asegúrate de que tu dominio esté en las URIs autorizadas
- Verifica que HTTPS esté configurado correctamente
- Prueba el flujo completo de autenticación

## 🔍 Debugging

### Console del Navegador
- Revisa los logs de autenticación
- Verifica que las URLs de redirección sean correctas
- Confirma que los parámetros OAuth se envíen correctamente

### Network Tab
- Monitorea las redirecciones OAuth
- Verifica los callbacks del servidor
- Confirma que los tokens se reciban correctamente

## 📚 Recursos Adicionales

- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth 2.0](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [Apple Sign In](https://developer.apple.com/sign-in-with-apple/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)