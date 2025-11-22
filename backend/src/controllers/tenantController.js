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
  const { name, email, phone, unit, status } = req.body;

  try {
    const tenant = new Tenant({
      name,
      email,
      phone,
      unit,
      status,
    });

    const createdTenant = await tenant.save();
    res.status(201).json(createdTenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a tenant
// @route   PUT /api/tenants/:id
// @access  Private
const updateTenant = async (req, res) => {
  const { name, email, phone, unit, status } = req.body;

  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.name = name || tenant.name;
      tenant.email = email || tenant.email;
      tenant.phone = phone || tenant.phone;
      tenant.unit = unit || tenant.unit;
      tenant.status = status || tenant.status;

      const updatedTenant = await tenant.save();
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
      await tenant.deleteOne();
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
