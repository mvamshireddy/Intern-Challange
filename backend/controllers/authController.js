const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateEmail, validatePassword, validateName, validateAddress } = require('../utils/validators');

// Your existing signup function (no changes needed here)
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

// New login function with detailed debugging
exports.login = async (req, res) => {
  // --- START OF DEBUGGING BLOCK ---
  console.log("\n--- New Login Attempt Received ---");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request Body:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("LOGIN_FAIL: Email or password missing from request body.");
      return res.status(400).json({ error: "Email and password are required." });
    }

    console.log(`STEP 1: Searching for user with email: [${email}]`);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(`STEP 2: DATABASE_FAIL - User with email [${email}] was not found.`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log("STEP 2: DATABASE_SUCCESS - User found. User data:", user.toJSON());
    console.log("STEP 3: Comparing passwords...");
    console.log("   - Plaintext password from Postman:", password);
    console.log("   - Hashed password from Database:", user.password);

    const match = await bcrypt.compare(password, user.password);

    console.log("STEP 4: bcrypt.compare() result (should be true):", match);

    if (!match) {
      console.log("STEP 5: BCRYPT_FAIL - Passwords do not match.");
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log("STEP 5: BCRYPT_SUCCESS - Passwords match! Generating token.");
    // --- END OF DEBUGGING BLOCK ---

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, name: user.name, id: user.id });

  } catch (err) {
    console.error("SERVER_ERROR: An unexpected error occurred in the login function.", err);
    res.status(500).json({ error: err.message });
  }
};