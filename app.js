// Attach event listener to the "Forgot Password?" link
const forgotPasswordLink = document.querySelector('.forgot-password');
forgotPasswordLink.addEventListener('click', showPasswordResetForm);

// Function to show the password reset form
function showPasswordResetForm(event) {
    event.preventDefault();

    // Check if the password reset form already exists
    if (document.querySelector('.password-reset-form')) return;

    // Create the password reset form
    const passwordResetForm = document.createElement('form');
    passwordResetForm.classList.add('password-reset-form');
    passwordResetForm.innerHTML = `
        <input type="email" id="reset-email" placeholder="Email/Username" required>
        <button type="submit">Reset Password</button>
    `;

    // Replace the login form with the password reset form
    const loginForm = document.getElementById('loginForm');
    loginForm.style.display = 'none';
    loginForm.parentNode.insertBefore(passwordResetForm, loginForm.nextSibling);
    passwordResetForm.style.display = 'block';

    // Attach event listener to the password reset form
    passwordResetForm.addEventListener('submit', handlePasswordReset);
}

// Function to handle the password reset request
async function handlePasswordReset(event) {
    event.preventDefault();

    const email = document.getElementById('reset-email').value;

    try {
        // Send a request to the server to initiate the password reset process
        const response = await fetch('/api/password-reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Password reset instructions have been sent to your email.');
            // Optionally, redirect to the login page or reset the form
            document.querySelector('.password-reset-form').remove();
            document.getElementById('loginForm').style.display = 'block';
        } else {
            alert(data.message || 'Failed to reset password.');
        }
    } catch (error) {
        alert('An error occurred while processing your request. Please try again later.');
        console.error('Error:', error);
    }
}
