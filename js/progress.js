/* ============================================================
 * imjustdex.com — progress.js
 * Reading progress bar + section indicator for long-form
 * article pages. Extracted from the inline script that was
 * previously duplicated across every /words/* page.
 *
 * Targets:
 *   .reading-progress  — fixed bar at top of viewport
 *   .section-indicator — fixed pill showing current section
 *   .article-body      — the scroll container for progress
 *   .section-head h2   — the landmarks the indicator tracks
 *
 * No-ops if any of these elements are missing, so it's safe
 * to include on any page.
 * ============================================================ */

(function () {
  'use strict';

  var bar = document.querySelector('.reading-progress');
  var label = document.querySelector('.section-indicator');
  var article =
    document.querySelector('.article-body') || document.querySelector('article');

  if (!bar || !article) return;

  // Collect section landmarks once on load
  var sections = [];
  article.querySelectorAll('.section-head h2').forEach(function (h2) {
    sections.push({
      el: h2.closest('.section-head'),
      name: h2.textContent.trim(),
    });
  });

  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function () {
      ticking = false;

      var rect = article.getBoundingClientRect();
      var total = article.scrollHeight - window.innerHeight;
      var scrolled = -rect.top;
      var pct = Math.max(0, Math.min(100, (scrolled / total) * 100));

      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', Math.round(pct));

      if (!label) return;

      // Find the most recently passed section head
      var current = '';
      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = sections[i].name;
          break;
        }
      }

      if (current && pct > 2 && pct < 98) {
        label.textContent = current;
        label.classList.add('visible');
      } else {
        label.classList.remove('visible');
      }
    });
  }

  // Initialize aria attributes so the bar is announced to AT
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Reading progress');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', '100');
  bar.setAttribute('aria-valuenow', '0');

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
