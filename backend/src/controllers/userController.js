const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ========================================
// GET PROFILE
// ========================================

exports.getProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
                profile: true
            }
        });

        res.json({ user });

    } catch (error) {
        next(error);
    }
};

// ========================================
// UPDATE PROFILE
// ========================================

exports.updateProfile = async (req, res, next) => {
    try {
        const { name, avatar } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(name && { name }),
                ...(avatar && { avatar })
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                updatedAt: true
            }
        });

        res.json({
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        next(error);
    }
};

// ========================================
// GET STATS
// ========================================

exports.getStats = async (req, res, next) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user.id }
        });

        // Get recent sessions
        const recentSessions = await prisma.session.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 7,
            select: {
                createdAt: true,
                duration: true
            }
        });

        // Calculate streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActive = new Date(profile.lastActiveAt);
        lastActive.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

        let currentStreak = profile.streak;
        if (daysDiff > 1) {
            currentStreak = 0;
        }

        // Get total mistakes and vocabulary
        const totalMistakes = await prisma.mistake.count({
            where: {
                session: {
                    userId: req.user.id
                }
            }
        });

        const totalVocabulary = await prisma.vocabulary.count({
            where: {
                session: {
                    userId: req.user.id
                }
            }
        });

        const sessionsToday = await prisma.session.count({
            where: {
                userId: req.user.id,
                createdAt: {
                    gte: today
                }
            }
        });

        res.json({
            stats: {
                streak: currentStreak,
                totalSessions: profile.totalSessions,
                totalMinutes: profile.totalMinutes,
                level: profile.level,
                sessionsToday,
                totalMistakes,
                totalVocabulary,
                recentActivity: recentSessions.map(s => ({
                    date: s.createdAt,
                    minutes: Math.floor(s.duration / 60)
                }))
            }
        });

    } catch (error) {
        next(error);
    }
};
