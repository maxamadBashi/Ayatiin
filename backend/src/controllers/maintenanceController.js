const { prisma } = require('../config/db');

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private
const getMaintenanceRequests = async (req, res) => {
    try {
        const requests = await prisma.maintenance.findMany({
            include: {
                user: { select: { name: true } },
                // property/unit inclusion if needed, but in our schema Maintenance has propertyId/unitId
            }
        });
        // Map id to _id for frontend compatibility
        const mappedRequests = requests.map(r => ({ ...r, _id: r.id }));
        res.json(mappedRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a maintenance request
// @route   POST /api/maintenance
// @access  Private
const createMaintenanceRequest = async (req, res) => {
    const { property, unit, description, priority, issue } = req.body;

    try {
        const request = await prisma.maintenance.create({
            data: {
                propertyId: property,
                unitId: unit,
                userId: req.user.id, // Using authenticated user's ID
                issue: issue || 'General',
                description,
                priority: priority || 'medium',
            },
        });

        res.status(201).json({ ...request, _id: request.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a maintenance request
// @route   PUT /api/maintenance/:id
// @access  Private
const updateMaintenanceRequest = async (req, res) => {
    const { status, cost } = req.body;

    try {
        const request = await prisma.maintenance.findUnique({ where: { id: req.params.id } });

        if (request) {
            const updatedRequest = await prisma.maintenance.update({
                where: { id: req.params.id },
                data: {
                    status: status || request.status,
                    cost: cost ? parseFloat(cost) : request.cost,
                },
            });
            res.json({ ...updatedRequest, _id: updatedRequest.id });
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
        const request = await prisma.maintenance.findUnique({ where: { id: req.params.id } });

        if (request) {
            await prisma.maintenance.delete({ where: { id: req.params.id } });
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
        const requests = await prisma.maintenance.findMany({
            where: { userId: req.user.id },
            include: {
                // include property/unit if needed
            }
        });

        const mappedRequests = requests.map(r => ({ ...r, _id: r.id }));
        res.json(mappedRequests);
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
