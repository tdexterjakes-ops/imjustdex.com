import type { CollectionEntry } from 'astro:content';

type WordsEntry = CollectionEntry<'words'>;

export function isPubliclyLive(entry: WordsEntry, now: Date = new Date()): boolean {
  return (
    entry.data.status === 'published' &&
    new Date(entry.data.publishedDate).getTime() <= now.getTime()
  );
}

export function isUpcoming(entry: WordsEntry, now: Date = new Date()): boolean {
  const ts = new Date(entry.data.publishedDate).getTime();
  return (
    (entry.data.status === 'published' || entry.data.status === 'upcoming') &&
    ts > now.getTime()
  );
}
