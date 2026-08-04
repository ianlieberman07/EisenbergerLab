// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `site` feeds every canonical URL, the sitemap and the Open Graph tags, so it
// has to match wherever the site is actually being served from.
//
// The default is the *temporary* address on purpose. It used to default to
// sanlab.psych.ucla.edu, which is not a placeholder — it resolves, and is still
// serving the old WordPress site. So every page of this one was telling search
// engines and link previews that its real self was the old site.
//
// Defaulting to the address it is genuinely served from means an unconfigured
// deployment is correct rather than wrong, and — because PRODUCTION_HOST in
// src/config.ts does not match — it is also noindexed automatically, so a
// throwaway URL can never be crawled by being forgotten about.
//
// AT LAUNCH: set SITE_URL to https://sanlab.psych.ucla.edu in the host's build
// variables. Canonicals, the sitemap and indexing all correct themselves.
// See DOCS/DEPLOYMENT.md.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://eisenbergerlab.pages.dev',
  integrations: [
    sitemap({
      // The admin is noindex'd and disallowed in robots.txt, so listing it in
      // the sitemap was the one place the site still advertised it to crawlers.
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Astro's sharp pipeline: every image is resized and served as modern
    // formats at multiple widths. Nothing full-size is ever shipped.
    responsiveStyles: true,
  },
  prefetch: {
    // Hover-intent only. `prefetchAll` + a viewport strategy pulls every linked
    // page (and its hero image) on sight, which is exactly the wrong trade on
    // the phone connections this site has to be fast on.
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
