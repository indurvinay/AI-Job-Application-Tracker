const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');

// Apply the "bouncer" middleware to ALL routes in this file
router.use(protect);

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

module.exports = router;
