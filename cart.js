// JavaScript to handle adding products to the cart

// Load cart from localStorage or start with empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartCountElement = document.getElementById("cart-count");
const cartListElement = document.getElementById("cart-list");
const cartItemsElement = document.getElementById("cart-items");

// Update cart count on page load
cartCountElement.textContent = cart.length;

// Add event listeners to all product categories
document.querySelectorAll(".category[data-name][data-price]").forEach(category => {
    category.addEventListener("click", (e) => {
        // Prevent adding to cart if a link or button inside the card is clicked
        if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;

        const productName = category.getAttribute("data-name");
        const productPrice = category.getAttribute("data-price");

        if (productName && productPrice) {
            // Add product to the cart
            cart.push({ name: productName, price: productPrice });

            // Update cart count
            cartCountElement.textContent = cart.length;

            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    });
});

// Add event listener to the cart icon to display cart items
document.getElementById("cart").addEventListener("click", () => {
    // Toggle the visibility of the cart items
    if (cartItemsElement.style.display === "none" || cartItemsElement.style.display === "") {
        cartItemsElement.style.display = "block";

        // Clear the cart list before populating
        cartListElement.innerHTML = "";

        // Display each item in the cart
        if (cart.length > 0) {
            cart.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = `${item.name} - $${item.price}`;
                cartListElement.appendChild(listItem);
            });
        } else {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "Your cart is empty.";
            cartListElement.appendChild(emptyMessage);
        }
    } else {
        cartItemsElement.style.display = "none";
    }
});



/* code for other html files to add product to the cart */

document.addEventListener('DOMContentLoaded', function() {
    // Ensure cart exists in localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Update cart count in navbar
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }
    updateCartCount();

    // Add event listeners to all buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = btn.closest('.bestseller-card, .mobile-card, .book-card,.computer-card, .deal-card, .electronics-card, .fashion-card, .headphone-card, .item-card, .appliance-card, .release-card');
            const name = card.getAttribute('data-name');
            const price = card.getAttribute('data-price').replace(/[^\d.]/g, ''); // Remove ₹ if present
            const img = card.querySelector('img').getAttribute('src');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ name, price, img });
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${name} added to cart!`);
        });
    });
});



function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Your cart is empty.</li>';
        // Show totals as zero
        document.getElementById('cart-totals').innerHTML = `
            <div style="padding:12px 18px; border-top:1px solid #eee;">
                <strong>Total Items:</strong> 0<br>
                <strong>Total Price:</strong> ₹0
            </div>
        `;
        return;
    }
    let totalPrice = 0;
    cart.forEach((item, index) => {
        totalPrice += parseFloat(item.price);
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-info">
                <div class="cart-title">${item.name}</div>
                <div class="cart-price">₹${item.price}</div>
            </div>
            <button class="remove-cart-item" data-index="${index}" style="margin-left:10px; background:#ff4444; color:#fff; border:none; border-radius:4px; padding:4px 8px; cursor:pointer;">Remove</button>
        `;
        cartItems.appendChild(li);
    });

    // Add event listeners for remove buttons
    cartItems.querySelectorAll('.remove-cart-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            cart.splice(idx, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            // Update cart count in navbar
            document.getElementById('cart-count').textContent = cart.length;
        });
    });

    // Show totals at the bottom
    document.getElementById('cart-totals').innerHTML = `
        <div style="padding:12px 18px; border-top:1px solid #eee;">
            <strong>Total Items:</strong> ${cart.length}<br>
            <strong>Total Price:</strong> ₹${totalPrice} k
        </div>
    `;
}

document.getElementById('cart').addEventListener('click', function() {
    renderCart();
    document.getElementById('offcanvas-cart').classList.add('open');
    document.getElementById('offcanvas-overlay').classList.add('open');
});
document.getElementById('close-cart').addEventListener('click', function() {
    document.getElementById('offcanvas-cart').classList.remove('open');
    document.getElementById('offcanvas-overlay').classList.remove('open');
});
document.getElementById('offcanvas-overlay').addEventListener('click', function() {
    document.getElementById('offcanvas-cart').classList.remove('open');
    this.classList.remove('open');
});