const { prisma } = require('../config/db');

// @desc    Get all units
// @route   GET /api/units
// @access  Private
const getUnits = async (req, res) => {
    try {
        const { status } = req.query;
        const where = status ? { status } : {};
        const units = await prisma.unit.findMany({
            where,
            include: {
                property: {
                    select: { name: true }
                }
            }
        });
        // Map id to _id for frontend compatibility
        const mappedUnits = units.map(u => ({ ...u, _id: u.id }));
        res.json(mappedUnits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a unit
// @route   POST /api/units
// @access  Private/Admin
const createUnit = async (req, res) => {
    const { property, unitNumber, type, rentAmount, status, description } = req.body;

    try {
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

        res.status(201).json({ ...unit, _id: unit.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a unit
// @route   PUT /api/units/:id
// @access  Private/Admin
const updateUnit = async (req, res) => {
    const { property, unitNumber, type, rentAmount, status, description } = req.body;

    try {
        const unit = await prisma.unit.findUnique({ where: { id: req.params.id } });

        if (unit) {
            const updateData = {};
            if (property) updateData.propertyId = property;
            if (unitNumber) updateData.unitNumber = unitNumber;
            if (type) updateData.type = type;
            if (rentAmount) updateData.rentAmount = parseFloat(rentAmount);
            if (status) updateData.status = status;
            if (description !== undefined) updateData.description = description;

            const updatedUnit = await prisma.unit.update({
                where: { id: req.params.id },
                data: updateData,
            });
            res.json({ ...updatedUnit, _id: updatedUnit.id });
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a unit
// @route   DELETE /api/units/:id
// @access  Private/Admin
const deleteUnit = async (req, res) => {
    try {
        const unit = await prisma.unit.findUnique({ where: { id: req.params.id } });

        if (unit) {
            await prisma.unit.delete({ where: { id: req.params.id } });
            res.json({ message: 'Unit removed' });
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
};
