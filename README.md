# SAN Lab website

A rebuild of the website for the **Social and Affective Neuroscience Laboratory**
at UCLA, directed by Dr. Naomi Eisenberger.

The standing brief is [`CLAUDE.md`](CLAUDE.md). Read it before changing anything.
Open questions and missing content are tracked in
[`DOCS/QUESTIONS.md`](DOCS/QUESTIONS.md).

## Status

Design direction + scaffold. The landing page is built to a finished standard for
sign-off; the remaining pages are structurally complete but **awaiting the
client's copy**, which was not supplied with the brief. No content has been
invented — every gap renders as a visible placeholder.

## Running it

```bash
npm install
npm run dev
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm run check` | Type-check `.astro` files |

## How it's put together

- **Astro 5**, static output, zero JS shipped except a ~20-line scroll-reveal.
- **Tailwind v4**, custom theme. Every colour, size, and font is a token in
  [`src/styles/global.css`](src/styles/global.css) — nothing hardcoded downstream.
  The site re-skins from that one file.
- **Content** is markdown + frontmatter in [`content/`](content/), typed by
  [`src/content.config.ts`](src/content.config.ts). Deliberately outside `src/`
  and in the shape a git-backed CMS expects, so an admin UI can be layered on
  without moving files.
- **Images** go through Astro's sharp pipeline — the 14 MB originals come out as
  45–150 kB WebP at several widths.

### Two components worth knowing

- `Placeholder.astro` wraps any copy that is **not** the client's own words. It
  outlines the text in dev and logs a warning at build time, so unapproved copy
  can't ship quietly.
- `Notice.astro` renders the visible "this content is missing" panels.

## Before launch

1. **Image licensing.** The heroes in `src/assets/heroes/` are unlicensed
   Shutterstock placeholders. They must be replaced — see QUESTIONS.md #3.
2. **Real copy** in place of every placeholder.
3. **Confirm the domain** with UCLA IT and set `site` in `astro.config.mjs`.
4. **Pick the CMS** (CLAUDE.md §4), then write `DOCS/EDITING-GUIDE.md` for her.
