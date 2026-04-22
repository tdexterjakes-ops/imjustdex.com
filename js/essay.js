/* ============================================================
 * imjustdex.com — essay.js
 * Article-page wiring (CSP-safe replacement for the inline
 * onclick handlers that previously lived in /words/* pages).
 *
 * Current responsibilities:
 *   • Copy-to-clipboard button in the share bar
 *
 * Add future article-page behavior here rather than inlining.
 * ============================================================ */

(function () {
  'use strict';

  /* ── Copy link button ────────────────────────────────── */

  var btn = document.querySelector('[data-copy-link]');
  if (btn) {
    var defaultLabel = btn.textContent;
    var status = document.querySelector('[data-copy-status]');

    // Announce result to screen readers via the sr-only live region
    // while updating the visible button label for sighted users.
    function announce(msg) {
      if (!status) return;
      // Re-setting identical text doesn't retrigger aria-live; clear first.
      status.textContent = '';
      // Next microtask so AT registers the change.
      setTimeout(function () { status.textContent = msg; }, 50);
    }

    btn.addEventListener('click', function () {
      var url =
        btn.getAttribute('data-copy-link') || window.location.href;

      var success = function () {
        btn.textContent = 'Copied';
        announce('Link copied to clipboard');
        setTimeout(function () {
          btn.textContent = defaultLabel;
        }, 2000);
      };

      var fail = function () {
        btn.textContent = 'Copy failed';
        announce('Copy failed. Select the URL manually.');
        setTimeout(function () {
          btn.textContent = defaultLabel;
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(success, fail);
      } else {
        // Legacy fallback
        try {
          var ta = document.createElement('textarea');
          ta.value = url;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          success();
        } catch (e) {
          fail();
        }
      }
    });
  }
})();
