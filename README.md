# imjustdex.com

Dexter Jakes' personal editorial site. Astro + MDX, deployed to Netlify from `main`.

## Publishing a new essay

```bash
cd ~/Documents/Claude/Projects/Substack/deploy

# 1. Drop the OG image (1200×630 PNG)
cp ~/path/to/og-<slug>.png public/img/og-<slug>.png

# 2. Write the essay
$EDITOR src/content/words/<slug>.mdx

# 3. Ship
ship "words: publish <slug>"
```

Netlify rebuilds (`npm run build`) and deploys in ~60 seconds. Homepage cascade,
feed, sitemap, lane counts, prev/next, entry number, and issue-next CTA all
auto-update. No manual edits to `index.html`, `feed.xml`, or `sitemap.xml` —
those are build outputs, not source.

## Frontmatter schema

Validated at build time via Zod. See `src/content/config.ts` for the full
schema. Required: `title`, `deck`, `description`, `ogImageAlt`, `publishedDate`,
`lanes` (subset of `Faith | Identity | Art`), `readTime`, `wordCount`. Optional:
`tags` (decorative chips), `plate` (homepage variant override), `status`,
`prev`/`next`, `extraStyles`.

## Body components

MDX imports from `~/components/`:

- `<DropCap>` — opening letter
- `<SectionHead heading="...">` — section divider with decorative line
- `<PullQuote>` — block quote
- `<Scripture cite="...">` — scripture block
- `<StudyNote ref="...">` — collapsible biblical study note with sources + cross-refs
- `<Callout>` — inline emphasis block
- `<StatBlock>` — vertical-bar stat/quote block
- `<ScriptureList>` — scripture reference table (job article)
- `<Closing>` — article closing line
- `<ResearchCTA text="..." href="...">` — external research link

## Local preview

```bash
npm install           # first time only
npm run dev           # localhost:4321
npm run build         # produces dist/ matching Netlify output
```

## Architecture notes

- `src/pages/index.astro` — homepage with auto-computed cascade
- `src/pages/words/[...slug].astro` — dynamic article route
- `src/pages/feed.xml.ts` — hand-built Atom feed endpoint
- `src/layouts/ArticleLayout.astro` — article shell + JSON-LD
- `src/layouts/HomeLayout.astro` — homepage shell + WebSite/Person JSON-LD
- `public/` — symlinks to repo-root `css/`, `js/`, `fonts/`, `img/`, `brand/`,
  `phase0/`, `feed.xsl`, `robots.txt` (all served as static assets)
- `netlify/functions/subscribe.js` — Mailchimp subscribe endpoint

## Passthrough routes

`/brand/` and `/phase0/` are bespoke one-off pages with their own CSS.
They're symlinked from `public/brand/` and `public/phase0/` to repo-root
directories and served as static HTML — not processed by Astro.

## Migration history

The site was hand-maintained static HTML through 2026-04-21. Migrated to
Astro + MDX in a single session (commit `eecabbb`). Legacy HTML retired at
`2b6f651`. `ROTATIONS.md` (the old 6-region cascade protocol) was deleted at
`67cff31` — replaced by automatic computation in `src/pages/index.astro`.
