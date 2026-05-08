/* ============================================================
 * earlier-toggle.js — reveals/hides the "earlier" essay overflow.
 *
 * Progressive enhancement on the homepage. The first N earlier
 * essays render visible; anything past that gets the
 * .earlier-more class + the `hidden` attribute, and a button
 * with [data-earlier-toggle] toggles them in-place.
 *
 * Extracted from an inline <script> block in HomeLayout.astro.
 * Inline scripts were silently blocked by the production CSP
 * (script-src 'self'), so the click handler never bound and
 * the init code never updated the singular/plural label.
 * Loading from same-origin satisfies the policy.
 * ============================================================ */

(function () {
  const btn = document.querySelector('[data-earlier-toggle]');
  if (!btn) return;
  const hidden = document.querySelectorAll('.earlier-more');
  const count = document.querySelector('[data-earlier-count]');
  const label = btn.querySelector('.btn-label');
  const more = hidden.length;
  const plural = more === 1 ? 'Essay' : 'Essays';
  if (count) count.textContent = '— ' + more + ' more';
  if (label) label.textContent = 'View Earlier ' + plural;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    hidden.forEach((el) => {
      if (next) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    });
    btn.setAttribute('aria-expanded', String(next));
    const total = hidden.length;
    const pluralAfter = total === 1 ? 'Essay' : 'Essays';
    btn.querySelector('.btn-label').textContent = next ? 'Show Less' : 'View Earlier ' + pluralAfter;
    if (count) count.textContent = next ? '— showing all' : '— ' + total + ' more';
  });
})();
