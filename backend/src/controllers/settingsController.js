const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ========================================
// GET SETTINGS
// ========================================

exports.getSettings = async (req, res, next) => {
    try {
        let settings = await prisma.settings.findUnique({
            where: { userId: req.user.id }
        });

        // Create default settings if not exists
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    userId: req.user.id
                }
            });
        }

        res.json({ settings });

    } catch (error) {
        next(error);
    }
};

// ========================================
// UPDATE SETTINGS
// ========================================

exports.updateSettings = async (req, res, next) => {
    try {
        const { darkMode, showHints, slowMode, dailyReminder, preferredMode } = req.body;

        const settings = await prisma.settings.upsert({
            where: { userId: req.user.id },
            update: {
                ...(typeof darkMode === 'boolean' && { darkMode }),
                ...(typeof showHints === 'boolean' && { showHints }),
                ...(typeof slowMode === 'boolean' && { slowMode }),
                ...(typeof dailyReminder === 'boolean' && { dailyReminder }),
                ...(preferredMode && { preferredMode })
            },
            create: {
                userId: req.user.id,
                darkMode: darkMode || false,
                showHints: showHints !== false,
                slowMode: slowMode || false,
                dailyReminder: dailyReminder || false,
                preferredMode: preferredMode || 'both'
            }
        });

        res.json({
            message: 'Settings updated successfully',
            settings
        });

    } catch (error) {
        next(error);
    }
};
