const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = 'larks_by_lekhani_super_secret_key_2026';
const HARDCODED_ADMIN_USERNAME = "lekhani_admin";
const HARDCODED_ADMIN_PASSWORD = "LarksStudio2026!";
const OFFICIAL_STUDIO_EMAIL = "larksbylekhani@lbl.in";

let inMemoryUsers = [];

router.post('/user/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already registered.' });
      const newUser = new User({ name, email, password: hashedPassword, role: 'user' });
      await newUser.save();
    } catch (dbErr) {
      const exists = inMemoryUsers.find(u => u.email === email);
      if (exists) return res.status(400).json({ message: 'Email already registered.' });
      inMemoryUsers.push({ id: Date.now().toString(), name, email, password: hashedPassword, role: 'user' });
    }

    res.status(201).json({ message: 'Account created successfully! Please sign in.' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let foundUser = null;

    try {
      foundUser = await User.findOne({ email });
    } catch (dbErr) {
      foundUser = inMemoryUsers.find(u => u.email === email);
    }

    if (!foundUser) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ id: foundUser._id || foundUser.id, role: 'user', name: foundUser.name, email: foundUser.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      success: true,
      token,
      user: { name: foundUser.name, email: foundUser.email, role: 'user' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === HARDCODED_ADMIN_USERNAME && password === HARDCODED_ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', name: 'Lekhani (Admin)' }, JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({
      success: true,
      token,
      user: { name: 'Lekhani (Admin)', email: OFFICIAL_STUDIO_EMAIL, role: 'admin' }
    });
  }
  return res.status(401).json({ message: 'Invalid Admin Credentials.' });
});

module.exports = router;