// --- Admin Login Logic ---
const ADMIN_PASSWORD = "admin123"; // Change this to your desired password
const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', function() {
    const pwd = document.getElementById('admin-password').value;
    if (pwd === ADMIN_PASSWORD) {
        loginSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        renderCart(); // Call renderCart after login
    } else {
        loginError.textContent = "Incorrect password!";
    }
});

// --- Product Management Logic ---
const productList = document.getElementById('product-list');
const addProductForm = document.getElementById('add-product-form');
let products = JSON.parse(localStorage.getItem('adminProducts')) || [];

function renderProducts() {
    productList.innerHTML = '';
    if (products.length === 0) {
        productList.innerHTML = "<li>No products available.</li>";
    } else {
        products.forEach((product, idx) => {
            const li = document.createElement('li');
            li.textContent = `${product.name} - $${product.price}`;
            const removeBtn = document.createElement('span');
            removeBtn.textContent = "Remove";
            removeBtn.className = "remove-btn";
            removeBtn.onclick = function() {
                products.splice(idx, 1);
                localStorage.setItem('adminProducts', JSON.stringify(products));
                renderProducts();
            };
            li.appendChild(removeBtn);
            productList.appendChild(li);
        });
    }
}

addProductForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const img = document.getElementById('product-img').value.trim();

    const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, img })
    });
    const result = await response.json();
    if(result.success) {
        alert('Product added!');
        this.reset();
        loadAdminProducts();
    } else {
        alert('Failed to add product.');
    }
});

// Load products for admin panel
async function loadAdminProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - $${product.price}`;
        li.setAttribute('data-name', product.name);
        li.setAttribute('data-price', product.price);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = async function() {
            const response = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: product.name })
            });
            const result = await response.json();
            if(result.success) {
                loadAdminProducts();
            } else {
                alert('Failed to remove product.');
            }
        };
        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

// Initial render
renderProducts();

// For demo: Show and allow removal of cart items stored in localStorage
const adminCartList = document.getElementById('admin-cart-list');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
    adminCartList.innerHTML = '';
    if(cart.length === 0) {
        adminCartList.innerHTML = "<li>No items in cart.</li>";
    } else {
        cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price}`;
            const removeBtn = document.createElement('span');
            removeBtn.textContent = " Remove";
            removeBtn.className = "remove-btn";
            removeBtn.onclick = function() {
                cart.splice(idx, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            };
            li.appendChild(removeBtn);
            adminCartList.appendChild(li);
        });
    }
}

// Call this after login and after any cart update
renderCart();

// Fetch and display users
function loadUsers() {
    fetch('/api/users')
        .then(res => res.json())
        .then(users => {
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.email} ${user.loggedIn ? '(Online)' : '(Offline)'}`;
                if (user.loggedIn) {
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Log out';
                    removeBtn.className = 'user-remove-btn';
                    removeBtn.onclick = function() {
                        fetch('/api/logout-user', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: user.email })
                        })
                        .then(res => res.json())
                        .then(result => {
                            if (result.success) loadUsers();
                            else alert('Failed to log out user.');
                        });
                    };
                    li.appendChild(removeBtn);
                }
                userList.appendChild(li);
            });
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // After successful admin login, show admin panel and load users
    document.getElementById('login-btn').onclick = function() {
        const pwd = document.getElementById('admin-password').value;
        if (pwd === 'admin123') { // Example password
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('admin-panel').classList.remove('hidden');
            loadUsers();
        } else {
            document.getElementById('login-error').textContent = 'Incorrect password!';
        }
    };
});
