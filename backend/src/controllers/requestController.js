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
    try {
        const { type, message, property, visitDate, amount } = req.body;

        if (!property) {
            return res.status(400).json({ message: 'Property is required' });
        }

        if (!type || (type !== 'booking' && type !== 'purchase')) {
            return res.status(400).json({ message: 'Request type must be booking or purchase' });
        }

        const requestData = {
            customer: req.user._id,
            type,
            property,
        };

        if (message) requestData.message = message.trim();
        if (visitDate) requestData.visitDate = new Date(visitDate);
        if (amount) requestData.amount = Number(amount);

        const request = new Request(requestData);
        const createdRequest = await request.save();
        
        // Populate property and customer for response
        await createdRequest.populate('property', 'name location type price');
        await createdRequest.populate('customer', 'name email');
        
        res.status(201).json(createdRequest);
    } catch (error) {
        console.error('Error creating request:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({ message: messages });
        }
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

        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        const updatedRequest = await request.save();
        
        // Populate for response
        await updatedRequest.populate('property', 'name location type price');
        await updatedRequest.populate('customer', 'name email');
        
        res.json(updatedRequest);
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
