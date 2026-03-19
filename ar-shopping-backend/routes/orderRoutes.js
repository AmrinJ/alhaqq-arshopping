const express = require('express');
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route POST /api/orders
// @desc Create new order
// @access Private
router.post('/', protect, (req, res) => {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    db.run(
        `INSERT INTO orders (user_id, total_price) VALUES (?, ?)`,
        [req.user.id, totalPrice],
        function(err) {
            if (err) return res.status(500).json({ message: err.message });
            
            const orderId = this.lastID;

            // Insert each order item
            const placeholders = orderItems.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
            const values = orderItems.flatMap(item => [
                orderId, item.product_id, item.quantity, item.size || null, item.color || null, item.price
            ]);

            db.run(
                `INSERT INTO order_items (order_id, product_id, quantity, size, color, price) VALUES ${placeholders}`,
                values,
                (err) => {
                    if (err) return res.status(500).json({ message: err.message });
                    res.status(201).json({ id: orderId, message: 'Order created successfully' });
                }
            );
        }
    );
});

// @route GET /api/orders/myorders
// @desc Get logged in user orders
// @access Private
router.get('/myorders', protect, (req, res) => {
    db.all(`SELECT * FROM orders WHERE user_id = ?`, [req.user.id], async (err, orders) => {
        if (err) return res.status(500).json({ message: err.message });

        for (let i = 0; i < orders.length; i++) {
            orders[i].orderItems = await new Promise((resolve, reject) => {
                db.all(`SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`, [orders[i].id], (err, items) => {
                    if (err) reject(err);
                    resolve(items);
                });
            });
        }

        res.json(orders);
    });
});

// @route GET /api/orders/all
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get('/all', protect, admin, (req, res) => {
    db.all(
        `SELECT o.*, u.name as user_name, u.email as user_email 
         FROM orders o 
         JOIN users u ON o.user_id = u.id 
         ORDER BY o.created_at DESC`, 
        async (err, orders) => {
            if (err) return res.status(500).json({ message: err.message });

            for (let i = 0; i < orders.length; i++) {
                orders[i].orderItems = await new Promise((resolve, reject) => {
                    db.all(
                        `SELECT oi.*, p.name as product_name, p.image_url 
                         FROM order_items oi 
                         JOIN products p ON oi.product_id = p.id 
                         WHERE oi.order_id = ?`, 
                        [orders[i].id], 
                        (err, items) => {
                            if (err) reject(err);
                            resolve(items);
                        }
                    );
                });
            }

            res.json(orders);
        }
    );
});

// @route PUT /api/orders/:id/tracking
// @desc Update order tracking status (Admin only)
// @access Private/Admin
router.put('/:id/tracking', protect, admin, (req, res) => {
    const { tracking_status, expected_delivery } = req.body;

    db.run(
        `UPDATE orders SET tracking_status = ?, expected_delivery = ? WHERE id = ?`,
        [tracking_status, expected_delivery || null, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ message: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Order not found' });
            res.json({ message: 'Tracking status updated successfully' });
        }
    );
});

// @route DELETE /api/orders/:id
// @desc Delete an order by ID (Only user who owns it)
// @access Private
router.delete('/:id', protect, (req, res) => {
    // First, verify the order belongs to this user
    db.get(`SELECT id FROM orders WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], (err, order) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!order) return res.status(404).json({ message: 'Order not found or unauthorized to delete' });

        // Delete associated order items first (due to typical foreign key constraints, though SQLite here might not strictly enforce unless enabled)
        db.run(`DELETE FROM order_items WHERE order_id = ?`, [req.params.id], function(err) {
            if (err) return res.status(500).json({ message: err.message });

            // Then delete the order itself
            db.run(`DELETE FROM orders WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id], function(err) {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ message: 'Order successfully removed from history' });
            });
        });
    });
});

module.exports = router;
