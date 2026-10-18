#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// sermon-poster.mjs — render the IMJUSTDEX video poster for a sermon entry.
//
//   node scripts/sermon-poster.mjs <slug> --still <image> [--vol N]
//
// Sibling of og-plate.mjs, not a mode of it. og-plate.mjs produces the
// released share plate whose sha256 is pinned in drafts/<slug>/release-plan.json;
// editing that generator risks the hash on an already-released asset. This
// script shares the visual language and the Chrome→sips pipeline and nothing
// else.
//
// Two modes. Default is a typographic plate in the share plate's language.
// With --still <image> it switches to the design system's IMAGE PLATE
// (DESIGN-SYSTEM.md §6):
// grayscale(1) contrast(1.15) on the still, the bottom-heavy black scrim, a
// light masthead badge over dark imagery, dark in both modes. Two deliberate
// departures from the share plate:
//
//   • The hero type is the PASSAGE, not the title. The share plate carries
//     the title because it is seen alone in a feed. This poster sits directly
//     beneath the page's own <h1>, where a 172px restatement of the same
//     words is noise. "GENESIS 15" says something the headline does not.
//   • Bottom-left is left empty. SermonVideo.astro overlays a live red PLAY
//     block there, which must be real UI for its hover and focus states, so
//     the poster reserves the corner rather than fighting it.
//
// Output is 16:9 (1200×675) to match the YouTube player exactly — the stage
// holds that ratio, so swapping poster for iframe causes no layout shift.
// Filenames are dated, never slugged: check-sermon-hold.mjs fails any built
// asset whose name carries a held study's slug.
//
// Requires macOS (uses `sips`) and Google Chrome. Zero npm dependencies.
// ─────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WORDS = join(REPO, 'src/content/words');
const FONTS = join(REPO, 'fonts');
const IMG = join(REPO, 'img');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const W = 1200, H = 675;

const argv = process.argv.slice(2);
const slug = argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--still' && argv[argv.indexOf(a) - 1] !== '--vol');
const flag = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : null);

const die = (m) => { console.error('✗ ' + m); process.exit(1); };
if (!slug) die('usage: node scripts/sermon-poster.mjs <slug> --still <image> [--vol N]');
if (!existsSync(CHROME)) die('Google Chrome not found at ' + CHROME);

const mdxPath = join(WORDS, slug + '.mdx');
if (!existsSync(mdxPath)) die('no entry at ' + mdxPath);

// A still is optional. Broadcast frames and channel thumbnails tend to carry
// burned-in lower thirds, the channel's own typography, and congregants'
// faces — none of which belong on this site. Supply one only when it is a
// clean production photograph; otherwise the typographic plate is correct.
const still = flag('--still');
const stillPath = still ? resolve(REPO, still) : null;
if (stillPath && !existsSync(stillPath)) die('no still at ' + stillPath);

// ── frontmatter ───────────────────────────────────────────────────────────
const fm = readFileSync(mdxPath, 'utf8').split(/^---$/m)[1] || '';
const field = (k) => (fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [, ''])[1].trim();
const unquote = (s) => s.replace(/^["']|["']$/g, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

if (unquote(field('contentType')) !== 'sermon-notes') die('not a sermon-notes entry: ' + slug);
const readTime = unquote(field('readTime'));
// "Genesis 15 · NASB1995" -> "GENESIS 15". The translation belongs in the
// study's own copyright footer, not shouted at 170px.
const passage = unquote(field('sermonPassage')).split('·')[0].trim();
if (!passage) die('no sermonPassage in frontmatter');
const deck = unquote(field('deck'));

// --hero passage (default) | deck | "<your own line>".
// A quote must be a line he is known to have said, in his own words, and
// never Scripture — the study never retypes Scripture and neither does this.
// The deck is the safest quote available: already written and approved in
// frontmatter, so no transcript sits between him and the plate.
const heroArg = flag('--hero') || 'passage';
const heroSource = heroArg === 'passage' ? passage : heroArg === 'deck' ? deck : heroArg;
if (!heroSource) die(`--hero ${heroArg} resolved to nothing`);
// The red square IS the period; a typed one beside it reads as a typo.
const hero = heroSource.replace(/[.\s]+$/, '').toUpperCase();
const lanes = (field('lanes').match(/"([^"]+)"/g) || []).map((s) => s.replace(/"/g, '').toUpperCase()).join(' + ');

// Dated filename, from the sermon's own date — never the slug.
const date = unquote(field('preachedOn')) || unquote(field('plannedSermonDate'));
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) die('need preachedOn or plannedSermonDate (YYYY-MM-DD)');

// VOL is the entry's OWN volume and must match its share plate. og-plate's
// published-count default drifts upward as later essays ship, so pin it.
let vol = flag('--vol');
if (!vol) {
  vol = readdirSync(WORDS).filter((f) => f.endsWith('.mdx'))
    .filter((f) => /status:\s*"published"/.test(readFileSync(join(WORDS, f), 'utf8'))).length + 1;
  console.warn(`! --vol not given; using ${vol} from the published count. Pin it if this entry's share plate says otherwise.`);
}

const DX = '<svg viewBox="0 0 1484.43 1027.42" xmlns="http://www.w3.org/2000/svg">'
  + '<path fill="#f5f5f1" d="M134.2,846V169H0L134.2,0h331.66c63.75,0,120.84,9.27,171.28,27.8s93.41,45.94,128.91,82.19,62.73,81.38,81.7,135.36,28.45,116.42,28.45,187.33-9.69,131.12-29.05,183.09c-19.38,51.97-47.02,95.08-82.92,129.33s-79.28,59.62-130.12,76.14-108.12,24.77-171.88,24.77H134.2ZM352.2,677h95.56c26.61,0,52.22-3.62,76.81-10.88s46.38-20.16,65.33-38.7c18.94-18.55,34.06-44.36,45.36-77.42,11.28-33.06,16.94-75.39,16.94-127s-5.45-94.95-16.33-127.61c-10.89-32.66-25.61-58.45-44.16-77.41-18.56-18.94-39.94-31.84-64.12-38.7-24.19-6.84-49.59-10.28-76.2-10.28h-99.19v508Z"/>'
  + '<path fill="#f5f5f1" d="M456.78,0h264.77l200.7,270.72L1127.78,0h257.52l-336.11,441.12,435.25,586.3-336.11-96.72-232.12-313.12-174.09,228.42h-257.52l303.45-400.03L456.78,0Z"/></svg>';

const isImage = Boolean(stillPath);

// --ground dark | light. Dark is the default for the typographic plate and is
// the system-correct choice, not a preference: image plates "stay dark in both
// modes — no inversion" (DESIGN-SYSTEM.md §6), and this poster sits inside a
// black letterbox and is replaced by a black player on play. A cream plate
// read as a bright slab against the page in dark mode and matched neither the
// stage nor the player in light mode.
const ground = flag('--ground') || 'dark';
if (!['dark', 'light'].includes(ground)) die('--ground must be dark or light');
const P = ground === 'dark'
  ? { paper: '#060606', ink: '#f5f5f1', grid: 'rgba(245,245,241,.055)',
      brandBg: '#f5f5f1', brandFg: '#0a0a0a', rule: '#f5f5f1', boxBg: 'rgba(245,245,241,.035)' }
  : { paper: '#f4f4f1', ink: '#0a0a0a', grid: 'rgba(10,10,10,.05)',
      brandBg: '#0a0a0a', brandFg: '#f5f5f1', rule: '#0a0a0a', boxBg: '#f8f8f5' };
// The mark is authored cream; recolour it to whatever the brandblock needs.
const MARK = DX.replaceAll('#f5f5f1', P.brandFg);

// Shared furniture: the masthead badge and the IMJUSTDEX.COM foot, lifted
// from the share plate so the two artifacts read as one system.
const mast = `<div class="mast"><div class="brandblock">${MARK}<span class="wm">IMJUSTDEX</span></div>
<div class="vol">VOL · ${vol} · ${lanes}</div>
<div class="words">SERMON NOTES · ${esc(readTime.toUpperCase())}</div></div>`;
const heroWords = hero.split(/\s+/).map(esc);
const heroLast = heroWords.pop();
const heroHtml = (heroWords.length ? heroWords.join(' ') + ' ' : '')
  + `<span class="nw">${heroLast}<span class="redsq"></span></span>`;

const foot = `<div class="foot"><div class="url"><span class="sq"></span>IMJUSTDEX.COM</div></div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Anton';src:url('file://${FONTS}/Anton-Regular.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Plex';src:url('file://${FONTS}/IBMPlexSans-Regular.woff2') format('woff2');font-weight:400;font-display:block;}
@font-face{font-family:'Plex';src:url('file://${FONTS}/IBMPlexSans-Bold.woff2') format('woff2');font-weight:700;font-display:block;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:${W}px;height:${H}px;overflow:hidden;}
body{position:relative;font-family:'Plex',sans-serif;${isImage
  ? 'background:#000;'
  : `background-color:${P.paper};background-image:linear-gradient(${P.grid} 1px,transparent 1px),linear-gradient(90deg,${P.grid} 1px,transparent 1px);background-size:46px 46px;background-position:-1px -1px;`}}
/* Image plate ::before — grayscale pulls the broadcast's own colour branding
   down so the still reads as IMJUSTDEX furniture, not someone else's card. */
.still{position:absolute;inset:0;background-image:url('file://${stillPath}');background-size:cover;background-position:center;filter:grayscale(1) contrast(1.15);transform:scale(1.02);z-index:0;}
/* Image plate ::after — the documented bottom-heavy scrim, verbatim. */
.scrim{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.78),rgba(0,0,0,.26) 55%,rgba(0,0,0,.34));z-index:1;}
.frame{position:absolute;inset:0;z-index:2;padding:30px 32px;display:flex;flex-direction:column;}
.mast{display:flex;align-items:stretch;height:60px;border:2px solid ${isImage ? '#0a0a0a' : P.rule};background:${isImage ? '#f4f4f1' : P.paper};}
.brandblock{display:flex;align-items:center;gap:13px;background:${isImage ? '#0a0a0a' : P.brandBg};color:${isImage ? '#f5f5f1' : P.brandFg};padding:0 22px;}
.brandblock svg{height:26px;width:auto;display:block;}
.brandblock .wm{font-weight:700;font-size:18px;letter-spacing:.18em;}
.vol{flex:1;display:flex;align-items:center;padding:0 26px;font-size:15px;font-weight:500;letter-spacing:.17em;text-transform:uppercase;color:${isImage ? '#0a0a0a' : P.ink};white-space:nowrap;}
.words{display:flex;align-items:center;border-left:2px solid ${isImage ? '#0a0a0a' : P.rule};padding:0 24px;font-size:14px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${isImage ? '#0a0a0a' : P.ink};white-space:nowrap;}
.herobox{flex:1;margin:22px 0 20px;border:3px solid ${P.rule};background:${P.boxBg};display:flex;align-items:center;padding:0 52px;overflow:hidden;}
.hero{font-family:'Anton',sans-serif;color:${P.ink};text-transform:uppercase;line-height:.92;letter-spacing:.005em;font-size:172px;text-wrap:balance;}
/* Keep the final word welded to its red-square period so the mark can never
   wrap onto a line of its own. */
.hero .nw{white-space:nowrap;}
.redsq{display:inline-block;width:.19em;height:.19em;background:#c00;vertical-align:baseline;margin-left:.05em;}
/* Bottom-left stays empty in both modes: the live PLAY block lands there. */
.foot{margin-top:auto;display:flex;justify-content:flex-end;align-items:flex-end;height:38px;}
.url{display:flex;align-items:center;gap:11px;font-size:15px;font-weight:700;letter-spacing:.13em;white-space:nowrap;color:${isImage ? '#f5f5f1' : P.ink};${isImage ? 'text-shadow:0 2px 0 rgba(0,0,0,.45);' : ''}}
.url .sq{width:13px;height:13px;background:#c00;display:block;}
</style></head><body>
${isImage ? '<div class="still"></div><div class="scrim"></div>' : ''}
<div class="frame">
${mast}
${isImage ? '' : `<div class="herobox"><div class="hero">${heroHtml}</div></div>`}
${foot}
</div>
<script>
(async function(){
  if(document.fonts&&document.fonts.ready){await document.fonts.ready;}
  var box=document.querySelector('.herobox');
  if(!box){return;}
  var t=document.querySelector('.hero'),s=380;
  function fits(){return t.offsetWidth<=box.clientWidth-104 && t.offsetHeight<=box.clientHeight-44;}
  t.style.fontSize=s+'px';
  while(s>44&&!fits()){s-=2;t.style.fontSize=s+'px';}
})();
</script>
</body></html>`;

const tmpHtml = '/tmp/sermon-poster-' + date + '.html';
const tmp2x = '/tmp/sermon-poster-' + date + '@2x.png';
const out = join(IMG, 'sermon-poster-' + date + '.png');
writeFileSync(tmpHtml, html);
// Chrome writes the screenshot and then sometimes fails its own teardown
// ("Teardown watchdog expired"), exiting non-zero with the PNG already on
// disk. Judge the run by the artifact, not the exit code.
try {
  execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars',
    '--allow-file-access-from-files', '--force-device-scale-factor=2',
    `--window-size=${W},${H}`, '--virtual-time-budget=8000',
    '--screenshot=' + tmp2x, 'file://' + tmpHtml], { stdio: 'ignore' });
} catch {
  if (!existsSync(tmp2x)) die('Chrome produced no screenshot');
}
if (!existsSync(tmp2x)) die('Chrome produced no screenshot');
execFileSync('sips', ['-z', String(H), String(W), tmp2x, '--out', out], { stdio: 'ignore' });

console.log(`✓ sermon-poster-${date}.png  —  VOL · ${vol} · ${lanes}  ·  SERMON NOTES · ${readTime.toUpperCase()}`);
console.log(`  mode:  ${isImage ? 'image plate — ' + stillPath : 'typographic plate'}`);
if (!isImage) console.log(`  hero:  ${hero}  (ground: ${ground})`);
console.log(`  → ${out}  (${W}×${H}, 16:9)`);
