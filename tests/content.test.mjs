import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import ts from 'typescript';

async function loadTypeScript(path) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText;
    return import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
}

// Semantic fingerprints captured from the original portfolio, updated for approved content edits.
// Formatting changes are allowed; other names, links, dates and records must remain intact.
const fingerprints = JSON.parse(await readFile(new URL('./content-fingerprints.json', import.meta.url), 'utf8'));
for (const [key, expected] of Object.entries(fingerprints)) {
    test(`original portfolio content remains intact: ${key}`, async () => {
        const [page, name] = key.split('.');
        const data = await loadTypeScript(`../src/lib/content/${page}.ts`);
        assert.equal(createHash('sha256').update(JSON.stringify(data[name])).digest('hex'), expected);
    });
}

test('date sorting handles existing portfolio formats and ongoing work', async () => {
    const { portfolioDate } = await loadTypeScript('../src/lib/utils/dates.ts');
    assert.ok(portfolioDate('Ongoing') > portfolioDate('Nov 2025'));
    assert.ok(portfolioDate('2025 - Ongoing') > portfolioDate('Feb 2026'));
    assert.ok(portfolioDate('Feb 2026') > portfolioDate('October 2025'));
    assert.equal(portfolioDate('May 2024 - Dec 2024'), portfolioDate('Dec 2024'));
    assert.equal(portfolioDate('2024 - 2025'), portfolioDate('Dec 2025'));
    assert.equal(portfolioDate('unknown'), 0);
});
