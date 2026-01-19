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

test('GET /health responds with ok status', async () => {
    const response = await fetch(`${baseUrl}/health`);
    assert.strictEqual(response.status, 200);
    const data = await response.json();
    assert.strictEqual(data.status, 'ok');
});
