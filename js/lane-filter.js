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
 *   - Hides non-matching <article> via the `hidden` attribute.
 *   - While filtered, reveals EVERY matching essay (including the
 *     ones normally tucked under "View Earlier") and hides the
 *     "View Earlier" toggle — a lane view is not chronological.
 *   - On clear, restores each article to its BASE state: an
 *     `.earlier-more` overflow card returns to hidden unless the
 *     reader had expanded the earlier section. This stops the
 *     filter from clobbering earlier-toggle.js's collapse state
 *     (previously a filter→clear cycle left all essays revealed
 *     while the toggle still read "collapsed").
 *   - Suppresses row-heads while filtered (CSS via data-filter).
 *   - Announces the count to assistive tech.
 *
 * Loaded on / (home) — defer, last in <body>.
 * ============================================================ */

(function () {
  var rail = document.querySelector('.lane-index');
  var plates = document.querySelector('.plates');
  if (!rail || !plates) return;

  var buttons = rail.querySelectorAll('button.lane-cell[data-lane]');
  if (!buttons.length) return;

  var earlierWrap = plates.querySelector('.earlier-more-wrap');
  var earlierToggle = document.querySelector('[data-earlier-toggle]');

  // Pre-index every article by its plate's data-lane so filtering is O(n).
  // data-lane may hold multiple lanes (space-separated) for multi-lane essays.
  var articles = Array.prototype.slice.call(plates.querySelectorAll('article'));
  var articleLanes = articles.map(function (art) {
    var plate = art.querySelector('[data-lane]');
    var raw = plate ? plate.getAttribute('data-lane') : '';
    return raw ? raw.split(/\s+/) : [];
  });

  // An article's base (unfiltered) visibility: overflow cards under
  // "Earlier" stay hidden unless the reader expanded that section.
  function baseHidden(article) {
    if (!article.classList.contains('earlier-more')) return false;
    var expanded = earlierToggle && earlierToggle.getAttribute('aria-expanded') === 'true';
    return !expanded;
  }

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
      // Filtered: show every match. Cleared: restore base collapse state.
      articles[i].hidden = lane === null ? baseHidden(articles[i]) : !match;
      if (match) visible++;
    }

    if (lane === null) {
      plates.removeAttribute('data-filter');
      if (earlierWrap) earlierWrap.hidden = false;
      live.textContent = 'Filter cleared. Showing all essays.';
    } else {
      plates.setAttribute('data-filter', lane);
      // A lane view spans the whole archive, so the chronological
      // "View Earlier" toggle doesn't apply — hide it while filtered.
      if (earlierWrap) earlierWrap.hidden = true;
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
