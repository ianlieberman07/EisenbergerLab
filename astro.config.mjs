// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// NOTE: `site` must be updated once the final domain is confirmed with UCLA
// Psychology IT (see DOCS/QUESTIONS.md #2). Sitemap and canonical URLs depend on it.
export default defineConfig({
  site: 'https://sanlab.psych.ucla.edu',
  integrations: [sitemap()],
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
