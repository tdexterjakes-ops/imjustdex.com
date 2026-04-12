/* ============================================================
 * imjustdex.com — signup.js
 * AJAX email signup via Mailchimp JSONP endpoint.
 * No page navigation, no popups. Inline feedback.
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

    // Build Mailchimp JSONP URL
    var action = form.getAttribute('action');
    // Switch from /subscribe/post to /subscribe/post-json
    var url = action.replace('/subscribe/post', '/subscribe/post-json');
    url += '&EMAIL=' + encodeURIComponent(email.value);

    // Add honeypot value (empty = human)
    var hp = form.querySelector('.email-signup-hp input');
    if (hp) {
      url += '&' + encodeURIComponent(hp.name) + '=';
    }

    // JSONP callback
    var callbackName = 'mc_cb_' + Date.now();
    url += '&c=' + callbackName;

    window[callbackName] = function (data) {
      // Clean up
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);

      if (data.result === 'success') {
        // Success state
        form.classList.add('email-signup--done');
        label.textContent = 'You\u2019re in.';
        email.style.display = 'none';
        btn.style.display = 'none';
      } else {
        // Error — usually "already subscribed" or invalid
        var msg = data.msg || 'Something went wrong.';
        // Strip Mailchimp's HTML from error messages
        msg = msg.replace(/<[^>]*>/g, '');
        // Shorten common messages
        if (msg.indexOf('already subscribed') > -1) {
          msg = 'Already subscribed.';
        }
        label.textContent = msg;
        btn.disabled = false;
        btn.textContent = 'Notify me';
      }
    };

    // Inject JSONP script
    var script = document.createElement('script');
    script.src = url;

    // Timeout fallback
    var timeout = setTimeout(function () {
      if (window[callbackName]) {
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
        label.textContent = 'Network error. Try again.';
        btn.disabled = false;
        btn.textContent = 'Notify me';
      }
    }, 8000);

    var origCallback = window[callbackName];
    window[callbackName] = function (data) {
      clearTimeout(timeout);
      origCallback(data);
    };

    document.body.appendChild(script);
  });
})();
