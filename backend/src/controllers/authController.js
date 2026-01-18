const { prisma } = require('../config/db');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Register a new user (Customer)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Force role to be 'customer' for public registration
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'customer',
      },
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Register a new admin/manager
// @route   POST /api/auth/admin/register
// @access  Private (Admin/Manager/Superadmin)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const requesterRole = req.user.role;

    // Role hierarchy checks
    if (role === 'superadmin' && requesterRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only Super Admin can create another Super Admin' });
    }

    if (requesterRole === 'manager' && role === 'superadmin') {
      return res.status(403).json({ message: 'Managers cannot create Super Admins' });
    }

    const allowedRoles = ['customer', 'admin', 'manager', 'superadmin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register Admin Error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin/Manager/Superadmin)
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    // Map id to _id for frontend compatibility if needed, though id is usually fine
    const mappedUsers = users.map(u => ({ ...u, _id: u.id }));
    res.json(mappedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin/Manager/Superadmin)
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const requesterRole = req.user.role;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hierarchy checks
    if (role === 'superadmin' && requesterRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only Super Admin can promote to Super Admin' });
    }

    if (user.role === 'superadmin' && requesterRole !== 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify Super Admin' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Superadmin)
const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (user) {
      if (user.role === 'superadmin') {
        return res.status(403).json({ message: 'Cannot delete Super Admin' });
      }
      await prisma.user.delete({ where: { id: req.params.id } });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block/Unblock user
// @route   PATCH /api/admin/users/:id/block
// @access  Private (Admin/Manager/Superadmin)
const toggleBlockUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (user) {
      if (user.role === 'superadmin') {
        return res.status(403).json({ message: 'Cannot block Super Admin' });
      }
      const updatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: { isBlocked: !user.isBlocked },
      });
      res.json({ message: `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'}` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authUser, registerUser, registerAdmin, getUsers, updateUserRole, deleteUser, toggleBlockUser };
