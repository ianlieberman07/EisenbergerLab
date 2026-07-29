import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content lives as markdown + frontmatter in /content/, deliberately outside
 * /src/. Two reasons:
 *   1. Content and presentation stay separate — no copy hardcoded in components.
 *   2. It is exactly the shape a git-backed CMS (Decap/Sveltia) expects, so the
 *      admin UI can be layered on without moving a single file.
 *
 * Every `draft: true` or `needsReview: true` entry is surfaced in the build
 * output rather than silently shipped — see DOCS/QUESTIONS.md.
 */

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/people' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      // `current` vs `alumni` drives which page the person appears on, so a
      // member can be moved to Alumni by flipping one field in the CMS.
      status: z.enum(['current', 'alumni']).default('current'),
      order: z.number().default(99),
      // Optional by design: the person card must degrade gracefully to a
      // placeholder when a headshot has not been supplied yet.
      headshot: image().optional(),
      headshotAlt: z.string().optional(),
      email: z.string().email().optional(),
      links: z
        .array(z.object({ label: z.string(), url: z.string().url() }))
        .default([]),
      // True when the bio is a placeholder awaiting client copy.
      needsReview: z.boolean().default(false),
    }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/research' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number().default(99),
      summary: z.string(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      needsReview: z.boolean().default(false),
    }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/papers' }),
  schema: z.object({
    citation: z.string(),
    year: z.number(),
    authors: z.string(),
    title: z.string(),
    journal: z.string().optional(),
    doi: z.string().optional(),
    pdf: z.string().optional(),
    // Ties a paper to a research topic so the Papers page can filter by theme.
    topics: z.array(z.string()).default([]),
    needsReview: z.boolean().default(false),
  }),
});

// Standalone prose blocks that are shared across pages — currently the lab
// overview, which appears on both /overview and /research.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string(),
    needsReview: z.boolean().default(false),
  }),
});

// `papers` is intentionally empty: her CV had not arrived, and CLAUDE.md §3 is
// explicit that citations must never be guessed. The schema and the Papers page
// are built and will populate the moment real entries exist.
export const collections = { people, research, papers, pages };
