const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { validateName, validateEmail, validatePassword, validateAddress } = require('../utils/validators');

// List users with filtering and sorting
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sort = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      order: [[sort, order]],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user details
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    if (!validateName(name) || !validateEmail(email) || !validatePassword(password) || !validateAddress(address)) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, address, role });
    res.status(201).json({ id: user.id, name, email, address, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update password (self or admin)
exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!validatePassword(password)) return res.status(400).json({ error: 'Password validation failed' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};