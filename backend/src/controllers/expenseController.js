const { prisma } = require('../config/db');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private (Admin/Manager/Accountant)
const getExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            include: {
                property: { select: { name: true } }
            }
        });
        const mappedExpenses = expenses.map(e => ({ ...e, _id: e.id }));
        res.json(mappedExpenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private (Admin/Manager/Accountant)
const createExpense = async (req, res) => {
    const { category, amount, description, date, property } = req.body;
    try {
        const expense = await prisma.expense.create({
            data: {
                category,
                amount: parseFloat(amount),
                description,
                date: date ? new Date(date) : new Date(),
                propertyId: property || null
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'CREATE_EXPENSE',
                details: `Created expense: ${category} - ${amount} (${expense.id})`
            }
        });

        res.status(201).json({ ...expense, _id: expense.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private (Admin/Manager/Accountant)
const updateExpense = async (req, res) => {
    const { category, amount, description, date, property } = req.body;
    try {
        const expense = await prisma.expense.findUnique({ where: { id: req.params.id } });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        const updateData = {};
        if (category) updateData.category = category;
        if (amount) updateData.amount = parseFloat(amount);
        if (description !== undefined) updateData.description = description;
        if (date) updateData.date = new Date(date);
        if (property !== undefined) updateData.propertyId = property;

        const updatedExpense = await prisma.expense.update({
            where: { id: req.params.id },
            data: updateData
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'UPDATE_EXPENSE',
                details: `Updated expense: ${updatedExpense.id}`
            }
        });

        res.json({ ...updatedExpense, _id: updatedExpense.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private (Admin/Manager/Accountant)
const deleteExpense = async (req, res) => {
    try {
        // Check if expense is part of a report (placeholder logic for now)
        if (expense.isReported) {
            return res.status(400).json({ message: 'Cannot delete an expense that has been included in a report' });
        }

        await prisma.expense.delete({ where: { id: req.params.id } });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: 'DELETE_EXPENSE',
                details: `Deleted expense: ${expense.id}`
            }
        });

        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
};
