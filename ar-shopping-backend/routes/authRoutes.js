const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d'
    });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
        if (err) return res.status(500).json({ message: err.message });
        if (row) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Make the first user an admin, otherwise regular user
        db.get(`SELECT COUNT(*) as count FROM users`, [], (err, countRow) => {
            const role = (countRow.count === 0) ? 'admin' : 'user';
            
            db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
                [name, email, hashedPassword, role],
                function(err) {
                    if (err) return res.status(500).json({ message: err.message });
                    
                    const userId = this.lastID;
                    res.status(201).json({
                        id: userId,
                        name,
                        email,
                        role,
                        token: generateToken(userId, role)
                    });
                }
            );
        });
    });
});

// @route POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role)
        });
    });
});

module.exports = router;
