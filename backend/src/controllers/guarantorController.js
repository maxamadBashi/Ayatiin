const { prisma } = require('../config/db');
const path = require('path');
const fs = require('fs');
const { uploadBuffer, isConfigured } = require('../config/cloudinary');

// @desc    Get all guarantors
// @route   GET /api/guarantors
// @access  Private
const getGuarantors = async (req, res) => {
    try {
        const guarantors = await prisma.guarantor.findMany({
            include: {
                leases: {
                    include: {
                        unit: { include: { property: true } },
                        tenant: true
                    }
                }
            }
        });
        res.json(guarantors.map(g => ({ ...g, _id: g.id })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single guarantor
// @route   GET /api/guarantors/:id
// @access  Private
const getGuarantor = async (req, res) => {
    try {
        const guarantor = await prisma.guarantor.findUnique({
            where: { id: req.params.id },
            include: {
                leases: {
                    include: {
                        unit: { include: { property: true } },
                        tenant: true
                    }
                }
            }
        });
        if (guarantor) {
            res.json({ ...guarantor, _id: guarantor.id });
        } else {
            res.status(404).json({ message: 'Guarantor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a guarantor
// @route   POST /api/guarantors
// @access  Private
const createGuarantor = async (req, res) => {
    try {
        const { _id, id, ...data } = req.body;
        // Upload id/work photos to Cloudinary if provided; fallback to local disk
        let idPhotoUrl = data.idPhoto;
        let workIdPhotoUrl = data.workIdPhoto;
        try {
            if (req.files && req.files.idPhoto && req.files.idPhoto[0] && req.files.idPhoto[0].buffer) {
                if (isConfigured) {
                    const r = await uploadBuffer(req.files.idPhoto[0].buffer, 'guarantors');
                    idPhotoUrl = r.secure_url || r.url;
                } else {
                    const uploadsDir = path.join(__dirname, '../../uploads');
                    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
                    const ext = path.extname(req.files.idPhoto[0].originalname) || '.jpg';
                    const filename = `idPhoto-${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                    fs.writeFileSync(path.join(uploadsDir, filename), req.files.idPhoto[0].buffer);
                    idPhotoUrl = `/uploads/${filename}`;
                }
            }
            if (req.files && req.files.workIdPhoto && req.files.workIdPhoto[0] && req.files.workIdPhoto[0].buffer) {
                if (isConfigured) {
                    const r2 = await uploadBuffer(req.files.workIdPhoto[0].buffer, 'guarantors');
                    workIdPhotoUrl = r2.secure_url || r2.url;
                } else {
                    const uploadsDir = path.join(__dirname, '../../uploads');
                    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
                    const ext2 = path.extname(req.files.workIdPhoto[0].originalname) || '.jpg';
                    const filename2 = `workId-${Date.now()}-${Math.round(Math.random()*1e9)}${ext2}`;
                    fs.writeFileSync(path.join(uploadsDir, filename2), req.files.workIdPhoto[0].buffer);
                    workIdPhotoUrl = `/uploads/${filename2}`;
                }
            }
        } catch (uploadErr) {
            console.error('Cloudinary/local upload error (guarantor):', uploadErr);
            return res.status(500).json({ message: 'Image upload failed' });
        }

        const guarantor = await prisma.guarantor.create({
            data: {
                ...data,
                idPhoto: idPhotoUrl,
                workIdPhoto: workIdPhotoUrl,
            }
        });
        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'CREATE_GUARANTOR',
                details: `Created guarantor: ${guarantor.name} (${guarantor.id})`
            }
        });

        res.status(201).json({ ...guarantor, _id: guarantor.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a guarantor
// @route   PUT /api/guarantors/:id
// @access  Private
const updateGuarantor = async (req, res) => {
    try {
        const { _id, id, ...data } = req.body;
        // Upload id/work photos to Cloudinary if provided; fallback to local disk
        let idPhotoUrl = data.idPhoto;
        let workIdPhotoUrl = data.workIdPhoto;
        try {
            if (req.files && req.files.idPhoto && req.files.idPhoto[0] && req.files.idPhoto[0].buffer) {
                if (isConfigured) {
                    const r = await uploadBuffer(req.files.idPhoto[0].buffer, 'guarantors');
                    idPhotoUrl = r.secure_url || r.url;
                } else {
                    const uploadsDir = path.join(__dirname, '../../uploads');
                    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
                    const ext = path.extname(req.files.idPhoto[0].originalname) || '.jpg';
                    const filename = `idPhoto-${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
                    fs.writeFileSync(path.join(uploadsDir, filename), req.files.idPhoto[0].buffer);
                    idPhotoUrl = `/uploads/${filename}`;
                }
            }
            if (req.files && req.files.workIdPhoto && req.files.workIdPhoto[0] && req.files.workIdPhoto[0].buffer) {
                if (isConfigured) {
                    const r2 = await uploadBuffer(req.files.workIdPhoto[0].buffer, 'guarantors');
                    workIdPhotoUrl = r2.secure_url || r2.url;
                } else {
                    const uploadsDir = path.join(__dirname, '../../uploads');
                    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
                    const ext2 = path.extname(req.files.workIdPhoto[0].originalname) || '.jpg';
                    const filename2 = `workId-${Date.now()}-${Math.round(Math.random()*1e9)}${ext2}`;
                    fs.writeFileSync(path.join(uploadsDir, filename2), req.files.workIdPhoto[0].buffer);
                    workIdPhotoUrl = `/uploads/${filename2}`;
                }
            }
        } catch (uploadErr) {
            console.error('Cloudinary/local upload error (guarantor):', uploadErr);
            return res.status(500).json({ message: 'Image upload failed' });
        }

        const guarantor = await prisma.guarantor.update({
            where: { id: req.params.id },
            data: {
                ...data,
                idPhoto: idPhotoUrl,
                workIdPhoto: workIdPhotoUrl,
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'UPDATE_GUARANTOR',
                details: `Updated guarantor: ${guarantor.name} (${guarantor.id})`
            }
        });

        res.json({ ...guarantor, _id: guarantor.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a guarantor
// @route   DELETE /api/guarantors/:id
// @access  Private
const deleteGuarantor = async (req, res) => {
    try {
        const guarantor = await prisma.guarantor.findUnique({ where: { id: req.params.id } });
        if (!guarantor) return res.status(404).json({ message: 'Guarantor not found' });

        await prisma.guarantor.delete({ where: { id: req.params.id } });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'DELETE_GUARANTOR',
                details: `Deleted guarantor: ${guarantor.name} (${guarantor.id})`
            }
        });

        res.json({ message: 'Guarantor removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGuarantors,
    getGuarantor,
    createGuarantor,
    updateGuarantor,
    deleteGuarantor
};
