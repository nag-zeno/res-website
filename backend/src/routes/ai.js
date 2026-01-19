const express = require('express');
const authMiddleware = require('../middleware/auth');
const aiController = require('../controllers/aiController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/ai/chat
 * @desc    Send message to AI (Gemini)
 * @access  Private
 */
router.post('/chat', aiController.chat);

/**
 * @route   POST /api/ai/init-conversation
 * @desc    Initialize conversation with topic
 * @access  Private
 */
router.post('/init-conversation', aiController.initConversation);

module.exports = router;
