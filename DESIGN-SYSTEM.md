# DX Editorial Design Standard

This document codifies the design system for imjustdex.com. It exists so the system does not drift. Every value listed here is pulled from production CSS as of April 2026.

---

## 1. System Architecture

The site is a static HTML publishing system. No build step. No framework. As of the April 2026 Phase 1 refactor, every page pulls from a shared layered CSS architecture and self-hosted fonts. Netlify auto-deploys on push to `main` on `tdexterjakes-ops/imjustdex.com`.

### CSS Layering

Styles live in five purpose-built sheets loaded in dependency order. No page embeds `<style>` blocks. No inline `style=""` attributes.

| Sheet | Role |
|-------|------|
| `/css/tokens.css` | Design tokens, `@font-face` declarations, `:root` light mode, `html.dark-mode` overrides, base reset, 46px grid body, print and reduced-motion rules |
| `/css/shell.css` | Page chrome — skip-link, page-shell, rulers, masthead, brand-block, mode-toggle, footer-strip, focus states |
| `/css/plates.css` | Homepage-only — 12-col plate grid, plate variants, meta rail, image plates, identity plate, ghost teaser |
| `/css/article.css` | Article/About only — article frame, header, body, drop cap, section heads, pull quotes, callouts, scripture, stat blocks, closing, share bar, reading progress, section indicator |
| `/css/notfound.css` | 404-only — `.notfound-plate`, eyebrow, headline, actions |

Load order on every page: `tokens.css` → `shell.css` → (`plates.css` ‖ `article.css` ‖ `notfound.css`). Tokens and shell are universal. The third sheet is page-type specific.

### JavaScript

Three small vanilla scripts in `/js/`, loaded via `<script src>`. No inline `onclick`, no third-party libraries, no bundler.

| Script | Role |
|--------|------|
| `/js/mode.js` | Mode toggle. Synchronously applied in `<head>` to prevent FOUC (sets `html.dark-mode` before first paint from cookie or `prefers-color-scheme`). `DOMContentLoaded` handler wires the toggle button, syncs the logo SVG, and listens for OS preference changes when the user has no explicit cookie. |
| `/js/progress.js` | Article reading progress bar and section indicator. `requestAnimationFrame`-throttled scroll handler. No-ops on pages without `.reading-progress` or `.article-body`. Sets ARIA progressbar attributes. |
| `/js/essay.js` | CSP-safe `data-copy-link` wiring for the share bar copy button. Replaces what used to be inline `onclick` handlers. |

### Self-Hosted Fonts

All fonts ship from `/fonts/` as WOFF2 with Latin subsetting. No Google Fonts. No `fonts.googleapis.com` preconnect. No CDN dependency. Fonts are declared once in `tokens.css` via `@font-face` and preloaded in each page's `<head>`.

### Page Types

**Homepage** (`/`) — Identity plate embedded in Row 1 of a 12-column plate grid. The archive IS the homepage. No filter rail — the archive is small enough that chronology is the only index that matters. No standalone hero. No scroll indicator.

**Words Index** (`/words/`) — Same plate grid without the identity plate. Functionally identical to homepage minus identity.

**Article** (`/words/{slug}/`) — Long-form reading frame. Two editorial modes share the same template:
- *Narrative* — reflective, intimate, elegiac. Fewer section heads (2–3). More atmospheric pauses. Stat blocks for emotional turning points.
- *Thesis-Driven* — declarative, argumentative, exegetical. More section heads (4–5). Denser paragraph rhythm. Scripture blocks as structural evidence. Stat blocks for declarations.

The difference is editorial judgment in component selection, not code.

**About** (`/about/`) — Same article frame, stripped of article-specific chrome (no reading progress bar, no section indicator). Content page, not an essay.

### Shared Shell (All Pages)

Every page renders the same outer shell: rulers, masthead, footer strip, 46px grid background, mode toggle. This is non-negotiable. Exception pages (if any) must still use this shell.

---

## 2. Color System

### Light Mode (`:root`)

| Variable | Value | Purpose |
|----------|-------|---------|
| `--bg` | `#f4f4f1` | Page background |
| `--panel` | `#f8f8f6` | Panel/card fill |
| `--ink` | `#050505` | Primary text, structural borders |
| `--muted` | `#202020` | Subdued text |
| `--border` | `#0a0a0a` | Structural borders |
| `--rule` | `rgba(0,0,0,.14)` | Grid lines, rulers, hairlines |
| `--meta-bg` | `#0a0a0a` | Meta rail background |
| `--meta-ink` | `#f5f5f1` | Meta rail text |
| `--accent` | `#c00` | THE brand red. Borders, bars, underlines, fills, backgrounds, and large display text. Identical in both modes — this is the single visual red of the system. |
| `--accent-text` | `#c00` | Red for SMALL text only (sub-18px labels, inline link hovers, tiny metadata). Decoupled from `--accent` because in dark mode it's the ONE exception that flips to `#ff4d4d` for AA contrast. Use `--accent` everywhere else. |
| `--focus-ring` | `#c00` | `:focus-visible` outline color. Always mirrors `--accent` in both modes — no dark-mode flip. |
| `--body-color` | `rgba(5,5,5,.82)` | Article body text |
| `--body-muted` | `rgba(5,5,5,.56)` | Article metadata, secondary text |
| `--body-faint` | `rgba(5,5,5,.18)` | Faint borders in article context |
| `--body-tint` | `rgba(5,5,5,.04)` | Tinted backgrounds (pull quotes, scripture) |

### Dark Mode (`html.dark-mode`)

| Variable | Value |
|----------|-------|
| `--bg` | `#060606` |
| `--panel` | `#0d0d0d` |
| `--ink` | `#f3f0e8` |
| `--muted` | `#d7d3ca` |
| `--border` | `#f3f0e8` |
| `--rule` | `rgba(255,255,255,.16)` |
| `--accent` | `#c00` — **unchanged from light mode.** The single structural red of the system. Non-text contrast (WCAG 1.4.11) requires 3:1 — `#c00` on `#060606` clears at 3.45:1, so borders, fills, underlines, and large display text all read correctly. |
| `--accent-text` | `var(--accent-on-dark)` → `#ff4d4d` — the **one intentional flip**. `#c00` on `#060606` is 3.45:1, which fails AA normal text (4.5:1). Small red text uses this token so it lifts to 7.54:1 (AAA) for legibility. Borders, fills, and display text are unaffected. |
| `--accent-on-dark` | `#ff4d4d` — the AA-safe red reserved for small red text on dark backgrounds. Do not use directly; it powers `--accent-text`'s dark flip. |
| `--focus-ring` | `#c00` — **unchanged from light mode.** Focus outlines are non-text UI elements (WCAG 1.4.11, 3:1 threshold) — `#c00` on `#060606` clears at 3.45:1. |
| `--meta-bg` | `#f3f0e8` |
| `--meta-ink` | `#0a0a0a` |
| `--body-color` | `rgba(243,240,232,.82)` |
| `--body-muted` | `rgba(243,240,232,.52)` |
| `--body-faint` | `rgba(243,240,232,.14)` |
| `--body-tint` | `rgba(243,240,232,.04)` |

**Phase 4.1 update (2026-04-10) — Accent doctrine unification.** Phase 2 had flipped `--accent` to `#ff4d4d` in dark mode so every red-on-ink context cleared AA. Phase 4.1 reversed that decision. The problem with the flip was aesthetic, not technical: it produced two visible reds in dark mode — `#c00` on the identity plate (via a scoped override) and `#ff4d4d` everywhere else. The editorial signature is `#c00`. The rule now is: **one structural red across both modes.** `--accent`, `--focus-ring`, and all borders/fills/underlines/large display text stay `#c00` in dark mode because non-text contrast (WCAG 1.4.11) only requires 3:1 — and `#c00`/`#060606` clears at 3.45:1. The ONE exception is `--accent-text`, which still flips to `#ff4d4d` in dark mode because AA normal text requires 4.5:1. This token is reserved for small red text — inline link hovers, uppercase micro-labels, sub-18px metadata. Everything visually structural stays unified to the brand red.

**Phase 4.2 hotfix (2026-04-10).** Smoke testing Phase 4.1 in dark mode caught `.article-body a:hover` still using `var(--accent)` instead of `var(--accent-text)` — a missed small-text consumer. With `--accent` now unified to `#c00`, body-link hover fell to 3.45:1 (failing AA 4.5:1). Patched to `var(--accent-text)` in article.css so it lifts to `#ff4d4d` (7.54:1 AAA) in dark. The underline decoration color on the same `.article-body a` rule stays `var(--accent)` because it's a decorative marker governed by the 3:1 non-text contrast floor, not the 4.5:1 text floor.

Dark mode is not personalization. It is a second editorial mode. Both modes are locked and authored. Mode is cookie-persisted (`dxmode`, one-year max-age, `SameSite=Lax`) and applied via an `html.dark-mode` class toggle. The class is set on the `<html>` element (not `<body>`) by a blocking script in `<head>` so there is no flash of incorrect mode on first paint. When no cookie is set, `prefers-color-scheme` decides the initial mode, and a `matchMedia` listener follows OS preference changes until the user makes an explicit choice.

### Accent Red (`#c00`) — Rules

Red marks editorial emphasis. Never decoration.

**Permitted:**
- Section head `h2` text color (`var(--accent-text)`)
- Section head horizontal rule line (`var(--accent)`)
- Reading progress bar (`var(--accent)`)
- Callout left-border (3px `var(--accent)` rule)
- Callout emphasis spans (`.callout-emph`, `var(--accent-text)`)
- Scripture block cite text (`var(--accent-text)` — auto-retunes to `#ff4d4d` in dark mode)
- Stat block vertical bar (`var(--accent)`)
- Identity plate tagline text (`var(--accent)`)
- Link underline on hover (article body only, `var(--accent)`)
- Plate border on hover (homepage/index, `var(--accent)`)
- Focus-visible outline rings (`var(--focus-ring)`)

**Prohibited:**
- Backgrounds
- Titles (except section heads)
- Navigation elements
- Footer elements
- Body text
- Tags or metadata

---

## 3. Typography

### Font Stack

| Variable | Value | Role |
|----------|-------|------|
| `--display` | `'Anton', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif` | Titles, identity marks, pull quotes, stat blocks, 404 headline |
| `--body` | `'IBM Plex Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif` | All body text — articles, About, plates |
| `--mono` | `'SF Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace` | Metadata, tags, eyebrows, section heads, share bar, nav labels, footer — the system voice. System monospace, no self-hosted file. |
| `--serif` | `Georgia, 'Times New Roman', serif` | **Deprecated.** Retained in `tokens.css` as a fallback-only token; not referenced by any component. Do not use in new CSS. |

Article body previously ran on Georgia serif. As of Phase 1 it runs on Plex Sans for optical consistency with the rest of the system. If a future component needs a serif, add a new token with intent rather than resurrecting `--serif`.

### Self-Hosted Font Files

| File | Format | Use |
|------|--------|-----|
| `/fonts/Anton-Regular.woff2` | Anton Regular | All `--display` text |
| `/fonts/IBMPlexSans-Regular.woff2` | Plex Sans 400 | Body, mono register |
| `/fonts/IBMPlexSans-Bold.woff2` | Plex Sans 700 | Bold body, bold mono register |

All three preload in every page's `<head>` with `rel="preload" as="font" type="font/woff2" crossorigin`. No other weights or styles ship.

### Display Type Rules

All display type (`--display`) uses: `text-transform: uppercase`, `font-weight: 400` (Anton Regular is the display weight — the font is pre-condensed and pre-heavy, so 400 is already maximum impact), `line-height: .86`, `letter-spacing: -.03em`, `word-break: break-word`, `text-wrap: balance`.

### Font-Weight Normalization (Phase 1)

Every `font-weight: 900` in the old system has been normalized to a real shipped weight:

- Anton display text → `font-weight: 400` (Anton only ships Regular; 900 was a synthesized bold browsers were inventing)
- Plex body/mono text that used to be `900` → `font-weight: 700` (Plex Sans Bold, the heaviest weight we ship)

Visual change is zero. The old declarations relied on browser font synthesis, which produced the same effective weight. The system now declares what it ships.

Phase 7 later tokenized both raw weights into `--weight-regular` (400) and `--weight-bold` (700). See §4 Font-Weight Scale.

### Typography Scale (Phase 5)

Before Phase 5, every CSS file carried raw `font-size` and `line-height` values — 42+ declarations across `article.css`, `plates.css`, `shell.css`, and `notfound.css`, with zero typography tokens. Phase 5 introduces a **two-tier token system** so the scale becomes the single source of truth and consumers express intent, not arithmetic.

**Two tiers — primitives and semantic aliases.**

`--size-*` primitives define the scale itself. `--text-*` semantic aliases point at primitives and express role. Consumers should always reach for the semantic alias first; dropping to a primitive is reserved for one-offs where no alias fits the intent. New intents earn a new alias — never speculate aliases without a consumer.

This is the pattern every mature design system converges on (Radix, Primer, Material 3). It's the only structure that doesn't force a tradeoff between flexibility and meaning. Pure semantic naming locks you in when a new context needs a near-but-not-identical size; pure t-shirt naming (`--text-xl`, `--text-2xl`) strips intent from the CSS. Two tiers give an escape hatch in both directions.

**Primitive scale — empirically derived, not mathematical.**

A golden-ratio or 1.25 modular scale is prettier in a spec doc but would force every existing value to round up or down, breaking visual calibration that was done by eye across months of editorial tuning. Phase 5 instead clusters the existing 42+ values and snaps to natural steps. Sub-display sizes consolidate only where differences sat below the perception threshold (sub-pixel noise: `.7rem ≈ .72rem`, `.8rem ≈ .82rem`, `.84rem ≈ .88rem`, `1rem ≈ 1.02rem`). Display sizes preserve every distinct clamp — those were tuned with editorial intent and collapsing them would visibly shift the site.

**Sub-display tier — fixed rem.** Sub-body sizes do not respond to viewport. Fluid type below body flattens hierarchy on mobile and produces muddy chrome.

| Token | Value | Role |
|-------|-------|------|
| `--size-1` | `.6rem` | Meta rail numerals |
| `--size-2` | `.72rem` | Micro labels (share labels, stat block spans, scripture citation, article nav labels) |
| `--size-3` | `.75rem` | Chips, eyebrows, tags, article back button, identity sub |
| `--size-4` | `.82rem` | Article deck, plate ghost date, plate meta rail |
| `--size-5` | `.88rem` | Shell nav (mode toggle, footer strip) |
| `--size-6` | `.92rem` | Brand word, 404 actions |
| `--size-7` | `1rem` | Body paragraphs, scripture body, closing block, 404 copy |
| `--size-8` | `1.08rem` | Article lede (body copy) |
| `--size-9` | `1.15rem` | Callout pull-quote |

**Display tier — fluid `clamp()`.** Every editorial clamp preserved as its own step. Consumers write `font-size: var(--text-h1)` and get fluidity for free.

| Token | Value | Role |
|-------|-------|------|
| `--size-10` | `clamp(1.2rem, 2vw, 1.6rem)` | Article h3, article-nav titles |
| `--size-11` | `clamp(1.35rem, 2.4vw, 2.4rem)` | Identity tagline |
| `--size-12` | `clamp(1.6rem, 4vw, 2.4rem)` | Pull quote, h2 |
| `--size-13` | `clamp(1.6rem, 5vw, 2.6rem)` | Stat block |
| `--size-14` | `clamp(2rem, 4vw, 4rem)` | Plate title (default) |
| `--size-15` | `clamp(2.35rem, 5vw, 5rem)` | Plate title (med) |
| `--size-16` | `clamp(2.8rem, 7vw, 5rem)` | Article h1 |
| `--size-17` | `clamp(3rem, 10vw, 9rem)` | 404 headline |
| `--size-18` | `clamp(3.5rem, 7vw, 7.2rem)` | Plate title (lg) |
| `--size-19` | `clamp(3.8rem, 10vw, 7.5rem)` | Identity name |

**Semantic aliases — role, not size.**

| Alias | Primitive | Intent |
|-------|-----------|--------|
| `--text-meta` | `--size-1` | Meta rail numerals |
| `--text-micro` | `--size-2` | Micro labels — the smallest legible system voice |
| `--text-label` | `--size-3` | Chips, eyebrows, buttons |
| `--text-citation` | `--size-4` | Scripture citation, article deck |
| `--text-nav` | `--size-5` | Shell navigation |
| `--text-chrome` | `--size-6` | Large chrome (brand word, 404 actions) |
| `--text-body` | `--size-7` | Paragraph body text |
| `--text-lede` | `--size-8` | Article lede copy |
| `--text-quote` | `--size-9` | Callout pull quotes |
| `--text-h3` | `--size-10` | Section sub-heads, article-nav titles |
| `--text-tagline` | `--size-11` | Identity tagline |
| `--text-h2` | `--size-12` | Pull quote, section heads |
| `--text-stat` | `--size-13` | Stat block display |
| `--text-plate` | `--size-14` | Default plate title |
| `--text-plate-med` | `--size-15` | Medium plate variant |
| `--text-h1` | `--size-16` | Article title |
| `--text-display` | `--size-17` | 404 display headline |
| `--text-plate-lg` | `--size-18` | Large plate variant |
| `--text-identity` | `--size-19` | Identity plate name |

**Line-height ladder — decoupled from size.**

Coupling line-height to font-size assumes a 1:1 mapping that doesn't hold. Body at `1rem` wants `1.7`. Lede at `1.08rem` wants `1.85`. Display at `clamp(...)` wants `.86`. These ratios repeat across sizes, so one ladder with five ratios keeps the rhythm honest across the whole system.

| Token | Value | Role |
|-------|-------|------|
| `--lh-display` | `.86` | Headlines, plate titles, article h1 |
| `--lh-tight` | `1.05` | h2, h3, pull quote, stat block |
| `--lh-snug` | `1.4` | Body base, chrome, deck, research cta |
| `--lh-normal` | `1.7` | Article body, scripture, closing |
| `--lh-loose` | `1.85` | Article lede |

**Exceptions.** A handful of ratios sit between ladder steps or serve unique contexts and remain raw with inline `/* Phase 5 exception */` comments: drop cap `4.8em`/`.72` (relative multipliers, not ramp values), `line-height: 1` on badge-style elements (meta rail, brand block, 404 eyebrow), `.82`/`.9`/`.95`/`1.55` tuned ratios on identity name, identity tagline, article-nav title, and 404 copy, and the mobile `.52rem` responsive step-down on `.section-indicator`. These are documented where they live.

### Title Scale

All sizes reference Phase 5 semantic aliases. The resolved `clamp()` value is shown in parentheses for quick reference.

**Homepage plates:**

| Class | Token | Resolved | Notes |
|-------|-------|----------|-------|
| `.plate-title` (default) | `var(--text-plate)` | `clamp(2rem, 4vw, 4rem)` | Standard plate |
| `.plate-title.med` | `var(--text-plate-med)` | `clamp(2.35rem, 5vw, 5rem)` | Medium emphasis |
| `.plate-title.lg` | `var(--text-plate-lg)` | `clamp(3.5rem, 7vw, 7.2rem)` | Large emphasis, `max-width: 8ch` on desktop |

**Identity plate:**

| Element | Token | Resolved | Notes |
|---------|-------|----------|-------|
| `.identity-name` | `var(--text-identity)` | `clamp(3.8rem, 10vw, 7.5rem)` | `line-height: .82` (Phase 5 exception), `max-width: 7ch` |
| `.identity-tagline` | `var(--text-tagline)` | `clamp(1.35rem, 2.4vw, 2.4rem)` | `line-height: .9` (Phase 5 exception), `color: var(--accent)`, `opacity: .85`, `max-width: 14ch` |
| `.identity-sub` | `var(--text-label)` | `.75rem` | Bordered label, inverted colors |

**Article:**

| Element | Token | Resolved |
|---------|-------|----------|
| `.article-title` | `var(--text-h1)` / `var(--lh-display)` | `clamp(2.8rem, 7vw, 5rem)` / `.86` |
| `.article-deck` | `var(--text-citation)` / `var(--lh-snug)` | `.82rem` / `1.4` |
| `.article-tag` | `var(--text-label)` | `.75rem` mono, inverted fill |
| `.article-date`, `.article-read` | `var(--text-label)` | `.75rem` mono, `color: var(--body-muted)` |

### Body Text

Article body: `font-family: var(--body)` (Plex Sans), `font-size: var(--text-lede)` (`1.08rem`), `line-height: var(--lh-loose)` (`1.85`), `color: var(--body-color)`.

Paragraph spacing: `margin-bottom: 1.5em`.

Article body links: `text-decoration: underline`, `text-decoration-color: var(--accent)`, `text-underline-offset: 3px`, `text-decoration-thickness: 2px`. Hover: `color: var(--accent)`.

### Drop Cap

`.article-body .intro .dropcap` — `font-family: var(--display)` (Anton), `font-size: 4.8em`, `font-weight: 400`, `float: left`, `line-height: .72`, `margin-right: 8px`, `margin-top: 4px`, `color: var(--ink)`.

**Markup pattern:**
```html
<p class="intro"><span class="dropcap">I</span> always skipped Saturday.</p>
```

Applied only to the first paragraph of each article. Never repeated.

**Phase 3 change (2026-04-10):** The prior pattern used the `::first-letter` pseudo-element. That selector is fragile — inconsistent rendering across browsers, no handle for assistive tech, and breaks on text normalization. The explicit `<span class="dropcap">` pattern is addressable, reliable, and survives copy-paste.

### Mono Register Rules

All mono-set elements (`--mono`): always uppercase, always small (`.65`–`.84rem`), always tracked (`.06`–`.15em`). This is the system voice — functional, stamped, non-decorative.

---

## 4. Structural Elements

### Border Language

Border weights are tokenized so a single edit rebalances the whole system. The doctrine is **content vs chrome**:

```css
--border-weight-content: 3px;   /* content frames */
--border-weight-chrome:  2px;   /* chrome elements */
```

**`var(--border-weight-content)` — primary structural borders:**
- Plate outlines (homepage grid)
- Article header, body, closing, share bar, research CTA
- Pull quote top/bottom borders
- Article nav top border
- Section indicator border
- Section head horizontal rule (3px bar)
- Callout left border (uses `var(--accent)` for color)

**`var(--border-weight-chrome)` — secondary borders:**
- Brand block + nav elements
- Mode toggle
- Footer strip items
- Back button
- Subscribe/Follow Me button
- Article nav prev/next cards
- Article tags (`.article-tag`)
- Meta rail top/right edges
- Scripture block border (uses `var(--body-faint)` for color)
- Identity sub label

**Rule:** if the element frames *content*, it uses the content weight. If it frames *an action or a label*, it uses the chrome weight. Never hardcode `3px` or `2px` in a border rule — always reference the token.

**Hairline exemption.** Decorative 1px hairlines are allowed — they are not frame borders, they are texture. The only permitted uses are:

- `.ruler-top` / `.ruler-left` — fixed-position measurement rulers at `border-color: var(--rule)`
- `.identity-plate .meta-rail` — inner separator between tagline and meta row at `border-color: var(--bg)`

If you're adding a 1px border and the element isn't a decorative ruler or an inner meta separator, you're doing it wrong. Use the token.

### Spacing Scale

Spacing is tokenized on a single semantic scale. No primitive/semantic split — one namespace, ten slots, named for editorial intent.

```css
/* tokens.css */
--space-0:        0;
--space-hairline: 4px;   /* micro gaps, tag chip top padding */
--space-xs:       8px;   /* tight chrome padding, tag chip sides */
--space-sm:       12px;  /* grid gap, standard chrome vertical, footer inner, plate-body bottom */
--space-chrome:   14px;  /* chrome horizontal padding baseline — named tier, not a drift */
--space-md:       16px;  /* callout inner, plate-body sides, article header sides (mobile) */
--space-lg:       24px;  /* identity-plate padding, article body sides, section-head margin-bottom */
--space-xl:       32px;  /* ghost plate padding, article header top, pull-quote/callout margin */
--space-2xl:      48px;  /* article-body vertical, section-head top margin, pull-quote margin-top */
--space-3xl:      80px;  /* article-frame bottom breathing room, notfound-rule width */
```

**The `--space-chrome: 14px` slot is deliberate.** Chrome elements (mode-toggle, footer-strip items, subscribe-link, article-back, notfound eyebrow) need a micro-padding tier that sits between `--space-sm` (12) and `--space-md` (16). Rather than drift a sibling token to fit, the scale owns a dedicated chrome slot. If you add a new chrome element and reach for `13px`, use `--space-chrome`. If you reach for `15px`, you're wrong.

**`--grid-gap` and `--outer-pad` are scope-excluded.**

- `--grid-gap` is repointed at `var(--space-sm)` (12px). The name stays because the homepage grid semantics outrank the raw scale value. **Same value across desktop and mobile** — no breakpoint override.
- `--outer-pad` stays as its own token (`28px` desktop, `18px` mobile). It's a layout primitive, not a spacing scale consumer — the shell's horizontal rhythm is independent of the component scale.

**Also scope-excluded from the scale:**

- `env(safe-area-inset-*)` — system-driven, not designable
- `1.5em` relative values in article body (line-height-relative paragraph spacing)
- `-1px` decorative hairlines (see Border Language above)
- Intrinsic element dimensions (SVG heights, logo min-widths, 44px tap-target min-heights)
- Focus-ring geometry (`outline-offset` stays local per Focus Rings below)
- Ruler mechanics (`22px` ruler width, `44px` tick interval — decorative system)

**Exception Policy — 9 locations hold raw pixel values.**

All nine are optical corrections on uppercase chrome text where a 1px bottom-padding trim is required to visually center glyphs inside their frame. Uppercase geometry puts more mass above the x-height than below; symmetric padding reads bottom-heavy. The fix is a 1px pull that does not belong in the scale.

| # | Selector | Value | Reason |
|---|----------|-------|--------|
| 1 | `.brand-mark`, `.brand-word` | `8px 12px 7px` | 1px pull on uppercase DX mark + WORDS label |
| 2 | `.mode-toggle` | `14px 16px 13px` | 1px pull on "MODE: DARK" / "MODE: LIGHT" |
| 3 | `.footer-strip > *` | `12px 14px 11px` | 1px pull on uppercase footer labels |
| 4 | `.meta-rail` | `7px 8px 6px` | Below-scale micro-chrome for plate meta row (7/8/6 all sit under `--space-xs`) |
| 5 | `.identity-sub` | `5px 7px 4px` | Below-scale micro-badge for identity sub label |
| 6 | `.article-tag` | `4px 8px 3px` | 1px pull on uppercase section tag |
| 7 | `.article-back` | `12px 14px 11px` | 1px pull on uppercase BACK button |
| 8 | `.notfound-actions a` | `22px 24px 21px` | 22/21 held at scale boundary — snapping to 24 would introduce 3px drift |
| 9 | `.subscribe-link` | `12px 14px` (symmetric) | Optical correction dropped intentionally — sub-button scale is below perception threshold for 1px delta |

**Rule for future components:** if you're reaching for a raw pixel value that isn't in the scale, you need either (a) a new scale slot or (b) a documented entry in this exception table. No silent drift. Every deviation is a named choice.

**Rule for existing components:** if a padding or margin value matches a scale slot, it MUST reference the token. `16px` is `var(--space-md)`, not `16px`. The tokens are the source of truth; raw numbers are drift.

### Letter-Spacing Scale

Letter-spacing is tokenized as **12 semantic slots**, each tuned to a specific text role. No consolidation — at uppercase chrome sizes, a `.03em` delta is visibly perceptible, so every distinct editorial tracking value on the site earns its own token.

```css
/* tokens.css */
--track-display:    -.03em;  /* article h1, plate titles, stat block, 404 headline */
--track-title:      -.02em;  /* pull-quote, article-nav title, identity tagline */
--track-brand:       .03em;  /* brand-mark / brand-word only */
--track-nav:         .04em;  /* mode toggle, article eyebrow date */
--track-footer:      .06em;  /* footer-strip items */
--track-badge:       .08em;  /* meta-rail, identity-sub, 404 actions */
--track-chrome:      .1em;   /* article meta, article-back, share bar */
--track-tag:         .12em;  /* tag chip, stat microlabel, article-nav label */
--track-teaser:      .14em;  /* identity meta-rail, teaser-date */
--track-label:       .15em;  /* section-head h2, scripture cite, research-cta */
--track-indicator:   .18em;  /* section-indicator (fixed editorial mark) */
--track-eyebrow:     .22em;  /* 404 eyebrow (widest tracking on the site) */
```

**Two directions, one doctrine.**

- **Negative tracking (`--track-display`, `--track-title`)** is display-tier only. Tight letterforms at h1/plate/pull-quote scale read as editorial confidence. Never applied below 18px.
- **Positive tracking (`--track-brand` through `--track-eyebrow`)** is chrome and uppercase. The wider the tracking, the smaller and more label-like the element — tiny eyebrows get `.22em`, meta rails get `.08em`, brand wordmark gets a restrained `.03em`.

**Why no consolidation?** The spacing scale tolerates 2–4px drift below the perception threshold. Letter-spacing does not — a `.03em` delta on uppercase tag-chips at `.75rem` is visible side-by-side. Collapsing `.08em` and `.1em` into one slot would force a visible shift on every meta rail or chrome label in the system. The 12-slot scale is the minimum that preserves fidelity.

**Rule:** every `letter-spacing` declaration in the site's CSS points at a `--track-*` token. Zero exceptions. Raw values are drift.

### Font-Weight Scale

Font-weight is tokenized as a **binary**: regular and bold. No intermediate weights.

```css
/* tokens.css */
--weight-regular: 400;
--weight-bold:    700;
```

**Why binary?** The site uses exactly two weights: 400 for all body and display type, 700 for all chrome, labels, tags, and strong emphasis. No medium, semibold, or black. The tokens earn their keep by making the binary legible at the call site — `var(--weight-bold)` tells you the element belongs to the chrome vocabulary; `700` does not.

**Exception:** `@font-face` declarations hold raw `400` / `700` values because CSS custom properties do not resolve inside `@font-face` at-rules. This is a language constraint, not a drift.

**Rule:** every `font-weight` declaration in normal selectors points at a `--weight-*` token. `@font-face` is the only place raw numbers are permitted.

### Focus Rings

Focus outlines for `:focus-visible` states are tokenized on width but not on offset.

```css
--focus-ring-width: 2px;   /* matches --border-weight-chrome */
--focus-ring:       #c00;  /* unified — same value in both modes (Phase 4.1) */
```

**Rule:** every `:focus-visible` outline on the site uses `outline: var(--focus-ring-width) solid var(--focus-ring);`. Never hardcode the width.

**Offset is intentionally local.** `outline-offset` stays hardcoded per selector because the correct offset depends on what the element sits inside:

- Chrome elements (`.mode-toggle`, `.brand-block`, `.footer-strip a`, article links, back button, CTAs) → `outline-offset: 2px` — the ring floats outside the element
- Content frames (`a.plate`, `.notfound-actions a`) → negative offset (`-5px` / `-4px`) — the ring insets *inside* the 3px content border so it doesn't compete visually with the frame

Tokenizing offset would force one rule to fit both cases. Leave it local.

### Reduced Motion

Reduced motion is handled globally in `tokens.css` via a blanket override:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
  }
}
```

This catches every transition on the site, including those that use `var(--motion-fast/med/slow)`. Do not add per-component reduced-motion rules — they are redundant.

### Grid Background

46px repeating grid lines at `var(--rule)` opacity. Applied to `body` via `background-image` on all pages.

**Homepage implementation:**
```css
background-image:
  linear-gradient(to right, transparent 0, transparent calc(100% - 1px), var(--rule) calc(100% - 1px)),
  linear-gradient(to bottom, transparent 0, transparent calc(100% - 1px), var(--rule) calc(100% - 1px));
background-size: 46px 46px;
```

**Article/About implementation** (uses `--body-faint` for slightly different opacity):
```css
background-image:
  linear-gradient(to right, var(--body-faint) 1px, transparent 1px),
  linear-gradient(to bottom, var(--body-faint) 1px, transparent 1px);
background-size: 46px 46px;
```

### Rulers

Fixed-position decorative rulers, `pointer-events: none`, `z-index: 1`, `opacity: .75`.

- `.ruler-top`: `height: 22px`, horizontal tick marks at 44px intervals, `border-bottom: 1px solid var(--rule)`
- `.ruler-left`: `width: 22px`, vertical tick marks at 44px intervals, `border-right: 1px solid var(--rule)`

Hidden on mobile (`< 760px`).

### Page Shell

`.page-shell`: `max-width: 1440px`, `margin: 0 auto`, `padding: var(--space-sm) var(--outer-pad) var(--space-lg)`. Respects `env(safe-area-inset-left/right)`.

`--outer-pad`: `28px` desktop, `18px` mobile. Scope-excluded layout primitive — see §4 Spacing Scale.

---

## 5. Page Shell Components

### Masthead

`position: sticky`, `top: 0`, `z-index: 50`. Flex row: brand-block + mode-toggle. `background: linear-gradient(to bottom, var(--bg) 70%, rgba(0,0,0,0))` — fades to transparent.

**Brand block:** Inline-flex, `var(--border-weight-chrome) solid var(--border)`, contains:
- `.brand-mark`: DX logo SVG (`height: 28px`), `min-width: 72px`, centered. Logo switches between `logo-dark.svg` (light mode) and `logo-white.svg` (dark mode) via JavaScript.
- `.brand-word`: "Words" label, inverted fill (`background: var(--ink)`, `color: var(--bg)`), `var(--text-chrome)`, `font-weight: 700`.

Both segments: `padding: var(--space-xs) var(--space-sm) 7px` (Exception 1 — 1px optical pull on uppercase DX/WORDS marks; sides snap 10→12 to align with the `--space-sm` slot), `border-right: var(--border-weight-chrome) solid var(--border)`, uppercase, `letter-spacing: .03em`.

**Mode toggle:** `margin-left: auto`. Bordered button, `var(--text-nav)`, `font-weight: 700`, `min-height: 44px`, `padding: var(--space-chrome) var(--space-md) 13px` (Exception 2 — 1px optical pull on "MODE: DARK" / "MODE: LIGHT"). Text reads "Mode: Light" / "Mode: Dark". Cookie-persisted.

### Footer Strip

Two-item grid: "Follow @ImJustDex" (links to Instagram) | "Est. 1994".

```css
.footer-strip {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-sm); margin-top: var(--space-sm);
  position: relative; z-index: 2;
}
.footer-strip > * {
  border: var(--border-weight-chrome) solid var(--border); background: var(--panel);
  /* Exception 3 — 11px bottom = 1px optical pull on uppercase footer labels.
     Horizontal sits on --space-chrome (14), the named chrome tier. */
  padding: var(--space-sm) var(--space-chrome) 11px;
  text-transform: uppercase;
  letter-spacing: .06em; font-size: var(--text-nav); font-weight: 700;
  min-height: 44px;
}
```

Stacks to single column on mobile (`grid-template-columns: 1fr`).

---

## 6. Homepage Plate Grid

### Grid Structure

12-column CSS grid, `gap: var(--grid-gap)`. `--grid-gap` is repointed at `var(--space-sm)` (12px) and holds across breakpoints — the homepage grid semantics outrank the raw scale value, so the name stays even though it now resolves to a token. See §4 Spacing Scale.

### Plate Base

A plate is the base archive card. It renders as either:

- `<a class="plate" href="…">` — the 4 article cards (interactive). The anchor IS the card. One focusable element. No overlay links. No nested tab stops.
- `<article class="plate">` — identity plate, ghost teaser (static). No hover highlight, no pointer cursor, no focus outline.

```css
.plate {
  border: var(--border-weight-content) solid var(--border);
  background: var(--panel);
  display: flex; flex-direction: column;
  justify-content: space-between;
  overflow: hidden; isolation: isolate;
  color: inherit; text-decoration: none;
  transition: border-color var(--motion-fast) var(--ease-default);
}
/* Native <a> cursor already renders as pointer — no redundant rule. */
a.plate:hover { border-color: var(--accent); }
a.plate:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: -5px;
}
```

**Phase 2 change (2026-04-10):** The prior pattern was `<article class="plate">` + absolutely-positioned `<a class="plate-link">` overlay. That created a nested-focusable anti-pattern and made the plate's semantics ambiguous. It is gone. The whole card is now a single block-level anchor.

### Plate Sizes

| Class | Span | Min Height |
|-------|------|------------|
| `.identity-plate` | `span 4` | `346px` |
| `.plate-feature` | `span 5` | `346px` |
| `.plate-secondary` | `span 3` | `230px` |
| `.plate-wide` | `span 5` | `230px` |
| `.plate-banner` | `span 4` | `230px` |

### Identity Plate

Inverted fill: `background: var(--ink)`, `color: var(--bg)`. In dark mode it **stays dark** (`#0a0a0a`) rather than flipping to white, because a lone white island in a field of dark plates fragments the grid. `cursor: default` (not clickable). Hover does NOT trigger red border — stays `var(--border)`.

**Accent history (Phase 3a → Phase 4.1):** Phase 3a introduced a scoped `--accent: #c00` override on this plate because the global `--accent` was flipping to `#ff4d4d` in dark mode — the identity tagline needed to stay the deeper editorial red. Phase 4.1 unified `--accent` to `#c00` in both modes (see §3 Color Palette → Phase 4.1 update) and removed the scoped override. The identity plate now inherits `#c00` naturally:

```css
html.dark-mode .identity-plate {
  background: #0a0a0a;
  color: #f3f0e8;
  border-color: #0a0a0a;
  /* --accent no longer scoped — inherits #c00 from :root in both modes */
}
```

Contents: `.identity-sub` ("ImJustDex" bordered label) → `.identity-name` ("Dexter Jakes") → `.identity-tagline` (red accent text) → `.meta-rail` ("About" link, transparent background, `.45` opacity).

### Image Plates

CSS-generated textures via `::before` pseudo-element. Three texture classes:

**`.img-concrete`** — layered gradients simulating concrete/stone.
**`.img-noise`** — dark noise with subtle color fringing.
**`.img-lines`** — diagonal line pattern on gray gradient.

Shared image plate rules:
```css
.plate-image::before {
  content: ""; position: absolute; inset: 0;
  filter: grayscale(1) contrast(1.15);
  z-index: 0; transform: scale(1.02);
}
.plate-image::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,.08) 55%, rgba(0,0,0,.14));
  z-index: 1;
}
.plate-image .plate-title { color: #fff; text-shadow: 0 2px 0 rgba(0,0,0,.45); }
.plate-image .meta-rail { color: #0a0a0a; background: #f5f5f1; border-color: #0a0a0a; }
```

**Phase 3a change (2026-04-10):** Image plates used to flip to white fills in dark mode via an `invert(1)` on the `::before` filter and a mirrored gradient. That created a fragmented visual field — textured plates bleached out against adjacent dark plain plates. Image plates now stay dark in both modes. The only dark-mode override is none. The grayscale filter and black-to-transparent gradient hold in light and dark.

### Meta Rail

Stamped label at bottom-left of each plate.

```css
.meta-rail {
  align-self: flex-start; margin: auto 0 0;
  /* Exception 4 — 7/6 vertical = 1px optical pull on uppercase meta label.
     Sides snap 10→8 to --space-xs to keep the badge tight (10→12 would
     fatten the meta-rail and break compact plate proportions). */
  padding: 7px var(--space-xs) 6px;
  background: var(--meta-bg); color: var(--meta-ink);
  border-top: var(--border-weight-chrome) solid var(--border);
  border-right: var(--border-weight-chrome) solid var(--border);
  font-size: var(--text-citation); letter-spacing: .08em;
  text-transform: uppercase; font-weight: 700;
  line-height: 1; white-space: nowrap;
}
```

Content format: reading time only (e.g., "8 min"). No dates. No "Read Time:" label.

### Plate Layout (Current)

**Row 1:** Identity (span 4) → Reckonings (span 5, light, `.med`) → The Nets (span 3, dark `.img-concrete`, `.med`)

**Row 2:** Nobody Handed Me This (span 5, dark `.img-noise`, `.lg`) → The Price of Sunday (span 5, light, `.lg`)

**Texture Alternation Rule:** Adjacent plates must never share the same background treatment. Textured plates (img-concrete, img-noise, img-lines) and plain plates must alternate so every card contrasts its neighbor. This applies both horizontally within a row and across row boundaries in reading order.

### Ghost Teaser Plate

```css
.plate-ghost {
  grid-column: span 5; min-height: 346px;
  background: transparent;
  border: var(--border-weight-content) dashed var(--border);
  cursor: default;
}
.plate-ghost .plate-title { color: var(--ink); opacity: .35; }
.plate-ghost .teaser-date {
  font-family: var(--body); font-size: .82rem; font-weight: 700;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink); opacity: .3;
}
.plate-ghost .meta-rail {
  background: transparent; color: var(--ink); opacity: .25;
  border-top: var(--border-weight-chrome) dashed var(--border); border-right: none;
}
```

Used to tease an upcoming article before its publish date. Contains title (muted), "Publishing [date]" microcopy, and "Coming Soon" meta rail. The dashed border and transparency signal *this space is held*. On launch day, swap for the full article plate and remove the ghost CSS from index.html.

### Responsive Grid

**Tablet (`< 1120px`):** 8-column grid. Identity/feature/secondary/banner → `span 4`. Wide → `span 8`.

**Mobile (`< 760px`):** Single column. All plates `span 1`, `min-height: 210px`. `.plate-title.lg` gets `max-width: 100%`.

---

## 7. Article Components

### Article Frame

`.article-frame`: `max-width: 680px`, `margin: 0 auto`, `padding: 0 0 var(--space-3xl)` (80px breathing room before footer).

### Article Header

`border: var(--border-weight-content) solid var(--border)`, `background: var(--panel)`, `padding: var(--space-xl) var(--space-lg) var(--space-lg)`. **Phase 6 drift:** top 28→32 (snap to `--space-xl`) and bottom 22→24 (snap to `--space-lg`) — both are well inside perception threshold for the article header's frame size and worth taking to keep the doc on-scale.

### Section Head

Flex row: `h2` label + horizontal rule line.

```css
/* Margin bottom drift: 20→24 (snap to --space-lg). */
.section-head { display: flex; align-items: center; gap: var(--space-chrome); margin: var(--space-2xl) 0 var(--space-lg); }
.section-head h2 {
  font-family: var(--mono); font-size: .75rem; font-weight: 700;
  letter-spacing: .15em; text-transform: uppercase; color: var(--accent);
}
.section-head-line { flex: 1; height: 3px; background: var(--accent); }
```

### Pull Quote

Full-width break inside article body. Bleeds into article padding with negative margins.

```css
/* Top/bottom margin drift: 40→48 (snap to --space-2xl).
   Negative side margins match --space-lg exactly so the pull-quote
   bleeds flush to the inner edge of the article-body's 3px border —
   the "full-bleed-within-frame" pattern. */
.pull-quote {
  margin: var(--space-2xl) calc(-1 * var(--space-lg));
  padding: var(--space-xl) var(--space-lg);
  border-top: var(--border-weight-content) solid var(--border);
  border-bottom: var(--border-weight-content) solid var(--border);
  background: var(--body-tint);
}
.pull-quote p {
  font-family: var(--display);
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 400; line-height: 1.1;
  letter-spacing: -.02em; text-transform: uppercase;
  color: var(--ink);
}
```

Maximum two per article.

### Callout

```css
/* Drifts: margin 36→32 (snap to --space-xl), left padding 18→16
   (snap to --space-md). Both pull tighter into the scale without
   visibly altering the callout's rhythm against surrounding body. */
.callout {
  margin: var(--space-xl) 0; padding: 0 0 0 var(--space-md);
  border-left: var(--border-weight-content) solid var(--accent);
  font-family: var(--body); font-size: 1.15rem;
  font-weight: 700; line-height: 1.4; color: var(--ink);
}
```

Single sentence or short phrase. Used for rhetorical pivots. Maximum two per article.

### Callout Emphasis

```css
.callout-emph {
  color: var(--accent-text);
  font-weight: 700;
}
```

Optional span class inside `.callout` blocks to highlight a single word or phrase in accent red. Uses `--accent-text` so it auto-lifts to `#ff4d4d` in dark mode — no per-mode override required. Available on all article pages.

### Scripture Block

```css
/* Margin drift: 36→32 (snap to --space-xl). */
.scripture {
  border: var(--border-weight-chrome) solid var(--body-faint);
  background: var(--body-tint);
  padding: var(--space-lg); margin: var(--space-xl) 0;
}
.scripture p {
  font-family: var(--body); font-size: 1rem;
  line-height: 1.7; color: var(--body-color);
  font-style: italic;
}
.scripture cite {
  font-family: var(--mono); font-style: normal;
  font-size: .7rem; letter-spacing: .15em;
  text-transform: uppercase; color: var(--accent-text);
}
```

### Stat Block

```css
/* Same full-bleed-within-frame pattern as .pull-quote — negative side
   margins match --space-lg so the bar+text align flush to the inner
   border. Column gap drift: 20→24 (snap to --space-lg). */
.stat-block {
  margin: var(--space-2xl) calc(-1 * var(--space-lg));
  padding: 0 var(--space-lg);
  display: grid; grid-template-columns: 3px 1fr; gap: 0 var(--space-lg);
}
.stat-block-bar { background: var(--accent); }
.stat-block-text {
  font-family: var(--display);
  font-size: clamp(1.6rem, 5vw, 2.6rem);
  font-weight: 400; letter-spacing: -.03em;
  line-height: 1.05; text-transform: uppercase;
  color: var(--ink);
}
.stat-block-text span {
  display: block; font-family: var(--mono);
  font-size: .7rem; font-weight: 400;
  letter-spacing: .12em; text-transform: uppercase;
  color: var(--body-muted); margin-top: 8px;
}
```

Maximum two per article.

### Closing Block

```css
/* Top padding drift: 28→32 (snap to --space-xl). */
.closing {
  margin-top: var(--space-2xl); padding: var(--space-xl) var(--space-lg);
  border: var(--border-weight-content) solid var(--border);
  background: var(--panel);
  font-family: var(--body); font-size: 1rem;
  line-height: 1.75; color: var(--body-color);
  font-style: italic;
}
```

Always present. Never more than 3–4 sentences. The final direct address to the reader.

### Share Bar

Sits directly below article body (no gap, `border-top: 0`).

```css
.share-bar {
  display: flex; align-items: center; gap: var(--space-chrome);
  padding: var(--space-chrome) var(--space-lg);
  border: var(--border-weight-content) solid var(--border); border-top: 0;
  background: var(--panel);
}
```

The internal `.subscribe-link` button drops the 1px optical pull intentionally — `padding: var(--space-sm) var(--space-chrome)` is symmetric (Exception 9). Sub-button scale is below the perception threshold for a 1px delta, so the pull gets dropped to keep the block reading clean.

Contains: "Share" label (mono, `.7rem`) → X link → Copy Link button → "Follow Me" subscribe button (inverted fill, `margin-left: auto`).

### Research CTA

```css
/* Drifts: vertical padding 18→16 (snap to --space-md), link side
   padding 20→24 (snap to --space-lg). Both sit comfortably inside the
   research-cta's frame proportions. */
.research-cta {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border: var(--border-weight-content) solid var(--border); border-top: 0;
  background: var(--panel); gap: var(--space-md);
}
.research-cta-text {
  font-family: var(--mono); font-size: .7rem; letter-spacing: .15em;
  text-transform: uppercase; color: var(--body-muted); line-height: 1.5;
}
.research-cta-link {
  flex-shrink: 0; font-family: var(--mono);
  font-size: .75rem; letter-spacing: .1em;
  text-transform: uppercase; font-weight: 700;
  padding: var(--space-sm) var(--space-lg); min-height: 44px;
  border: var(--border-weight-chrome) solid var(--border);
  background: var(--ink); color: var(--bg);
  text-decoration: none; white-space: nowrap;
}
```

Reusable CTA bar between article body and share bar. Links to external research, study, or source material that backs the essay. CSS is available on all article pages; add HTML only when an article has a backing research document. Stacks vertically on mobile.

### Back Button

```css
/* Exception 7 — 11px bottom = 1px optical pull on uppercase BACK label.
   Horizontal sits on --space-chrome (14), the named chrome tier. */
.article-back {
  display: inline-block; margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-chrome) 11px; min-height: 44px;
  border: var(--border-weight-chrome) solid var(--border); background: var(--panel);
  font-family: var(--mono); font-size: .75rem;
  letter-spacing: .1em; text-transform: uppercase;
  font-weight: 700;
}
.article-back:hover { border-color: var(--accent); }
```

### Reading Progress Bar (Articles Only)

```css
.reading-progress {
  position: fixed; top: 0; left: 0; width: 0%; height: 3px;
  background: var(--ink); z-index: 9999;
  transition: width var(--motion-fast) linear; pointer-events: none;
}
```

**Phase 3b change (2026-04-10):** Progress bar recolored from `--accent` (red) to `--ink` (black/cream). Red is reserved for section heads, callouts, underlines, and focus rings. A red bar at the top of the viewport was competing with the masthead and diluting the accent's semantic weight.

### Section Indicator (Articles Only)

Fixed-position label at bottom-left. Shows current section head text. Fades in/out via `.visible` class.

```css
/* Drifts: bottom/left 28→32 (snap to --space-xl), padding 6→8 / 12.
   The fixed-position editorial mark sits on the scale cleanly. */
.section-indicator {
  position: fixed; bottom: var(--space-xl); left: var(--space-xl); z-index: 9998;
  font-family: var(--mono); font-size: .6rem;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--ink); background: var(--bg);
  border: var(--border-weight-content) solid var(--ink);
  padding: var(--space-xs) var(--space-sm); opacity: 0;
  transition: opacity var(--motion-slow) ease; pointer-events: none;
  max-width: 260px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
```

**Phase 3b change (2026-04-10):** Dropped the `border-radius`, `box-shadow`, and `1px var(--rule)` hairline in favor of a content-weight hard border on `var(--ink)`. The indicator now reads as a stamped editorial mark, not a floating tooltip chip.

Mobile: `bottom: 16px`, `left: 16px`, `font-size: .52rem`, `max-width: 200px`.

---

## 8. Interaction & Accessibility

### Focus States

All interactive elements use `outline: var(--focus-ring-width) solid var(--focus-ring)` on `:focus-visible`. Width is tokenized (`--focus-ring-width: 2px`); offset stays local per selector (`2px` on chrome elements, `-5px`/`-4px` inset on content frames — see §4 Focus Rings). `--focus-ring` is `#c00` in both modes (unified in Phase 4.1) — non-text contrast only requires 3:1 and `#c00`/`#060606` clears 3.45:1.

### Touch Targets

All buttons and interactive elements have `min-height: 44px` for WCAG compliance.

### Selection

Light mode: `::selection { background: var(--ink); color: var(--bg); }` (homepage)
Article pages: `::selection { background: rgba(204,0,0,.14); }`

### Skip Link

Hidden off-screen, appears on focus: `background: var(--ink)`, `color: var(--bg)`, `padding: var(--space-sm) var(--space-chrome)`.

### Motion Doctrine

Motion is a three-rung duration scale + one easing curve, applied sparingly:

```css
--motion-fast:   120ms;
--motion-med:    180ms;
--motion-slow:   300ms;
--ease-default:  cubic-bezier(.2, .8, .2, 1);
```

If a duration isn't in this scale, it doesn't belong in the product.

**Where each rung lives:**
- **`--motion-fast`** — hover chrome (`a.plate`, `.article-nav-link`, `.mode-toggle` border-color/background), reading progress bar `width` (paired with `linear`).
- **`--motion-med`** — body `background`/`color` mode flip (`html.dark-mode` transition), research CTA `opacity` hover.
- **`--motion-slow`** — section indicator fade (ambient chrome reveal).

Everything else stays instant. No fade-ins. No scroll reveals. No page transitions. `--motion-tiny` from earlier phases was collapsed into `--motion-fast` + `--ease-default` to keep duration and easing authored as orthogonal tokens.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
  }
}
```

### Print

Hides: rulers, mode toggle, share bar, reading progress, section indicator, research CTA. Removes background images. Forces `#fff`/`#000`. Appends URLs to links.

---

## 9. Responsive Breakpoints

| Breakpoint | Trigger | Key Changes |
|------------|---------|-------------|
| `< 1120px` | Tablet | Plate grid → 8 columns. Feature/secondary/identity → span 4. Wide → span 8. |
| `< 760px` | Mobile | Single column plates. Masthead wraps. Footer stacks. Rulers hidden. `--outer-pad: 18px`. `--grid-gap` holds at `var(--space-sm)` (12px) across breakpoints. Article header/body padding reduces. Share bar wraps. Section indicator shrinks. Article nav stacks to single column. |

---

## 10. Dark Mode Behavior

### Global

All structural colors invert through CSS custom properties. The toggle adds/removes `html.dark-mode` (set on the `<html>` element, not `<body>`, so a blocking head script can flip the class before first paint and avoid a flash of the wrong mode). Logo SVG swaps via `/js/mode.js` (`logo-dark.svg` ↔ `logo-white.svg`) using the `data-base` attribute on the logo `<img>` to resolve paths.

When no explicit `dxmode` cookie is set, the page respects the OS `prefers-color-scheme` at load and follows OS preference changes live via `matchMedia`. Once the user clicks the toggle, the cookie takes over and OS changes no longer override.

### Identity Plate (Special Case)

Stays dark in both modes. Light mode: `background: var(--ink)`. Dark mode: `background: #0a0a0a` (scoped override). The plate maintains its editorial signature regardless of ambient mode. No accent scoping is needed anymore — as of Phase 4.1, `--accent` is `#c00` in both modes globally, so the tagline reads at the intended weight on the dark field without any per-plate override.

### Image Plates (Special Case)

Stay dark in both modes. No `html.dark-mode` overrides — the grayscale filter and black-to-transparent gradient hold in light and dark. Flipping them to light in dark mode was fragmenting the visual field; keeping them dark lets textured and plain plates alternate cleanly.

### Scripture Citation

`color: var(--accent-text)` — resolves to `#c00` in light mode and `#ff4d4d` in dark mode. No per-mode override at the selector level. `--accent-text` is the **only** token in the system that still flips in dark mode — the single intentional exception to the unified `#c00` doctrine, because small red text on `#060606` fails WCAG AA at `#c00` (3.45:1) and needs the lifted `#ff4d4d` (7.54:1).

---

## 11. Image Language (Target — Not Yet Implemented)

When images replace the current CSS-generated textures, they must follow these rules:

**Permitted categories:** Monochrome documentary stills. Architecture and concrete forms. Close-cropped textures. High-contrast domestic objects. Archival-feeling personal photography. Degraded digital artifacts.

**Treatment:** Always `filter: grayscale(1) contrast(1.15)`. Always covered with gradient overlay for text legibility. Images stay dark in both modes — no per-mode flip. Light-mode legibility comes from the gradient; dark-mode integration comes from the ambient dark field.

**Test:** Every image must answer: *what tension does this create with the title?* If it doesn't increase tension, cut it.

---

## 11.5 Security, CSP, and Caching

### Content Security Policy

`netlify.toml` ships a strict self-only CSP. No `unsafe-inline` anywhere.

```
default-src 'self';
script-src 'self';
style-src 'self';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
upgrade-insecure-requests
```

Every script lives in `/js/*`. Every stylesheet lives in `/css/*`. Every font lives in `/fonts/*`. No inline `<style>` blocks. No inline `<script>` blocks. No inline `onclick` / `onload` / `onerror` attributes. No Google Fonts. No analytics beacons. No CDNs.

When adding behavior, the rule is: write it in `/js/*.js`, gate it on the DOM elements it targets (no-op if absent), and load it with `<script src>`. When adding copy-to-clipboard or similar interactions, use `data-*` attributes read by the script — never inline handlers.

### Other Security Headers

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

### Cache-Control

| Path pattern | Header |
|--------------|--------|
| `/*.html` | `public, max-age=0, must-revalidate` |
| `/css/*` | `public, max-age=31536000, immutable` |
| `/js/*` | `public, max-age=31536000, immutable` |
| `/fonts/*` | `public, max-age=31536000, immutable` + `Access-Control-Allow-Origin: *` |
| `/img/*` | `public, max-age=31536000, immutable` |

HTML is always fresh. Static assets cache for a year and are busted by filename if a breaking change ships. Fonts get CORS on top of the immutable cache so cross-origin preloads never get blocked.

---

## 12. Metadata & SEO

### Title Pattern

- Homepage: `DX — Dexter Jakes`
- Article: `{Article Title} — DX`
- About: `About — DX`

### OG/Social

All pages set: `og:title`, `og:description`, `og:image` (default: `/img/og-default.png`), `og:url`, `og:type`, `og:site_name` ("DX"). Articles add `article:author` ("Dexter Jakes") and `article:published_time`.

Twitter cards: `summary_large_image`.

### Title Standardization

Titles appear on four surfaces: archive plate, article `<h1>`, `<title>` tag, and OG/social metadata. All four use the same string. No periods in display titles. CSS `text-transform: uppercase` handles casing — source HTML uses natural case.

---

## 13. Microcopy & Editorial Voice

All interface-level language follows one register: **terse, stamped, authored.**

**No articles or prepositions in labels.** "Est. 1994" — not "Established in 1994."

**No verbs in metadata.** "8 min" — not "Takes 8 minutes to read."

**No friendliness.** No "Welcome," "Thanks for reading," "Enjoy." The site does not greet. It presents.

**No marketing language.** No "Don't miss out," "Join the community," "Stay updated." The only CTAs permitted are "Follow Me" and "Follow @ImJustDex."

**Mode toggle reads as state, not invitation.** "Mode: Light" / "Mode: Dark" — not "Switch to dark mode."

**Footer text is identity, not explanation.** "Est. 1994" is a mark, not a description. It does not need to be understood by everyone. It needs to be consistent.

**Tags are classification, not decoration.** Single-word categorical labels. Never cute. Never clever. Never more than two per piece.

### Permitted Tag Vocabulary

Faith, Identity, Work, Grief, Inheritance, Language, Calling, Strategy

New tags may be added. Each must be a single word that names a weight, not a topic.

---

## 14. File Structure

```
imjustdex.com/
├── index.html                    ← Homepage (plate grid + identity)
├── 404.html                      ← Custom 404 (served by Netlify fallback)
├── about/
│   └── index.html                ← About page
├── words/
│   ├── reckonings/index.html
│   ├── the-nets/index.html
│   ├── gumbo/index.html
│   └── price-of-sunday/index.html
├── css/
│   ├── tokens.css                ← Tokens, @font-face, :root, html.dark-mode, reset, grid body, print, reduced-motion
│   ├── shell.css                 ← Skip link, page-shell, rulers, masthead, brand-block, mode-toggle, footer-strip, focus
│   ├── plates.css                ← Plate grid, plate variants, meta rail, image plates, identity, ghost
│   ├── article.css               ← Article frame, header, body, drop cap, section heads, components, share bar, progress
│   └── notfound.css              ← 404-only plate, eyebrow, headline, actions
├── js/
│   ├── mode.js                   ← Mode toggle (head-phase FOUC prevention + DOMContentLoaded wiring)
│   ├── progress.js               ← Reading progress bar + section indicator (article pages)
│   └── essay.js                  ← data-copy-link share button wiring (CSP-safe)
├── fonts/
│   ├── Anton-Regular.woff2
│   ├── IBMPlexSans-Regular.woff2
│   └── IBMPlexSans-Bold.woff2
├── img/
│   ├── logo-dark.svg
│   ├── logo-white.svg
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   └── og-default.png
├── DESIGN-SYSTEM.md              ← This file
└── netlify.toml                  ← Deploy config (strict CSP, trailing-slash redirects, cache headers)
```

No page embeds inline CSS or inline JavaScript. Every page loads the same `tokens.css` + `shell.css` universal pair, then one page-type sheet (`plates.css`, `article.css`, or `notfound.css`). Shared elements are defined once and never replicated by hand — changing the masthead or footer means editing `shell.css` once.

### Removed Routes (April 2026)

The following TPH-era prototype routes have been removed from the editorial repo and redirect to `/` in `netlify.toml`. They were migrated into the Cowork OS under `TPH Marketing/`.

- `/opsmeeting` and `/opsmeeting/*`
- `/leadership-prep` and `/leadership-prep/*`
- `/asana-workflow` and `/asana-workflow/*`

### Trailing-Slash Canonical

All article and About URLs are canonical with a trailing slash (`/about/`, `/words/the-nets/`, etc.). Non-slash variants 301-redirect to the slash version in `netlify.toml`. The homepage (`/`) and `404.html` are the only pages without a trailing-slash canonical.

---

## 15. Exception Policy

The standard governs all production pages. Exceptions are permitted only under these conditions:

**What qualifies:** A photo essay, a long-form project page, a collaboration, a one-time editorial experiment, or any page that cannot fulfill its purpose within the standard template.

**What does not qualify:** Wanting more color. Wanting a different font. Wanting the page to "feel different." Aesthetic preference is not an exception — it is drift.

### Exception Rules

1. Must use the same shell (masthead, rulers, footer strip, grid background, mode toggle).
2. Must use the same color variables. No new colors.
3. Must be visually recognizable as part of imjustdex.com within the first viewport.
4. Must be documented here with a one-line rationale before it ships.

### Active Exceptions

(None)

---

## 16. What This System Is Not

This is not a blog theme. It is not a personal website template.

Every decision — border weight, title scale, metadata format, accent placement — exists to make the site feel printed, rigid, and inevitable. If a change makes the site feel more like a "website" and less like a "publication," the change is wrong.

---

## 17. Machine-Legibility Layer (Phase 2)

Added 2026-04-10 to make the site machine-legible for search engines, feed readers, and schema consumers without altering a single visible pixel.

### Structured Data (JSON-LD)

Every page ships Schema.org JSON-LD in the `<head>`, embedded as `<script type="application/ld+json">`.

- **Homepage (`/`)** — `@graph` with `WebSite` + `Person` nodes. The `Person` node is the canonical identity (`@id: https://imjustdex.com/#person`) referenced from every article's `author` and `publisher` fields.
- **About (`/about/`)** — `ProfilePage` whose `mainEntity` is the same `Person` node.
- **Each article (`/words/*/`)** — `BlogPosting` with `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `mainEntityOfPage`, `image`, `url`, `inLanguage`, and `wordCount`.

`wordCount` is computed from article source text at the time of the edit. Refresh it when an article is materially rewritten.

`image` points to `/img/og-default.png` site-wide until Phase 4.3 ships the per-article OG generator. Swap the URL only — the schema shape stays the same.

### Sitemap + Robots

- **`/sitemap.xml`** — flat `urlset` with the homepage, About, and every published article. `lastmod`, `changefreq`, `priority` per URL. Update this file when a new article ships.
- **`/robots.txt`** — one-line `Allow: /` plus a `Sitemap:` pointer. No disallow rules. Nothing on this site should be blocked from indexing.

### Atom Feed

- **`/feed.xml`** — Atom 1.0 with site-level metadata and one `<entry>` per published article in reverse-chronological order. `summary` ships (not full content) to keep the file light. `<category>` tags mirror the `data-tags` attribute from the archive plate.
- Discovery: `<link rel="alternate" type="application/atom+xml" href="/feed.xml">` in the `<head>` of `/` and `/about/`.

### Per-Article Dates

Every archive plate and article header now carries a `<time datetime="YYYY-MM-DD">` element. The archive plate renders the date inline in the meta rail (`Apr 8 · 14 min`), the article header renders the full formatted date. Both machine-readable and visible.

### Previous / Next Essay

Every article has two links to its chronological neighbors:

1. **`<head>`** — `<link rel="prev" href="…">` and `<link rel="next" href="…">` for crawlers.
2. **Article body** — A `.article-nav` block below the share bar: a two-column grid of prev and next, each with a mono label and a display-cased title. On viewports narrower than 640px the grid collapses to a single column. First and last articles render only one direction, spanning the full row (`:only-child`).

Chronological order is by `datePublished` (oldest → newest): Reckonings → Price of Sunday → Nobody Handed Me This → The Nets Were Already Full.

### Update Rules

When a new article ships:

1. Add a plate to `/index.html` (`<a class="plate" …>` with inline `<time>`).
2. Add a `BlogPosting` JSON-LD block to the article's `<head>` and compute its `wordCount` from source.
3. Add a `<url>` entry to `/sitemap.xml`.
4. Add an `<entry>` to the top of `/feed.xml` and bump the feed's `<updated>` timestamp.
5. Update the previous article's `<link rel="next">` + `.article-nav-next` to point at the new one.
6. Add the new article's `<link rel="prev">` + `.article-nav-prev` pointing at what was previously the last article.

No step is optional. Skip one and the SEO layer drifts.
