const { prisma } = require('../config/db');

function makeAbsoluteImageUrls(images = [], req) {
    const base = (process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    return images.map(raw => {
        if (!raw) return raw;
        if (typeof raw !== 'string') return raw;
        const img = raw.trim();
        // Already absolute (http/https)
        if (/^https?:\/\//i.test(img)) return img;
        // Protocol-relative //example.com/image.jpg
        if (/^\/\//.test(img)) return `${req.protocol}:${img}`;
        // Already contains host (e.g., starts with backend URL)
        try {
            const parsed = new URL(img, base);
            // If img included a protocol or hostname, return as-is (URL resolved)
            if (parsed.protocol && parsed.hostname && !img.startsWith('/')) {
                return parsed.href;
            }
        } catch (e) {
            // ignore and continue to prefix
        }
        // Relative path: prefix with base
        if (img.startsWith('/')) return `${base}${img}`;
        return `${base}/${img}`;
    });
}

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
        // Map id to _id for frontend compatibility and make image URLs absolute
        const mappedProperties = properties.map(p => ({
            ...p,
            _id: p.id,
            images: makeAbsoluteImageUrls(p.images || [], req),
        }));
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
            res.json({ ...property, _id: property.id, images: makeAbsoluteImageUrls(property.images || [], req) });
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

        // Handle image uploads (Cloudinary or fallback local)
        let images = [];
        if (req.uploadedImages && req.uploadedImages.length > 0) {
            images = req.uploadedImages;
        } else if (req.files && req.files.length > 0) {
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

        res.status(201).json({ ...property, _id: property.id, images: makeAbsoluteImageUrls(property.images || [], req) });
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

        // Handle image uploads (Cloudinary or fallback local)
        let newImages = [];
        if (req.uploadedImages && req.uploadedImages.length > 0) {
            newImages = req.uploadedImages;
        } else if (req.files && req.files.length > 0) {
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

        res.json({ ...updatedProperty, _id: updatedProperty.id, images: makeAbsoluteImageUrls(updatedProperty.images || [], req) });
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
