const { prisma } = require('../config/db');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Public (for currency/company name) or Private
const getSettings = async (req, res) => {
    try {
        let settings = await prisma.setting.findMany();
        if (settings.length === 0) {
            // Create default settings if none exist
            const defaultSettings = await prisma.setting.create({
                data: {
                    companyName: 'Ayatiin Property Management',
                    currency: 'USD',
                }
            });
            return res.json({ ...defaultSettings, _id: defaultSettings.id });
        }
        res.json({ ...settings[0], _id: settings[0].id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private (Admin/Superadmin)
const updateSettings = async (req, res) => {
    const { companyName, currency, paymentMethods } = req.body;
    try {
        let settings = await prisma.setting.findMany();
        let updatedSettings;

        if (settings.length === 0) {
            updatedSettings = await prisma.setting.create({
                data: {
                    companyName,
                    currency,
                    paymentMethods: paymentMethods ? JSON.stringify(paymentMethods) : null
                }
            });
        } else {
            updatedSettings = await prisma.setting.update({
                where: { id: settings[0].id },
                data: {
                    companyName,
                    currency,
                    paymentMethods: paymentMethods ? JSON.stringify(paymentMethods) : undefined
                }
            });
        }
        res.json({ ...updatedSettings, _id: updatedSettings.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
