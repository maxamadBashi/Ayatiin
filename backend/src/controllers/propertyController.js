const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Private
const getProperties = async (req, res) => {
    try {
        const properties = await Property.find({});
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Private
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res) => {
    const { name, location, description } = req.body;

    try {
        const property = new Property({
            name,
            location,
            description,
        });

        const createdProperty = await property.save();
        res.status(201).json(createdProperty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res) => {
    const { name, location, description } = req.body;

    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            property.name = name || property.name;
            property.location = location || property.location;
            property.description = description || property.description;

            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            await property.deleteOne();
            res.json({ message: 'Property removed' });
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};
