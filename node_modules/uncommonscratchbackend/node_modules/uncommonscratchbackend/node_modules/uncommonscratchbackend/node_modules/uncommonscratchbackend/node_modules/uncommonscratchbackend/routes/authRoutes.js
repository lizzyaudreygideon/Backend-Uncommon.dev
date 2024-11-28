// routes/authRoutes.js
const express = require('express');
const { 
  register, 
  login, 
  getUserProfile 
} = require('../controllers/authController');
const { 
  authenticateToken, 
  optionalAuth 
} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;


// http://localhost:5000/auth/register  
// http://localhost:5000/auth/login
// http://localhost:5000/auth/profile