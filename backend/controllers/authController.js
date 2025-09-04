const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateEmail, validatePassword, validateName, validateAddress } = require('../utils/validators');

exports.signup = async (req, res) => {
  const { name, email, password, address } = req.body;
  if (!validateName(name) || !validateEmail(email) || !validatePassword(password) || !validateAddress(address)) {
    return res.status(400).json({ error: 'Validation failed' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, address, role: 'user' });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
console.log("DEBUG req.body:", req.body);
  console.log("DEBUG headers:", req.headers);
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, name: user.name, id: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};