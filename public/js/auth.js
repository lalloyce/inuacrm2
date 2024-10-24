document.addEventListener('DOMContentLoaded', () => {
    // Get forms by their IDs
    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form'); // Assume you have this ID for registration
    const passwordResetForm = document.getElementById('password-reset-form'); // Assume this ID for password reset
    const contactForm = document.getElementById('contactForm');

    // Login form submission handler with validation
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();

            // Basic validation checks
            if (!email || !validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!password) {
                alert('Password cannot be empty.');
                return;
            }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                console.log('Response status:', response.status);
                console.log('Response result:', result);

                if (response.status === 200) {
                    console.log('Login successful:', result);
                    localStorage.setItem('jwt', result.token);
                    const redirectUrl = localStorage.getItem('redirectAfterLogin');
                    if (redirectUrl) {
                        localStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirectUrl;
                    } else {
                        window.location.href = '/dashboard.html';
                    }
                } else {
                    console.error('Login failed:', result);
                    alert('Login failed: ' + result.error);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please try again.');
            }
        });
    }

    // Registration form submission handler with validation
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();

            // Basic validation checks
            if (!email || !validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!password || password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                console.log('Response status:', response.status);
                console.log('Response result:', result);

                if (response.status === 200) {
                    alert('Registration successful! Please log in.');
                    window.location.href = '/login.html'; // Redirect to login page
                } else {
                    console.error('Registration failed:', result);
                    alert('Registration failed: ' + result.error);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An error occurred during registration. Please try again.');
            }
        });
    }

    // Password reset form submission handler with validation
    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('reset-email').value.trim();

            // Basic validation checks
            if (!email || !validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            try {
                const response = await fetch('/api/password-reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const result = await response.json();
                console.log('Response status:', response.status);
                console.log('Response result:', result);

                if (response.status === 200) {
                    alert('Password reset link has been sent to your email.');
                } else {
                    console.error('Password reset failed:', result);
                    alert('Password reset failed: ' + result.error);
                }
            } catch (error) {
                console.error('Error during password reset:', error);
                alert('An error occurred during password reset. Please try again.');
            }
        });
    }

    // Contact form submission handler with validation
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation checks
            if (!name || name.length < 7) {
                alert('Name must be at least 7 characters long.');
                return;
            }
            if (!email || !validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!message || message.length < 100) {
                alert('Message must be at least 100 characters long.');
                return;
            }

            try {
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();
                console.log('Response status:', response.status);
                console.log('Response result:', result);

                if (response.status === 200) {
                    document.getElementById('feedback').innerHTML = `<div class="alert alert-success">${result.message}</div>`;
                    contactForm.reset();
                } else {
                    console.error('Error sending message:', result);
                    document.getElementById('feedback').innerHTML = `<div class="alert alert-danger">Error: ${result.error}</div>`;
                }
            } catch (error) {
                console.error('Error during message sending:', error);
                document.getElementById('feedback').innerHTML = `<div class="alert alert-danger">There was an error sending your message. Please try again.</div>`;
            }
        });
    }

    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
