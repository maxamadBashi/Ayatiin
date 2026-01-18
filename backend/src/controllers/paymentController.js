const { prisma } = require('../config/db');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                lease: {
                    include: {
                        tenant: { select: { name: true, phone: true } },
                        unit: {
                            select: {
                                unitNumber: true,
                                property: { select: { name: true, location: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { paymentDate: 'desc' }
        });
        // Map id to _id for frontend compatibility
        const mappedPayments = payments.map(p => ({ ...p, _id: p.id }));
        res.json(mappedPayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res) => {
    const { lease, amount, date, method, status, referenceId } = req.body;

    try {
        const payment = await prisma.payment.create({
            data: {
                leaseId: lease,
                amount: parseFloat(amount),
                paymentDate: date ? new Date(date) : new Date(),
                paymentMethod: method || 'bank_transfer',
                status: status || 'pending',
                referenceId,
            },
            include: {
                lease: {
                    include: {
                        tenant: { select: { name: true, phone: true } },
                        unit: {
                            select: {
                                unitNumber: true,
                                property: { select: { name: true, location: true } }
                            }
                        }
                    }
                }
            }
        });
        res.status(201).json({ ...payment, _id: payment.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a payment
// @route   PUT /api/payments/:id
// @access  Private
const updatePayment = async (req, res) => {
    const { status } = req.body;

    try {
        const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });

        if (payment) {
            const updatedPayment = await prisma.payment.update({
                where: { id: req.params.id },
                data: { status: status || payment.status },
            });
            res.json({ ...updatedPayment, _id: updatedPayment.id });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const generateInvoices = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Find active leases with autoInvoice enabled
        const activeLeases = await prisma.lease.findMany({
            where: {
                status: 'active',
                autoInvoice: true,
            }
        });

        let createdCount = 0;
        for (const lease of activeLeases) {
            // Check if invoice already exists for this lease this month
            const existingPayment = await prisma.payment.findFirst({
                where: {
                    leaseId: lease.id,
                    type: 'rent',
                    paymentDate: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            });

            if (!existingPayment) {
                await prisma.payment.create({
                    data: {
                        leaseId: lease.id,
                        amount: lease.rentAmount,
                        paymentDate: now,
                        paymentMethod: 'pending',
                        status: 'pending',
                    }
                });
                createdCount++;
            }
        }

        res.json({ message: `Successfully generated ${createdCount} invoices for the current month.`, count: createdCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPayments,
    createPayment,
    updatePayment,
    generateInvoices
};
