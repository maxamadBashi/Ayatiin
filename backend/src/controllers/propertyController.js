const { prisma } = require('../config/db');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Private
const getProperties = async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            include: {
                units: true
            }
        });
        // Map id to _id for frontend compatibility
        const mappedProperties = properties.map(p => ({ ...p, _id: p.id }));
        res.json(mappedProperties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Private
const getPropertyById = async (req, res) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
            include: {
                units: true
            }
        });
        if (property) {
            res.json({ ...property, _id: property.id });
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
        const { name, location, type, description, status, price, bedrooms, bathrooms, size, dimensions } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Property name is required' });
        }
        if (!location || !location.trim()) {
            return res.status(400).json({ message: 'Location is required' });
        }

        // Validate property type
        const validTypes = [
            'Apartment',
            'House',
            'Villa',
            'Land',
            'Commercial',
            'Land for Sale',
            'Commercial Land',
            'Residential Land',
            'Farm Land',
            'Investment Land'
        ];

        if (type && !validTypes.includes(type)) {
            return res.status(400).json({
                message: `Invalid property type. Allowed types are: ${validTypes.join(', ')}`,
                received: type
            });
        }

        // Handle image uploads
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const property = await prisma.property.create({
            data: {
                name: name.trim(),
                location: location.trim(),
                type: type || 'Apartment',
                description: description?.trim() || '',
                status: status || 'available',
                size: size || '',
                dimensions: dimensions || '',
                price: price ? parseFloat(price) : null,
                bedrooms: bedrooms ? parseInt(bedrooms) : null,
                bathrooms: bathrooms ? parseInt(bathrooms) : null,
                images,
            },
        });

        res.status(201).json({ ...property, _id: property.id });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({
            message: error.message || 'Error creating property'
        });
    }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res) => {
    try {
        const { name, location, type, description, status, price, bedrooms, bathrooms, size, dimensions } = req.body;

        // Handle image uploads
        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => `/uploads/${file.filename}`);
        }

        const property = await prisma.property.findUnique({ where: { id: req.params.id } });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (location !== undefined) updateData.location = location.trim();
        if (type !== undefined) updateData.type = type;
        if (description !== undefined) updateData.description = description.trim();
        if (status !== undefined) updateData.status = status;
        if (size !== undefined) updateData.size = size;
        if (dimensions !== undefined) updateData.dimensions = dimensions;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (bedrooms !== undefined) updateData.bedrooms = parseInt(bedrooms);
        if (bathrooms !== undefined) updateData.bathrooms = parseInt(bathrooms);

        if (newImages.length > 0) {
            updateData.images = [...(property.images || []), ...newImages];
        }

        const updatedProperty = await prisma.property.update({
            where: { id: req.params.id },
            data: updateData,
        });

        res.json({ ...updatedProperty, _id: updatedProperty.id });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({
            message: error.message || 'Error updating property'
        });
    }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
    try {
        const property = await prisma.property.findUnique({ where: { id: req.params.id } });

        if (property) {
            await prisma.property.delete({ where: { id: req.params.id } });
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
