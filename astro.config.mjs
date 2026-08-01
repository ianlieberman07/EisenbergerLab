// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `site` feeds every canonical URL, the sitemap and the Open Graph tags, so it
// has to match wherever the site is actually being served from.
//
// The default below is the intended final address, pending UCLA Psychology IT
// (DOCS/QUESTIONS.md #2). Until that domain exists, set a SITE_URL environment
// variable in the host's build settings — e.g. https://sanlab.pages.dev — so a
// live preview doesn't advertise canonical URLs for a domain that 404s.
// See DOCS/DEPLOYMENT.md.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://sanlab.psych.ucla.edu',
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
