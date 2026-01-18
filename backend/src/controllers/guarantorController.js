const { prisma } = require('../config/db');

// @desc    Get all guarantors
// @route   GET /api/guarantors
// @access  Private
const getGuarantors = async (req, res) => {
    try {
        const guarantors = await prisma.guarantor.findMany({
            include: { leases: { select: { id: true } } }
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
            include: { leases: true }
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
        const guarantor = await prisma.guarantor.create({
            data: {
                ...data,
                // Handle potential file paths from multer fields
                idPhoto: req.files && req.files.idPhoto ? req.files.idPhoto[0].path : data.idPhoto,
                workIdPhoto: req.files && req.files.workIdPhoto ? req.files.workIdPhoto[0].path : data.workIdPhoto,
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
        const guarantor = await prisma.guarantor.update({
            where: { id: req.params.id },
            data: {
                ...data,
                idPhoto: req.files && req.files.idPhoto ? req.files.idPhoto[0].path : data.idPhoto,
                workIdPhoto: req.files && req.files.workIdPhoto ? req.files.workIdPhoto[0].path : data.workIdPhoto,
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
        await prisma.guarantor.delete({ where: { id: req.params.id } });
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
