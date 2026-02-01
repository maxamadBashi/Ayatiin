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
        if (unit) {
            const unitData = await prisma.unit.findUnique({ where: { id: unit } });
            if (unitData && unitData.status === 'available') {
                await prisma.unit.update({
                    where: { id: unit },
                    data: { status: 'maintenance' }
                });
            }
        }

        const request = await prisma.maintenance.create({
            data: {
                propertyId: property,
                unitId: unit,
                userId: req.user.id,
                issue: issue || 'General',
                description,
                priority: priority || 'medium',
            },
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'CREATE_MAINTENANCE',
                details: `Created maintenance request: ${request.issue} (${request.id})`
            }
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
            if (request.status === 'closed' || request.status === 'completed') {
                return res.status(400).json({ message: 'Cannot update a closed maintenance request' });
            }

            const updatedRequest = await prisma.maintenance.update({
                where: { id: req.params.id },
                data: {
                    status: status || request.status,
                    cost: cost ? parseFloat(cost) : request.cost,
                },
            });

            // If status becomes closed, and it was a unit maintenance, set unit to available if it was in maintenance
            if ((status === 'closed' || status === 'completed') && request.unitId) {
                const unitData = await prisma.unit.findUnique({ where: { id: request.unitId } });
                if (unitData && unitData.status === 'maintenance') {
                    await prisma.unit.update({
                        where: { id: request.unitId },
                        data: { status: 'available' }
                    });
                }
            }

            // Audit Log
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'UPDATE_MAINTENANCE',
                    details: `Updated maintenance request: ${updatedRequest.id} (Status: ${status})`
                }
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

            // Audit Log
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'DELETE_MAINTENANCE',
                    details: `Deleted maintenance request: ${request.id}`
                }
            });

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
