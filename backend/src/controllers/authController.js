const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user (Customer)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // Force role to be 'customer' for public registration
  const user = await User.create({
    name,
    email,
    password,
    role: 'customer',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Register a new admin/manager
// @route   POST /api/auth/admin/register
// @access  Private (Admin/Manager/Superadmin)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log('Register Admin Request:', { name, email, role, requester: req.user._id, requesterRole: req.user.role });

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

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
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
  const users = await User.find({}).select('-password');
  res.json(users);
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin/Manager/Superadmin)
const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  const { role } = req.body;
  const requesterRole = req.user.role;

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Hierarchy checks
  if (role === 'superadmin' && requesterRole !== 'superadmin') {
    return res.status(403).json({ message: 'Only Super Admin can promote to Super Admin' });
  }

  // Prevent modifying Super Admin unless you are Super Admin (optional safety)
  if (user.role === 'superadmin' && requesterRole !== 'superadmin') {
    return res.status(403).json({ message: 'Cannot modify Super Admin' });
  }

  user.role = role;
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Superadmin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'superadmin') {
        return res.status(403).json({ message: 'Cannot delete Super Admin' });
      }
      await user.deleteOne();
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
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'superadmin') {
        return res.status(403).json({ message: 'Cannot block Super Admin' });
      }
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authUser, registerUser, registerAdmin, getUsers, updateUserRole, deleteUser, toggleBlockUser };
