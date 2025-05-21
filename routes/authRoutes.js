/**
 * Routes for authentication
 */
const express = require('express');
const router = express.Router();

// Add a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    // Correct - save user 
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
    if (username === 'agadman' && password === 'password') {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid username/password' });
    }   

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
);

module.exports = router;