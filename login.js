// Login Form Validation
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in both fields!');
        return;
    }

    // Mock Login Logic
    if (email === 'test@lanverse.com' && password === 'password123') {
        alert('Login successful!');
        // Redirect to the dashboard or another page
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
});
