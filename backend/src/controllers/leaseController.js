const { prisma } = require('../config/db');

// @desc    Get all leases
// @route   GET /api/leases
// @access  Private
const getLeases = async (req, res) => {
  try {
    const leases = await prisma.lease.findMany({
      include: {
        tenant: { select: { name: true } },
        unit: {
          include: {
            property: { select: { name: true } }
          }
        },
        guarantor: true
      }
    });
    // Map id to _id for frontend compatibility
    const mappedLeases = leases.map(l => ({ ...l, _id: l.id }));
    res.json(mappedLeases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lease
// @route   POST /api/leases
// @access  Private
const createLease = async (req, res) => {
  const {
    tenant, unit, startDate, endDate, rentAmount, status,
    deposit, rentCycle, autoInvoice,
    guarantorName, guarantorPhone, guarantorID, guarantorId,
    conditions,
    vehicleMake, vehicleModel, vehiclePlate,
    weaponType, weaponLicense,
    witness1Name, witness1Phone, witness1ID,
    witness2Name, witness2Phone, witness2ID,
    witness3Name, witness3Phone, witness3ID
  } = req.body;


  try {
    const cleanGuarantorId = guarantorId && guarantorId.trim() !== '' ? guarantorId : null;

    const lease = await prisma.lease.create({
      data: {
        tenantId: tenant,
        unitId: unit,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentAmount: parseFloat(rentAmount),
        deposit: deposit ? parseFloat(deposit) : 0,
        rentCycle: rentCycle || 'monthly',
        autoInvoice: autoInvoice !== undefined ? autoInvoice : true,
        status: status || 'active',
        guarantorName,
        guarantorPhone,
        guarantorID,
        conditions,
        vehicleMake,
        vehicleModel,
        vehiclePlate,
        weaponType,
        weaponLicense,
        witness1Name,
        witness1Phone,
        witness1ID,
        witness2Name,
        witness2Phone,
        witness2ID,
        witness3Name,
        witness3Phone,
        witness3ID,
        guarantorId: cleanGuarantorId,
      },
    });

    res.status(201).json({ ...lease, _id: lease.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a lease
// @route   PUT /api/leases/:id
// @access  Private
const updateLease = async (req, res) => {
  const {
    tenant, unit, startDate, endDate, rentAmount, status,
    deposit, rentCycle, autoInvoice,
    guarantorName, guarantorPhone, guarantorID, guarantorId,
    conditions,
    vehicleMake, vehicleModel, vehiclePlate,
    weaponType, weaponLicense,
    witness1Name, witness1Phone, witness1ID,
    witness2Name, witness2Phone, witness2ID,
    witness3Name, witness3Phone, witness3ID
  } = req.body;


  try {
    const lease = await prisma.lease.findUnique({ where: { id: req.params.id } });

    if (lease) {
      const updateData = {};
      if (tenant) updateData.tenantId = tenant;
      if (unit) updateData.unitId = unit;
      if (startDate) updateData.startDate = new Date(startDate);
      if (endDate) updateData.endDate = new Date(endDate);
      if (rentAmount) updateData.rentAmount = parseFloat(rentAmount);
      if (deposit !== undefined) updateData.deposit = parseFloat(deposit);
      if (rentCycle) updateData.rentCycle = rentCycle;
      if (autoInvoice !== undefined) updateData.autoInvoice = autoInvoice;
      if (status) updateData.status = status;
      if (guarantorName !== undefined) updateData.guarantorName = guarantorName;
      if (guarantorPhone !== undefined) updateData.guarantorPhone = guarantorPhone;
      if (guarantorID !== undefined) updateData.guarantorID = guarantorID;
      if (conditions !== undefined) updateData.conditions = conditions;
      if (vehicleMake !== undefined) updateData.vehicleMake = vehicleMake;
      if (vehicleModel !== undefined) updateData.vehicleModel = vehicleModel;
      if (vehiclePlate !== undefined) updateData.vehiclePlate = vehiclePlate;
      if (weaponType !== undefined) updateData.weaponType = weaponType;
      if (weaponLicense !== undefined) updateData.weaponLicense = weaponLicense;
      if (witness1Name !== undefined) updateData.witness1Name = witness1Name;
      if (witness1Phone !== undefined) updateData.witness1Phone = witness1Phone;
      if (witness1ID !== undefined) updateData.witness1ID = witness1ID;
      if (witness2Name !== undefined) updateData.witness2Name = witness2Name;
      if (witness2Phone !== undefined) updateData.witness2Phone = witness2Phone;
      if (witness2ID !== undefined) updateData.witness2ID = witness2ID;
      if (witness3Name !== undefined) updateData.witness3Name = witness3Name;
      if (witness3Phone !== undefined) updateData.witness3Phone = witness3Phone;
      if (witness3ID !== undefined) updateData.witness3ID = witness3ID;

      const cleanGuarantorId = guarantorId && guarantorId.trim() !== '' ? guarantorId : null;
      updateData.guarantorId = cleanGuarantorId;

      const updatedLease = await prisma.lease.update({
        where: { id: req.params.id },
        data: updateData,
      });
      res.json({ ...updatedLease, _id: updatedLease.id });
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
    const lease = await prisma.lease.findUnique({ where: { id: req.params.id } });

    if (lease) {
      await prisma.lease.delete({ where: { id: req.params.id } });
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
