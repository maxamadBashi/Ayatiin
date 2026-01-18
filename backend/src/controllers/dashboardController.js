const { prisma } = require('../config/db');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin/Manager/Superadmin)
const getDashboardStats = async (req, res) => {
    try {
        const totalProperties = await prisma.property.count();
        const availableProperties = await prisma.property.count({ where: { status: 'available' } });
        const rentedProperties = await prisma.property.count({ where: { status: 'rented' } });
        const soldProperties = await prisma.property.count({ where: { status: 'sold' } });

        const totalTenants = await prisma.tenant.count();
        const totalCustomers = await prisma.user.count({ where: { role: 'customer' } });

        const totalUnits = await prisma.unit.count();
        const occupiedUnits = await prisma.unit.count({ where: { status: 'occupied' } });

        const maintenanceRequests = await prisma.maintenance.count({ where: { status: 'pending' } });
        const customerRequests = await prisma.request.count({ where: { status: 'pending' } });

        const landProperties = await prisma.property.count({
            where: {
                type: { in: ['Land', 'Land for Sale', 'Commercial Land', 'Residential Land', 'Farm Land', 'Investment Land'] }
            }
        });

        // Financial Stats
        const incomeResult = await prisma.payment.findMany({ where: { status: 'paid' } });
        const totalIncome = incomeResult.reduce((sum, p) => sum + p.amount, 0);

        const expenseResult = await prisma.expense.findMany();
        const totalExpenses = expenseResult.reduce((sum, e) => sum + e.amount, 0);

        // Monthly Stats (Simple implementation for now)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyIncome = incomeResult
            .filter(p => new Date(p.paymentDate) >= startOfMonth)
            .reduce((sum, p) => sum + p.amount, 0);

        const monthlyExpenses = expenseResult
            .filter(e => new Date(e.date) >= startOfMonth)
            .reduce((sum, e) => sum + e.amount, 0);

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
            landProperties,
            totalIncome,
            totalExpenses,
            profit: totalIncome - totalExpenses,
            monthlyIncome,
            monthlyExpenses,
            monthlyProfit: monthlyIncome - monthlyExpenses
        });
    } catch (error) {
        console.error('DASHBOARD STATS ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
