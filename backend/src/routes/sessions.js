const express = require('express');
const authMiddleware = require('../middleware/auth');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/sessions
 * @desc    Get all user sessions
 * @access  Private
 */
router.get('/', sessionController.getSessions);

/**
 * @route   POST /api/sessions
 * @desc    Create new session
 * @access  Private
 */
router.post('/', sessionController.createSession);

/**
 * @route   GET /api/sessions/:id
 * @desc    Get session by ID
 * @access  Private
 */
router.get('/:id', sessionController.getSession);

/**
 * @route   DELETE /api/sessions/:id
 * @desc    Delete session
 * @access  Private
 */
router.delete('/:id', sessionController.deleteSession);

/**
 * @route   GET /api/sessions/:id/report
 * @desc    Get session report with feedback
 * @access  Private
 */
router.get('/:id/report', sessionController.getSessionReport);

module.exports = router;
