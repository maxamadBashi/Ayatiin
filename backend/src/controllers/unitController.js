const Unit = require('../models/Unit');

// @desc    Get all units
// @route   GET /api/units
// @access  Private
const getUnits = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const units = await Unit.find(query).populate('property', 'name');
        res.json(units);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a unit
// @route   POST /api/units
// @access  Private/Admin
const createUnit = async (req, res) => {
    const { property, unitNumber, type, rentAmount, status, bedrooms, bathrooms, size, floor, features } = req.body;

    try {
        const unit = new Unit({
            property,
            unitNumber,
            type,
            rentAmount,
            status,
            bedrooms,
            bathrooms,
            size,
            floor,
            features,
        });

        const createdUnit = await unit.save();
        res.status(201).json(createdUnit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a unit
// @route   PUT /api/units/:id
// @access  Private/Admin
const updateUnit = async (req, res) => {
    const { property, unitNumber, type, rentAmount, status, bedrooms, bathrooms, size, floor, features } = req.body;

    try {
        const unit = await Unit.findById(req.params.id);

        if (unit) {
            unit.property = property || unit.property;
            unit.unitNumber = unitNumber || unit.unitNumber;
            unit.type = type || unit.type;
            unit.rentAmount = rentAmount || unit.rentAmount;
            unit.status = status || unit.status;
            unit.bedrooms = bedrooms || unit.bedrooms;
            unit.bathrooms = bathrooms || unit.bathrooms;
            unit.size = size || unit.size;
            unit.floor = floor || unit.floor;
            unit.features = features || unit.features;

            const updatedUnit = await unit.save();
            res.json(updatedUnit);
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
        const unit = await Unit.findById(req.params.id);

        if (unit) {
            await unit.deleteOne();
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
