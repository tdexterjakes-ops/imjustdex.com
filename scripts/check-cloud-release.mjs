import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { materializeRelease, RELEASE_FILES } from './materialize-grace-release.mjs';
import { runRelease } from '../netlify/functions/release-grace-notes.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'grace-gate-test-'));
try {
  assert.equal(materializeRelease({ root, now: new Date('2026-10-18T14:59:59.999Z') }).state, 'held');
  assert.ok(RELEASE_FILES.every(file => !fs.existsSync(path.join(root, file))));
  assert.throws(() => materializeRelease({ root, now: new Date('2026-10-18T15:00:00Z'), key: '' }), /Missing production release key/);
  let calls = 0;
  const config = { siteId: 'ff389de6-02d3-4738-b48b-6c59701f6b7d', getHook: () => 'https://api.netlify.com/build_hooks/123abc',
    fetchImpl: async (_url, options) => { calls++; return new Response('', { status: options.method === 'POST' ? 201 : 404 }); } };
  assert.equal(await runRelease({ ...config, now: new Date('2026-10-18T14:59:59Z') }), 'outside-release-window');
  assert.equal(await runRelease({ ...config, now: new Date('2027-10-18T15:00:00Z') }), 'outside-release-window');
  assert.equal(calls, 0);
  assert.equal(await runRelease({ ...config, now: new Date('2026-10-18T15:00:00Z') }), 'build-requested');
  assert.equal(calls, 2);
  assert.equal(await runRelease({ ...config, now: new Date('2026-10-18T15:05:00Z'),
    fetchImpl: async () => new Response('Grace in the Dark' + '<details class="passage" open>'.repeat(43)) }), 'already-live');
  await assert.rejects(runRelease({ ...config, now: new Date('2026-10-18T15:00:00Z'),
    fetchImpl: async () => new Response('', { status: 500 }) }), /HTTP 500/);
  console.log('PASS: no early/next-year trigger; source stays held before time; missing key fails closed; 10 AM trigger, successful-page no-op, and failure handling.');
} finally { fs.rmSync(root, { recursive: true, force: true }); }
