const { prisma } = require('../config/db');

// @desc    Get all units
// @route   GET /api/units
// @access  Private
const getUnits = async (req, res) => {
    try {
        const { status } = req.query;
        const where = status ? { status } : {};

        // 1. Fetch units
        const units = await prisma.unit.findMany({ where });

        // 2. Fetch all properties
        const properties = await prisma.property.findMany();

        // 3. Manually Join Property Data
        const mappedUnits = units.map(u => {
            const property = properties.find(p => p.id === u.propertyId);
            return {
                ...u,
                _id: u.id,
                property: property || null // Attach property object
            };
        });

        console.log('Backend: Fetched Units (manual property join):', mappedUnits.length); // DEBUG LOG
        res.json(mappedUnits);
    } catch (error) {
        console.error('Backend Error: getUnits - Full Error:', error); // DEBUG LOG
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a unit
// @route   POST /api/units
// @access  Private/Admin
const createUnit = async (req, res) => {
    const { property, unitNumber, type, rentAmount, status, description } = req.body;
    console.log('Backend: Create Unit request body:', JSON.stringify(req.body, null, 2)); // DEBUG LOG

    try {
        // Validate property exists
        const propertyExists = await prisma.property.findUnique({ where: { id: property } });
        if (!propertyExists) {
            console.error('Backend: Property not found for ID:', property); // DEBUG LOG
            return res.status(404).json({ message: 'Property not found' });
        }

        const unit = await prisma.unit.create({
            data: {
                propertyId: property, // Assuming property field in request body is the ID
                unitNumber,
                type,
                rentAmount: parseFloat(rentAmount),
                status: status || 'available',
                description,
            },
        });
        console.log('Backend: Unit created:', JSON.stringify(unit, null, 2)); // DEBUG LOG

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'CREATE_UNIT',
                details: `Created unit: ${unit.unitNumber} in property ${propertyExists.name} (${unit.id})`
            }
        });

        res.status(201).json({ ...unit, _id: unit.id });
    } catch (error) {
        console.error('Backend Error: createUnit - Full Error:', error); // DEBUG LOG
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a unit
// @route   PUT /api/units/:id
// @access  Private/Admin
const updateUnit = async (req, res) => {
    const { property, unitNumber, type, rentAmount, status, description } = req.body;
    console.log('Backend: Update Unit request body:', JSON.stringify(req.body, null, 2)); // DEBUG LOG
    console.log('Backend: Unit ID from params:', req.params.id); // DEBUG LOG

    try {
        const unit = await prisma.unit.findUnique({ where: { id: req.params.id } });

        if (unit) {
            console.log('Backend: Found existing unit for update:', JSON.stringify(unit, null, 2)); // DEBUG LOG
            const updateData = {};
            if (property) {
                // Validate property exists if it's being updated
                const propertyExists = await prisma.property.findUnique({ where: { id: property } });
                if (!propertyExists) {
                    console.error('Backend: Property not found for ID during unit update:', property); // DEBUG LOG
                    return res.status(404).json({ message: 'Property not found' });
                }
                updateData.propertyId = property;
            }
            if (unitNumber) updateData.unitNumber = unitNumber;
            if (type) updateData.type = type;
            if (rentAmount) updateData.rentAmount = parseFloat(rentAmount);
            if (status) updateData.status = status;
            if (description !== undefined) updateData.description = description;

            const updatedUnit = await prisma.unit.update({
                where: { id: req.params.id },
                data: updateData,
            });
            console.log('Backend: Unit updated:', JSON.stringify(updatedUnit, null, 2)); // DEBUG LOG

            // Audit Log
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'UPDATE_UNIT',
                    details: `Updated unit: ${updatedUnit.unitNumber} (${updatedUnit.id})`
                }
            });

            res.json({ ...updatedUnit, _id: updatedUnit.id });
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        console.error('Backend Error: updateUnit - Full Error:', error); // DEBUG LOG
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a unit
// @route   DELETE /api/units/:id
// @access  Private/Admin
const deleteUnit = async (req, res) => {
    console.log('Backend: Delete Unit request for ID:', req.params.id); // DEBUG LOG
    try {
        const unit = await prisma.unit.findUnique({ where: { id: req.params.id } });

        if (unit) {
            // Check if the unit is currently part of any active lease
            const activeLeasesCount = await prisma.lease.count({
                where: { unitId: req.params.id, status: 'active' }
            });

            if (activeLeasesCount > 0) {
                console.log('Backend: Cannot delete an occupied unit (active leases exist).'); // DEBUG LOG
                return res.status(400).json({ message: 'Cannot delete an occupied unit with active leases' });
            }

            await prisma.unit.delete({ where: { id: req.params.id } });
            console.log('Backend: Unit deleted successfully:', unit.id); // DEBUG LOG

            // Audit Log
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'DELETE_UNIT',
                    details: `Deleted unit: ${unit.unitNumber} (${unit.id})`
                }
            });

            res.json({ message: 'Unit removed' });
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        console.error('Backend Error: deleteUnit - Full Error:', error); // DEBUG LOG
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
};
