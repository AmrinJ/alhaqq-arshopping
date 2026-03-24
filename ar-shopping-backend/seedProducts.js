const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Atlas for seeding...');

        const products = [
            {
                name: 'Classic Boys Tee',
                description: 'A comfortable cotton t-shirt for boys.',
                category: 'Boys T-Shirts',
                price: 799,
                stock: 50,
                sizes: ['S', 'M', 'L'],
                image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400'
            },
            {
                name: 'Elegant Girls Top',
                description: 'Stylish and soft t-shirt for girls.',
                category: 'Girls T-Shirts',
                price: 899,
                stock: 45,
                sizes: ['S', 'M', 'L'],
                image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400'
            },
            {
                name: 'Modern Unisex Shirt',
                description: 'Versatile unisex t-shirt for everyone.',
                category: 'Unisex T-Shirts',
                price: 999,
                stock: 60,
                sizes: ['M', 'L', 'XL'],
                image_url: 'https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?q=80&w=400'
            },
            {
                name: 'Premium Black Hoodie',
                description: 'Warm and cozy premium hoodie.',
                category: 'Hoodies',
                price: 1499,
                stock: 30,
                sizes: ['M', 'L', 'XL', 'XXL'],
                image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400'
            }
        ];

        console.log('Seeding products...');
        await Product.insertMany(products);
        console.log('Sample products seeded successfully!');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
