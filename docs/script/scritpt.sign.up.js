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
        function signUpWithGoogle() {
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

        // Function to start authentication with Microsoft/Windows
        function signUpWithMicrosoft() {
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

        // Function to start authentication with Apple/iCloud
        function signUpWithApple() {
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

        // Form submission handler
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validation
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            if (password.length < 8) {
                showError('Password must be at least 8 characters long');
                return;
            }

            if (!terms) {
                showError('Please accept the terms and conditions');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
            }

            // Show loading state
            const submitBtn = document.getElementById('signupBtn');
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            
            // Hide any existing messages
            hideMessages();

            // Simulate API call
            setTimeout(() => {
                // Simulate success (in real app, this would be an API call)
                if (Math.random() > 0.1) { // 90% success rate for demo
                    showSuccess();
                    
                    // Redirect to sign in page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'Sign in.html';
                    }, 2000);
                } else {
                    showError('Failed to create account. Please try again.');
                    submitBtn.textContent = 'Create Account';
                    submitBtn.disabled = false;
                }
            }, 2000);
        });

        function showSuccess() {
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
        }

        function showError(message) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = `❌ ${message}`;
            errorMessage.style.display = 'block';
        }

        function hideMessages() {
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('errorMessage').style.display = 'none';
        }

        // Clear messages when user starts typing
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', function() {
                hideMessages();
            });
        });

        // Terms and Privacy functions (placeholder)
        function showTerms() {
            alert('Terms of Service would be displayed here in a real application.');
        }

        function showPrivacy() {
            alert('Privacy Policy would be displayed here in a real application.');
        }

        // Handle OAuth callback if present
        function handleAuthCallback() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');
            
            if (error) {
                console.error('Authentication error:', error);
                showError('Error during authentication. Please try again.');
                return;
            }
            
            if (code) {
                console.log('Authorization code received:', code);
                // In a real app, you would exchange this code for a token
                // and create the user account
                showSuccess();
                setTimeout(() => {
                    window.location.href = 'Sign in.html';
                }, 2000);
            }
        }

        // Check for OAuth callback on page load
        document.addEventListener('DOMContentLoaded', function() {
            handleAuthCallback();
        });