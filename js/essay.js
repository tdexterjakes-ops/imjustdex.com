/* ============================================================
 * dxjakes.com — essay.js
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

    btn.addEventListener('click', function () {
      var url =
        btn.getAttribute('data-copy-link') || window.location.href;

      var success = function () {
        btn.textContent = 'Copied';
        setTimeout(function () {
          btn.textContent = defaultLabel;
        }, 2000);
      };

      var fail = function () {
        btn.textContent = 'Copy failed';
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
