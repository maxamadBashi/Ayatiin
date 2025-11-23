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
    try {
        console.log('Creating property - Request body:', req.body);
        console.log('Files received:', req.files ? req.files.length : 0);

        const { name, location, type, description, status, price, bedrooms, bathrooms, size, dimensions } = req.body;

        // Validate required fields first
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Property name is required' });
        }
        if (!location || !location.trim()) {
            return res.status(400).json({ message: 'Location is required' });
        }

        // Handle image uploads - convert paths to relative URLs
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/${file.filename}`);
            console.log('Image paths:', images);
        }

        const propertyData = {
            name: name.trim(),
            location: location.trim(),
            type: type || 'Apartment',
            description: description?.trim() || '',
            status: status || 'available',
            size: size || '',
            dimensions: dimensions || '',
            images,
        };

        // Parse numeric fields
        if (price !== undefined && price !== null && price !== '') {
            propertyData.price = Number(price);
            if (isNaN(propertyData.price)) {
                return res.status(400).json({ message: 'Price must be a valid number' });
            }
        }
        if (bedrooms !== undefined && bedrooms !== null && bedrooms !== '') {
            propertyData.bedrooms = Number(bedrooms);
            if (isNaN(propertyData.bedrooms)) {
                return res.status(400).json({ message: 'Bedrooms must be a valid number' });
            }
        }
        if (bathrooms !== undefined && bathrooms !== null && bathrooms !== '') {
            propertyData.bathrooms = Number(bathrooms);
            if (isNaN(propertyData.bathrooms)) {
                return res.status(400).json({ message: 'Bathrooms must be a valid number' });
            }
        }

        console.log('Property data to save:', propertyData);

        const property = new Property(propertyData);
        const createdProperty = await property.save();

        console.log('Property created successfully:', createdProperty._id);
        res.status(201).json(createdProperty);
    } catch (error) {
        console.error('Error creating property:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({ message: messages });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Property with this name already exists' });
        }

        res.status(500).json({
            message: error.message || 'Error creating property',
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res) => {
    try {
        const { name, location, type, description, status, price, bedrooms, bathrooms, size, dimensions } = req.body;

        // Handle image uploads - convert paths to relative URLs
        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => `/uploads/${file.filename}`);
        }

        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Update fields
        if (name !== undefined) property.name = name.trim();
        if (location !== undefined) property.location = location.trim();
        if (type !== undefined) property.type = type;
        if (description !== undefined) property.description = description.trim();
        if (status !== undefined) property.status = status;
        if (size !== undefined) property.size = size;
        if (dimensions !== undefined) property.dimensions = dimensions;

        if (price !== undefined) property.price = Number(price);
        if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
        if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);

        // Add new images to existing ones
        if (newImages.length > 0) {
            property.images = [...(property.images || []), ...newImages];
        }

        const updatedProperty = await property.save();
        res.json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({ message: messages });
        }

        res.status(500).json({
            message: error.message || 'Error updating property',
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
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
