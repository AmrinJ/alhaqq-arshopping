const express = require('express');
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// @route GET /api/products
// @desc Get all products
router.get('/', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, products) => {
        if (err) return res.status(500).json({ message: err.message });
        
        // Parse JSON strings back to arrays
        const parsedProducts = products.map(p => ({
            ...p,
            sizes: p.sizes ? JSON.parse(p.sizes) : [],
            colors: p.colors ? JSON.parse(p.colors) : []
        }));
        
        res.json(parsedProducts);
    });
});

// @route GET /api/products/:id
// @desc Get single product
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, product) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        product.sizes = product.sizes ? JSON.parse(product.sizes) : [];
        product.colors = product.colors ? JSON.parse(product.colors) : [];
        
        res.json(product);
    });
});

// @route POST /api/products
// @desc Create a product
// @access Private/Admin
router.post('/', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ar_model', maxCount: 1 }]), (req, res) => {
    const { name, description, category, price, sizes, colors, fabric, stock } = req.body;
    
    // sizes and colors usually come as JSON strings in form data
    const sizesStr = sizes || '[]';
    const colorsStr = colors || '[]';
    
    const image_url = req.files && req.files.image ? `/uploads/${req.files.image[0].filename}` : null;
    const ar_model_url = req.files && req.files.ar_model ? `/uploads/${req.files.ar_model[0].filename}` : null;

    db.run(
        `INSERT INTO products (name, description, category, price, sizes, colors, fabric, image_url, ar_model_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, description, category || null, price || 0, sizesStr, colorsStr, fabric, image_url, ar_model_url, stock || 0],
        function(err) {
            if (err) return res.status(500).json({ message: err.message });
            
            res.status(201).json({
                id: this.lastID,
                name, description, category, price, sizes: JSON.parse(sizesStr), colors: JSON.parse(colorsStr),
                fabric, image_url, ar_model_url, stock
            });
        }
    );
});

// @route PUT /api/products/:id
// @desc Update a product
// @access Private/Admin
router.put('/:id', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ar_model', maxCount: 1 }]), (req, res) => {
    const { name, description, category, price, sizes, colors, fabric, stock } = req.body;
    
    // Check if product exists first to keep old images if not provided
    db.get(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, product) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const sizesStr = sizes || product.sizes;
        const colorsStr = colors || product.colors;
        const finalFabric = fabric || product.fabric;
        const finalDesc = description || product.description;
        const finalCategory = category || product.category;
        
        const image_url = req.files && req.files.image ? `/uploads/${req.files.image[0].filename}` : product.image_url;
        const ar_model_url = req.files && req.files.ar_model ? `/uploads/${req.files.ar_model[0].filename}` : product.ar_model_url;

        db.run(
            `UPDATE products SET name = ?, description = ?, category = ?, price = ?, sizes = ?, colors = ?, fabric = ?, image_url = ?, ar_model_url = ?, stock = ? WHERE id = ?`,
            [name || product.name, finalDesc, finalCategory, price || product.price, sizesStr, colorsStr, finalFabric, image_url, ar_model_url, stock || product.stock, req.params.id],
            function(err) {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ message: 'Product updated successfully' });
            }
        );
    });
});

// @route DELETE /api/products/:id
// @desc Delete a product
// @access Private/Admin
router.delete('/:id', protect, admin, (req, res) => {
    db.run(`DELETE FROM products WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: 'Product removed' });
    });
});

module.exports = router;
