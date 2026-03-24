const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const showData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ar-shopping');
        console.log('--- Database Preview ---\n');

        const usersCount = await User.countDocuments();
        console.log(`Users (${usersCount}):`);
        const users = await User.find().limit(5);
        users.forEach(u => console.log(` - ${u.name} (${u.email}) [Role: ${u.role}]`));

        const productsCount = await Product.countDocuments();
        console.log(`\nProducts (${productsCount}):`);
        const products = await Product.find().limit(5);
        products.forEach(p => console.log(` - ${p.name} ($${p.price}) [Category: ${p.category}]`));

        const ordersCount = await Order.countDocuments();
        console.log(`\nOrders (${ordersCount}):`);
        const orders = await Order.find().limit(5).populate('user', 'name email');
        orders.forEach(o => console.log(` - Order ID: ${o._id} [Status: ${o.status}, Total: $${o.totalPrice}]`));

        console.log('\n--- End of Preview ---');
        process.exit(0);
    } catch (error) {
        console.error('Error viewing data:', error);
        process.exit(1);
    }
};

showData();
