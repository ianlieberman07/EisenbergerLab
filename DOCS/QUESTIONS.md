# Open questions

Tracked per CLAUDE.md §6. Numbering follows the original brief; items 11+ came
up during the build.

Most of what was outstanding is now **closed** — `Information for Website.docx`
supplied the lab overview, all four research texts, five bios and five
headshots, and the live site supplied the alumni list.

## Still blocking launch

### 6b. Paper links and author names — audited end to end

Every one of the 205 entries was checked against Crossref (the DOI registry) and
against Unpaywall / Europe PMC / PubMed Central for open access. Current state:

| | |
|---|---|
| Publications | 205 |
| With a verified DOI | 195 |
| Freely readable | 134 (116 via a separate copy, 18 free at the publisher) |
| Author lists matching the registry exactly | 190 |
| No DOI found | 10 — all book chapters, which frequently have none |

**Author names.** Six surnames were misspelled in the CV and are corrected:
Eisenbeger → Eisenberger, Horstein → Hornstein, Tashijan → Tashjian (x2),
Duthcher → Dutcher, Moeini → Moieni (x3), Weisman-Fogel → Weissman-Fogel,
Kulhlman → Kuhlman, Pacillo → Pacilio. Twenty-five entries had also dropped
co-authors in transcription and were rebuilt from the publisher-deposited record
in her own house style.

Three entries deliberately do **not** match the registry, because the site is
right and the registry is wrong:

- **#102** — the registry misspells Byrne Haltom as "Bryne". Her CV and the live
  site both use Byrne, so the site keeps it.
- **#1** — Crossref's 2000 *Addiction* record omits two authors the CV correctly
  lists, including Eisenberger herself.
- **#157** — a 59-author paper. The CV's shortened list is the sane thing to
  print; the full roster would swamp the entry.

**Links.** Every free link was fetched and confirmed to respond, and where both
existed, PubMed Central was preferred over eScholarship — eScholarship sits
behind a Cloudflare human-verification challenge that some visitors will hit.
Eighteen papers whose "free copy" was simply the DOI again now show a single
"Read it free" link instead of the same URL twice under two labels.

Sixty DOIs return 403 to an automated request. Those are publisher bot-blocks
(SAGE, Wiley, Elsevier), not broken links — spot-checked by hand: doi.org
redirects correctly and the records resolve to the right articles.

**Nine papers were published under a different title than the CV records** — for
example #41 "Tylenol reduces social pain" appeared as "Acetaminophen Reduces
Social Pain", and #189 "Social connection and fear" as "Loneliness and the
persistence of fear". The DOIs are correct (verified by author list, venue and
year); only the wording differs. Her titles have been left as written, but she
may prefer the published forms: #24, #41, #53, #79, #129, #153, #160, #168, #189.

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

### 4, 5. Erica Hornstein restored; headshots supplied

Hornstein had no bio, photograph or title in the brief, the Word document or the
CV, and was **removed at the client's instruction**.

**She has since been added back**, at the developer's request, from the copy on
the live site (`sanlab.psych.ucla.edu/people/`). Her biography there is
transcribed verbatim. Three things are still open:

1. **Confirm the reinstatement with the client.** The removal was her decision.
   Nothing about it has been retracted in writing — this reversal came from the
   developer, not from her, and should not ship until she has said so.
2. **Title.** No job title is printed beside any name on the live site. `role`
   is set to "Postdoctoral Researcher", which follows from her own copy ("during
   her postdoctoral work") but is not a title she has stated. Confirm it, as with
   the other five.
3. **Headshot — low resolution.** Her photograph has been taken from the live
   site at the developer's instruction and converted to JPEG with all metadata
   stripped, as with the other five.

   **It is the only copy that exists there, and it is 214 × 239 pixels.** There
   is no larger original behind it — the file has no size suffix and the page
   offers no `srcset`, so that is the full-size upload, dating from 2016. The
   person card renders at roughly 440 CSS pixels wide, so the image is displayed
   at about twice its native size and is visibly softer than the other five
   (which are 1400px). It does not look broken, but it does not hold up beside
   them, and on a high-density display it will be worse.

   **Ask her for a current headshot.** Any phone photo taken today would be a
   large improvement. This is the one asset on the site that is below the
   standard of everything around it.

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
