/* ============================================================
 * imjustdex.com — signup.js
 * Inline email signup via Mailchimp through Netlify proxy.
 * The /api/subscribe proxy in netlify.toml keeps the request
 * same-origin so it clears the strict CSP (connect-src 'self').
 *
 * Loaded on /words/* pages only (deferred).
 * ============================================================ */

(function () {
  var form = document.querySelector('.email-signup');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var email = form.querySelector('.email-signup-input');
    var btn = form.querySelector('.email-signup-submit');
    var label = form.querySelector('.email-signup-label');

    if (!email.value || !email.validity.valid) {
      email.focus();
      return;
    }

    // Lock the form
    btn.disabled = true;
    btn.textContent = '...';

    // Build URL-encoded body (Mailchimp expects form data)
    var params = 'EMAIL=' + encodeURIComponent(email.value);

    // Honeypot (empty = human)
    var hp = form.querySelector('.email-signup-hp input');
    if (hp) params += '&' + encodeURIComponent(hp.name) + '=';

    // POST through Netlify proxy — same-origin, no CORS issues
    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    }).then(function (res) {
      // Mailchimp returns 200 on success
      form.classList.add('email-signup--done');
      label.textContent = 'You\u2019re in. Check your inbox.';
      email.style.display = 'none';
      btn.style.display = 'none';
    }).catch(function () {
      label.textContent = 'Something went wrong. Try again.';
      btn.disabled = false;
      btn.textContent = 'Notify me';
    });
  });
})();
