import type { CollectionEntry } from 'astro:content';
import { isPubliclyLiveData, isUpcomingData } from './published.mjs';

type WordsEntry = CollectionEntry<'words'>;

// Typed wrappers around the pure predicate in published.mjs. Behavior
// unchanged — the predicate logic is shared with astro.config.mjs so the
// sitemap filter can never silently drift from these consumers.
//
// Public API preserved exactly: isPubliclyLive(entry, now?), isUpcoming(entry, now?).

export function isPubliclyLive(entry: WordsEntry, now: Date = new Date()): boolean {
  return isPubliclyLiveData(entry.data, now);
}

export function isUpcoming(entry: WordsEntry, now: Date = new Date()): boolean {
  return isUpcomingData(entry.data, now);
}
