/**
 * Routes for authentication
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to database...');
});

// User model
const User = require('../models/User');

// Add a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    // Correct - save user 
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
);

// Login user
router.post('/login', async (req, res) => {     
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    // Check credentials
    const user = await User.findOne({ username }); // Does user exist?
    if (!user) {
      return res.status(401).json({ error: 'Incorrect username/password' });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect username/password' });
    } else {
      res.status(200).json({ message: 'Login successful' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
);

module.exports = router;