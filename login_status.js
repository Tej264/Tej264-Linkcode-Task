// login status for navbar as circle with dropdown for email, settings, and logout
async function renderLoginStatus() {
    let loggedInUser = null;
    try {
        const res = await fetch('/api/users');
        const users = await res.json();
        loggedInUser = users.find(u => u.loggedIn);
    } catch (e) {
        // fallback to localStorage if backend is not available
        if (localStorage.getItem('isLoggedIn') === 'true') {
            loggedInUser = {
                email: localStorage.getItem('userEmail') || 'User'
            };
        }
    }
    // Remove existing user circle if present
    document.querySelectorAll('.user-circle').forEach(el => el.remove());
    if (!loggedInUser) return;

    const nav = document.querySelector('nav');
    const userEmail = loggedInUser.email || loggedInUser.mobile || 'User';
    const userName = userEmail.split('@')[0];
    const userInitial = userName.charAt(0).toUpperCase();

    // Create user circle
    let userCircle = document.createElement('div');
    userCircle.style.width = '36px';
    userCircle.style.height = '36px';
    userCircle.style.background = '#febd69';
    userCircle.style.color = '#232f3e';
    userCircle.style.borderRadius = '50%';
    userCircle.style.display = 'flex';
    userCircle.style.alignItems = 'center';
    userCircle.style.justifyContent = 'center';
    userCircle.style.fontWeight = 'bold';
    userCircle.style.fontSize = '18px';
    userCircle.style.cursor = 'pointer';
    userCircle.style.position = 'relative';
    userCircle.style.marginLeft = '32px';
    userCircle.style.marginRight = '20px';
    userCircle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    userCircle.textContent = userInitial;

    // Dropdown menu
    let dropdown = document.createElement('div');
    dropdown.style.position = 'absolute';
    dropdown.style.top = '46px';
    dropdown.style.right = '0';
    dropdown.style.background = '#232f3e';
    dropdown.style.color = 'white';
    dropdown.style.padding = '14px 24px 10px 24px';
    dropdown.style.borderRadius = '8px';
    dropdown.style.fontSize = '14px';
    dropdown.style.minWidth = '180px';
    dropdown.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
    dropdown.style.display = 'none';
    dropdown.style.zIndex = '1000';

    // Email display
    let emailDiv = document.createElement('div');
    emailDiv.textContent = userEmail;
    emailDiv.style.marginBottom = '12px';
    emailDiv.style.fontWeight = 'bold';
    emailDiv.style.wordBreak = 'break-all';
    emailDiv.style.background = 'white';
    emailDiv.style.color = 'black';
    emailDiv.style.padding = '6px 10px';
    emailDiv.style.borderRadius = '5px';
    emailDiv.style.marginLeft = '-10px';
    emailDiv.style.marginRight = '-10px';

    // Settings link
    let settingsLink = document.createElement('a');
    settingsLink.textContent = 'Settings';
    settingsLink.href = '#';
    settingsLink.style.display = 'block';
    settingsLink.style.color = '#febd69';
    settingsLink.style.textDecoration = 'none';
    settingsLink.style.marginBottom = '10px';
    settingsLink.style.fontWeight = 'bold';
    settingsLink.onmouseover = function() { settingsLink.style.textDecoration = 'underline'; };
    settingsLink.onmouseout = function() { settingsLink.style.textDecoration = 'none'; };

    // Logout button
    let logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Log out';
    logoutBtn.style.background = '#febd69';
    logoutBtn.style.color = '#232f3e';
    logoutBtn.style.border = 'none';
    logoutBtn.style.borderRadius = '4px';
    logoutBtn.style.padding = '6px 18px';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.style.fontWeight = 'bold';
    logoutBtn.style.marginTop = '8px';

    logoutBtn.onclick = async function() {
        // Remove localStorage status
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        // Also log out on backend if possible
        try {
            await fetch('/api/logout-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });
        } catch (e) {}
        window.location.href = 'login.html';
    };

    dropdown.appendChild(emailDiv);
    dropdown.appendChild(settingsLink);
    dropdown.appendChild(logoutBtn);
    userCircle.appendChild(dropdown);

    userCircle.addEventListener('click', function(e) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        e.stopPropagation();
    });

    document.addEventListener('click', function() {
        dropdown.style.display = 'none';
    });

    // Add a class for easy removal:
    userCircle.classList.add('user-circle');

    // Insert into navbar (right side, after cart)
    const cartElem = document.getElementById('cart');
    if (cartElem && cartElem.parentNode) {
        cartElem.parentNode.insertBefore(userCircle, cartElem.nextSibling);
    } else {
        nav.appendChild(userCircle);
    }
}

// On page load
window.addEventListener('DOMContentLoaded', renderLoginStatus);
// After login (if AJAX), call renderLoginStatus();

