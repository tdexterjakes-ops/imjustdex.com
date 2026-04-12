/* ============================================================
 * imjustdex.com — signup.js
 * Inline email signup via Mailchimp. Uses fetch (no-cors)
 * so the reader never leaves the essay page.
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

    // Build form data
    var data = new FormData();
    data.append('EMAIL', email.value);

    // Honeypot (empty = human)
    var hp = form.querySelector('.email-signup-hp input');
    if (hp) data.append(hp.name, '');

    // POST to Mailchimp — no-cors means we can't read the
    // response, but the subscription goes through. We show
    // an optimistic confirmation.
    fetch(form.action, {
      method: 'POST',
      body: data,
      mode: 'no-cors'
    }).then(function () {
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
