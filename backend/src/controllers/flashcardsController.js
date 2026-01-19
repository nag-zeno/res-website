const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ========================================
// GET USER FLASHCARDS
// ========================================

exports.getFlashcards = async (req, res, next) => {
    try {
        const flashcards = await prisma.flashcard.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                term: true,
                translation: true,
                sourceText: true,
                createdAt: true
            }
        });

        res.json({ flashcards });
    } catch (error) {
        next(error);
    }
};

// ========================================
// CREATE/UPDATE FLASHCARD
// ========================================

exports.createFlashcard = async (req, res, next) => {
    try {
        const { term, translation, sourceText } = req.body;

        if (!term || !translation) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Term and translation are required'
            });
        }

        const normalizedTerm = term.trim().toLowerCase();
        const cleanedTranslation = translation.trim();

        if (!normalizedTerm || !cleanedTranslation) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Term and translation are required'
            });
        }

        const flashcard = await prisma.flashcard.upsert({
            where: {
                userId_term: {
                    userId: req.user.id,
                    term: normalizedTerm
                }
            },
            update: {
                translation: cleanedTranslation,
                sourceText: sourceText ? sourceText.trim() : null
            },
            create: {
                userId: req.user.id,
                term: normalizedTerm,
                translation: cleanedTranslation,
                sourceText: sourceText ? sourceText.trim() : null
            }
        });

        res.status(201).json({ flashcard });
    } catch (error) {
        next(error);
    }
};

// ========================================
// DELETE FLASHCARD
// ========================================

exports.deleteFlashcard = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existing = await prisma.flashcard.findFirst({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!existing) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Flashcard not found'
            });
        }

        await prisma.flashcard.delete({
            where: { id }
        });

        res.json({ message: 'Flashcard deleted' });
    } catch (error) {
        next(error);
    }
};
