const { prisma } = require('../config/db');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private
const getTenants = async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        leases: {
          include: {
            unit: {
              select: { unitNumber: true }
            }
          }
        }
      }
    });
    // Map id to _id for frontend compatibility
    const mappedTenants = tenants.map(t => ({ ...t, _id: t.id }));
    res.json(mappedTenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a tenant
// @route   POST /api/tenants
// @access  Private
const createTenant = async (req, res) => {
  const { name, email, phone, unit, status, emergencyContact } = req.body;

  try {
    const tenant = await prisma.tenant.create({
      data: {
        name,
        email,
        phone,
        emergencyContact,
      },
    });

    // Note: Unit attachment usually happens via Lease in this schema, 
    // but the original controller logic updated Unit directly.
    if (unit) {
      await prisma.unit.update({
        where: { id: unit },
        data: { status: 'occupied' }
      });
    }

    res.status(201).json({ ...tenant, _id: tenant.id });
  } catch (error) {
    if (error.code === 'P2002' || error.message?.includes('unique constraint')) {
      return res.status(400).json({ message: 'A tenant with this email already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a tenant
// @route   PUT /api/tenants/:id
// @access  Private
const updateTenant = async (req, res) => {
  const { name, email, phone, unit, status, emergencyContact } = req.body;

  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.params.id },
      include: {
        leases: {
          where: { status: 'active' },
          take: 1
        }
      }
    });

    if (tenant) {
      const oldUnitId = tenant.leases.length > 0 ? tenant.leases[0].unitId : null;

      const updatedTenant = await prisma.tenant.update({
        where: { id: req.params.id },
        data: {
          name: name || tenant.name,
          email: email || tenant.email,
          phone: phone || tenant.phone,
          emergencyContact: emergencyContact || tenant.emergencyContact,
        }
      });

      // Handle unit status change
      if (unit && oldUnitId && unit !== oldUnitId) {
        // Set old unit to available
        await prisma.unit.update({
          where: { id: oldUnitId },
          data: { status: 'available' }
        });
        // Set new unit to occupied
        await prisma.unit.update({
          where: { id: unit },
          data: { status: 'occupied' }
        });
      } else if (unit && !oldUnitId) {
        await prisma.unit.update({
          where: { id: unit },
          data: { status: 'occupied' }
        });
      }

      res.json({ ...updatedTenant, _id: updatedTenant.id });
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    if (error.code === 'P2002' || error.message?.includes('unique constraint')) {
      return res.status(400).json({ message: 'Another tenant with this email already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a tenant
// @route   DELETE /api/tenants/:id
// @access  Private
const deleteTenant = async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.params.id },
      include: {
        leases: {
          where: { status: 'active' },
          take: 1
        }
      }
    });

    if (tenant) {
      const unitId = tenant.leases.length > 0 ? tenant.leases[0].unitId : null;
      await prisma.tenant.delete({ where: { id: req.params.id } });

      // Set unit to available
      if (unitId) {
        await prisma.unit.update({
          where: { id: unitId },
          data: { status: 'available' }
        });
      }

      res.json({ message: 'Tenant removed' });
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's tenant profile
// @route   GET /api/tenants/me
// @access  Private (Customer)
const getMyTenantProfile = async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { email: req.user.email },
      include: {
        leases: {
          include: {
            unit: {
              include: {
                property: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });

    if (tenant) {
      res.json({ ...tenant, _id: tenant.id });
    } else {
      res.status(404).json({ message: 'Tenant profile not found' });
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
  getMyTenantProfile,
};
