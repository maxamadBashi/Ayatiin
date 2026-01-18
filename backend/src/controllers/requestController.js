const { prisma } = require('../config/db');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin/Manager/Superadmin)
const getRequests = async (req, res) => {
    try {
        const requests = await prisma.request.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                property: { select: { name: true, location: true } }
            }
        });
        const mappedRequests = requests.map(r => ({ ...r, _id: r.id, customer: r.user }));
        res.json(mappedRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my requests
// @route   GET /api/requests/my
// @access  Private (Customer)
const getMyRequests = async (req, res) => {
    try {
        const requests = await prisma.request.findMany({
            where: { userId: req.user.id },
            property: { select: { name: true, location: true } }
        });
        const mappedRequests = requests.map(r => ({ ...r, _id: r.id }));
        res.json(mappedRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a request
// @route   POST /api/requests
// @access  Private (Customer)
const createRequest = async (req, res) => {
    try {
        const { type, message, subject } = req.body;

        if (!type) {
            return res.status(400).json({ message: 'Request type is required' });
        }

        const request = await prisma.request.create({
            data: {
                userId: req.user.id,
                type,
                subject: subject || 'No Subject',
                message: message || '',
                status: 'pending',
            },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });

        res.status(201).json({ ...request, _id: request.id, customer: request.user });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: error.message || 'Error creating request' });
    }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private (Admin/Manager/Superadmin)
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be pending, approved, rejected, or completed' });
        }

        const request = await prisma.request.findUnique({ where: { id: req.params.id } });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const updatedRequest = await prisma.request.update({
            where: { id: req.params.id },
            data: { status },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });

        res.json({ ...updatedRequest, _id: updatedRequest.id, customer: updatedRequest.user });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ message: error.message || 'Error updating request status' });
    }
};

module.exports = {
    getRequests,
    getMyRequests,
    createRequest,
    updateRequestStatus,
};
