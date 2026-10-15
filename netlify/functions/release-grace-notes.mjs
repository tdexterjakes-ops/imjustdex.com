const RELEASE = Date.parse('2026-10-18T15:00:00Z');
const WINDOW_END = Date.parse('2026-10-18T16:00:00Z');
const SITE_ID = 'ff389de6-02d3-4738-b48b-6c59701f6b7d';
const STUDY_URL = 'https://imjustdex.com/words/grace-in-the-dark/';

export async function runRelease({ now = new Date(), siteId, getHook, fetchImpl = fetch }) {
  // The year/date guard makes this a single-service release, even though cron
  // has no year field. Early/manual invocations cannot trigger publication.
  if (now.getTime() < RELEASE || now.getTime() >= WINDOW_END) return 'outside-release-window';
  if (siteId !== SITE_ID) throw new Error('Unexpected production site');
  const live = await fetchImpl(STUDY_URL, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
  const html = live.ok ? await live.text() : '';
  if (live.ok && html.includes('Grace in the Dark') &&
      (html.match(/<details\b[^>]*\bclass="passage"[^>]*\bopen(?:[\s=>])/g) || []).length === 43) {
    console.log('Grace notes release verified live; no rebuild needed.');
    return 'already-live';
  }
  const hook = getHook();
  if (!/^https:\/\/api\.netlify\.com\/build_hooks\/[a-f0-9]+$/.test(hook ?? '')) throw new Error('Missing production build hook');
  let response;
  try { response = await fetchImpl(hook, { method: 'POST', signal: AbortSignal.timeout(10000) }); }
  catch { throw new Error('Production build trigger failed'); }
  if (!response.ok) throw new Error(`Production build trigger returned HTTP ${response.status}`);
  console.log('Authorized Grace notes production build requested.');
  return 'build-requested';
}

export default async (_request, context) => {
  await runRelease({ siteId: context.site.id, getHook: () => Netlify.env.get('GRACE_RELEASE_BUILD_HOOK') });
};

// October 18, 2026: 15:00 UTC = 10:00 AM America/Chicago (CDT).
// Two later checks verify the live page and retry only if it is still absent.
export const config = { schedule: '0,5,10 15 18 10 *' };
