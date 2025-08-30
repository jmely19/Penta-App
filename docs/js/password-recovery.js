document.getElementById('recoveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const submitBtn = document.getElementById('recoveryBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!email) {
        showError('Please enter your email address');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Hide any existing messages
    hideMessages();

    // Simulate API call
    setTimeout(() => {
        // Simulate success (in real app, this would be an API call)
        if (Math.random() > 0.1) { // 90% success rate for demo
            showSuccess();
            submitBtn.textContent = 'Link Sent!';
            
            // Reset form after showing success
            setTimeout(() => {
                document.getElementById('recoveryForm').reset();
                submitBtn.textContent = 'Send Recovery Link';
                submitBtn.disabled = false;
                hideMessages();
            }, 5000);
        } else {
            showError('Failed to send recovery link. Please try again.');
            submitBtn.textContent = 'Send Recovery Link';
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
document.getElementById('email').addEventListener('input', function() {
    hideMessages();
});
