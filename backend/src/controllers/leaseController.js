const Lease = require('../models/Lease');

// @desc    Get all leases
// @route   GET /api/leases
// @access  Private
const getLeases = async (req, res) => {
  try {
    const leases = await Lease.find({})
      .populate('tenant', 'name')
      .populate('unit', 'unitNumber');
    res.json(leases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lease
// @route   POST /api/leases
// @access  Private
const createLease = async (req, res) => {
  const { tenant, unit, startDate, endDate, rentAmount, status } = req.body;

  try {
    const lease = new Lease({
      tenant,
      unit,
      startDate,
      endDate,
      rentAmount,
      status,
    });

    const createdLease = await lease.save();
    res.status(201).json(createdLease);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a lease
// @route   PUT /api/leases/:id
// @access  Private
const updateLease = async (req, res) => {
  const { tenant, unit, startDate, endDate, rentAmount, status } = req.body;

  try {
    const lease = await Lease.findById(req.params.id);

    if (lease) {
      lease.tenant = tenant || lease.tenant;
      lease.unit = unit || lease.unit;
      lease.startDate = startDate || lease.startDate;
      lease.endDate = endDate || lease.endDate;
      lease.rentAmount = rentAmount || lease.rentAmount;
      lease.status = status || lease.status;

      const updatedLease = await lease.save();
      res.json(updatedLease);
    } else {
      res.status(404).json({ message: 'Lease not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a lease
// @route   DELETE /api/leases/:id
// @access  Private
const deleteLease = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);

    if (lease) {
      await lease.deleteOne();
      res.json({ message: 'Lease removed' });
    } else {
      res.status(404).json({ message: 'Lease not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeases,
  createLease,
  updateLease,
  deleteLease,
};
