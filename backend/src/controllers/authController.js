const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ========================================
// REGISTER
// ========================================

exports.register = async (req, res, next) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation Error',
                errors: errors.array()
            });
        }

        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Conflict',
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with profile and settings
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                profile: {
                    create: {}
                },
                settings: {
                    create: {}
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true
            }
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user
        });

    } catch (error) {
        next(error);
    }
};

// ========================================
// LOGIN
// ========================================

exports.login = async (req, res, next) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation Error',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                profile: true
            }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid email or password'
            });
        }

        // Update last active
        await prisma.profile.update({
            where: { userId: user.id },
            data: { lastActiveAt: new Date() }
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
    });

} catch (error) {
    next(error);
}
};

// ========================================
// GET ME
// ========================================

exports.getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                createdAt: true,
                profile: true,
                settings: true
            }
        });

        res.json({ user });

    } catch (error) {
        next(error);
    }
};

// ========================================
// LOGOUT
// ========================================

exports.logout = async (req, res) => {
    // JWT is stateless, so logout is handled client-side
    // by removing the token from storage
    res.json({
        message: 'Logout successful'
    });
};
