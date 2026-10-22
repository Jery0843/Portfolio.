import { error } from '@sveltejs/kit';

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_CLIENTS = 10_000;
/** @type {Map<string, { count: number, resetTime: number }>} */
const clients = new Map();
let nextCleanup = 0;

/** Per-instance protection; distributed limits belong at the hosting edge.
 * @param {string} clientIP
 */
export function checkRateLimit(clientIP) {
    const now = Date.now();
    if (now >= nextCleanup) {
        for (const [ip, entry] of clients) {
            if (now >= entry.resetTime) clients.delete(ip);
        }
        nextCleanup = now + 60_000;
    }
    const entry = clients.get(clientIP);
    if (entry && now < entry.resetTime) {
        if (entry.count >= 3) return false;
        entry.count++;
        return true;
    }
    // Fail closed at capacity instead of evicting active rate limits.
    if (!entry && clients.size >= MAX_CLIENTS) return false;
    clients.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
}

/** Validate the transport and bound actual bytes, including chunked requests.
 * @param {Request} request
 */
export async function readContactRequest(request) {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) error(403, 'Invalid request origin');
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
        error(415, 'Content-Type must be application/json');
    }
    if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
        error(413, 'Request body is too large');
    }
    if (!request.body) error(400, 'Missing request body');
    const reader = request.body.getReader();
    const chunks = [];
    let size = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > MAX_BODY_BYTES) {
                void reader.cancel().catch(() => {});
                error(413, 'Request body is too large');
            }
            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }
    let data;
    try {
        data = JSON.parse(await new Blob(chunks).text());
    } catch {
        error(400, 'Invalid JSON body');
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) error(400, 'Invalid contact fields');
    for (const [field, limit] of Object.entries({ name: 100, email: 254, subject: 200, message: 1000 })) {
        if (typeof data[field] !== 'string' || !data[field].trim() || data[field].length > limit) {
            error(400, 'Invalid contact fields');
        }
    }
    if (/[\r\n\u0000]/.test(data.subject) || /[\r\n\u0000]/.test(data.email)) {
        error(400, 'Invalid contact fields');
    }
    return /** @type {{ name: string, email: string, subject: string, message: string }} */ (data);
}
