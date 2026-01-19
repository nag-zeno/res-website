const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const aiRoutes = require('./routes/ai');
const settingsRoutes = require('./routes/settings');
const flashcardsRoutes = require('./routes/flashcards');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// ========================================
// ENV VALIDATION
// ========================================

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
    console.error('❌ Missing required environment variables:', missingEnv.join(', '));
    process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is not set. AI endpoints may fail.');
}

if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}

// ========================================
// MIDDLEWARE
// ========================================

app.disable('x-powered-by');

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
);

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (!allowedOrigins.length) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: allowedOrigins.length > 0
};
app.use(cors(corsOptions));

// Body parser
const jsonLimit = process.env.JSON_BODY_LIMIT || '1mb';
app.use(express.json({ limit: jsonLimit }));
app.use(express.urlencoded({ extended: true, limit: jsonLimit }));

// Logging
const logFormat = process.env.LOG_FORMAT || (process.env.NODE_ENV === 'development' ? 'dev' : 'combined');
app.use(morgan(logFormat));

// Rate limiting
const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);

const apiLimiter = rateLimit({
    windowMs: rateLimitWindow,
    max: rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api', apiLimiter);

// ========================================
// ROUTES
// ========================================

app.get('/', (req, res) => {
    res.json({
        message: '🚀 SpeakEasy API',
        version: '1.0.0',
        status: 'running'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/flashcards', flashcardsRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Error Handler
app.use(errorHandler);

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('');
        console.log('🚀 ========================================');
        console.log(`   SpeakEasy API Server`);
        console.log('   ========================================');
        console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`   Port: ${PORT}`);
        console.log(`   URL: http://localhost:${PORT}`);
        console.log('   ========================================');
        console.log('');
    });
}

module.exports = app;
