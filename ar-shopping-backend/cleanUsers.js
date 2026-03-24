const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const cleanUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ar-shopping');
        
        console.log('Fetching all users...');
        const users = await User.find({});
        console.log(`Found ${users.length} users.`);
        
        const adminEmail = 'alhaqq@gmail.com';
        
        console.log(`Deleting all users except ${adminEmail}...`);
        const result = await User.deleteMany({ email: { $ne: adminEmail } });
        console.log(`Deleted ${result.deletedCount} non-admin users.`);
        
        const adminExists = await User.findOne({ email: adminEmail });
        if (adminExists) {
            console.log(`Admin user ${adminEmail} is still present.`);
        } else {
            console.log(`WARNING: Admin user ${adminEmail} not found! You may need to run ensureAdmin.js.`);
        }
        
        process.exit();
    } catch (error) {
        console.error(`Error cleaning users: ${error.message}`);
        process.exit(1);
    }
};

cleanUsers();
