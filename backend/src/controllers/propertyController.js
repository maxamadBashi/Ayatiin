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
        const { name, type, address, city, ownerName, description, status, location } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Property name is required' });
        }
        if (!city || !city.trim()) {
            return res.status(400).json({ message: 'City is required' });
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
                type: type || 'Apartment',
                address: address?.trim() || '',
                city: city.trim(),
                ownerName: ownerName?.trim() || '',
                location: location?.trim() || address?.trim() || '',
                description: description?.trim() || '',
                status: status || 'available',
                images,
            },
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'CREATE_PROPERTY',
                details: `Created property: ${property.name} (${property.id})`
            }
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
        const { name, type, address, city, ownerName, description, status, location } = req.body;

        // Handle image uploads
        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => `/uploads/${file.filename}`);
        }

        const property = await prisma.property.findUnique({ where: { id: req.params.id } });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (status !== undefined && status === 'inactive') {
            const occupiedUnits = await prisma.unit.count({
                where: {
                    propertyId: req.params.id,
                    status: 'occupied'
                }
            });
            if (occupiedUnits > 0) {
                return res.status(400).json({ message: 'Cannot set property to inactive while units are occupied' });
            }
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (type !== undefined) updateData.type = type;
        if (address !== undefined) updateData.address = address.trim();
        if (city !== undefined) updateData.city = city.trim();
        if (ownerName !== undefined) updateData.ownerName = ownerName.trim();
        if (location !== undefined) updateData.location = location.trim();
        else if (address !== undefined) updateData.location = address.trim();

        if (description !== undefined) updateData.description = description.trim();
        if (status !== undefined) updateData.status = status;

        if (newImages.length > 0) {
            updateData.images = [...(property.images || []), ...newImages];
        }

        const updatedProperty = await prisma.property.update({
            where: { id: req.params.id },
            data: updateData,
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'UPDATE_PROPERTY',
                details: `Updated property: ${updatedProperty.name} (${updatedProperty.id})`
            }
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
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
            include: { units: true }
        });

        if (property) {
            const unitCount = await prisma.unit.count({ where: { propertyId: req.params.id } });
            if (unitCount > 0) {
                return res.status(400).json({ message: 'Cannot delete property with existing units' });
            }

            await prisma.property.delete({ where: { id: req.params.id } });

            // Audit Log
            await prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'DELETE_PROPERTY',
                    details: `Deleted property: ${property.name} (${property.id})`
                }
            });

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
