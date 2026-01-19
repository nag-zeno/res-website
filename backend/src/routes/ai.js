const express = require('express');
const { body } = require('express-validator');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

/**
 * @route   POST /api/ai/translate
 * @desc    Translate text
 * @access  Public
 */
router.post(
    '/translate',
    [
        body('text').isString().trim().notEmpty(),
        body('targetLanguage').optional().isIn(['vi', 'en'])
    ],
    validateRequest,
    aiController.translate
);

// All routes below require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/ai/chat
 * @desc    Send message to AI (Gemini)
 * @access  Private
 */
router.post(
    '/chat',
    [
        body('message').isString().trim().notEmpty().isLength({ max: 2000 }),
        body('conversationHistory').optional().isArray()
    ],
    validateRequest,
    aiController.chat
);

/**
 * @route   POST /api/ai/init-conversation
 * @desc    Initialize conversation with topic
 * @access  Private
 */
router.post(
    '/init-conversation',
    [body('topic').optional().isObject()],
    validateRequest,
    aiController.initConversation
);

module.exports = router;
