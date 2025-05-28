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
        return [];
    }
}

// Helper to write users
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Get all users (without password)
router.get('/api/users', (req, res) => {
    const users = readUsers().map(({ password, ...rest }) => rest);
    res.json(users);
});

// Log out a user
router.post('/api/logout-user', (req, res) => {
    const { email } = req.body;
    let users = readUsers();
    let found = false;
    users = users.map(u => {
        if (u.email === email) {
            found = true;
            return { ...u, loggedIn: false };
        }
        return u;
    });
    if (found) {
        writeUsers(users);
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'User not found' });
    }
});

module.exports = router;