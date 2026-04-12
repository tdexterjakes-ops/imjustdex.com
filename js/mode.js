/* ============================================================
 * imjustdex.com — mode.js
 * Blocking-safe mode toggle.
 *
 * Runs in two phases:
 *
 *  1) HEAD phase — executed synchronously in <head> before any
 *     body content paints. Reads the stored preference (cookie
 *     first, then prefers-color-scheme as fallback) and sets the
 *     `dark-mode` class on <html> before first paint. This is
 *     what eliminates the dark-mode FOUC.
 *
 *  2) BODY phase — wires the toggle button on DOMContentLoaded,
 *     swaps the brand logo source, and persists the user's
 *     choice to a cookie.
 *
 * Served from /js/mode.js with Cache-Control: no-cache so
 * preference logic stays current across deploys.
 * ============================================================ */

(function () {
  'use strict';

  var KEY = 'dxmode';
  var DARK = 'dark';
  var LIGHT = 'light';
  var CLASS = 'dark-mode';

  /* ── Storage helpers ─────────────────────────────────── */

  function readCookie() {
    var m = document.cookie.match(/(?:^|; )dxmode=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function writeCookie(value) {
    document.cookie =
      KEY + '=' + value + ';path=/;max-age=31536000;SameSite=Lax';
  }

  /* ── Resolve initial mode ────────────────────────────── *
   * Priority:
   *   1. Explicit user choice stored in cookie
   *   2. OS preference (prefers-color-scheme)
   *   3. Light (default)
   * ------------------------------------------------------ */

  function resolveInitialMode() {
    var stored = readCookie();
    if (stored === DARK || stored === LIGHT) return stored;

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return DARK;
    }

    return LIGHT;
  }

  /* ── Apply mode to <html> (runs immediately) ─────────── */

  var root = document.documentElement;
  var initial = resolveInitialMode();

  if (initial === DARK) {
    root.classList.add(CLASS);
  } else {
    root.classList.remove(CLASS);
  }

  /* ── Wire up toggle + logo swap on DOM ready ─────────── */

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.getElementById('modeToggle');
    var logo = document.querySelector('.brand-logo');

    function syncLogo(mode) {
      if (!logo) return;
      // Respect relative paths on article pages and absolute paths on root.
      var base = logo.getAttribute('data-base') || '/img/';
      logo.src = base + (mode === DARK ? 'logo-white.svg' : 'logo-dark.svg');
    }

    function syncLabel(mode) {
      if (!toggle) return;
      toggle.textContent = mode === DARK ? 'Mode: Dark' : 'Mode: Light';
      toggle.setAttribute('aria-pressed', mode === DARK ? 'true' : 'false');
    }

    function applyMode(mode) {
      if (mode === DARK) {
        root.classList.add(CLASS);
      } else {
        root.classList.remove(CLASS);
      }
      writeCookie(mode);
      syncLogo(mode);
      syncLabel(mode);
    }

    // Sync UI to the mode the head script already set
    var current = root.classList.contains(CLASS) ? DARK : LIGHT;
    syncLogo(current);
    syncLabel(current);

    if (toggle) {
      toggle.addEventListener('click', function () {
        applyMode(root.classList.contains(CLASS) ? LIGHT : DARK);
      });
    }

    // Follow OS changes if the user has not chosen explicitly
    if (!readCookie() && window.matchMedia) {
      var mql = window.matchMedia('(prefers-color-scheme: dark)');
      var handler = function (e) {
        // Only follow OS if user still has no explicit preference
        if (!readCookie()) {
          applyMode(e.matches ? DARK : LIGHT);
        }
      };
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
      } else if (mql.addListener) {
        mql.addListener(handler);
      }
    }
  });
})();
