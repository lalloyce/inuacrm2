// app.js

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const resetPasswordModal = document.getElementById('resetPasswordModal');
    const closeBtns = document.getElementsByClassName('close');

    // Open modals
    loginBtn.onclick = () => loginModal.style.display = 'block';
    registerBtn.onclick = () => registerModal.style.display = 'block';
    resetPasswordBtn.onclick = () => resetPasswordModal.style.display = 'block';

    // Close modals
    Array.from(closeBtns).forEach(btn => {
        btn.onclick = function() {
            this.closest('.modal').style.display = 'none';
        }
    });

    // Close modals when clicking outside
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }

    // Form submissions
    document.getElementById('loginForm').onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    }

    document.getElementById('registerForm').onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        register(name, email, password, confirmPassword);
    }

    document.getElementById('resetPasswordForm').onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        resetPassword(email);
    }
});

async function login(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Login successful:', data);
        // Handle successful login (e.g., store token, redirect)
    } catch (error) {
        console.error('Login error:', error);
        // Handle login error (e.g., show error message)
    }
}

async function register(name, email, password, confirmPassword) {
    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        console.log('Registration successful:', data);
        // Handle successful registration (e.g., show success message, redirect to login)
    } catch (error) {
        console.error('Registration error:', error);
        // Handle registration error (e.g., show error message)
    }
}

async function resetPassword(email) {
    try {
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Password reset request failed');
        }

        const data = await response.json();
        console.log('Password reset request successful:', data);
        // Handle successful password reset request (e.g., show success message)
    } catch (error) {
        console.error('Password reset error:', error);
        // Handle password reset error (e.g., show error message)
    }
}