
        // Validación del formulario de contacto
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if(!name || !email || !message) {
                alert('Please complete all required fields');
                return;
            }
            
            if(!/^S+@S+\.S+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Aquí iría la lógica para enviar el formulario
            alert('Thank you for your message! We will contact you shortly.');
            this.reset();
        });
        
        // Scroll suave mejorado con offset para el header fijo
        document.querySelectorAll('.quick-access a').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
        
        /* Desplazamiento suave para enlaces internos con offset para el header */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    const headerHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar URL sin recargar la página
                    history.pushState(null, null, targetId);
                }
            });
        });
        
        /* Toggle para menú móvil (necesitaría elementos HTML adicionales)
           Esto es solo un marcador de posición - se necesitaría implementar la estructura del menú móvil */
        const mobileMenuButton = document.querySelector('nav button.md\\:hidden');
        mobileMenuButton.addEventListener('click', () => {
            // This would toggle a mobile menu
            console.log('Mobile menu would open');
        });