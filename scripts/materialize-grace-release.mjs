import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createDecipheriv, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const RELEASE_AT = '2026-10-18T15:00:00Z';
export const RELEASE_FILES = [
  'src/content/words/grace-in-the-dark.mdx',
  'src/data/sermons/grace-in-the-dark.json',
  'img/og-grace-in-the-dark.png',
];
const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

// The repository is public. The approved study is encrypted until its authorized
// release, and the decryption key exists only in Netlify's production build scope.
export function materializeRelease({ root = defaultRoot, now = new Date(), key = process.env.GRACE_RELEASE_KEY } = {}) {
  assert.ok(Number.isFinite(now.getTime()), 'Invalid release clock');
  if (now.getTime() < Date.parse(RELEASE_AT)) {
    for (const file of RELEASE_FILES) assert.ok(!fs.existsSync(path.join(root, file)), `Premature plaintext release file: ${file}`);
    return { state: 'held' };
  }
  assert.match(key ?? '', /^[a-f0-9]{64}$/, 'Missing production release key');
  const envelope = JSON.parse(fs.readFileSync(path.join(root, 'release/grace-in-the-dark.enc.json'), 'utf8'));
  assert.equal(envelope.version, 1);
  assert.equal(envelope.releaseAt, RELEASE_AT);
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(envelope.iv, 'base64'));
  decipher.setAAD(Buffer.from(RELEASE_AT));
  decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
  const payload = JSON.parse(Buffer.concat([decipher.update(Buffer.from(envelope.ciphertext, 'base64')), decipher.final()]));
  assert.deepEqual(Object.keys(payload.files).sort(), [...RELEASE_FILES].sort());
  const decoded = Object.fromEntries(RELEASE_FILES.map(file => {
    const item = payload.files[file];
    const bytes = Buffer.from(item.base64, 'base64');
    assert.equal(hash(bytes), item.sha256, `Release integrity failure: ${file}`);
    return [file, bytes];
  }));
  const study = JSON.parse(decoded[RELEASE_FILES[1]].toString('utf8'));
  assert.equal((study.body.match(/<details class="passage" open>/g) || []).length, 43);
  assert.ok(!/href=["']https?:\/\//.test(study.body), 'Unexpected outbound link');
  const mdx = decoded[RELEASE_FILES[0]].toString('utf8');
  assert.match(mdx, /^status: "published"$/m);
  assert.match(mdx, /^publicationAuthorized: true$/m);
  assert.match(mdx, /^authorizedReleaseAt: "2026-10-18T10:00:00-05:00"$/m);
  assert.match(mdx, /^publishedDate: "2026-10-18T10:00:00-05:00"$/m);
  assert.ok(!/^preachedOn:/m.test(mdx), 'Do not invent a preached date');
  for (const [file, bytes] of Object.entries(decoded)) {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }
  return { state: 'released', passages: 43 };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = materializeRelease();
  console.log(`Grace in the Dark: ${result.state}.`);
}
