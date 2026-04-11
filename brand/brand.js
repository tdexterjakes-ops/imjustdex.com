/* Theme preview toggle.
       Light and dark are editorial — not user preferences — per the Color System.
       This control is a preview affordance for the guide itself, nothing more.
       It exposes its state via aria-pressed and persists across reloads of this
       file so reviewers can hold a chosen preview mode while scrolling. */
    (function () {
      var toggle = document.getElementById('modeToggle');
      var body = document.body;
      var STORAGE_KEY = 'dx-style-guide-preview-mode';

      function setLabel() {
        var dark = body.classList.contains('dark-mode');
        toggle.textContent = dark ? 'Mode: Dark' : 'Mode: Light';
        toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
      }

      // Restore prior preview choice if available.
      try {
        var stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark') body.classList.add('dark-mode');
      } catch (e) { /* storage unavailable — silent */ }

      setLabel();

      toggle.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        setLabel();
        try {
          localStorage.setItem(
            STORAGE_KEY,
            body.classList.contains('dark-mode') ? 'dark' : 'light'
          );
        } catch (e) { /* storage unavailable — silent */ }
      });
    })();
