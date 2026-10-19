(() => {
  'use strict';

  // Upgrades the poster link into an in-page player. Without this script the
  // markup is still a working link to the sermon, so there is nothing to
  // guard against beyond a missing stage.
  const stages = [...document.querySelectorAll('[data-sermon-video]')];
  if (!stages.length) return;

  for (const stage of stages) {
    const trigger = stage.querySelector('[data-sermon-video-trigger]');
    const parent = stage.parentElement;
    const dismiss = parent && parent.querySelector('[data-sermon-video-dismiss]');
    // The way out of a blocked or broken player. Hidden at rest so the page
    // keeps its no-outbound-links rule until a player is actually present.
    const escape = parent && parent.querySelector('[data-sermon-video-escape]');
    const src = stage.dataset.embed;
    if (!trigger || !src) continue;

    let frame = null;

    function stop() {
      if (frame) { frame.remove(); frame = null; }
      if (dismiss) dismiss.hidden = true;
      if (escape) escape.hidden = true;
      trigger.hidden = false;
      delete stage.dataset.state;
      trigger.focus();
    }

    function play() {
      frame = document.createElement('iframe');
      frame.className = 'sermon-video-embed';
      frame.src = src;
      frame.title = stage.dataset.embedTitle || 'Sermon video';
      // autoplay is in the list because the embed URL asks for it; omitting it
      // left the player's own autoplay request denied by permissions policy.
      frame.allow = 'accelerometer; autoplay; encrypted-media; fullscreen; gyroscope; picture-in-picture';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';

      // The poster and its link stay in the DOM, hidden - this is what makes
      // the action reversible and the failure recoverable.
      stage.appendChild(frame);
      trigger.hidden = true;
      stage.dataset.state = 'playing';
      if (dismiss) dismiss.hidden = false;
      if (escape) escape.hidden = false;
      frame.focus();
    }

    trigger.addEventListener('click', event => {
      // Let modified clicks and middle-clicks open YouTube the way the
      // reader asked; only plain activation plays in place.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      play();
    });

    if (dismiss) dismiss.addEventListener('click', stop);
  }
})();
