# PENTA - Financial Education Platform

## Descripción
PENTA es una plataforma de educación financiera para jóvenes que ofrece lecciones interactivas, juegos y herramientas para aprender sobre finanzas personales.

## Características
- ✅ Sistema de autenticación simple (sin backend)
- ✅ Página de inicio de sesión funcional
- ✅ Redirección automática después del login
- ✅ Interfaz de usuario moderna y responsiva
- ✅ Chatbot integrado
- ✅ Lecciones interactivas

## Cómo ejecutar el proyecto

### Opción 1: Servidor local simple (Recomendado)
1. Abre una terminal en la carpeta `doc/docs`
2. Ejecuta uno de estos comandos:

**Con Python 3:**
```bash
python -m http.server 8000
```

**Con Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Con Node.js:**
```bash
npx http-server -p 8000
```

3. Abre tu navegador y ve a `http://localhost:8000`
4. Navega a `sign.in.html` para probar el login

### Opción 2: Abrir directamente en el navegador
1. Navega a la carpeta `doc/docs`
2. Abre `index.html` directamente en tu navegador
3. Haz clic en "Login" en la navegación
4. Prueba el formulario de inicio de sesión

## Cómo usar el sistema de login

1. Ve a `sign.in.html`
2. Ingresa cualquier email y contraseña (el sistema está configurado para aceptar cualquier credencial)
3. Haz clic en "Sign In"
4. Serás redirigido automáticamente a `index.html`
5. Verás tu email en la barra de navegación
6. Puedes hacer clic en "Logout" para cerrar sesión

## Estructura del proyecto

```
doc/
├── docs/
│   ├── index.html          # Página principal
│   ├── sign.in.html        # Página de login
│   ├── sign.up.html        # Página de registro
│   ├── our-lessons.html    # Lecciones
│   ├── exercise1.html      # Ejercicios
│   ├── exercise2.html
│   ├── exercise3.html
│   ├── css/                # Estilos
│   ├── images/             # Imágenes
│   └── scriptchatbot.js    # Script del chatbot
├── server.example.js       # Servidor de ejemplo (no necesario)
├── package.json           # Dependencias (no necesario)
└── README.md              # Este archivo
```

## Notas importantes

- El sistema de autenticación actual es solo para demostración
- No requiere base de datos ni servidor backend
- Los datos se almacenan temporalmente en el localStorage del navegador
- Para un entorno de producción, necesitarías implementar un backend real

## Solución de problemas

### Si el login no funciona:
1. Asegúrate de que estás ejecutando desde un servidor local (no abriendo el archivo directamente)
2. Verifica que no hay errores en la consola del navegador (F12)
3. Limpia el localStorage del navegador si es necesario

### Si las redirecciones no funcionan:
1. Verifica que todos los archivos HTML están en la misma carpeta
2. Asegúrate de que los nombres de archivo coinciden exactamente

## Tecnologías utilizadas

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (Vanilla)
- Font Awesome (iconos)
- Imágenes de Unsplash

## Autor

PENTA Financial Education Team
