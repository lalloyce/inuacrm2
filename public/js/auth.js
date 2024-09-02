document.addEventListener('DOMContentLoaded', () => {
    // Get the login form element by its ID
    const loginForm = document.getElementById('login-form');
    
    // Check if the login form exists
    if (loginForm) {
        // Add a submit event listener to the login form
        loginForm.addEventListener('submit', async (e) => {
            // Prevent the default form submission behavior
            e.preventDefault();
            
            // Get the email and password values from the form inputs
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                // Send a POST request to the login API endpoint with the email and password
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                // Parse the JSON response from the server
                const result = await response.json();

                // Log the response status and result for debugging purposes
                console.log('Response status:', response.status);
                console.log('Response result:', result);

                // Check if the login was successful
                if (response.status === 200) {
                    console.log('Login successful:', result);
                    // Store the JWT token in localStorage
                    localStorage.setItem('jwt', result.token);
                    // Redirect the user to the dashboard page
                    window.location.href = '/dashboard.html';
                } else {
                    // Log an error message and show an alert if the login failed
                    console.error('Login failed:', result);
                    alert('Login failed: ' + result.error);
                }
            } catch (error) {
                // Log an error message and show an alert if there was an error during the login process
                console.error('Error during login:', error);
                alert('An error occurred during login. Please try again.');
            }
        });
    }
});