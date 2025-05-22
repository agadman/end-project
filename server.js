const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

// Protected routes
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route' });
});

// Validate Token
function authenticateToken(req, res, next) {
  const authHeader= req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null ) res.status(401).json({ message: 'Unauthorized - token missing!' });
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403).json({ message: 'Forbidden - invalid token!' });
    req.user = user;
    next();
  }
  );
}

// Start application
app.listen (port, () => {
  console.log(`Server is running on port ${port}`);
});