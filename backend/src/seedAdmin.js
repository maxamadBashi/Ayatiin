const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const { prisma } = require('./config/db');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        const email = 'moha33@gmail.com';
        const password = '123';
        const name = 'Super Admin';
        const role = 'superadmin';

        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        console.log(`Admin user created: ${user.email} / ${password}`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
