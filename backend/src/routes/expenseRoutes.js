const express = require('express');
const router = express.Router();
const {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(authorize('admin', 'manager', 'accountant', 'superadmin'), getExpenses)
    .post(authorize('admin', 'manager', 'accountant', 'superadmin'), createExpense);

router.route('/:id')
    .put(authorize('admin', 'manager', 'accountant', 'superadmin'), updateExpense)
    .delete(authorize('admin', 'manager', 'superadmin'), deleteExpense);

module.exports = router;
