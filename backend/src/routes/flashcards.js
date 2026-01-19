const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const flashcardsController = require('../controllers/flashcardsController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', authMiddleware, flashcardsController.getFlashcards);
router.post(
    '/',
    authMiddleware,
    [
        body('term').isString().trim().notEmpty(),
        body('translation').isString().trim().notEmpty(),
        body('sourceText').optional().isString().trim()
    ],
    validateRequest,
    flashcardsController.createFlashcard
);
router.delete(
    '/:id',
    authMiddleware,
    [param('id').isString().notEmpty()],
    validateRequest,
    flashcardsController.deleteFlashcard
);

module.exports = router;
