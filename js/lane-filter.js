/* ============================================================
 * lane-filter.js — toggles the editorial archive by lane.
 *
 * Progressive enhancement: no-JS = all essays visible. With JS:
 * clicking Faith or Identity filters the archive plates to that
 * lane; clicking the active button again clears. Art is queued
 * (dashed, non-interactive) and is ignored here.
 *
 * Behavior:
 *   - Sets aria-pressed on the active button (single-select).
 *   - Hides non-matching <article> via `hidden` attribute.
 *   - Suppresses row-heads while filtered (chronological framing
 *     doesn't apply to a lane-scoped view — CSS handles display).
 *   - Focuses archive and announces the count for assistive tech.
 *
 * Loaded on / (home) — defer, last in <body>.
 * ============================================================ */

(function () {
  var rail = document.querySelector('.lane-index');
  var plates = document.querySelector('.plates');
  if (!rail || !plates) return;

  var buttons = rail.querySelectorAll('button.lane-cell[data-lane]');
  if (!buttons.length) return;

  // Pre-index every article by its plate's data-lane so filtering is O(n).
  // data-lane may hold multiple lanes (space-separated) for multi-lane essays.
  var articles = Array.prototype.slice.call(plates.querySelectorAll('article'));
  var articleLanes = articles.map(function (art) {
    var plate = art.querySelector('[data-lane]');
    var raw = plate ? plate.getAttribute('data-lane') : '';
    return raw ? raw.split(/\s+/) : [];
  });

  // Live region for screen readers — announce filter result counts.
  var live = document.createElement('span');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('aria-atomic', 'true');
  rail.appendChild(live);

  function apply(lane) {
    var visible = 0;
    for (var i = 0; i < articles.length; i++) {
      var match = lane === null || articleLanes[i].indexOf(lane) !== -1;
      articles[i].hidden = !match;
      if (match) visible++;
    }

    if (lane === null) {
      plates.removeAttribute('data-filter');
      live.textContent = 'Filter cleared. Showing all essays.';
    } else {
      plates.setAttribute('data-filter', lane);
      live.textContent =
        'Filtered to ' + lane + '. ' + visible + (visible === 1 ? ' essay.' : ' essays.');
    }

    for (var j = 0; j < buttons.length; j++) {
      var btnLane = buttons[j].getAttribute('data-lane');
      buttons[j].setAttribute('aria-pressed', btnLane === lane ? 'true' : 'false');
    }
  }

  for (var k = 0; k < buttons.length; k++) {
    buttons[k].addEventListener('click', function (e) {
      var lane = e.currentTarget.getAttribute('data-lane');
      var already = e.currentTarget.getAttribute('aria-pressed') === 'true';
      apply(already ? null : lane);
    });
  }
})();
