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
        const {
            topic,
            topicId,
            duration,
            messageCount,
            transcript,
            mistakes,
            vocabulary,
            createdAt,
            migrate
        } = req.body;

        const createdAtDate = createdAt ? new Date(createdAt) : null;

        // Create session with related data
        const session = await prisma.session.create({
            data: {
                userId: req.user.id,
                topic,
                topicId,
                duration,
                messageCount,
                transcript,
                ...(createdAtDate && !Number.isNaN(createdAtDate.getTime())
                    ? { createdAt: createdAtDate }
                    : {}),
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

        if (migrate) {
            await recalculateProfileStats(req.user.id);
        } else {
            // Update user profile stats + streak
            const profile = await prisma.profile.findUnique({
                where: { userId: req.user.id }
            });

            const now = new Date();
            const today = new Date(now);
            today.setHours(0, 0, 0, 0);

            let nextStreak = profile?.streak || 0;
            if (profile?.lastActiveAt) {
                const lastActive = new Date(profile.lastActiveAt);
                lastActive.setHours(0, 0, 0, 0);
                const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

                if (daysDiff === 0) {
                    nextStreak = profile.streak || 0;
                } else if (daysDiff === 1) {
                    nextStreak = (profile.streak || 0) + 1;
                } else {
                    nextStreak = 1;
                }
            } else {
                nextStreak = 1;
            }

            await prisma.profile.update({
                where: { userId: req.user.id },
                data: {
                    totalSessions: { increment: 1 },
                    totalMinutes: { increment: Math.floor(duration / 60) },
                    lastActiveAt: now,
                    streak: nextStreak
                }
            });
        }

        res.status(201).json({
            message: 'Session created successfully',
            session
        });

    } catch (error) {
        next(error);
    }
};

// ========================================
// HELPER: RECALCULATE PROFILE STATS
// ========================================

function getDayKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDayKey(key) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
}

async function recalculateProfileStats(userId) {
    const sessions = await prisma.session.findMany({
        where: { userId },
        select: {
            createdAt: true,
            duration: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce(
        (sum, session) => sum + Math.floor((session.duration || 0) / 60),
        0
    );

    const lastActiveAt = sessions[0]?.createdAt || new Date();

    const dayKeys = Array.from(
        new Set(sessions.map((session) => getDayKey(new Date(session.createdAt))))
    );

    dayKeys.sort((a, b) => (a < b ? 1 : -1));

    let streak = 0;
    if (dayKeys.length) {
        streak = 1;
        let previousDate = parseDayKey(dayKeys[0]);
        for (let i = 1; i < dayKeys.length; i += 1) {
            const currentDate = parseDayKey(dayKeys[i]);
            const diffDays = Math.round(
                (previousDate - currentDate) / (1000 * 60 * 60 * 24)
            );
            if (diffDays === 1) {
                streak += 1;
                previousDate = currentDate;
            } else {
                break;
            }
        }
    }

    await prisma.profile.update({
        where: { userId },
        data: {
            totalSessions,
            totalMinutes,
            lastActiveAt,
            streak
        }
    });
}

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
