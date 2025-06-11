const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const usersRoutes = require('./users.js'); // Import your users.js

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Use user management routes
app.use(usersRoutes);

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Amazon_clone.html'));
});

// Route for "see more" link
app.get('/see-more', (req, res) => {
    res.send('<h1>See More Page</h1><p>More content will be added here.</p>');
});

// Example routes for menu items
app.get('/fresh', (req, res) => {
    res.send('<h1>Fresh Page</h1><p>Welcome to the Fresh section.</p>');
});

app.get('/fashion', (req, res) => {
    res.send('<h1>Fashion Page</h1><p>Explore the latest fashion trends.</p>');
});

app.get('/electronics', (req, res) => {
    res.send('<h1>Electronics Page</h1><p>Find the best electronics here.</p>');
});

// Add more routes for other menu items as needed
app.get('/mobile', (req, res) => {
    res.send('<h1>Mobile Page</h1><p>Discover the latest mobile phones.</p>');
});

app.get('/bestseller', (req, res) => {
    res.send('<h1>Best Seller Page</h1><p>Check out our best-selling products.</p>');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Admin Section
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

//login 

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

const USERS_FILE = path.join(__dirname, 'users.json');

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        const content = fs.readFileSync(USERS_FILE, 'utf-8').trim();
        if (content) users = JSON.parse(content);
    }
    // Find user by email or mobile and password
    const user = users.find(u => (u.email === email || u.mobile === email) && u.password === password);
    if (!user) {
        return res.json({ success: false, message: 'Invalid credentials.' });
    }
    // Set loggedIn status for this user, and false for others
    users = users.map(u => {
        if ((u.email === user.email && user.email) || (u.mobile === user.mobile && user.mobile)) {
            return { ...u, loggedIn: true };
        } else {
            return { ...u, loggedIn: false };
        }
    });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ success: true, name: user.name });
});

// Serve login.html as the root page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// Get all products
app.get('/api/products', (req, res) => {
    if (!fs.existsSync(PRODUCTS_FILE)) return res.json([]);
    const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8').trim();
    if (!content) return res.json([]);
    res.json(JSON.parse(content));
});

// Add a new product
app.post('/api/products', (req, res) => {
    const { name, price, img } = req.body;
    if (!name || !price || !img) return res.json({ success: false, message: 'Missing fields' });
    let products = [];
    if (fs.existsSync(PRODUCTS_FILE)) {
        const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8').trim();
        if (content) products = JSON.parse(content);
    }
    products.push({ name, price, img });
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.json({ success: true });
});

// Remove a product by name
app.delete('/api/products', (req, res) => {
    const { name } = req.body;
    let products = [];
    if (fs.existsSync(PRODUCTS_FILE)) {
        products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    }
    const newProducts = products.filter(p => p.name !== name);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(newProducts, null, 2));
    res.json({ success: true });
});

app.use(express.static(__dirname));
app.listen(3000, () => console.log('Server running on port 3000'));

// Registration endpoint
app.post('/api/register', (req, res) => {
    const { name, mobile, email, password } = req.body;
    if (!name || !mobile || !password) {
        return res.json({ success: false, message: 'Missing required fields.' });
    }
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        const content = fs.readFileSync(USERS_FILE, 'utf-8').trim();
        if (content) users = JSON.parse(content);
    }
    // Check for duplicate mobile or email
    if (users.some(u => u.mobile === mobile || (email && u.email === email))) {
        return res.json({ success: false, message: 'User already exists.' });
    }
    users.push({ name, mobile, email, password });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ success: true });
});

// Cart functionality
const CART_FILE = './cart.json';

app.get('/api/cart', (req, res) => {
    if (!fs.existsSync(CART_FILE)) return res.json([]);
    const cart = JSON.parse(fs.readFileSync(CART_FILE, 'utf-8'));
    res.json(cart);
});

app.delete('/api/cart', (req, res) => {
    const { index } = req.body;
    let cart = [];
    if (fs.existsSync(CART_FILE)) {
        cart = JSON.parse(fs.readFileSync(CART_FILE, 'utf-8'));
    }
    cart.splice(index, 1);
    fs.writeFileSync(CART_FILE, JSON.stringify(cart, null, 2));
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));

// POST /api/logout-user
app.post('/api/logout-user', (req, res) => {
    const { email, mobile } = req.body;
    const USERS_FILE = path.join(__dirname, 'users.json');
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
        const content = fs.readFileSync(USERS_FILE, 'utf-8').trim();
        if (content) users = JSON.parse(content);
    }
    let found = false;
    users = users.map(u => {
        if ((email && u.email === email) || (mobile && u.mobile === mobile)) {
            found = true;
            return { ...u, loggedIn: false };
        }
        return u;
    });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ success: found });
});

