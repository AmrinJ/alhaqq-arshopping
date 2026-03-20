const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                street: user.street,
                city: user.city,
                state: user.state,
                zip: user.zip
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.street = req.body.street || user.street;
            user.city = req.body.city || user.city;
            user.state = req.body.state || user.state;
            user.zip = req.body.zip || user.zip;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                street: updatedUser.street,
                city: updatedUser.city,
                state: updatedUser.state,
                zip: updatedUser.zip
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/users/all
// @desc Get all users (Admin only)
// @access Private/Admin
router.get('/all', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
