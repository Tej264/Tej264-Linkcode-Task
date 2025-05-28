async function loadProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'category';
        div.setAttribute('data-name', product.name);
        div.setAttribute('data-price', product.price);
        div.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
        `;
        container.appendChild(div);
    });
}
document.addEventListener('DOMContentLoaded', loadProducts);