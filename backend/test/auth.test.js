const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { buildTestEnv, startTestServer } = require('./helpers');

buildTestEnv();

const app = require('../src/server');

let server;
let baseUrl;

before(async () => {
    const started = await startTestServer(app);
    server = started.server;
    baseUrl = started.baseUrl;
});

after(() => {
    if (server) server.close();
});

test('register and login with email/password', async () => {
    const email = `test_${Date.now()}@example.com`;
    const password = 'Password123!';
    const name = 'Test User';

    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
    });

    assert.strictEqual(registerResponse.status, 201);
    const registerData = await registerResponse.json();
    assert.ok(registerData.token);
    assert.strictEqual(registerData.user.email, email);

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    assert.strictEqual(loginResponse.status, 200);
    const loginData = await loginResponse.json();
    assert.ok(loginData.token);
    assert.strictEqual(loginData.user.email, email);
});
