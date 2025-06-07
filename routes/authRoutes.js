const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

// Route to register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Checking if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    // Creating and saving the user
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to log in user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if credentials are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Fyll i användarnamn/lösenord' });
    }
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Felaktigt användarnamn/lösenord' });
    }
    // Generate and return a JWT token
    const payload = { username };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'User logged in', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Public route - get all menu items for the menu list
router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get menu items' });
  }
});

// Protected route - add a new menu item (only for authenticated users)
router.post('/menu', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const newItem = new MenuItem({ name, description, price, category });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add menu item' });
  }
});

// Protected route - Delete a menu item (by ID)
router.delete('/menu/:id', authenticateToken, async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
});

// Protected route - Update a menu item (by ID)
router.put('/menu/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category },
      { new: true, runValidators: true } // Return updated item and run validation
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update menu item' });
  }
});

// Middleware function to check and verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
  // If token is missing
  if (!token) return res.status(401).json({ message: 'Unauthorized - token missing!' });
  // // Verify token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden - invalid token!' });
    req.user = user;
    next();
  });
}
// Exporting the router so it can be used in server.js
module.exports = router;