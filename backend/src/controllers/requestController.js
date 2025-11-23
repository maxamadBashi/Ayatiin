const Request = require('../models/Request');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin/Manager/Superadmin)
const getRequests = async (req, res) => {
    try {
        const requests = await Request.find({}).populate('customer', 'name email').populate('property', 'name location');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my requests
// @route   GET /api/requests/my
// @access  Private (Customer)
const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ customer: req.user._id }).populate('property', 'name location');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a request
// @route   POST /api/requests
// @access  Private (Customer)
const createRequest = async (req, res) => {
    const { type, message, property } = req.body;

    try {
        const request = new Request({
            customer: req.user._id,
            type,
            message,
            property,
        });

        const createdRequest = await request.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private (Admin/Manager/Superadmin)
const updateRequestStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const request = await Request.findById(req.params.id);

        if (request) {
            request.status = status;
            const updatedRequest = await request.save();
            res.json(updatedRequest);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getRequests,
    getMyRequests,
    createRequest,
    updateRequestStatus,
};
