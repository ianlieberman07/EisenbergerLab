# Open questions

Tracked per CLAUDE.md §6. Numbering follows the original brief; items 11+ came
up during the build.

Most of what was outstanding is now **closed** — `Information for Website.docx`
supplied the lab overview, all four research texts, five bios and five
headshots, and the live site supplied the alumni list.

## Still blocking launch

### 6b. Paper links — mostly resolved automatically

Her CV lists no DOIs or PDF links, so they were resolved against **Crossref**
(the DOI registry) and **Unpaywall** (legal open-access copies only). Nothing was
guessed: a candidate is accepted only if the normalised title matches at ≥0.93,
an Eisenberger appears in Crossref's own author list, the year is within a year,
and the journal name also matches. That last gate matters — for the 2003 *Science*
paper, Crossref's top hit is a PsycEXTRA duplicate record, and title similarity
alone would have picked the wrong DOI.

Every paper without a confident match keeps its "Find this paper" Scholar search
fallback, so nothing on the page is broken or wrong — just less convenient.

**Remaining:** the unmatched entries are mostly book chapters and encyclopedia
articles, which frequently have no DOI at all. This is where her offer applies —
*"If you can't get access to any, let me know and I might be able to."* Links can
be pasted in through the admin one at a time.

### 17. A CV-parsing bug worth knowing about

The original transcription split each citation into title and journal at the
first sentence break. That silently truncated any title containing internal
punctuation — *"Why don't you like me? The role of the mentalizing network…"* had
half its title sitting in the journal field, and six entries were affected.

Fixed, and the six re-resolved. Flagging it because it's the kind of error that
looks like clean data: nothing was missing, it was just in the wrong field.
**Worth a spot-check against the CV before launch.**

### 18. Strand 3 artwork — resolved

Strands 2 and 3 originally used two images from the same series: near-identical
sculpted figures differing only in colour grade. Strand 3 briefly used a
client-supplied illustration, but at 466 x 291 it was being upscaled roughly
threefold (sixfold on a retina screen) and read as soft.

It now uses `12-paired-hollow-heads-pastel` from her own inspiration set —
7000 x 4000, already licensed and paid for, on-register, and a good fit for the
topic (two facing heads, one holding another figure). It was freed up when the
Overview page was removed.

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

### 8. Contact block — resolved

Full details supplied by the client (July 2026): phone 310.267.5196, email
neisenbe@ucla.edu, Box 951563. Building kept as **5514 Pritzker Hall** per her
explicit correction — the supplied block still carried the old 4444 Franz Hall
address, which circulates on older materials. Flag to her if the lab has
actually moved back.

### 3. Image licensing — resolved

**The client confirms the inspiration-set images are licensed and purchased for
use.** All 12 in-use images are cleared; the table below records where each one
appears.

The landing hero is **byte-for-byte identical** to `sanlab-brain-cover.jpg`
already served by the live site (verified by checksum), which matches her note
that the existing image is "fine to leave". It carries whatever licence the lab
already holds rather than being a new pick.

Every section has its own image so no two pages look alike — 11 images from the
set in use beyond the cover:

| Page | Image |
|---|---|
| Landing (section break) | `17-gears-heads-blue-red` (chosen by the client) |
| _(Overview page removed — `16-yarn-brain-to-yarn-heart` and `12-paired-hollow-heads-pastel` now unused)_ | — |
| Research index | `02-surreal-brain-landscape` |
| Social Pain | `03-busts-facing-erosion` |
| Inflammation | `11-figure-green-water-candle` |
| Loneliness & Fear Learning | `12-paired-hollow-heads-pastel` |
| Prosocial Behavior | `14-head-doorway-red-heart` |
| Papers | `06-maze-brain-head-black` |
| People | `09-wood-head-puzzle-pieces` |
| Alumni | `05-cave-opening-tree-light` |

Swapping any of them remains trivial: the four research images are set per-entry
through the admin, and the rest are a one-line import each.

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

### 7. Lab overview placement — resolved

**The Overview page has been removed at the client's request.** The lab overview
now lives only at the top of `/research`, which is the arrangement her document
allowed for. The contact block that lived on Overview moved to the landing page
(beside her name, as requested) and remains in the footer.

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
