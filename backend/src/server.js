const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const aiRoutes = require('./routes/ai');
const settingsRoutes = require('./routes/settings');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

// CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

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

module.exports = app;
