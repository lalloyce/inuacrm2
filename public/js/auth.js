document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const showSignupLink = document.getElementById('show-signup');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const signupModal = document.getElementById('signup-modal');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const closeButtons = document.querySelectorAll('.close');

    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    showSignupLink.addEventListener('click', showSignupModal);
    forgotPasswordLink.addEventListener('click', showForgotPasswordModal);
    closeButtons.forEach(button => button.addEventListener('click', closeModal));

    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!validateEmail(email) || !validatePassword(password)) {
            displayError('Invalid email or password format');
            return;
        }

        try {
            showLoading();
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                displaySuccess('Login successful. Redirecting...');
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            } else {
                displayError(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            displayError('An error occurred during login');
        } finally {
            hideLoading();
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const fullName = document.getElementById('signup-name').value;
        const role = document.getElementById('signup-role').value;

        if (!validateEmail(email) || !validatePassword(password)) {
            displayError('Invalid email or password format');
            return;
        }

        try {
            showLoading();
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, full_name: fullName, role })
            });

            const data = await response.json();

            if (response.ok) {
                displaySuccess(data.message);
                closeModal();
                loginForm.reset();
            } else {
                displayError(data.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            displayError('An error occurred during signup');
        } finally {
            hideLoading();
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-password-email').value;

        if (!validateEmail(email)) {
            displayError('Invalid email format');
            return;
        }

        try {
            showLoading();
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                displaySuccess(data.message);
                closeModal();
            } else {
                displayError(data.error || 'Failed to send password reset email');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            displayError('An error occurred while processing your request');
        } finally {
            hideLoading();
        }
    }

    function showSignupModal() {
        signupModal.style.display = 'block';
    }

    function showForgotPasswordModal() {
        forgotPasswordModal.style.display = 'block';
    }

    function closeModal() {
        signupModal.style.display = 'none';
        forgotPasswordModal.style.display = 'none';
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == signupModal || event.target == forgotPasswordModal) {
            closeModal();
        }
    }

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(password);
    }

    function displayError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
        setTimeout(() => {
            errorElement.remove();
        }, 5000);
    }

    function displaySuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        document.body.appendChild(successElement);
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    }

    function showLoading() {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading';
        loadingElement.textContent = 'Loading...';
        document.body.appendChild(loadingElement);
    }

    function hideLoading() {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
});