/* ============================================================
 * imjustdex.com — phase0.js
 * Behavior layer for /phase0/ (Ministry Marketing OS — Phase 0).
 *
 * Responsibilities:
 *   1) Richer signup form handler (error copy updates, aria-invalid
 *      wiring, data-state machine) bound to .phase0-capture.
 *      The form carries data-no-signup-js so signup.js skips it
 *      and this file owns submission.
 *   2) Footer year injection.
 *
 * Delivery:
 *   Same-origin POST through the Netlify /api/subscribe proxy
 *   which forwards to Mailchimp server-side. URL-encoded form
 *   body, identical shape to signup.js — but this handler keeps
 *   the error state machine instead of collapsing the whole form
 *   on failure.
 *
 * Served from /js/phase0.js with 1-year immutable cache. Bump
 * the ?v= query string in the HTML when this file changes.
 * ============================================================ */

(function () {
  'use strict';

  /* ── Footer year ──────────────────────────────────────────── */

  var yr = document.getElementById('yr');
  if (yr) {
    yr.textContent = String(new Date().getFullYear());
  }

  /* ── Signup form state machine ────────────────────────────── */

  var form = document.querySelector('.phase0-capture');
  if (!form) return;

  var input     = form.querySelector('input[type="email"]');
  var submit    = form.querySelector('.email-signup-submit');
  var errorMsg  = form.querySelector('.form-msg[data-kind="error"]');
  var honeypot  = form.querySelector('.email-signup-hp input');

  if (!input || !submit) return;

  var originalSubmitText = submit.textContent;

  /* The error <p> ships holding the server-failure line, so every error
     must pass its own copy — a bare setError() told a reader with a typo
     that the server broke [F53]. Invalid-email and rate-limit wording is
     the same copy subscribe.js and signup.js already show. */
  var COPY_INVALID = 'That email didn’t look right. Try it again.';
  var COPY_RATE    = 'Too many attempts. Give it a minute.';
  var COPY_BROKE   = 'Something broke on our end. Try again, or email dex@imjustdex.com.';

  function setState(state) {
    form.setAttribute('data-state', state);
  }

  function setError(copy) {
    if (copy && errorMsg) {
      errorMsg.textContent = copy;
    }
    setState('error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', 'capture-error');
  }

  function clearError() {
    if (form.getAttribute('data-state') !== 'error') return;
    setState('idle');
    input.removeAttribute('aria-invalid');
    input.setAttribute('aria-describedby', 'capture-fine');
  }

  function setSuccess() {
    setState('success');
    input.removeAttribute('aria-invalid');
  }

  /* Clear error on next valid keystroke. */
  input.addEventListener('input', function () {
    if (input.checkValidity()) clearError();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!input.value || !input.checkValidity()) {
      input.focus();
      setError(COPY_INVALID);
      return;
    }

    /* Lock the button */
    submit.disabled = true;
    submit.textContent = 'Sending\u2026';

    /* URL-encoded body — FormData captures all inputs including hidden source field. */
    var params = new URLSearchParams(new FormData(form)).toString();

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    })
      .then(function (res) {
        /* Netlify proxy returns 200 on success (even across Mailchimp's
           own 2xx/3xx responses the proxy normalizes). */
        if (res && res.ok) {
          setSuccess();
          return;
        }
        /* Read the function's error code so a rejected address or a
           rate limit isn't reported as an outage. */
        return (res ? res.json() : Promise.reject())
          .catch(function () { return {}; })
          .then(function (data) {
            var code = data && data.error;
            submit.disabled = false;
            if (code === 'invalid_email') {
              setError(COPY_INVALID);
              submit.textContent = originalSubmitText;
            } else {
              setError(code === 'rate_limited' ? COPY_RATE : COPY_BROKE);
              submit.textContent = 'Retry';
            }
          });
      })
      .catch(function () {
        setError(COPY_BROKE);
        submit.disabled = false;
        submit.textContent = 'Retry';
      });
  });
})();
