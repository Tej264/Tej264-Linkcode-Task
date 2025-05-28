// This code goes in registration-client.js or inside a <script> tag in Registration.html
document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, email, password })
    });
    const result = await response.json();
    if(result.success) {
        alert('Registration successful! You can now log in.');
        window.location.href = 'login.html';
    } else {
        alert(result.message || 'Registration failed.');
    }
});