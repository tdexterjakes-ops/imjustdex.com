import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://imjustdex.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.8,
      // Passthrough route (public/phase0) isn't in Astro's route graph,
      // so inject it explicitly. /brand/ is now a real Astro route
      // (src/pages/brand/index.astro) and ships via the normal crawler.
      customPages: [
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
