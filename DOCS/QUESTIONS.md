# Open questions

Tracked per CLAUDE.md §6. Numbering follows the original brief; items 11+ came
up during the build.

Most of what was outstanding is now **closed** — `Information for Website.docx`
supplied the lab overview, all four research texts, five bios and five
headshots, and the live site supplied the alumni list.

## Still blocking launch

### 6b. Paper links — DOIs and PDFs

All 205 publications are transcribed from her CV (June 2026) and live at
`content/papers.json`. **The CV lists no DOIs or PDF links**, so every `doi` and
`pdf` field is an empty string — none have been guessed. Each entry currently
falls back to a "Find this paper" Google Scholar search built from its title.

She offered to supply anything we can't access: *"If you can't get access to any,
let me know and I might be able to."* Taking her up on that is the remaining
work here, and links can be pasted in through the admin one at a time.

### 14. Job titles for the lab members

The document lists Crowder, Noble, Blandl and Naclerio under a bare heading,
"Lab members", with no individual titles. All four currently render as
"Lab Member". The bios imply graduate students, but that has not been assumed —
real titles (Graduate Student, Postdoctoral Fellow, etc.) need confirming.

### 8. Confirm the full contact block

Address is corrected to **5514 Pritzker Hall** per the doc. Phone, email and mail
code were never supplied and render as "TO BE CONFIRMED". All in one place:
`content/site.json`.

## Architectural

### 1. Editing approach — decided, and built

Git-backed CMS (**Sveltia**, a maintained drop-in for Decap), per the §4 default.
The admin lives at `/admin`; configuration is `public/admin/config.yml`; the
walkthrough written for her is [`EDITING-GUIDE.md`](EDITING-GUIDE.md).

**It is not yet connected.** It needs the site deployed and GitHub sign-in
authorised — roughly fifteen minutes once #2 below is settled. Until then
`/admin` loads and fails to sign in, which is expected.

Worth being straight with her about the boundary: adding people, papers, research
topics, text and photos is all self-service. Adding a **new kind of page** (a
"Join the Lab" page, a news section) or changing the design or navigation is a
developer job — small, but not something the admin exposes, deliberately.

### 2. Will UCLA IT point `sanlab.psych.ucla.edu` at external hosting?

Unanswered, and capable of invalidating the hosting plan. `site` in
`astro.config.mjs` is a placeholder until it's settled.

### 9. Does UCLA branding policy constrain the palette?

UCLA blue and gold appear only as a small footer nod. If Psychology's web team
requires more prominent branding, that's a change to make before sign-off.

## Resolved

### 3. Image licensing — substantially better than feared

The landing hero is **byte-for-byte identical** to `sanlab-brain-cover.jpg`
already served by the live site (verified by checksum), which matches her note
that the existing image is "fine to leave". It carries whatever licence the lab
already holds rather than being a new pick.

**Still outstanding, and now larger in scope.** Every section has its own image
so no two pages look alike, which means **11 further images from the inspiration
set are in use** — all Shutterstock, all unlicensed:

| Page | Image |
|---|---|
| Landing (section break) | `13-tree-heads-exchanging-birds` |
| Overview (header / aside) | `16-yarn-brain-to-yarn-heart` / `12-paired-hollow-heads-pastel` |
| Research index | `02-surreal-brain-landscape` |
| Social Pain | `03-busts-facing-erosion` |
| Inflammation | `11-figure-green-water-candle` |
| Loneliness & Fear Learning | `10-figure-ripples-pale-pink` |
| Prosocial Behavior | `14-head-doorway-red-heart` |
| Papers | `06-maze-brain-head-black` |
| People | `09-wood-head-puzzle-pieces` |
| Alumni | `05-cave-opening-tree-light` |

They must be licensed or replaced before launch. The upside is that swapping any
of them is now trivial: the four research images are set per-entry through the
admin, and the rest are a one-line import each.

**Ask her which of the 17 the lab actually licensed** — that determines how much
replacement work there is. `MANIFEST.md` keeps the original Shutterstock
filenames, so each one can be looked up directly.

### 4, 5. Erica Hornstein removed; headshots supplied

Hornstein had no bio, photograph or title in the brief, the Word document or the
CV. **Removed at the client's instruction** — she appears in the publication list
as a co-author, but no longer on the People page.

### Headshots

Extracted from the Word document. Blandl's was embedded inside an EMF wrapper and
had to be recovered from the raster inside it.

**Note:** Noble's photo carried iPhone GPS coordinates and several others carried
camera/timestamp EXIF. All metadata has been stripped, since these are private
individuals' photographs going into a public repository. Only colourspace and
pixel dimensions remain.

### 7. Lab overview on `/research` or `/overview`?

Her copy currently appears on **both**, which is what the doc allows for
("or you could put this overview on the overview page"). Trivial to consolidate
once she picks — it's one markdown file, `content/pages/lab-overview.md`.

### 11, 12. Content and alumni list — closed

All copy is now transcribed verbatim, with her italics preserved (*hurt*,
*crushed*, *broken*, *social*, *prepared fear suppressors*). The alumni list was
pulled from the live site: 19 established alumni plus 7 people moved off the
current-members list. Nobody was dropped.

### 16. Press Release page — confirmed removed

The doc says "don't need this". It does not exist in the new site and nothing
links to it.

## Design sign-off

### 13. The direction still needs her approval

Palette, type pairing and motion are tokenised in `src/styles/global.css`; the
whole site re-skins from that one file if she wants a different register.
