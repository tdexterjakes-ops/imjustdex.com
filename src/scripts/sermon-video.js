(() => {
  'use strict';

  // Upgrades the poster link into an in-page player. Without this script the
  // markup is still a working link to the sermon, so there is nothing to
  // guard against beyond a missing stage.
  const stages = [...document.querySelectorAll('[data-sermon-video]')];
  if (!stages.length) return;

  for (const stage of stages) {
    const trigger = stage.querySelector('[data-sermon-video-trigger]');
    const src = stage.dataset.embed;
    if (!trigger || !src) continue;

    trigger.addEventListener('click', event => {
      // Let modified clicks and middle-clicks open YouTube the way the
      // reader asked; only plain activation plays in place.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();

      const frame = document.createElement('iframe');
      frame.className = 'sermon-video-embed';
      frame.src = src;
      frame.title = stage.dataset.embedTitle || 'Sermon video';
      frame.allow = 'accelerometer; encrypted-media; fullscreen; gyroscope; picture-in-picture';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';

      stage.replaceChildren(frame);
      stage.dataset.state = 'playing';
      // Keyboard activation should land inside the player, not back at the top.
      frame.focus();
    });
  }
})();
