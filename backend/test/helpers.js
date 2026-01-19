const { once } = require('node:events');
const path = require('node:path');
const dotenv = require('dotenv');

function buildTestEnv() {
    dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    process.env.DATABASE_URL =
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5432/speakeasy?schema=public';
    process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5500';
    process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || '900000';
    process.env.RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS || '1000';
    process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-key';
}

async function startTestServer(app) {
    const server = app.listen(0);
    await once(server, 'listening');
    const { port } = server.address();
    return {
        server,
        baseUrl: `http://127.0.0.1:${port}`
    };
}

module.exports = {
    buildTestEnv,
    startTestServer
};
