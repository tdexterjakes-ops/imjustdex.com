/* ============================================================
 * imjustdex.com — signup.js
 * Inline email signup via Mailchimp through the Netlify
 * /api/subscribe function. Same-origin POST clears the strict
 * CSP (connect-src 'self').
 *
 * States:
 *   success   → collapse form, "You're in. Check your inbox."
 *   existing  → collapse form, "You're already on the list."
 *   error     → keep form, surface a real error, re-enable submit
 *
 * IMPORTANT: this handler checks res.ok AND the JSON {ok:true}
 * envelope. fetch() only rejects on a network failure, so a
 * 4xx/5xx still resolves — an earlier version blanket-showed
 * success on every response, telling readers they'd subscribed
 * when the server had actually errored.
 *
 * Loaded on /words/* + coming-soon pages (deferred). Pages can
 * opt out with data-no-signup-js (see /phase0/).
 * ============================================================ */

(function () {
  var form = document.querySelector('.email-signup');
  if (!form) return;
  if (form.hasAttribute('data-no-signup-js')) return;
  // No fetch → let the native form POST proceed (progressive enhancement).
  if (!window.fetch) return;

  var email = form.querySelector('.email-signup-input');
  var btn = form.querySelector('.email-signup-submit');
  var label = form.querySelector('.email-signup-label');
  var originalBtnText = btn ? btn.textContent : 'Notify me';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!email.value || !email.validity.valid) {
      email.focus();
      return;
    }

    btn.disabled = true;
    btn.textContent = '…';

    var params = new URLSearchParams(new FormData(form)).toString();

    fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: params
    })
      .then(function (res) {
        return res
          .json()
          .then(function (data) { return { ok: res.ok, data: data }; })
          .catch(function () { return { ok: res.ok, data: {} }; });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.ok) {
          var already = result.data.message === 'already_subscribed';
          form.classList.add('email-signup--done');
          label.textContent = already
            ? 'You’re already on the list.'
            : 'You’re in. Check your inbox.';
          email.style.display = 'none';
          btn.style.display = 'none';
        } else {
          var msg = 'Something broke. Try again in a minute.';
          if (result.data && result.data.error === 'invalid_email') {
            msg = 'That email didn’t look right. Try it again.';
          } else if (result.data && result.data.error === 'rate_limited') {
            msg = 'Too many attempts. Give it a minute.';
          }
          label.textContent = msg;
          btn.disabled = false;
          btn.textContent = originalBtnText;
        }
      })
      .catch(function () {
        label.textContent = 'Network hiccup. Try again.';
        btn.disabled = false;
        btn.textContent = originalBtnText;
      });
  });
})();
