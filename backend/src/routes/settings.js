const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');
const validateRequest = require('../middleware/validateRequest');

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
router.put(
    '/',
    [
        body('darkMode').optional().isBoolean(),
        body('showHints').optional().isBoolean(),
        body('slowMode').optional().isBoolean(),
        body('dailyReminder').optional().isBoolean(),
        body('preferredMode').optional().isIn(['voice', 'text', 'both'])
    ],
    validateRequest,
    settingsController.updateSettings
);

module.exports = router;
