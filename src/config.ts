import site from '../content/site.json';

export { site };

/**
 * Site structure per CLAUDE.md §3. The Press Release page from the old site is
 * deliberately absent — the client asked for it to be removed, and no link to
 * it should exist anywhere.
 */
export const nav = [
  { label: 'Overview', href: '/overview' },
  { label: 'Research', href: '/research' },
  { label: 'Papers', href: '/papers' },
  { label: 'People', href: '/people' },
] as const;
