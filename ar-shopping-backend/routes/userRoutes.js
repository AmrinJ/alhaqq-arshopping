const express = require('express');
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/users/profile
router.get('/profile', protect, (req, res) => {
    db.get(`SELECT id, name, email, role, phone, street, city, state, zip FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json(user);
    });
});

// @route PUT /api/users/profile
router.put('/profile', protect, (req, res) => {
    const { name, phone, street, city, state, zip } = req.body;
    
    db.run(
        `UPDATE users SET name = ?, phone = ?, street = ?, city = ?, state = ?, zip = ? WHERE id = ?`,
        [name || '', phone || '', street || '', city || '', state || '', zip || '', req.user.id],
        function(err) {
            if (err) return res.status(500).json({ message: err.message });
            
            // Return updated user configuration
            db.get(`SELECT id, name, email, role, phone, street, city, state, zip FROM users WHERE id = ?`, [req.user.id], (err, updatedUser) => {
                if (err) return res.status(500).json({ message: err.message });
                res.json(updatedUser);
            });
        }
    );
});

// @route GET /api/users/all
// @desc Get all users (Admin only)
// @access Private/Admin
router.get('/all', protect, admin, (req, res) => {
    db.all(`SELECT id, name, email, role FROM users ORDER BY id DESC`, [], (err, users) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(users);
    });
});

module.exports = router;
