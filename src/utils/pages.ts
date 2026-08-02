import { getCollection, type CollectionEntry } from 'astro:content';
import { nav } from '../config';

/**
 * Pages that are rendered *inside* another page and must never get a URL or a
 * navigation item of their own.
 *
 * The lab overview is printed at the top of /research. Giving it a second
 * address would publish the same copy twice, which is bad for search and worse
 * for anyone trying to work out which one to edit.
 *
 * This is the one place that list lives — the route and the navigation both
 * read it, so they cannot disagree.
 */
export const EMBEDDED_PAGES = ['lab-overview'];

/**
 * Every page that should have its own URL, in navigation order.
 *
 * Drafts are visible while developing and dropped from the build, so she can
 * leave a half-written page saved without it appearing on the site.
 */
export async function getStandalonePages(): Promise<CollectionEntry<'pages'>[]> {
  const all = await getCollection('pages');
  return all
    .filter((page) => !EMBEDDED_PAGES.includes(page.id))
    .filter((page) => !page.data.draft || import.meta.env.DEV)
    .sort((a, b) => a.data.navOrder - b.data.navOrder || a.data.title.localeCompare(b.data.title));
}

export interface NavItem {
  label: string;
  href: string;
}

/**
 * The site navigation: the four fixed sections, plus any page she has created
 * and left ticked as "Show in the menu".
 *
 * The fixed items carry orders 10–40 and new pages default to 50, so adding a
 * page appends it rather than rearranging what is already there.
 */
export async function getNavItems(): Promise<NavItem[]> {
  const pages = await getStandalonePages();

  const fromPages = pages
    .filter((page) => page.data.showInNav)
    .map((page) => ({
      label: page.data.navLabel ?? page.data.title,
      href: `/${page.id}`,
      order: page.data.navOrder,
    }));

  return [...nav, ...fromPages]
    .sort((a, b) => a.order - b.order)
    .map(({ label, href }) => ({ label, href }));
}
