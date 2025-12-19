const Tenant = require('../models/Tenant');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private
const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({}).populate('unit', 'unitNumber');
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a tenant
// @route   POST /api/tenants
// @access  Private
const createTenant = async (req, res) => {
  const { name, email, phone, unit, status, leaseStartDate, leaseEndDate, deposit, emergencyContact } = req.body;

  try {
    const tenant = new Tenant({
      name,
      email,
      phone,
      unit,
      status,
      leaseStartDate,
      leaseEndDate,
      deposit,
      emergencyContact,
    });

    const createdTenant = await tenant.save();

    // Update unit status to occupied
    if (unit) {
      const Unit = require('../models/Unit');
      await Unit.findByIdAndUpdate(unit, { status: 'occupied' });
    }

    res.status(201).json(createdTenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a tenant
// @route   PUT /api/tenants/:id
// @access  Private
const updateTenant = async (req, res) => {
  const { name, email, phone, unit, status, leaseStartDate, leaseEndDate, deposit, emergencyContact } = req.body;

  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      const oldUnitId = tenant.unit;

      tenant.name = name || tenant.name;
      tenant.email = email || tenant.email;
      tenant.phone = phone || tenant.phone;
      tenant.unit = unit || tenant.unit;
      tenant.status = status || tenant.status;
      tenant.leaseStartDate = leaseStartDate || tenant.leaseStartDate;
      tenant.leaseEndDate = leaseEndDate || tenant.leaseEndDate;
      tenant.deposit = deposit || tenant.deposit;
      tenant.emergencyContact = emergencyContact || tenant.emergencyContact;

      const updatedTenant = await tenant.save();

      // Handle unit status change
      if (unit && oldUnitId && unit.toString() !== oldUnitId.toString()) {
        const Unit = require('../models/Unit');
        // Set old unit to available
        await Unit.findByIdAndUpdate(oldUnitId, { status: 'available' });
        // Set new unit to occupied
        await Unit.findByIdAndUpdate(unit, { status: 'occupied' });
      } else if (unit && !oldUnitId) {
        // If assigning a unit where there was none
        const Unit = require('../models/Unit');
        await Unit.findByIdAndUpdate(unit, { status: 'occupied' });
      }

      res.json(updatedTenant);
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a tenant
// @route   DELETE /api/tenants/:id
// @access  Private
const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      const unitId = tenant.unit;
      await tenant.deleteOne();

      // Set unit to available
      if (unitId) {
        const Unit = require('../models/Unit');
        await Unit.findByIdAndUpdate(unitId, { status: 'available' });
      }

      res.json({ message: 'Tenant removed' });
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
};
