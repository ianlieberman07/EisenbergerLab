# SAN Lab website

A rebuild of the website for the **Social and Affective Neuroscience Laboratory**
at UCLA, directed by Dr. Naomi Eisenberger.

The standing brief is [`CLAUDE.md`](CLAUDE.md). Read it before changing anything.
Open questions and missing content are tracked in
[`DOCS/QUESTIONS.md`](DOCS/QUESTIONS.md).

## Status

All pages built and populated with the client's own content: copy transcribed
verbatim from `Information for Website.docx` with her emphasis preserved, all
headshots, all 205 publications from her CV, and the alumni list from the
current live site.

The site is Home, Research (with four topic pages), Papers and People. Editing
is handled by a git-backed CMS at `/admin` — see
[`DOCS/EDITING-GUIDE.md`](DOCS/EDITING-GUIDE.md), written for her rather than for
a developer. It needs deploying and GitHub sign-in before it works.

**Outstanding:** confirmed job titles for the four lab members. No content has
been invented — every remaining gap renders as a visible notice.
See [`DOCS/QUESTIONS.md`](DOCS/QUESTIONS.md).

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
  [`src/content.config.ts`](src/content.config.ts), and edited through the CMS at
  `/admin`. Papers are the exception: 205 entries live in a single
  `content/papers.json` rather than 205 files.
- **Images** go through Astro's sharp pipeline — the 14 MB originals come out as
  45–150 kB WebP at several widths.

### Two components worth knowing

- `Placeholder.astro` wraps any copy that is **not** the client's own words. It
  outlines the text in dev and logs a warning at build time, so unapproved copy
  can't ship quietly.
- `Notice.astro` renders the visible "this content is missing" panels.

## Before launch

2. **Confirm the domain** with UCLA IT and set `site` in `astro.config.mjs`,
   then deploy and gate `/admin` (DOCS/ADMIN-ACCESS.md).
3. **Design sign-off** from the client.

## A note on the headshots

Several arrived with camera EXIF, and one carried **GPS coordinates**. All
metadata is stripped before the files enter the repo — these are private
individuals' photographs in a public repository. If you add more headshots by
hand, strip them too.
