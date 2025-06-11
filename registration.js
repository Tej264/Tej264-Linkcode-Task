const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, 'users.json');

// Helper to read users
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    const content = fs.readFileSync(USERS_FILE, 'utf-8').trim();
    if (!content) return [];
    try {
        return JSON.parse(content);
    } catch (e) {
        // If corrupted, reset to empty array
        fs.writeFileSync(USERS_FILE, '[]');
        return [];
    }
}

// Helper to write users
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Registration endpoint
router.post('/api/register', (req, res) => {
    const { name, mobile, email, password } = req.body;
    if (!name || !mobile || !password) {
        return res.json({ success: false, message: 'Please fill all required fields.' });
    }
    let users = readUsers();
    if (users.find(u => u.mobile === mobile)) {
        return res.json({ success: false, message: 'Mobile number already registered.' });
    }
    users.push({ name, mobile, email, password });
    writeUsers(users);
    res.json({ success: true });
});

module.exports = router;