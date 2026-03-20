const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const products = [
    {
        name: 'Classic White T-Shirt',
        description: 'A comfortable classic white t-shirt made from 100% organic cotton.',
        category: 'T-Shirts',
        price: 25.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White'],
        fabric: '100% Cotton',
        image_url: '/uploads/white-tshirt.jpg',
        stock: 100
    },
    {
        name: 'Slim Fit Blue Jeans',
        description: 'Premium slim fit blue jeans with a slight stretch for comfort.',
        category: 'Jeans',
        price: 59.99,
        sizes: ['30', '32', '34', '36'],
        colors: ['Blue'],
        fabric: '98% Cotton, 2% Elastane',
        image_url: '/uploads/blue-jeans.jpg',
        stock: 50
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ar-shopping');
        
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        console.log('Seeding products...');
        await Product.insertMany(products);

        console.log('Data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
