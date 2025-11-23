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
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    const { name, location, type, description, status, price, bedrooms, bathrooms } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    try {
        const propertyData = {
            name,
            location,
            type,
            description,
            status,
            images,
        };

        if (price) propertyData.price = price;
        if (bedrooms) propertyData.bedrooms = bedrooms;
        if (bathrooms) propertyData.bathrooms = bathrooms;

        const property = new Property(propertyData);

        const createdProperty = await property.save();
        res.status(201).json(createdProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res) => {
    const { name, location, type, description, status, price, bedrooms, bathrooms } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    try {
        const property = await Property.findById(req.params.id);

        if (property) {
            property.name = name || property.name;
            property.location = location || property.location;
            property.type = type || property.type;
            property.description = description || property.description;
            property.status = status || property.status;

            if (price) property.price = price;
            if (bedrooms) property.bedrooms = bedrooms;
            if (bathrooms) property.bathrooms = bathrooms;

            if (images.length > 0) {
                property.images = [...property.images, ...images];
            }

            const updatedProperty = await property.save();
            res.json(updatedProperty);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: error.message });
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
