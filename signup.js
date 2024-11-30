// Signup Form Validation
const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (username && email && password) {
        alert('Sign up successful!');
        // Add further logic here (e.g., save data, redirect, etc.)
    } else {
        alert('Please fill in all fields!');
    }
});
