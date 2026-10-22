(() => {
  'use strict';
  if (!document.querySelector('.sermon-study')) return;
  const article = document.querySelector('.sermon-study');
  const passages = [...document.querySelectorAll('details.passage')];
  const contents = document.querySelector('.mobile-contents');
  const contentsNav = contents ? contents.querySelector('nav') : null;
  const movementLinks = [...document.querySelectorAll('.movement-nav > li > a')];
  const subLinks = [...document.querySelectorAll('.sub-nav a')];
  const progress = document.querySelector('.reading-progress');
  const mobileLabel = document.querySelector('[data-mobile-label]');

  /* Memory. A 60-minute study is read in more than one sitting, so the place
     and the fold choice outlive the visit. Private mode and blocked site data
     must cost the reader the memory and never the page: every access is
     wrapped, and a throw degrades to "nothing was remembered". */
  const KEY = 'dxnotes:' + location.pathname;
  function readState() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch { return {}; }
  }
  function writeState(patch) {
    try { localStorage.setItem(KEY, JSON.stringify(Object.assign(readState(), patch))); } catch { /* no memory this visit */ }
  }
  const saved = readState();

  /* Fold. All 43 passages open is the default and a pastoral decision, so only
     the reader's own press is ever stored and only that press can collapse
     them. The control is an action button, not a toggle: the label names what
     the next press does. It used to carry aria-pressed as well, which names a
     state instead — so "Fold passages" with aria-pressed="false" told a screen
     reader the passages were not folded at the moment they all were. The label
     stays and aria-pressed is gone, leaving one story. Each passage still
     reports its own expanded state, as a native disclosure. */
  const fold = document.querySelector('[data-fold-passages]');
  const foldRow = document.querySelector('.contents-tools');
  function syncFold() {
    if (fold) fold.textContent = passages.every(p => p.open) ? 'Fold passages' : 'Open passages';
  }
  if (saved.folded === true) passages.forEach(p => { p.open = false; });
  if (fold) {
    fold.hidden = false;
    if (foldRow) foldRow.hidden = false;
    syncFold();
    passages.forEach(p => p.addEventListener('toggle', syncFold));
    fold.addEventListener('click', () => {
      const open = !passages.every(p => p.open);
      passages.forEach(p => { p.open = open; });
      syncFold();
      writeState({ folded: !open });
    });
  }

  const print = document.querySelector('[data-print]');
  if (print) {
    print.hidden = false;
    print.addEventListener('click', () => window.print());
  }
  let printStates = null;
  window.addEventListener('beforeprint', () => {
    printStates = passages.map(p => p.open);
    passages.forEach(p => { p.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (printStates) passages.forEach((p,i) => { p.open = printStates[i]; });
    printStates = null;
  });

  const headings = [...article.querySelectorAll('h2')];
  const subHeadings = [...article.querySelectorAll('h3')];
  /* Which movement each sub-point sits under, so the outline never marks a
     sub-point current while the reader is in a different movement. */
  const movementOf = new Map();
  let openMovement = null;
  for (const el of article.querySelectorAll('h2, h3')) {
    if (el.tagName === 'H2') openMovement = el; else movementOf.set(el, openMovement);
  }
  /* An outline anchor holds more than its label: the sub-point rows also carry
     the delivery state as .sr-only words and an aria-hidden mark. textContent
     concatenates all of that regardless of CSS, so read the labelled span. */
  const linkLabel = link => ((link?.querySelector('[data-label]') ?? link?.lastElementChild)?.textContent ?? '').trim();
  // 35 rows now, so only touch the attribute that actually changed.
  function mark(links, heading) {
    links.forEach(a => {
      const current = !!heading && a.hash === '#' + heading.id;
      if (current === a.hasAttribute('aria-current')) return;
      if (current) a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
  }

  let pending = false;
  let place = null;
  let lastWrite = 0;
  /* Nothing is recorded until the reader actually moves. Opening the page runs
     one pass immediately, and without this gate that pass would overwrite a
     remembered place with the top of the document — so a reader who came back,
     saw the offer and closed the tab would have lost exactly the place the
     offer was about. */
  let engaged = false;
  /* The place is stored as "which heading, and how far past it", so it survives
     anything that changes the page above it — a reflow, a different viewport,
     an edit to an earlier movement. */
  function remember(force) {
    if (!place || !engaged) return;
    const now = Date.now();
    if (!force && now - lastWrite < 1200) return;
    lastWrite = now;
    writeState({ y: Math.round(window.scrollY), heading: place.heading, offset: place.offset, label: place.label, at: now });
  }

  function updateReading() {
    pending = false;
    let active = headings[0];
    const mastheadHeight = document.querySelector('.page-shell > header').getBoundingClientRect().height;
    document.documentElement.style.setProperty('--notes-header-height', `${mastheadHeight}px`);
    // Match native anchor placement; allow for fractional-pixel rounding.
    const threshold = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 1;
    headings.forEach(h => { if (h.getBoundingClientRect().top <= threshold) active = h; });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) active = headings.at(-1);
    let activeSub = null;
    subHeadings.forEach(h => {
      if (movementOf.get(h) === active && h.getBoundingClientRect().top <= threshold) activeSub = h;
    });
    mark(movementLinks, active);
    mark(subLinks, activeSub);
    // The bar always reads exactly as the matching Contents entry.
    const label = linkLabel(movementLinks.find(a => a.hash === '#' + active.id)) || active.textContent;
    if (mobileLabel) mobileLabel.textContent = label;
    const anchor = activeSub ?? active;
    place = {
      heading: anchor.id,
      offset: Math.round(-anchor.getBoundingClientRect().top),
      // Name the finest-grained place the reader can recognise coming back.
      label: activeSub ? (linkLabel(subLinks.find(a => a.hash === '#' + activeSub.id)) || label) : label,
    };
    remember(false);
    const rect = article.getBoundingClientRect();
    const travelled = -rect.top + threshold;
    const total = Math.max(1, article.offsetHeight - window.innerHeight + threshold);
    const value = Math.max(0, Math.min(1, travelled / total));
    progress.style.transform = `scaleX(${value})`;
  }
  const requestUpdate = () => {
    if (!pending) { pending = true; requestAnimationFrame(updateReading); }
  };
  window.addEventListener('scroll',() => { engaged = true; requestUpdate(); },{passive:true});
  window.addEventListener('resize',requestUpdate);
  passages.forEach(p => p.addEventListener('toggle',requestUpdate));
  // A closing tab is the commonest way a sitting ends; scroll throttling can
  // otherwise drop the last stretch of reading.
  window.addEventListener('pagehide', () => remember(true));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') remember(true);
  });

  /* Resume is offered, never applied. A reader who opens the page at the top
     meant the top: a bookmark, the /grace short link or a QR code should not
     silently drop them into the middle of a 60-minute study. The offer only
     stands when nothing else already claimed the position. */
  const resume = document.querySelector('[data-resume]');
  function offerResume() {
    if (!resume || !saved.heading) return;
    const target = document.getElementById(saved.heading);
    // No hash (the reader asked for a place), no restored scroll, and far
    // enough in to be worth returning to.
    if (!target || location.hash || window.scrollY > 4) return;
    if ((Number(saved.y) || 0) <= window.innerHeight) return;
    // A place from another season is not where the reader is now.
    if (!saved.at || Date.now() - saved.at > 90 * 24 * 60 * 60 * 1000) return;
    const label = resume.querySelector('[data-resume-label]');
    /* Re-derive from the live outline rather than trusting the stored string: a
       place recorded before the outline carried state words has them run into
       the label. Rewriting the key instead would discard the fold choice and
       the position with it. */
    const fresh = linkLabel([...subLinks, ...movementLinks].find(a => a.hash === '#' + saved.heading));
    if (label) label.textContent = fresh || saved.label || 'where you left off';
    resume.hidden = false;
    resume.addEventListener('click', () => {
      // Land keyboard and screen-reader users where the page goes.
      target.setAttribute('tabindex','-1');
      target.focus({ preventScroll: true });
      window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY + (Number(saved.offset) || 0)) });
      resume.hidden = true;
    });
  }

  function revealPassage(hash) {
    if (!hash.startsWith('#text-')) return;
    const passage = document.getElementById(hash.slice(1))?.closest('details.passage');
    if (passage) passage.open = true;
  }
  document.addEventListener('click',event => {
    const link = event.target.closest('a[href^="#text-"]');
    if (link) revealPassage(link.hash);
  });
  window.addEventListener('hashchange',() => revealPassage(location.hash));
  revealPassage(location.hash);
  [...movementLinks, ...subLinks].forEach(a => a.addEventListener('click',() => { if (contents) contents.open = false; }));
  /* Opening the outline lands on the reader's own place, not on row 1 of 35. */
  if (contents && contentsNav) {
    contents.addEventListener('toggle', () => {
      if (!contents.open) return;
      const current = contentsNav.querySelector('[aria-current="location"]');
      const row = current?.closest('.movement-nav > li');
      if (row) contentsNav.scrollTop += row.getBoundingClientRect().top - contentsNav.getBoundingClientRect().top;
    });
  }
  // Scroll restoration happens after load, so the resume offer waits for it.
  window.addEventListener('load',() => { requestUpdate(); offerResume(); });
  document.fonts.ready.then(requestUpdate);
  updateReading();
})();
