const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // Middleware to parse JSON data in requests
app.use(cors()); // Middleware to allow cross-origin requests

// Connect to MongoDB
mongoose.set('strictQuery', false); // Optional setting for Mongoose
mongoose.connect(process.env.DATABASE).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to database...', error);
});

// Routes
app.use('/api', authRoutes);

// Protected route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route' });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"
  
  // If token is missing
  if (!token) return res.status(401).json({ message: 'Unauthorized - token missing!' });

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden - invalid token!' });
    req.user = user;
    next();
  });
}

// Start application
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});