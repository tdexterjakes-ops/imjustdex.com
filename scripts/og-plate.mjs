#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// og-plate.mjs — generate a brand-correct OpenGraph plate for an essay.
//
//   node scripts/og-plate.mjs <slug> [--vol N]
//
// Reads src/content/words/<slug>.mdx frontmatter (title, deck, lanes,
// readTime), renders the IMJUSTDEX OG plate (phase28 language: masthead,
// bordered Anton title box with red-square period, deck, foot), and writes
// img/og-<slug>.png at 1200×630.
//
//   • VOL is auto-set to (count of published essays + 1) — i.e. "this is the
//     next blog" — unless you pass --vol N to pin it.
//   • The title auto-fits the box, so 1-word and 5-word titles both work.
//
// Requires macOS (uses `sips`) and Google Chrome. Zero npm dependencies.
// Renders at 2× through headless Chrome, then downscales for crisp type.
// ─────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const REPO  = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WORDS = join(REPO, 'src/content/words');
const FONTS = join(REPO, 'fonts');
const IMG   = join(REPO, 'img');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// ── args ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const slug = argv.find((a) => !a.startsWith('--'));
const volFlag = argv.includes('--vol') ? argv[argv.indexOf('--vol') + 1] : null;

const die = (m) => { console.error('✗ ' + m); process.exit(1); };
if (!slug) die('usage: node scripts/og-plate.mjs <slug> [--vol N]');
if (!existsSync(CHROME)) die('Google Chrome not found at ' + CHROME);

const mdxPath = join(WORDS, slug + '.mdx');
if (!existsSync(mdxPath)) die('no essay at ' + mdxPath);

// ── read frontmatter ────────────────────────────────────────────────────
const fm = (readFileSync(mdxPath, 'utf8').split(/^---$/m)[1] || '');
const field = (k) => (fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [, ''])[1].trim();
const unquote = (s) => s.replace(/^["']|["']$/g, '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const title = unquote(field('title'));
const deck = unquote(field('deck'));
const readTime = unquote(field('readTime'));                    // "12 min"
const lanes = (field('lanes').match(/"([^"]+)"/g) || [])
  .map((s) => s.replace(/"/g, '').toUpperCase()).join(' + ');   // "FAITH + IDENTITY"

if (!title) die('no title in frontmatter');

// ── volume number: --vol, else (published count + 1) ──────────────────────
let vol = volFlag;
if (!vol) {
  vol = readdirSync(WORDS).filter((f) => f.endsWith('.mdx'))
    .filter((f) => /status:\s*"published"/.test(readFileSync(join(WORDS, f), 'utf8'))).length + 1;
}

// ── title html: ALL CAPS, last word + red-square period kept on one line ──
const words = title.toUpperCase().split(/\s+/).map(esc);
const last = words.pop();
const titleHtml = (words.length ? words.join(' ') + ' ' : '') +
  '<span class="nw">' + last + '<span class="redsq"></span></span>';

// ── DX mark (white), inlined ──────────────────────────────────────────────
const DX = '<svg viewBox="0 0 1484.43 1027.42" xmlns="http://www.w3.org/2000/svg">'
  + '<path fill="#f5f5f1" d="M134.2,846V169H0L134.2,0h331.66c63.75,0,120.84,9.27,171.28,27.8s93.41,45.94,128.91,82.19,62.73,81.38,81.7,135.36,28.45,116.42,28.45,187.33-9.69,131.12-29.05,183.09c-19.38,51.97-47.02,95.08-82.92,129.33s-79.28,59.62-130.12,76.14-108.12,24.77-171.88,24.77H134.2ZM352.2,677h95.56c26.61,0,52.22-3.62,76.81-10.88s46.38-20.16,65.33-38.7c18.94-18.55,34.06-44.36,45.36-77.42,11.28-33.06,16.94-75.39,16.94-127s-5.45-94.95-16.33-127.61c-10.89-32.66-25.61-58.45-44.16-77.41-18.56-18.94-39.94-31.84-64.12-38.7-24.19-6.84-49.59-10.28-76.2-10.28h-99.19v508Z"/>'
  + '<path fill="#f5f5f1" d="M456.78,0h264.77l200.7,270.72L1127.78,0h257.52l-336.11,441.12,435.25,586.3-336.11-96.72-232.12-313.12-174.09,228.42h-257.52l303.45-400.03L456.78,0Z"/></svg>';

// ── plate html (auto-fit title before screenshot) ─────────────────────────
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Anton';src:url('file://${FONTS}/Anton-Regular.woff2') format('woff2');font-display:block;}
@font-face{font-family:'Plex';src:url('file://${FONTS}/IBMPlexSans-Regular.woff2') format('woff2');font-weight:400;font-display:block;}
@font-face{font-family:'Plex';src:url('file://${FONTS}/IBMPlexSans-Bold.woff2') format('woff2');font-weight:700;font-display:block;}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1200px;height:630px;overflow:hidden;}
body{background-color:#f4f4f1;background-image:linear-gradient(rgba(10,10,10,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(10,10,10,.05) 1px,transparent 1px);background-size:46px 46px;background-position:-1px -1px;font-family:'Plex',sans-serif;color:#050505;padding:30px 32px;display:flex;flex-direction:column;}
.mast{display:flex;align-items:stretch;height:60px;border:2px solid #0a0a0a;background:#f4f4f1;}
.brandblock{display:flex;align-items:center;gap:13px;background:#0a0a0a;color:#f5f5f1;padding:0 22px;}
.brandblock svg{height:26px;width:auto;display:block;}
.brandblock .wm{font-weight:700;font-size:18px;letter-spacing:.18em;}
.vol{flex:1;display:flex;align-items:center;padding:0 26px;font-size:15px;font-weight:500;letter-spacing:.17em;text-transform:uppercase;color:#0a0a0a;white-space:nowrap;}
.words{display:flex;align-items:center;border-left:2px solid #0a0a0a;padding:0 24px;font-size:14px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#0a0a0a;white-space:nowrap;}
.titlebox{flex:1;margin:22px 0 20px;border:3px solid #0a0a0a;background:#f8f8f5;display:flex;align-items:center;padding:0 52px;overflow:hidden;}
.title{font-family:'Anton',sans-serif;color:#0a0a0a;text-transform:uppercase;line-height:.86;letter-spacing:.005em;font-size:172px;}
.nw{white-space:nowrap;}
.redsq{display:inline-block;width:.19em;height:.19em;background:#c00;vertical-align:baseline;margin-left:.05em;}
.foot{display:flex;align-items:flex-end;justify-content:space-between;height:38px;gap:24px;}
.deck{font-size:27px;font-weight:400;color:#161616;line-height:1;}
.url{display:flex;align-items:center;gap:11px;font-size:15px;font-weight:700;letter-spacing:.13em;color:#0a0a0a;white-space:nowrap;}
.url .sq{width:13px;height:13px;background:#c00;display:block;}
</style></head><body>
<div class="mast"><div class="brandblock">${DX}<span class="wm">IMJUSTDEX</span></div>
<div class="vol">VOL · ${vol} · ${lanes}</div>
<div class="words">WORDS · ${esc(readTime.toUpperCase())}</div></div>
<div class="titlebox"><div class="title">${titleHtml}</div></div>
<div class="foot"><div class="deck">${esc(deck)}</div><div class="url"><span class="sq"></span>IMJUSTDEX.COM</div></div>
<script>
(async function(){
  if(document.fonts&&document.fonts.ready){await document.fonts.ready;}
  var box=document.querySelector('.titlebox'),t=document.querySelector('.title'),s=380;
  function fits(){return t.offsetWidth<=box.clientWidth-104 && t.offsetHeight<=box.clientHeight-44;}
  t.style.fontSize=s+'px';
  while(s>44&&!fits()){s-=2;t.style.fontSize=s+'px';}
})();
</script>
</body></html>`;

// ── render: HTML → headless Chrome @2× → sips downscale → img/og-<slug>.png ─
const tmpHtml = '/tmp/og-plate-' + slug + '.html';
const tmp2x = '/tmp/og-' + slug + '@2x.png';
const out = join(IMG, 'og-' + slug + '.png');
writeFileSync(tmpHtml, html);
execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=2', '--window-size=1200,630', '--virtual-time-budget=8000',
  '--screenshot=' + tmp2x, 'file://' + tmpHtml], { stdio: 'ignore' });
execFileSync('sips', ['-z', '630', '1200', tmp2x, '--out', out], { stdio: 'ignore' });

console.log(`✓ og-${slug}.png  —  VOL · ${vol} · ${lanes}  ·  WORDS · ${readTime.toUpperCase()}`);
console.log(`  title: "${title}"   deck: "${deck}"`);
console.log(`  → ${out}`);
console.log(`  (bump ogImagePhase in the essay's frontmatter to cache-bust if replacing a live plate)`);
