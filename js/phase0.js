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
      setError();
      return;
    }

    /* Lock the button */
    submit.disabled = true;
    submit.textContent = 'Sending\u2026';

    /* URL-encoded body — Mailchimp expects form data. */
    var params = 'EMAIL=' + encodeURIComponent(input.value);

    /* Honeypot (empty = human). */
    if (honeypot && honeypot.name) {
      params += '&' + encodeURIComponent(honeypot.name) + '=' + encodeURIComponent(honeypot.value || '');
    }

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    })
      .then(function (res) {
        /* Netlify proxy returns 200 on success (even across Mailchimp's
           own 2xx/3xx responses the proxy normalizes). */
        if (!res || !res.ok) throw new Error('subscribe failed');
        setSuccess();
      })
      .catch(function () {
        setError('Something broke on our end. Try again, or email dex@imjustdex.com.');
        submit.disabled = false;
        submit.textContent = 'Retry';
      });
  });
})();
