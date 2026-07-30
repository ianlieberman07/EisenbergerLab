import site from '../content/site.json';

export { site };

/**
 * Site structure per CLAUDE.md §3. The Press Release page from the old site is
 * deliberately absent — the client asked for it to be removed, and no link to
 * it should exist anywhere.
 */
export const nav = [
  // The wordmark links home too, but an explicit Home item is what people
  // actually look for — relying on the logo alone is a small usability tax.
  { label: 'Home', href: '/' },
  // Overview was removed at the client's request. The lab overview copy now
  // lives only on /research, and the contact block moved to the landing page
  // and the footer.
  { label: 'Research', href: '/research' },
  { label: 'Papers', href: '/papers' },
  { label: 'People', href: '/people' },
] as const;
