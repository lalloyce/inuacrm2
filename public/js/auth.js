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

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = '/dashboard.html';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    }

    async function handleSignup(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const fullName = document.getElementById('signup-name').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: fullName })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                closeModal();
                loginForm.reset();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup');
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-password-email').value;

        try {
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                closeModal();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            alert('An error occurred while processing your request');
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
});