// Pure-JS publish predicate for `words` collection entries. Single source of
// truth — consumed by:
//   - src/utils/visibility.ts        (typed wrapper for Astro/MDX consumers)
//   - astro.config.mjs               (build-time sitemap filter, where the
//                                     `astro:content` types are not yet
//                                     available)
//
// Keep this file dependency-free. No imports from `astro:content`, Zod, or
// TypeScript types — those would block consumption from `astro.config.mjs`
// during config-eval. The typed wrappers live in visibility.ts.
//
// Phase 30 (2026-05-07) — extracted from visibility.ts so the sitemap filter
// in astro.config.mjs can share the predicate. Eliminates drift risk between
// /sitemap-0.xml and the homepage cascade / feed.xml / [...slug].astro.

/**
 * @typedef {{ status?: string, publishedDate?: string }} EntryDataLike
 */

/**
 * Returns true iff the entry is publicly live at `now`.
 * (status === 'published' AND publishedDate <= now)
 *
 * @param {EntryDataLike} data
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isPubliclyLiveData(data, now = new Date()) {
  if (!data || data.status !== 'published') return false;
  if (typeof data.publishedDate !== 'string' || data.publishedDate.length === 0) return false;
  const ts = new Date(data.publishedDate).getTime();
  return Number.isFinite(ts) && ts <= now.getTime();
}

/**
 * Returns true iff the entry is staged for the future but should still
 * render a Coming-Soon page (so social shares and dispatch teasers have a
 * real URL to land on).
 *
 * @param {EntryDataLike} data
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isUpcomingData(data, now = new Date()) {
  if (!data) return false;
  if (data.status !== 'published' && data.status !== 'upcoming') return false;
  if (typeof data.publishedDate !== 'string' || data.publishedDate.length === 0) return false;
  const ts = new Date(data.publishedDate).getTime();
  return Number.isFinite(ts) && ts > now.getTime();
}
