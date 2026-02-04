const { prisma } = require('../config/db');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private
const getTenants = async (req, res) => {
  try {
    // 1. Fetch all tenants
    const tenants = await prisma.tenant.findMany();

    // 2. Fetch all active leases
    const leases = await prisma.lease.findMany({ where: { status: 'active' } });

    // 3. Fetch all units and properties to link them
    const units = await prisma.unit.findMany();
    const properties = await prisma.property.findMany();

    // 4. Manually Stitch Data (Emulator workaround for lack of 'include')
    const mappedTenants = tenants.map(tenant => {
      // Find active lease for this tenant
      const activeLease = leases.find(l => l.tenantId === tenant.id);

      let leaseWithUnit = [];
      if (activeLease) {
        // Find unit for lease
        const unit = units.find(u => u.id === activeLease.unitId);

        if (unit) {
          // Find property for unit
          const property = properties.find(p => p.id === unit.propertyId);
          // Attach property to unit
          unit.property = property;

          // Attach unit to lease
          activeLease.unit = unit;
        }
        leaseWithUnit = [activeLease];
      }

      // Return tenant with manually constructed 'leases' array
      return {
        ...tenant,
        _id: tenant.id, // Frontend compatibility
        leases: leaseWithUnit
      };
    });

    res.json(mappedTenants);
  } catch (error) {
    console.error('Backend Error: getTenants - Full Error:', error); // DEBUG LOG
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a tenant
// @route   POST /api/tenants
// @access  Private
// @desc    Create a tenant
// @route   POST /api/tenants
// @access  Private
const createTenant = async (req, res) => {
  const { name, email, phone, unit, status, emergencyContact } = req.body;
  console.log('Backend: Create Tenant request body:', JSON.stringify(req.body, null, 2)); // DEBUG LOG

  try {
    // 1. Check if email exists
    const existingTenant = await prisma.tenant.findUnique({ where: { email } });
    if (existingTenant) {
      console.error('Backend Error: createTenant - Tenant with this email already exists.'); // DEBUG LOG
      return res.status(400).json({ message: 'A tenant with this email already exists.' });
    }

    // 2. Validate Unit if provided
    let targetUnit = null;
    if (unit) {
      targetUnit = await prisma.unit.findUnique({
        where: { id: unit },
        select: { id: true, status: true, propertyId: true }
      });

      if (!targetUnit) {
        console.error('Backend Error: createTenant - Unit not found:', unit); // DEBUG LOG
        return res.status(404).json({ message: 'Selected unit not found.' });
      }
      if (targetUnit.status !== 'available') {
        console.error('Backend Error: createTenant - Unit is not available:', unit); // DEBUG LOG
        return res.status(400).json({ message: `Unit is already occupied or unavailable.` });
      }
    }

    // 3. Create Tenant (with status)
    const tenant = await prisma.tenant.create({
      data: {
        name,
        email,
        phone,
        emergencyContact,
        status: status || 'active', // Respect frontend status or default to active
      },
    });

    // 4. Create Lease & Update Unit if unit was selected
    if (unit && targetUnit) {
      console.log('Backend: Creating new lease for tenant and unit:', { tenantId: tenant.id, unitId: unit }); // DEBUG LOG

      try {
        await prisma.lease.create({
          data: {
            tenantId: tenant.id,
            unitId: unit,
            // propertyId removed
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Default 1 year lease
            rentAmount: 0, // Default rent amount, can be updated later
            status: 'active',
          },
        });

        // Update unit status to occupied
        await prisma.unit.update({
          where: { id: unit },
          data: { status: 'occupied' }
        });
      } catch (leaseError) {
        console.error('Backend Error: createTenant - Lease creation failed, rolling back tenant:', leaseError);
        // Manual Rollback: Delete the created tenant
        await prisma.tenant.delete({ where: { id: tenant.id } });
        throw new Error(`Failed to assign unit: ${leaseError.message}`);
      }
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE_TENANT',
        details: `Created tenant: ${tenant.name} (${tenant.id})`
      }
    });

    res.status(201).json({ ...tenant, _id: tenant.id });
  } catch (error) {
    console.error('Backend Error: createTenant - Full Error:', error); // DEBUG LOG
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
  console.log('Backend: Update Tenant request body:', JSON.stringify(req.body, null, 2)); // DEBUG LOG
  console.log('Backend: Tenant ID from params:', req.params.id); // DEBUG LOG

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
      console.log('Backend: Found existing tenant for update:', JSON.stringify(tenant, null, 2)); // DEBUG LOG
      const oldUnitId = tenant.leases.length > 0 ? tenant.leases[0].unitId : null;
      const existingLease = tenant.leases.length > 0 ? tenant.leases[0] : null;

      // Handle unit assignment changes (creating/terminating leases)
      if (unit && unit !== oldUnitId) {
        console.log('Backend: Unit provided and different from old unit, or no existing lease. Handling lease update/creation.'); // DEBUG LOG
        // Terminate old lease if exists
        if (existingLease) {
          console.log('Backend: Terminating old lease:', existingLease.id); // DEBUG LOG
          await prisma.lease.update({
            where: { id: existingLease.id },
            data: { status: 'terminated' },
          });
          // Set old unit to available
          await prisma.unit.update({
            where: { id: oldUnitId },
            data: { status: 'available' }
          });
        }

        // Validate if the new unit exists and is available
        const newUnit = await prisma.unit.findUnique({
          where: { id: unit },
          select: { id: true, status: true }
        });

        if (!newUnit) {
          console.error('Backend Error: updateTenant - New unit not found:', unit); // DEBUG LOG
          return res.status(404).json({ message: 'New unit not found.' });
        }
        if (newUnit.status !== 'available') {
          console.error('Backend Error: updateTenant - New unit is not available:', unit); // DEBUG LOG
          return res.status(400).json({ message: `Unit ${newUnit.id} is not available.` });
        }

        // Create new lease
        console.log('Backend: Creating new lease for tenant and new unit:', { tenantId: tenant.id, unitId: unit }); // DEBUG LOG
        await prisma.lease.create({
          data: {
            tenantId: tenant.id,
            unitId: unit,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            rentAmount: 0,
            status: 'active',
          },
        });

        // Set new unit to occupied
        await prisma.unit.update({
          where: { id: unit },
          data: { status: 'occupied' }
        });
      } else if (!unit && existingLease) {
        console.log('Backend: Unit removed, terminating existing lease:', existingLease.id); // DEBUG LOG
        // If unit is removed and an existing lease is there, terminate it
        await prisma.lease.update({
          where: { id: existingLease.id },
          data: { status: 'terminated' },
        });
        // Set old unit to available
        await prisma.unit.update({
          where: { id: oldUnitId },
          data: { status: 'available' }
        });
      }

      const updatedTenant = await prisma.tenant.update({
        where: { id: req.params.id },
        data: {
          name: name || tenant.name,
          email: email || tenant.email,
          phone: phone || tenant.phone,
          emergencyContact: emergencyContact || tenant.emergencyContact,
          status: status || tenant.status, // Allow status update
        }
      });

      console.log('Backend: Tenant updated:', JSON.stringify(updatedTenant, null, 2)); // DEBUG LOG

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'UPDATE_TENANT',
          details: `Updated tenant: ${updatedTenant.name} (${updatedTenant.id})`
        }
      });

      res.json({ ...updatedTenant, _id: updatedTenant.id });
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    console.error('Backend Error: updateTenant - Full Error:', error); // DEBUG LOG
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
  console.log('Backend: Delete Tenant request for ID:', req.params.id); // DEBUG LOG
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
      // Safe check for active leases
      const hasActiveLeases = tenant.leases && tenant.leases.length > 0;
      if (hasActiveLeases) {
        console.log('Backend: Cannot delete tenant with active leases.'); // DEBUG LOG
        return res.status(400).json({ message: 'Cannot delete tenant with active leases' });
      }

      // Find any associated leases (active or not) to update unit status if necessary
      const allLeases = await prisma.lease.findMany({
        where: { tenantId: req.params.id },
        select: { unitId: true, status: true }
      });

      await prisma.tenant.delete({ where: { id: req.params.id } });
      console.log('Backend: Tenant deleted successfully:', tenant.id); // DEBUG LOG

      // Set unit to available if it was linked to any of the tenant's leases and is not currently occupied by another active lease
      for (const lease of allLeases) {
        const otherActiveLeases = await prisma.lease.count({
          where: {
            unitId: lease.unitId,
            status: 'active',
            NOT: { tenantId: req.params.id } // Exclude leases of the tenant being deleted
          }
        });
        if (otherActiveLeases === 0) {
          await prisma.unit.update({
            where: { id: lease.unitId },
            data: { status: 'available' }
          });
          console.log('Backend: Set unit to available after tenant deletion:', lease.unitId); // DEBUG LOG
        }
      }

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: req.user.id,
          action: 'DELETE_TENANT',
          details: `Deleted tenant: ${tenant.name} (${tenant.id})`
        }
      });

      res.json({ message: 'Tenant removed' });
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    console.error('Backend Error: deleteTenant - Full Error:', error); // DEBUG LOG
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's tenant profile
// @route   GET /api/tenants/me
// @access  Private (Customer)
const getMyTenantProfile = async (req, res) => {
  console.log('Backend: getMyTenantProfile for user:', req.user.email); // DEBUG LOG
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { email: req.user.email },
      include: {
        leases: {
          include: {
            unit: {
              include: {
                property: true // Include the entire property object
              }
            }
          }
        }
      }
    });

    if (tenant) {
      console.log('Backend: Found tenant profile:', JSON.stringify(tenant, null, 2)); // DEBUG LOG
      res.json({ ...tenant, _id: tenant.id });
    } else {
      res.status(404).json({ message: 'Tenant profile not found' });
    }
  } catch (error) {
    console.error('Backend Error: getMyTenantProfile - Full Error:', error); // DEBUG LOG
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
