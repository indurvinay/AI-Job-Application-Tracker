const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const protect = require('../middleware/auth'); // Import the auth middleware

const router = express.Router();

// Define our endpoints
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getProfile); // NEW: Protected profile route

module.exports = router;
