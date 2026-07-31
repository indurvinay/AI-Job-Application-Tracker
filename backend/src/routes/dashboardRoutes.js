const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

// This route is protected, so only the logged-in user sees their own stats
router.get('/stats', protect, getStats);

module.exports = router;
