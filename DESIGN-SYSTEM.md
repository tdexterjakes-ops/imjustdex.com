# DX Editorial Design Standard

This document codifies the design system for dxjakes.com. It exists so the system does not drift. Every value listed here is pulled from production CSS as of April 2026.

---

## 1. System Architecture

The site is a static HTML publishing system. No build step. No framework. Each page is a self-contained HTML file with inline `<style>` blocks. Netlify auto-deploys on push to `main` on `tdexterjakes-ops/dxjakes.com`.

### Page Types

**Homepage** (`/`) — Identity plate embedded in Row 1 of a 12-column plate grid. The archive IS the homepage. Filter rail allows tag-based filtering. No standalone hero. No scroll indicator.

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
| `--accent` | `#c00` | Emphasis accent |
| `--body-color` | `rgba(5,5,5,.82)` | Article body text |
| `--body-muted` | `rgba(5,5,5,.56)` | Article metadata, secondary text |
| `--body-faint` | `rgba(5,5,5,.18)` | Faint borders in article context |
| `--body-tint` | `rgba(5,5,5,.04)` | Tinted backgrounds (pull quotes, scripture) |

### Dark Mode (`body.dark-mode`)

| Variable | Value |
|----------|-------|
| `--bg` | `#060606` |
| `--panel` | `#0d0d0d` |
| `--ink` | `#f3f0e8` |
| `--muted` | `#d7d3ca` |
| `--border` | `#f3f0e8` |
| `--rule` | `rgba(255,255,255,.16)` |
| `--meta-bg` | `#f3f0e8` |
| `--meta-ink` | `#0a0a0a` |
| `--body-color` | `rgba(243,240,232,.82)` |
| `--body-muted` | `rgba(243,240,232,.52)` |
| `--body-faint` | `rgba(243,240,232,.14)` |
| `--body-tint` | `rgba(243,240,232,.04)` |

Dark mode is not personalization. It is a second editorial mode. Both modes are locked and authored. Mode is cookie-persisted (`dxmode`), applied via `body.dark-mode` class toggle.

### Accent Red (`#c00`) — Rules

Red marks editorial emphasis. Never decoration.

**Permitted:**
- Section head `h2` text color (`var(--accent)`)
- Section head horizontal rule line (`var(--accent)`)
- Reading progress bar (`var(--accent)`)
- Callout left-border (3px rule)
- Callout emphasis spans (`.callout-emph`)
- Scripture block cite text (light mode: `var(--accent)`; dark mode: `#f44`)
- Stat block vertical bar
- Identity plate tagline text
- Link underline on hover (article body only)
- Plate border on hover (homepage/index)
- Focus-visible outline rings

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
| `--display` | `Impact, Haettenschweiler, 'Impact', sans-serif` | Titles, identity marks, pull quotes, stat blocks |
| `--body` | `'IBM Plex Sans', system-ui, -apple-system, sans-serif` | Homepage/index plate context, base body font |
| `--serif` | `Georgia, 'Times New Roman', serif` | Article body text, closing blocks, callouts |
| `--mono` | `'SF Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace` | Metadata, tags, eyebrows, section heads, share bar, nav labels, footer |

### Display Type Rules

All display type (`--display`) uses: `text-transform: uppercase`, `font-weight: 900`, `line-height: .86`, `letter-spacing: -.03em`, `word-break: break-word`, `text-wrap: balance`.

### Title Scale

**Homepage plates:**

| Class | Size | Notes |
|-------|------|-------|
| `.plate-title` (default) | `clamp(2rem, 4vw, 4rem)` | Standard plate |
| `.plate-title.med` | `clamp(2.35rem, 5vw, 5rem)` | Medium emphasis |
| `.plate-title.lg` | `clamp(3.5rem, 7vw, 7.2rem)` | Large emphasis, `max-width: 8ch` on desktop |

**Identity plate:**

| Element | Size | Notes |
|---------|------|-------|
| `.identity-name` | `clamp(3.8rem, 10vw, 7.5rem)` | `line-height: .82`, `max-width: 7ch` |
| `.identity-tagline` | `clamp(1.35rem, 2.4vw, 2.4rem)` | `line-height: .9`, `color: #c00`, `opacity: .85`, `max-width: 14ch` |
| `.identity-sub` | `.75rem` | Bordered label, inverted colors |

**Article:**

| Element | Size |
|---------|------|
| `.article-title` | `clamp(2.8rem, 7vw, 5rem)` |
| `.article-deck` | `.8rem` mono, uppercase, `max-width: 480px`, 3px left border |
| `.article-tag` | `.75rem` mono, inverted fill |
| `.article-date`, `.article-read` | `.75rem` mono, `color: var(--body-muted)` |

### Body Text

Article body: `font-family: var(--serif)`, `font-size: 1.08rem`, `line-height: 1.85`, `color: var(--body-color)`.

Paragraph spacing: `margin-bottom: 1.5em`.

Article body links: `text-decoration: underline`, `text-decoration-color: var(--accent)`, `text-underline-offset: 3px`, `text-decoration-thickness: 2px`. Hover: `color: var(--accent)`.

### Drop Cap

`.intro::first-letter` — `font-family: var(--display)`, `font-size: 4.8em`, `font-weight: 900`, `float: left`, `line-height: .72`, `margin-right: 8px`, `margin-top: 4px`, `color: var(--ink)`.

Applied only to the first paragraph of each article (class `.intro`). Never repeated.

### Mono Register Rules

All mono-set elements (`--mono`): always uppercase, always small (`.65`–`.84rem`), always tracked (`.06`–`.15em`). This is the system voice — functional, stamped, non-decorative.

---

## 4. Structural Elements

### Border Language

**3px solid `var(--border)` — primary structural borders:**
- Plate outlines (homepage grid)
- Article header border
- Article body left/right/bottom borders
- Share bar border (3px, `border-top: 0`)
- Closing block border
- Pull quote top/bottom borders
- Section head horizontal rule
- Callout left border (3px `var(--accent)`)

**2px solid `var(--border)` — secondary borders:**
- Tags (`.article-tag`)
- Meta rail top/right edges
- Scripture block border (`var(--body-faint)`)
- Brand block + nav elements
- Mode toggle
- Footer strip items
- Back button
- Subscribe/Follow Me button
- Identity sub label

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

`.page-shell`: `max-width: 1440px`, `margin: 0 auto`, `padding: 12px var(--outer-pad) 22px`. Respects `env(safe-area-inset-left/right)`.

`--outer-pad`: `28px` desktop, `18px` mobile.

---

## 5. Page Shell Components

### Masthead

`position: sticky`, `top: 0`, `z-index: 50`. Flex row: brand-block + mode-toggle. `background: linear-gradient(to bottom, var(--bg) 70%, rgba(0,0,0,0))` — fades to transparent.

**Brand block:** Inline-flex, `2px solid var(--border)`, contains:
- `.brand-mark`: DX logo SVG (`height: 28px`), `min-width: 72px`, centered. Logo switches between `logo-dark.svg` (light mode) and `logo-white.svg` (dark mode) via JavaScript.
- `.brand-word`: "Words" label, inverted fill (`background: var(--ink)`, `color: var(--bg)`), `.92rem`, `font-weight: 900`.

Both segments: `padding: 8px 10px 7px`, `border-right: 2px solid var(--border)`, uppercase, `letter-spacing: .03em`.

**Mode toggle:** `margin-left: auto`. Bordered button, `.88rem`, `font-weight: 900`, `min-height: 44px`. Text reads "Mode: Light" / "Mode: Dark". Cookie-persisted.

### Footer Strip

Two-item grid: "Follow @ImJustDex" (links to Instagram) | "Est. 1994".

```css
.footer-strip {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px; margin-top: 12px;
  position: relative; z-index: 2;
}
.footer-strip > * {
  border: 2px solid var(--border); background: var(--panel);
  padding: 12px 14px 11px; text-transform: uppercase;
  letter-spacing: .06em; font-size: .84rem; font-weight: 900;
  min-height: 44px;
}
```

Stacks to single column on mobile (`grid-template-columns: 1fr`).

### Filter Rail (Homepage Only)

Horizontal button bar above the plate grid. Scrollable on mobile. Buttons: "All", plus one per tag. Active state: inverted fill.

```css
.filter-btn {
  border: 2px solid var(--border); border-right: 0;
  background: var(--panel); color: var(--muted);
  padding: 14px 16px 13px; font-size: .78rem;
  font-weight: 900; letter-spacing: .1em;
  min-height: 44px;
}
.filter-btn.active {
  background: var(--ink); color: var(--bg);
  border-color: var(--ink);
}
```

---

## 6. Homepage Plate Grid

### Grid Structure

12-column CSS grid, `gap: var(--grid-gap)` (12px desktop, 10px mobile).

### Plate Base

```css
.plate {
  border: 3px solid var(--border);
  background: var(--panel);
  display: flex; flex-direction: column;
  justify-content: space-between;
  overflow: hidden; isolation: isolate;
  cursor: pointer;
}
.plate:hover { border-color: #c00; }
```

### Plate Sizes

| Class | Span | Min Height |
|-------|------|------------|
| `.identity-plate` | `span 4` | `346px` |
| `.plate-feature` | `span 5` | `346px` |
| `.plate-secondary` | `span 3` | `230px` |
| `.plate-wide` | `span 5` | `230px` |
| `.plate-banner` | `span 4` | `230px` |

### Identity Plate

Inverted fill: `background: var(--ink)`, `color: var(--bg)`. In dark mode: `background: #ffffff`, `color: #050505`. `cursor: default` (not clickable). Hover does NOT trigger red border — stays `var(--border)`.

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

**Dark mode image plate inversion:**
```css
body.dark-mode .plate-image::before { filter: grayscale(1) contrast(1.15) invert(1); }
body.dark-mode .plate-image::after {
  background: linear-gradient(to top, rgba(255,255,255,.78), rgba(255,255,255,.08) 55%, rgba(255,255,255,.14));
}
body.dark-mode .plate-image .plate-title { color: #050505; text-shadow: none; }
body.dark-mode .plate-image .meta-rail { color: #f5f5f1; background: #0a0a0a; border-color: #f3f0e8; }
```

### Meta Rail

Stamped label at bottom-left of each plate.

```css
.meta-rail {
  align-self: flex-start; margin: auto 0 0;
  padding: 7px 10px 6px;
  background: var(--meta-bg); color: var(--meta-ink);
  border-top: 2px solid var(--border);
  border-right: 2px solid var(--border);
  font-size: .8rem; letter-spacing: .08em;
  text-transform: uppercase; font-weight: 900;
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
  border: 3px dashed var(--border);
  cursor: default;
}
.plate-ghost .plate-title { color: var(--ink); opacity: .35; }
.plate-ghost .teaser-date {
  font-family: var(--body); font-size: .82rem; font-weight: 900;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink); opacity: .3;
}
.plate-ghost .meta-rail {
  background: transparent; color: var(--ink); opacity: .25;
  border-top: 2px dashed var(--border); border-right: none;
}
```

Used to tease an upcoming article before its publish date. Contains title (muted), "Publishing [date]" microcopy, and "Coming Soon" meta rail. The dashed border and transparency signal *this space is held*. On launch day, swap for the full article plate and remove the ghost CSS from index.html.

### Responsive Grid

**Tablet (`< 1120px`):** 8-column grid. Identity/feature/secondary/banner → `span 4`. Wide → `span 8`.

**Mobile (`< 760px`):** Single column. All plates `span 1`, `min-height: 210px`. `.plate-title.lg` gets `max-width: 100%`.

---

## 7. Article Components

### Article Frame

`.article-frame`: `max-width: 680px`, `margin: 0 auto`, `padding: 0 0 80px`.

### Article Header

`border: 3px solid var(--border)`, `background: var(--panel)`, `padding: 28px 24px 22px`. Contains eyebrow (tag + date + read time), title, and deck.

### Section Head

Flex row: `h2` label + horizontal rule line.

```css
.section-head { display: flex; align-items: center; gap: 14px; margin: 48px 0 20px; }
.section-head h2 {
  font-family: var(--mono); font-size: .75rem; font-weight: 900;
  letter-spacing: .15em; text-transform: uppercase; color: var(--accent);
}
.section-head-line { flex: 1; height: 3px; background: var(--accent); }
```

### Pull Quote

Full-width break inside article body. Bleeds into article padding with negative margins.

```css
.pull-quote {
  margin: 40px -24px; padding: 32px 24px;
  border-top: 3px solid var(--border);
  border-bottom: 3px solid var(--border);
  background: var(--body-tint);
}
.pull-quote p {
  font-family: var(--display);
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 900; line-height: 1.1;
  letter-spacing: -.02em; text-transform: uppercase;
  color: var(--ink);
}
```

Maximum two per article.

### Callout

```css
.callout {
  margin: 36px 0; padding: 0 0 0 18px;
  border-left: 3px solid var(--accent);
  font-family: var(--serif); font-size: 1.15rem;
  font-weight: 700; line-height: 1.4; color: var(--ink);
}
```

Single sentence or short phrase. Used for rhetorical pivots. Maximum two per article.

### Callout Emphasis

```css
.callout-emph {
  color: var(--accent);
  font-weight: 900;
}
body.dark-mode .callout-emph { color: #f44; }
```

Optional span class inside `.callout` blocks to highlight a single word or phrase in accent red. Available on all article pages.

### Scripture Block

```css
.scripture {
  border: 2px solid var(--body-faint);
  background: var(--body-tint);
  padding: 24px; margin: 36px 0;
}
.scripture p {
  font-family: var(--serif); font-size: 1rem;
  line-height: 1.7; color: var(--body-color);
  font-style: italic;
}
.scripture cite {
  font-family: var(--mono); font-style: normal;
  font-size: .7rem; letter-spacing: .15em;
  text-transform: uppercase; color: var(--accent);
}
body.dark-mode .scripture cite { color: #f44; }
```

### Stat Block

```css
.stat-block {
  margin: 48px -24px; padding: 0 24px;
  display: grid; grid-template-columns: 3px 1fr; gap: 0 20px;
}
.stat-block-bar { background: var(--accent); }
.stat-block-text {
  font-family: var(--display);
  font-size: clamp(1.6rem, 5vw, 2.6rem);
  font-weight: 900; letter-spacing: -.03em;
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
.closing {
  margin-top: 48px; padding: 28px 24px;
  border: 3px solid var(--border);
  background: var(--panel);
  font-family: var(--serif); font-size: 1rem;
  line-height: 1.75; color: var(--body-color);
  font-style: italic;
}
```

Always present. Never more than 3–4 sentences. The final direct address to the reader.

### Share Bar

Sits directly below article body (no gap, `border-top: 0`).

```css
.share-bar {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 24px;
  border: 3px solid var(--border); border-top: 0;
  background: var(--panel);
}
```

Contains: "Share" label (mono, `.7rem`) → X link → Copy Link button → "Follow Me" subscribe button (inverted fill, `margin-left: auto`).

### Research CTA

```css
.research-cta {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px;
  border: 3px solid var(--border); border-top: 0;
  background: var(--panel); gap: 16px;
}
.research-cta-text {
  font-family: var(--mono); font-size: .7rem; letter-spacing: .15em;
  text-transform: uppercase; color: var(--body-muted); line-height: 1.5;
}
.research-cta-link {
  flex-shrink: 0; font-family: var(--mono);
  font-size: .75rem; letter-spacing: .1em;
  text-transform: uppercase; font-weight: 900;
  padding: 12px 20px; min-height: 44px;
  border: 2px solid var(--border);
  background: var(--ink); color: var(--bg);
  text-decoration: none; white-space: nowrap;
}
```

Reusable CTA bar between article body and share bar. Links to external research, study, or source material that backs the essay. CSS is available on all article pages; add HTML only when an article has a backing research document. Stacks vertically on mobile.

### Back Button

```css
.article-back {
  display: inline-block; margin-top: 16px;
  padding: 12px 14px 11px; min-height: 44px;
  border: 2px solid var(--border); background: var(--panel);
  font-family: var(--mono); font-size: .75rem;
  letter-spacing: .1em; text-transform: uppercase;
  font-weight: 900;
}
.article-back:hover { border-color: var(--accent); }
```

### Reading Progress Bar (Articles Only)

```css
.reading-progress {
  position: fixed; top: 0; left: 0; width: 0%; height: 3px;
  background: var(--accent); z-index: 9999;
  transition: width .12s linear; pointer-events: none;
}
```

### Section Indicator (Articles Only)

Fixed-position label at bottom-left. Shows current section head text. Fades in/out via `.visible` class.

```css
.section-indicator {
  position: fixed; bottom: 28px; left: 28px; z-index: 9998;
  font-family: var(--mono); font-size: .6rem;
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--ink); background: var(--bg);
  border: 1px solid var(--rule); padding: 6px 12px;
  border-radius: 2px; opacity: 0;
  transition: opacity .3s ease; pointer-events: none;
  max-width: 260px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
  box-shadow: 0 1px 4px rgba(0,0,0,.12);
}
```

Mobile: `bottom: 16px`, `left: 16px`, `font-size: .52rem`, `max-width: 200px`.

---

## 8. Interaction & Accessibility

### Focus States

All interactive elements use `outline: 2px solid var(--accent)`, `outline-offset: 2px` on `:focus-visible`.

### Touch Targets

All buttons and interactive elements have `min-height: 44px` for WCAG compliance.

### Selection

Light mode: `::selection { background: var(--ink); color: var(--bg); }` (homepage)
Article pages: `::selection { background: rgba(204,0,0,.14); }`

### Skip Link

Hidden off-screen, appears on focus: `background: var(--ink)`, `color: var(--bg)`, `padding: 10px 14px`.

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

Hides: rulers, mode toggle, share bar, filter rail. Removes background images. Forces `#fff`/`#000`. Appends URLs to links.

---

## 9. Responsive Breakpoints

| Breakpoint | Trigger | Key Changes |
|------------|---------|-------------|
| `< 1120px` | Tablet | Plate grid → 8 columns. Feature/secondary/identity → span 4. Wide → span 8. |
| `< 760px` | Mobile | Single column plates. Masthead wraps. Footer stacks. Rulers hidden. `--outer-pad: 18px`. `--grid-gap: 10px`. Article header/body padding reduces. Share bar wraps. Section indicator shrinks. Filter buttons compact. |

---

## 10. Dark Mode Behavior

### Global

All structural colors invert through CSS custom properties. The toggle adds/removes `body.dark-mode`. Logo SVG swaps via JavaScript (`logo-dark.svg` ↔ `logo-white.svg`).

### Identity Plate (Special Case)

Light mode: `background: var(--ink)` (dark plate). Dark mode: `background: #ffffff`, `color: #050505`, `border-color: #ffffff` (inverts to light plate).

### Image Plates (Special Case)

Texture `::before` gets `invert(1)` added to filter chain. Gradient overlay `::after` flips from black-to-transparent to white-to-transparent. Title text goes from white to `#050505`. Meta rail inverts from light-on-dark to dark-on-light.

### Scripture Citation

`color: var(--accent)` in light mode. `color: #f44` in dark mode (brighter red for contrast on dark backgrounds).

---

## 11. Image Language (Target — Not Yet Implemented)

When images replace the current CSS-generated textures, they must follow these rules:

**Permitted categories:** Monochrome documentary stills. Architecture and concrete forms. Close-cropped textures. High-contrast domestic objects. Archival-feeling personal photography. Degraded digital artifacts.

**Treatment:** Always `filter: grayscale(1) contrast(1.15)`. Always covered with gradient overlay for text legibility. Dark mode adds `invert(1)` to filter chain and flips gradient to white-based.

**Test:** Every image must answer: *what tension does this create with the title?* If it doesn't increase tension, cut it.

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
dxjakes.com/
├── index.html                    ← Homepage (plate grid + identity)
├── about/
│   └── index.html                ← About page
├── words/
│   ├── index.html                ← Words index (plate grid, no identity)
│   ├── reckonings/index.html
│   ├── the-nets/index.html
│   ├── gumbo/index.html
│   ├── price-of-sunday/index.html
│   ├── gloria/index.html
│   ├── job/index.html
│   ├── pulpit/index.html
│   └── next-verse/index.html
├── img/
│   ├── logo-dark.svg
│   ├── logo-white.svg
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   └── og-default.png
├── DESIGN-SYSTEM.md              ← This file
└── netlify.toml                  ← Deploy config
```

Each HTML file is fully self-contained — styles inline, no external CSS sheets. No build step. No shared partials. Changes to shared elements (masthead, footer, mode toggle) must be replicated across all pages manually.

---

## 15. Exception Policy

The standard governs all production pages. Exceptions are permitted only under these conditions:

**What qualifies:** A photo essay, a long-form project page, a collaboration, a one-time editorial experiment, or any page that cannot fulfill its purpose within the standard template.

**What does not qualify:** Wanting more color. Wanting a different font. Wanting the page to "feel different." Aesthetic preference is not an exception — it is drift.

### Exception Rules

1. Must use the same shell (masthead, rulers, footer strip, grid background, mode toggle).
2. Must use the same color variables. No new colors.
3. Must be visually recognizable as part of dxjakes.com within the first viewport.
4. Must be documented here with a one-line rationale before it ships.

### Active Exceptions

(None)

---

## 16. What This System Is Not

This is not a blog theme. It is not a personal website template.

Every decision — border weight, title scale, metadata format, accent placement — exists to make the site feel printed, rigid, and inevitable. If a change makes the site feel more like a "website" and less like a "publication," the change is wrong.
