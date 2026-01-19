const express = require('express');
const { body, param, query } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const sessionController = require('../controllers/sessionController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/sessions
 * @desc    Get all user sessions
 * @access  Private
 */

/**
 * @route   POST /api/sessions
 * @desc    Create new session
 * @access  Private
 */
router.post(
    '/',
    [
        body('topic').isString().trim().notEmpty(),
        body('topicId').optional({ nullable: true }).isString().trim(),
        body('duration').isInt({ min: 0 }),
        body('messageCount').optional().isInt({ min: 0 }),
        body('transcript').isArray(),
        body('createdAt').optional().isISO8601(),
        body('migrate').optional().isBoolean().toBoolean()
    ],
    validateRequest,
    sessionController.createSession
);

/**
 * @route   GET /api/sessions/:id
 * @desc    Get session by ID
 * @access  Private
 */
router.get(
    '/:id',
    [param('id').isString().notEmpty()],
    validateRequest,
    sessionController.getSession
);

/**
 * @route   DELETE /api/sessions/:id
 * @desc    Delete session
 * @access  Private
 */
router.delete(
    '/:id',
    [param('id').isString().notEmpty()],
    validateRequest,
    sessionController.deleteSession
);

/**
 * @route   GET /api/sessions/:id/report
 * @desc    Get session report with feedback
 * @access  Private
 */
router.get(
    '/:id/report',
    [param('id').isString().notEmpty()],
    validateRequest,
    sessionController.getSessionReport
);

router.get(
    '/',
    [
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('offset').optional().isInt({ min: 0 })
    ],
    validateRequest,
    sessionController.getSessions
);

module.exports = router;
