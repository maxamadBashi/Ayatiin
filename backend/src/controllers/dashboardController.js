const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const Unit = require('../models/Unit');
const Maintenance = require('../models/Maintenance');
const Request = require('../models/Request');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin/Manager/Superadmin)
const getDashboardStats = async (req, res) => {
    try {
        const totalProperties = await Property.countDocuments();
        const availableProperties = await Property.countDocuments({ status: 'available' });
        const rentedProperties = await Property.countDocuments({ status: 'rented' });
        const soldProperties = await Property.countDocuments({ status: 'sold' });

        const totalTenants = await Tenant.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        const totalUnits = await Unit.countDocuments();
        const occupiedUnits = await Unit.countDocuments({ status: 'occupied' });

        const maintenanceRequests = await Maintenance.countDocuments({ status: 'pending' });
        const customerRequests = await Request.countDocuments({ status: 'pending' });

        res.json({
            totalProperties,
            availableProperties,
            rentedProperties,
            soldProperties,
            totalTenants,
            totalCustomers,
            totalUnits,
            occupiedUnits,
            availableUnits: totalUnits - occupiedUnits,
            maintenanceRequests,
            customerRequests,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
