document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if(result.success) {
        // After successful login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email); // or whatever identifier you use
        window.location.href = 'Amazon_clone.html'; // or your main page
    } else {
        alert(result.message);
    }
});
