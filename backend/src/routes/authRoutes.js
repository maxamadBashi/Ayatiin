const express = require('express');
const router = express.Router();
const { authUser, registerUser, registerAdmin, getUsers, updateUserRole, deleteUser, toggleBlockUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', authUser);
router.post('/register', registerUser);

// Admin Routes
router.post('/admin/register', protect, authorize('admin', 'manager', 'superadmin'), registerAdmin);
router.get('/admin/users', protect, authorize('admin', 'manager', 'superadmin'), getUsers);
router.patch('/admin/users/:id/role', protect, authorize('admin', 'manager', 'superadmin'), updateUserRole);
router.delete('/admin/users/:id', protect, authorize('superadmin'), deleteUser);
router.patch('/admin/users/:id/block', protect, authorize('admin', 'manager', 'superadmin'), toggleBlockUser);

module.exports = router;
