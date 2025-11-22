const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const unitRoutes = require('./routes/unitRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const leaseRoutes = require('./routes/leaseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Dashboard Stats Route (Simple implementation for now)
app.get('/api/dashboard/stats', async (req, res) => {
    // This would ideally be in a controller
    const Property = require('./models/Property');
    const Tenant = require('./models/Tenant');
    const Unit = require('./models/Unit');
    const Maintenance = require('./models/Maintenance');

    try {
        const totalProperties = await Property.countDocuments();
        const totalTenants = await Tenant.countDocuments();
        const totalUnits = await Unit.countDocuments();
        const occupiedUnits = await Unit.countDocuments({ status: 'occupied' });
        const maintenanceRequests = await Maintenance.countDocuments({ status: 'pending' });

        res.json({
            totalProperties,
            totalTenants,
            totalUnits,
            occupiedUnits,
            availableUnits: totalUnits - occupiedUnits,
            maintenanceRequests,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
