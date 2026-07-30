import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

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

// 205 publications transcribed from her CV. A single JSON list rather than 205
// markdown files: it builds faster, keeps the repo tidy, and a CMS list widget
// is a far nicer thing to edit than a folder of hundreds of entries.
// `doi` and `pdf` are empty strings awaiting real links — never guessed.
const papers = defineCollection({
  // Nested under a `papers` key rather than a bare array so the CMS can bind a
  // list widget to it — a root-level array has nothing to name in the editor.
  loader: file('./content/papers.json', { parser: (text) => JSON.parse(text).papers }),
  schema: z.object({
    id: z.number(),
    citation: z.string(),
    authors: z.string(),
    title: z.string(),
    journal: z.string().default(''),
    year: z.number(),
    inPress: z.boolean().default(false),
    traineeFirstAuthor: z.boolean().default(false),
    doi: z.string().default(''),
    pdf: z.string().default(''),
  }),
});

// Standalone prose blocks — currently the lab overview, which heads /research.
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
