/* ============================================================
 * subscribe.js — intercepts the /api/subscribe form submit,
 * POSTs via fetch, and swaps the form content with an inline
 * success / already-subscribed / error state. Keeps the reader
 * inside the subscribe-manifesto frame.
 *
 * States written to form.dataset.state:
 *   loading | success | existing | error
 *
 * Loaded on / (home) — defer, last in <body>.
 * ============================================================ */

(function () {
  var form = document.querySelector('.subscribe-manifesto .sm-form');
  if (!form || !window.fetch) return;

  var submit = form.querySelector('.sm-submit');
  var originalSubmitText = submit ? submit.textContent : '';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.dataset.state = 'loading';
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }

    var body = new URLSearchParams(new FormData(form)).toString();

    fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: body
    })
      .then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; })
          .catch(function () { return { ok: res.ok, data: {} }; });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.ok) {
          var already = result.data.message === 'already_subscribed';
          form.dataset.state = already ? 'existing' : 'success';
          renderConfirm(already);
        } else {
          var msg = 'Something broke. Try again in a minute.';
          if (result.data && result.data.error === 'invalid_email') {
            msg = "That email didn't look right. Try it again.";
          } else if (result.data && result.data.error === 'rate_limited') {
            msg = 'Too many attempts. Give it a minute.';
          }
          showError(msg);
        }
      })
      .catch(function () {
        showError('Network hiccup. Try again.');
      });
  });

  function renderConfirm(already) {
    var head = already ? "Already on the list." : "You're in.";
    var sub = already
      ? 'Sit tight — the next essay is on its way.'
      : 'The next essay lands in your inbox in two weeks.';

    // Empty the form and replace with the confirm block.
    while (form.firstChild) form.removeChild(form.firstChild);

    var wrap = document.createElement('div');
    wrap.className = 'sm-confirm';
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-live', 'polite');

    var mark = document.createElement('span');
    mark.className = 'sm-confirm-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '✓';

    var body = document.createElement('div');
    body.className = 'sm-confirm-body';

    var h = document.createElement('p');
    h.className = 'sm-confirm-head';
    h.textContent = head;

    var s = document.createElement('p');
    s.className = 'sm-confirm-sub';
    s.textContent = sub;

    body.appendChild(h);
    body.appendChild(s);
    wrap.appendChild(mark);
    wrap.appendChild(body);
    form.appendChild(wrap);
  }

  function showError(text) {
    form.dataset.state = 'error';
    if (submit) {
      submit.disabled = false;
      submit.textContent = originalSubmitText;
    }
    var err = form.parentNode.querySelector('.sm-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'sm-error';
      err.setAttribute('role', 'alert');
      // Insert after the form, before .sm-fine.
      var fine = form.parentNode.querySelector('.sm-fine');
      if (fine) {
        form.parentNode.insertBefore(err, fine);
      } else {
        form.parentNode.appendChild(err);
      }
    }
    err.textContent = text;
  }
})();
