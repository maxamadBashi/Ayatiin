const Maintenance = require('../models/Maintenance');
const Tenant = require('../models/Tenant');

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private
const getMaintenanceRequests = async (req, res) => {
    try {
        const requests = await Maintenance.find({})
            .populate('property', 'name')
            .populate('unit', 'unitNumber')
            .populate('tenant', 'name');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a maintenance request
// @route   POST /api/maintenance
// @access  Private
const createMaintenanceRequest = async (req, res) => {
    const { property, unit, tenant, description, priority } = req.body;

    try {
        const request = new Maintenance({
            property,
            unit,
            tenant,
            description,
            priority,
        });

        const createdRequest = await request.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a maintenance request
// @route   PUT /api/maintenance/:id
// @access  Private
const updateMaintenanceRequest = async (req, res) => {
    const { status, cost, assignedTo } = req.body;

    try {
        const request = await Maintenance.findById(req.params.id);

        if (request) {
            request.status = status || request.status;
            request.cost = cost || request.cost;
            request.assignedTo = assignedTo || request.assignedTo;

            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Maintenance request not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a maintenance request
// @route   DELETE /api/maintenance/:id
// @access  Private
const deleteMaintenanceRequest = async (req, res) => {
    try {
        const request = await Maintenance.findById(req.params.id);

        if (request) {
            await request.deleteOne();
            res.json({ message: 'Maintenance request removed' });
        } else {
            res.status(404).json({ message: 'Maintenance request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's maintenance requests
// @route   GET /api/maintenance/my
// @access  Private (Customer)
const getMyMaintenanceRequests = async (req, res) => {
    try {
        // Find tenant by user's email
        const tenant = await Tenant.findOne({ email: req.user.email });

        if (!tenant) {
            return res.json([]); // Return empty if user is not a tenant
        }

        const requests = await Maintenance.find({ tenant: tenant._id })
            .populate('property', 'name')
            .populate('unit', 'unitNumber');

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    deleteMaintenanceRequest,
    getMyMaintenanceRequests,
};
