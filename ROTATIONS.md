# Home Page Rotations

Every new published essay triggers a rotation on `/index.html`. This file stages the next flip and documents the protocol.

---

## Protocol

On publish day, touch only these six regions of `index.html`:

1. **Issue meta** (lines 103–106) — entry number + week label.
2. **Latest bar** (lines 107–113) — title, date, read time, lane, href.
3. **Lead plate** (lines 162–185) — "This Week" featured essay.
4. **Earlier-this-month stack** (lines 193–240) — cascade: what was lead becomes plate-wide; everything shifts one slot down.
5. **Lane index** (lines 137–150) — bump the essay count for the lane that just shipped.
6. **Issue-next** (lines 245–251) — update to the next `Deployed` essay in the calendar.

Entry numbers = chronological rank of all entries (Published + Deployed + Drafted) by publish date. Zero-pad to two digits.

Cascade rule: the home surfaces the lead + 3 earlier. When a 5th essay publishes, the oldest in view drops to the deep archive. No 4th "earlier" slot.

Meta-rail convention: every meta rail (latest bar, lead plate eyebrow, earlier plates, issue-next) uses `lane · date · read-time`. Never relative time ("in two days," "next week") — it ages wrong and breaks the editorial calm.

---

## Next Rotation — Entry No. 05 · Apr 19, 2026

**Publishing:** The Groan Beneath the Song (Art · `/words/gloria/` · 18 min)

**Drops off home:** I Don't Do Resolutions, I Do Reckonings (still lives at `/words/reckonings/`).

### Exact edits

**Issue meta (line 104–105):**
```html
<span class="issue-no">Entry No. 05</span>
<span>Week of April 19, 2026</span>
```

**Latest bar (lines 107–113):**
```html
<a class="issue-standfirst issue-latest" href="/words/gloria/" aria-label="Read: The Groan Beneath the Song">
  <span class="latest-tag">Latest</span>
  <span class="latest-title">The Groan Beneath the Song</span>
  <span class="latest-meta">Art · Apr 19 · 18 min</span>
  <span class="latest-cta" aria-hidden="true">Read →</span>
</a>
```

**Lead plate (lines 162–185):**
```html
<article>
  <a class="plate plate-lead" href="/words/gloria/" aria-label="Read: The Groan Beneath the Song" data-lane="art">
    <div class="lead-image" aria-hidden="true">
      <div class="lead-badge">
        <span class="lead-badge-label">Latest</span>
        <span class="lead-badge-lane">Art</span>
      </div>
    </div>
    <div class="lead-body">
      <div>
        <div class="lead-eyebrow"><time datetime="2026-04-19">Apr 19</time> · 18 min read</div>
        <h2 class="lead-title">The Groan Beneath the Song</h2>
        <p class="lead-deck">
          On the Sunday school lie that split sacred from secular, the Psalms that broke it, and the song that met me when I couldn&rsquo;t pray.
        </p>
      </div>
      <div class="lead-rail">
        <span class="rail-meta">Essay · 18 min</span>
        <span class="rail-cta">Read →</span>
      </div>
    </div>
  </a>
</article>
```

**Earlier-this-month cascade (lines 193–240):** Shift down by one. New stack top-to-bottom:

1. `plate-wide plate-image img-noise` → **The Nets Were Already Full** · `/words/the-nets/` · Faith · Apr 8 · 14 min · deck: "Marketing and ministry, the Sea of Galilee, and the work of knowing the room before you ask it to follow."
2. `plate-secondary` → **Nobody Handed Me This** · `/words/gumbo/` · Identity · Apr 6 · 12 min · deck: "A gumbo built from scratch — Brazilian wife, Southern upbringing, and the patience a pot demands."
3. `plate-banner plate-image img-concrete` → **The Price of Sunday** · `/words/price-of-sunday/` · Faith · Apr 4 · 10 min · deck: "Holy Saturday — the silent day before resurrection, and the work of being still."

Reckonings drops off the home.

**Lane index (lines 137–150):** Bump Art from "In the queue" to "01 essay". (First Art essay.)

**Issue-next (lines 245–251):**
```html
<a class="issue-next" href="#subscribe-manifesto" aria-label="Scroll to subscribe and be notified when I Am Not My Father&rsquo;s Pulpit is published">
  <span class="next-tag">Next</span>
  <span class="next-title">I Am Not My Father&rsquo;s Pulpit</span>
  <span class="next-meta">Identity · Apr 23 · 12 min</span>
  <span class="next-cta" aria-hidden="true">Notify me →</span>
</a>
```

---

## Decisions (locked 2026-04-18)

- **Art lane lead plate** — ships on the default lead-image pattern. No `img-art` texture required for Entry 05. Revisit if an Art-specific treatment is introduced later.
- **No relative time copy** in meta rails. Always `lane · date · read-time`. Applied to the live issue-next (The Groan Beneath the Song) and codified as a protocol rule above.
