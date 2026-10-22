import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { checkRateLimit, readContactRequest } from '../src/lib/server/contact-security.js';

const valid = { name: 'Visitor', email: 'visitor@example.com', subject: 'Hello', message: 'Let us collaborate.\nThank you.' };
function request(body = JSON.stringify(valid), headers = {}) {
    return new Request('https://jerome.co.in/api/send-email', {
        method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body
    });
}
const rejectsWith = (req, status) => assert.rejects(readContactRequest(req), error => error.status === status);

test('valid same-origin contact JSON is preserved, including multiline messages', async () => {
    assert.deepEqual(await readContactRequest(request(undefined, { origin: 'https://jerome.co.in' })), valid);
});

test('cross-origin and non-JSON contact requests are rejected', async () => {
    await rejectsWith(request(undefined, { origin: 'https://attacker.example' }), 403);
    await rejectsWith(request(undefined, { 'content-type': 'text/plain' }), 415);
});

test('malformed JSON, invalid shapes, oversized fields and header injection are rejected', async () => {
    for (const body of ['{', 'null', '[]', '42', '{}', JSON.stringify({ ...valid, name: {} }),
        JSON.stringify({ ...valid, name: 'a'.repeat(101) }), JSON.stringify({ ...valid, message: 'a'.repeat(1001) }),
        JSON.stringify({ ...valid, email: 'visitor@example.com\r\nBcc: victim@example.com' }),
        JSON.stringify({ ...valid, subject: 'Hello\r\nBcc: victim@example.com' })]) {
        await rejectsWith(request(body), 400);
    }
});

test('body size is bounded by actual bytes even without a truthful Content-Length', async () => {
    await rejectsWith(request('{}', { 'content-length': '20000' }), 413);
    await rejectsWith(request('x'.repeat(16 * 1024 + 1), { 'content-length': '2' }), 413);
    // Character count is below the byte limit, but UTF-8 byte count exceeds it.
    await rejectsWith(request('€'.repeat(6000)), 413);
    let cancelled = false;
    const stream = new ReadableStream({
        pull(controller) { controller.enqueue(new Uint8Array(1024)); },
        cancel() { cancelled = true; }
    });
    await rejectsWith(new Request('https://jerome.co.in/api/send-email', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: stream, duplex: 'half'
    }), 413);
    assert.equal(cancelled, true, 'stop consuming an oversized streaming body');
});

test('rate limits expire and tracking stays bounded without evicting active limits', t => {
    t.mock.timers.enable({ apis: ['Date'], now: 1_000_000 });
    try {
        for (let i = 0; i < 3; i++) assert.equal(checkRateLimit('limited-client'), true);
        assert.equal(checkRateLimit('limited-client'), false);
        for (let i = 0; i < 9999; i++) assert.equal(checkRateLimit(`client-${i}`), true);
        assert.equal(checkRateLimit('overflow-client'), false);
        assert.equal(checkRateLimit('limited-client'), false);
        t.mock.timers.tick(15 * 60 * 1000);
        assert.equal(checkRateLimit('overflow-client'), true);
        assert.equal(checkRateLimit('limited-client'), true);
    } finally {
        t.mock.timers.reset();
    }
});

test('SvelteKit resolves a cookie serializer that rejects delimiter injection', () => {
    const requireFromKit = createRequire(import.meta.resolve('@sveltejs/kit'));
    const { parse, serialize } = requireFromKit('cookie');
    assert.equal(serialize('session', 'value', { path: '/', httpOnly: true }), 'session=value; Path=/; HttpOnly');
    assert.equal(parse('session=value').session, 'value');
    assert.throws(() => serialize('session; injected', 'value'), TypeError);
    assert.throws(() => serialize('session', 'value', { path: '/; injected' }), TypeError);
    assert.throws(() => serialize('session', 'value', { domain: 'example.com; injected' }), TypeError);
});
