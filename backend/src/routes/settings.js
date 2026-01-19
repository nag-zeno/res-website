const express = require('express');
const authMiddleware = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/settings
 * @desc    Get user settings
 * @access  Private
 */
router.get('/', settingsController.getSettings);

/**
 * @route   PUT /api/settings
 * @desc    Update user settings
 * @access  Private
 */
router.put('/', settingsController.updateSettings);

module.exports = router;
