import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Build a Set of /words/<slug>/ URLs whose entry is publicly-live at build time
// (status === 'published' AND publishedDate <= now). Coming-Soon entries
// (future publishedDate) render at their URL with <meta name="robots" content="noindex">,
// so listing them in the sitemap creates conflicting indexing signals and noisy
// Search Console coverage warnings. This filter mirrors src/utils/visibility.ts.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wordsDir = path.join(__dirname, 'src', 'content', 'words');
const now = Date.now();
const liveWordsUrls = new Set(
  fs
    .readdirSync(wordsDir)
    .filter((f) => f.endsWith('.mdx'))
    .filter((f) => {
      const fm = fs.readFileSync(path.join(wordsDir, f), 'utf8').split(/^---\s*$/m)[1] ?? '';
      const status = (fm.match(/^status:\s*["']?([^"'\n\r]+)/m)?.[1] ?? 'published').trim();
      const publishedDate = (fm.match(/^publishedDate:\s*["']?([^"'\n\r]+)/m)?.[1] ?? '').trim();
      if (status !== 'published') return false;
      const ts = new Date(publishedDate).getTime();
      return Number.isFinite(ts) && ts <= now;
    })
    .map((f) => `https://imjustdex.com/words/${f.replace(/\.mdx$/, '')}/`)
);

export default defineConfig({
  site: 'https://imjustdex.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        if (page.includes('/404')) return false;
        // Coming-Soon (noindex) word pages must not appear in the sitemap.
        if (page.includes('/words/')) return liveWordsUrls.has(page);
        return true;
      },
      changefreq: 'weekly',
      priority: 0.8,
      // Passthrough routes (public/brand, public/phase0) aren't in Astro's route graph,
      // so inject them explicitly.
      customPages: [
        'https://imjustdex.com/brand/',
        'https://imjustdex.com/phase0/',
      ],
      // Per-route overrides match the existing hand-maintained sitemap conventions.
      serialize(item) {
        if (item.url === 'https://imjustdex.com/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        if (item.url === 'https://imjustdex.com/about/') {
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
