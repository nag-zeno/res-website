const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
    '/profile',
    [
        body('name').optional().isString().trim().isLength({ min: 2, max: 80 }),
        body('avatar').optional().isURL()
    ],
    validateRequest,
    userController.updateProfile
);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', userController.getStats);

module.exports = router;
