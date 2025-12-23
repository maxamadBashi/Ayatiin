const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const resetAdmin = async () => {
    try {
        await connectDB();

        const email = 'moha33@gmail.com';
        const password = '123';

        // Find user
        let user = await User.findOne({ email });

        if (user) {
            // Update password
            // Note: User model likely has pre-save hook to hash password, 
            // but if we use findOneAndUpdate it might bypass it depending on implementation.
            // Safer to fetch, set, and save.
            user.password = password;
            await user.save();
            console.log(`Admin password updated to: ${password}`);
        } else {
            // Create if not exists
            user = await User.create({
                name: 'Super Admin',
                email,
                password,
                role: 'superadmin',
            });
            console.log(`Admin user created with password: ${password}`);
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetAdmin();
