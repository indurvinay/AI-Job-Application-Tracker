const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { 
  analyzeApplication, 
  generateCoverLetter, 
  generateInterviewPrep, 
  atsCheck, 
  generateColdEmail,
  autoApplyJob,
  deleteApplication 
} = require('../controllers/aiController');

// Standalone & Detail Endpoints for 5 AI Tools (Express 5 & Node 24 Compatible)
router.post('/analyze', protect, upload.single('resume'), analyzeApplication);
router.post('/analyze/:applicationId', protect, upload.single('resume'), analyzeApplication);

router.post('/cover-letter', protect, upload.single('resume'), generateCoverLetter);
router.post('/cover-letter/:applicationId', protect, upload.single('resume'), generateCoverLetter);

router.post('/interview-prep', protect, upload.single('resume'), generateInterviewPrep);
router.post('/interview-prep/:applicationId', protect, upload.single('resume'), generateInterviewPrep);

router.post('/ats-check', protect, upload.single('resume'), atsCheck);
router.post('/ats-check/:applicationId', protect, upload.single('resume'), atsCheck);

router.post('/cold-email', protect, upload.single('resume'), generateColdEmail);
router.post('/cold-email/:applicationId', protect, upload.single('resume'), generateColdEmail);

// Auto-Apply Autonomous Engine
router.post('/auto-apply', protect, autoApplyJob);

// Delete Application
router.delete('/:id', protect, deleteApplication);

module.exports = router;
