const express = require('express');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/orders
// @desc Create new order
// @access Private
router.post('/', protect, async (req, res) => {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    try {
        const order = new Order({
            user: req.user.id,
            orderItems,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json({ id: createdOrder._id, message: 'Order created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/orders/myorders
// @desc Get logged in user orders
// @access Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders.map(o => ({
            id: o._id,
            total_price: o.totalPrice,
            status: o.status,
            tracking_status: o.trackingStatus,
            expected_delivery: o.expectedDelivery,
            created_at: o.createdAt,
            orderItems: o.orderItems
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/orders/all
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get('/all', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders.map(o => ({
            id: o._id,
            user_id: o.user ? o.user._id : null,
            user_name: o.user ? o.user.name : 'Unknown User',
            user_email: o.user ? o.user.email : 'Unknown Email',
            total_price: o.totalPrice,
            status: o.status,
            tracking_status: o.trackingStatus,
            expected_delivery: o.expectedDelivery,
            created_at: o.createdAt,
            orderItems: o.orderItems
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/orders/:id/tracking
// @desc Update order tracking status (Admin only)
// @access Private/Admin
router.put('/:id/tracking', protect, admin, async (req, res) => {
    const { tracking_status, expected_delivery } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.trackingStatus = tracking_status || order.trackingStatus;
            order.expectedDelivery = expected_delivery || order.expectedDelivery;

            await order.save();
            res.json({ message: 'Tracking status updated successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/orders/:id
// @desc Delete an order by ID (Only user who owns it)
// @access Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.user.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized to delete this order' });
            }
            await order.deleteOne();
            res.json({ message: 'Order successfully removed from history' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
