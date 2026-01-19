const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ========================================
// GET ALL SESSIONS
// ========================================

exports.getSessions = async (req, res, next) => {
    try {
        const { limit = 20, offset = 0 } = req.query;

        const sessions = await prisma.session.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset),
            select: {
                id: true,
                topic: true,
                duration: true,
                messageCount: true,
                createdAt: true
            }
        });

        const total = await prisma.session.count({
            where: { userId: req.user.id }
        });

        res.json({
            sessions,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });

    } catch (error) {
        next(error);
    }
};

// ========================================
// CREATE SESSION
// ========================================

exports.createSession = async (req, res, next) => {
    try {
        const { topic, topicId, duration, messageCount, transcript, mistakes, vocabulary } = req.body;

        // Create session with related data
        const session = await prisma.session.create({
            data: {
                userId: req.user.id,
                topic,
                topicId,
                duration,
                messageCount,
                transcript,
                mistakes: {
                    create: mistakes || []
                },
                vocabulary: {
                    create: vocabulary || []
                }
            },
            include: {
                mistakes: true,
                vocabulary: true
            }
        });

        // Update user profile stats
        await prisma.profile.update({
            where: { userId: req.user.id },
            data: {
                totalSessions: { increment: 1 },
                totalMinutes: { increment: Math.floor(duration / 60) },
                lastActiveAt: new Date()
            }
        });

        res.status(201).json({
            message: 'Session created successfully',
            session
        });

    } catch (error) {
        next(error);
    }
};

// ========================================
// GET SESSION BY ID
// ========================================

exports.getSession = async (req, res, next) => {
    try {
        const { id } = req.params;

        const session = await prisma.session.findFirst({
            where: {
                id,
                userId: req.user.id
            },
            include: {
                mistakes: true,
                vocabulary: true,
                feedback: true
            }
        });

        if (!session) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Session not found'
            });
        }

        res.json({ session });

    } catch (error) {
        next(error);
    }
};

// ========================================
// DELETE SESSION
// ========================================

exports.deleteSession = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if session exists and belongs to user
        const session = await prisma.session.findFirst({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!session) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Session not found'
            });
        }

        // Delete session (cascade will delete related data)
        await prisma.session.delete({
            where: { id }
        });

        res.json({
            message: 'Session deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

// ========================================
// GET SESSION REPORT
// ========================================

exports.getSessionReport = async (req, res, next) => {
    try {
        const { id } = req.params;

        const session = await prisma.session.findFirst({
            where: {
                id,
                userId: req.user.id
            },
            include: {
                mistakes: true,
                vocabulary: true,
                feedback: true
            }
        });

        if (!session) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Session not found'
            });
        }

        // Generate feedback if not exists
        if (!session.feedback) {
            const feedback = await generateSessionFeedback(session);

            await prisma.feedback.create({
                data: {
                    sessionId: session.id,
                    ...feedback
                }
            });

            session.feedback = feedback;
        }

        res.json({
            session,
            report: {
                duration: session.duration,
                messageCount: session.messageCount,
                mistakesCount: session.mistakes.length,
                vocabularyCount: session.vocabulary.length,
                feedback: session.feedback
            }
        });

    } catch (error) {
        next(error);
    }
};

// ========================================
// HELPER: GENERATE FEEDBACK
// ========================================

async function generateSessionFeedback(session) {
    // Simple feedback generation
    // In production, use AI to analyze conversation

    const mistakeCount = session.mistakes?.length || 0;
    const messageCount = session.messageCount || 1;

    const grammarScore = Math.max(0, 100 - (mistakeCount * 10));
    const fluencyScore = Math.min(100, messageCount * 5);
    const vocabularyScore = Math.min(100, (session.vocabulary?.length || 0) * 10);
    const pronunciationScore = 85; // Default
    const overallScore = Math.floor((grammarScore + fluencyScore + vocabularyScore + pronunciationScore) / 4);

    return {
        overallScore,
        fluencyScore,
        grammarScore,
        vocabularyScore,
        pronunciationScore,
        strengths: [
            fluencyScore > 70 ? 'Good conversation flow' : null,
            vocabularyScore > 70 ? 'Rich vocabulary usage' : null,
            grammarScore > 70 ? 'Strong grammar' : null
        ].filter(Boolean),
        improvements: [
            grammarScore < 70 ? 'Focus on grammar accuracy' : null,
            fluencyScore < 70 ? 'Practice speaking more' : null,
            vocabularyScore < 70 ? 'Expand your vocabulary' : null
        ].filter(Boolean)
    };
}
