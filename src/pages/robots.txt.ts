import type { APIRoute } from 'astro';
import { PRODUCTION_HOST } from '../config';

/**
 * robots.txt, generated rather than kept as a static file in public/.
 *
 * It has to say two different things depending on where the site is served
 * from, and a static file can only say one. On the real domain it is the
 * ordinary "crawl everything except the admin"; anywhere else — the temporary
 * workers.dev address, a branch preview — it closes the door completely, to
 * match the noindex the pages themselves carry.
 *
 * Prerendered at build time like every other route here, so it costs nothing.
 */
export const GET: APIRoute = ({ site }) => {
  const isPreview = site?.hostname !== PRODUCTION_HOST;

  const body = isPreview
    ? `# Preview deployment — not the published site.
# The real site is https://${PRODUCTION_HOST}/
User-agent: *
Disallow: /
`
    : `User-agent: *
Allow: /

# The admin is gated at the hosting layer (see DOCS/ADMIN-ACCESS.md), but there
# is no reason for it to be crawled or to appear in search results.
Disallow: /admin

Sitemap: ${new URL('sitemap-index.xml', site)}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
