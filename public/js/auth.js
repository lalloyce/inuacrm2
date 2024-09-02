document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

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

                if (response.ok) {
                    // Handle successful login
                    console.log('Login successful:', result);
                    // Redirect to a protected page or update the UI
                    window.location.href = '/dashboard.html';
                } else {
                    // Handle login error
                    console.error('Login error:', result);
                    alert(result.error || JSON.stringify(result) || 'An error occurred. Please try again.');
                }
            } catch (error) {
                console.error('Unexpected error:', error);
                alert('An unexpected error occurred. Please try again later.');
            }
        });
    }
});