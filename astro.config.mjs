import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { isPubliclyLiveData } from './src/utils/published.mjs';

// Build a Set of /words/<slug>/ URLs whose entry is publicly-live at build
// time. Coming-Soon entries (status !== 'published' OR future publishedDate)
// render at their canonical URL with <meta name="robots" content="noindex">,
// so listing them in the sitemap creates conflicting indexing signals and
// noisy Search Console coverage warnings.
//
// The predicate (isPubliclyLiveData) is the same one consumed by
// src/utils/visibility.ts (typed) — single source of truth across sitemap,
// homepage cascade, feed.xml, and route generation.
//
// Frontmatter is parsed with regex here (not via getCollection) because
// astro.config.mjs runs before Astro's content collection pipeline. The
// keys we read (status, publishedDate) are flat strings — Zod still owns
// full validation at build time.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wordsDir = path.join(__dirname, 'src', 'content', 'words');
const SITE_ORIGIN = 'https://imjustdex.com';
const now = new Date();

const liveWordsUrls = new Set(
  fs
    .readdirSync(wordsDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(wordsDir, f), 'utf8');
      const fm = raw.split(/^---\s*$/m)[1] ?? '';
      const status = fm.match(/^status:\s*["']?([^"'\n\r]+)/m)?.[1]?.trim();
      const publishedDate = fm.match(/^publishedDate:\s*["']?([^"'\n\r]+)/m)?.[1]?.trim();
      return { slug: f.replace(/\.mdx$/, ''), status, publishedDate };
    })
    .filter(({ slug, status, publishedDate }) => {
      // Fail loud on malformed frontmatter — same philosophy as the Zod
      // schema. The Zod check at build time is authoritative; this warn
      // surfaces sitemap-specific drift early.
      if (!status || !publishedDate) {
        console.warn(
          `[sitemap-filter] ${slug}.mdx: missing or unparseable frontmatter ` +
            `(status=${status ?? 'undefined'}, publishedDate=${publishedDate ?? 'undefined'}). ` +
            `Excluded from /sitemap-0.xml.`
        );
        return false;
      }
      return isPubliclyLiveData({ status, publishedDate }, now);
    })
    .map(({ slug }) => `${SITE_ORIGIN}/words/${slug}/`)
);

export default defineConfig({
  site: SITE_ORIGIN,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Emit component <style> blocks as external, content-hashed stylesheets
    // instead of inlining them. The site's strict CSP (style-src 'self', no
    // 'unsafe-inline') blocks inline <style> elements — which silently killed
    // the article multi-tag " + " separator and ScriptureList styling in
    // production. External /_astro/*.css is same-origin, so it clears the
    // policy. Phase: health audit.
    inlineStylesheets: 'never',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        if (page.includes('/404')) return false;
        // Strict prefix match — substring `/words/` would also match any
        // future route containing it (e.g. /words-archive/). Tightened in
        // Phase 30 audit.
        if (page.startsWith(`${SITE_ORIGIN}/words/`)) {
          return liveWordsUrls.has(page);
        }
        return true;
      },
      changefreq: 'weekly',
      priority: 0.8,
      // Passthrough routes (public/brand, public/phase0) aren't in Astro's route graph,
      // so inject them explicitly.
      customPages: [
        `${SITE_ORIGIN}/brand/`,
        `${SITE_ORIGIN}/phase0/`,
      ],
      // Per-route overrides match the existing hand-maintained sitemap conventions.
      serialize(item) {
        if (item.url === `${SITE_ORIGIN}/`) {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        if (item.url === `${SITE_ORIGIN}/about/`) {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }
        if (item.url.includes('/phase0/')) {
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        }
        if (item.url.includes('/brand/')) {
          return { ...item, changefreq: 'monthly', priority: 0.5 };
        }
        // Articles: weekly, 0.8.
        return item;
      },
    }),
  ],
});
