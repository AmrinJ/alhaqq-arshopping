const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// @route GET /api/products
// @desc Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products.map(p => ({
            id: p._id,
            name: p.name,
            description: p.description,
            category: p.category,
            price: p.price,
            sizes: p.sizes,
            colors: p.colors,
            fabric: p.fabric,
            image_url: p.image_url,
            ar_model_url: p.ar_model_url,
            stock: p.stock
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/products/:id
// @desc Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json({
                id: product._id,
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                sizes: product.sizes,
                colors: product.colors,
                fabric: product.fabric,
                image_url: product.image_url,
                ar_model_url: product.ar_model_url,
                stock: product.stock
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/products
// @desc Create a product
// @access Private/Admin
router.post('/', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ar_model', maxCount: 1 }]), async (req, res) => {
    const { name, description, category, price, sizes, colors, fabric, stock } = req.body;
    
    try {
        // Handle sizes and colors from form-data (might be JSON string)
        let parsedSizes = [];
        let parsedColors = [];
        try {
            parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [];
            parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors || [];
        } catch (e) {
            parsedSizes = sizes ? [sizes] : [];
            parsedColors = colors ? [colors] : [];
        }

        const image_url = req.files && req.files.image ? `/uploads/${req.files.image[0].filename}` : null;
        const ar_model_url = req.files && req.files.ar_model ? `/uploads/${req.files.ar_model[0].filename}` : null;

        const product = new Product({
            name,
            description,
            category,
            price: price || 0,
            sizes: parsedSizes,
            colors: parsedColors,
            fabric,
            image_url,
            ar_model_url,
            stock: stock || 0
        });

        const createdProduct = await product.save();
        res.status(201).json({
            id: createdProduct._id,
            ...createdProduct._doc
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/products/:id
// @desc Update a product
// @access Private/Admin
router.put('/:id', protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'ar_model', maxCount: 1 }]), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const { name, description, category, price, sizes, colors, fabric, stock } = req.body;

            product.name = name || product.name;
            product.description = description || product.description;
            product.category = category || product.category;
            product.price = price || product.price;
            product.fabric = fabric || product.fabric;
            product.stock = stock || product.stock;

            if (sizes) {
                try {
                    product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
                } catch (e) {
                    product.sizes = [sizes];
                }
            }
            if (colors) {
                try {
                    product.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
                } catch (e) {
                    product.colors = [colors];
                }
            }

            if (req.files && req.files.image) {
                product.image_url = `/uploads/${req.files.image[0].filename}`;
            }
            if (req.files && req.files.ar_model) {
                product.ar_model_url = `/uploads/${req.files.ar_model[0].filename}`;
            }

            const updatedProduct = await product.save();
            res.json({ message: 'Product updated successfully', product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/products/:id
// @desc Delete a product
// @access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
