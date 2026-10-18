(() => {
  'use strict';
  if (!document.querySelector('.sermon-study')) return;
  const passages = [...document.querySelectorAll('details.passage')];
  const fold = document.querySelector('[data-fold-passages]');
  function syncFold() {
    const allOpen = passages.every(p => p.open);
    fold.textContent = allOpen ? 'Fold passages' : 'Open passages';
    fold.setAttribute('aria-pressed', String(!allOpen));
  }
  if (fold) {
    fold.hidden = false;
    syncFold();
    passages.forEach(p => p.addEventListener('toggle', syncFold));
    fold.addEventListener('click', () => {
      const open = !passages.every(p => p.open);
      passages.forEach(p => { p.open = open; });
      syncFold();
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
  const article = document.querySelector('.sermon-study');
  const headings = [...article.querySelectorAll('h2')];
  const links = [...document.querySelectorAll('.movement-nav a')];
  const progress = document.querySelector('.reading-progress');
  const mobileLabel = document.querySelector('[data-mobile-label]');
  const mobile = document.querySelector('.mobile-contents');
  let pending = false;
  function updateReading() {
    pending = false;
    let active = headings[0];
    const mastheadHeight = document.querySelector('.page-shell > header').getBoundingClientRect().height;
    document.documentElement.style.setProperty('--notes-header-height', `${mastheadHeight}px`);
    // Match native anchor placement; allow for fractional-pixel rounding.
    const threshold = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 1;
    headings.forEach(h => { if (h.getBoundingClientRect().top <= threshold) active = h; });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) active = headings.at(-1);
    links.forEach(a => {
      if (a.hash === '#' + active.id) a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
    // The bar always reads exactly as the matching Contents entry.
    const label = links.find(a => a.hash === '#' + active.id)?.lastElementChild?.textContent ?? active.textContent;
    if (mobileLabel) mobileLabel.textContent = label;
    const rect = article.getBoundingClientRect();
    const travelled = -rect.top + threshold;
    const total = Math.max(1, article.offsetHeight - window.innerHeight + threshold);
    const value = Math.max(0, Math.min(1, travelled / total));
    progress.style.transform = `scaleX(${value})`;
  }
  const requestUpdate = () => {
    if (!pending) { pending = true; requestAnimationFrame(updateReading); }
  };
  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate);
  passages.forEach(p => p.addEventListener('toggle',requestUpdate));
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
  links.forEach(a => a.addEventListener('click',() => { if (mobile) mobile.open = false; }));
  window.addEventListener('load',requestUpdate);
  document.fonts.ready.then(requestUpdate);
  updateReading();
})();
