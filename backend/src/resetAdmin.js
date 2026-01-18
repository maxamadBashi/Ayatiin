const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const { prisma } = require('./config/db');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const resetAdmin = async () => {
    try {
        const email = 'moha33@gmail.com';
        const password = '123';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Find user
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Update password
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            });
            console.log(`Admin password updated to: ${password}`);
        } else {
            // Create if not exists
            user = await prisma.user.create({
                data: {
                    name: 'Super Admin',
                    email,
                    password: hashedPassword,
                    role: 'superadmin',
                },
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
