const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');
const Property = require('../src/models/Property');
const Unit = require('../src/models/Unit');
const Tenant = require('../src/models/Tenant');
const Lease = require('../src/models/Lease');
const Payment = require('../src/models/Payment');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany();
        await Property.deleteMany();
        await Unit.deleteMany();
        await Tenant.deleteMany();
        await Lease.deleteMany();
        await Payment.deleteMany();

        console.log('Data cleared...');

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
        });

        const manager = await User.create({
            name: 'Manager User',
            email: 'manager@example.com',
            password: 'password123',
            role: 'manager',
        });

        console.log('Users created...');

        // Create Property
        const property = await Property.create({
            name: 'Sunrise Apartments',
            address: '123 Main St, Cityville',
            type: 'residential',
            units: [],
        });

        console.log('Property created...');

        // Create Units
        const unit1 = await Unit.create({
            property: property._id,
            unitNumber: '101',
            rentAmount: 1200,
            status: 'occupied',
            bedrooms: 2,
            bathrooms: 1,
        });

        const unit2 = await Unit.create({
            property: property._id,
            unitNumber: '102',
            rentAmount: 1200,
            status: 'available',
            bedrooms: 2,
            bathrooms: 1,
        });

        property.units.push(unit1._id, unit2._id);
        await property.save();

        console.log('Units created...');

        // Create Tenant
        const tenant = await Tenant.create({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-0101',
            status: 'active',
        });

        console.log('Tenant created...');

        // Create Lease
        const lease = await Lease.create({
            property: property._id,
            unit: unit1._id,
            tenant: tenant._id,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            rentAmount: 1200,
            status: 'active',
        });

        console.log('Lease created...');

        // Create Payment
        await Payment.create({
            lease: lease._id,
            tenant: tenant._id,
            amount: 1200,
            date: new Date(),
            type: 'rent',
            method: 'bank_transfer',
            receiptId: 'REC-' + Date.now(),
            status: 'paid',
        });

        console.log('Payment created...');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
