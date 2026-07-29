# Open questions

Tracked per CLAUDE.md §6. Numbering follows the original brief; items 11+ came
up during the build.

Most of what was outstanding is now **closed** — `Information for Website.docx`
supplied the lab overview, all four research texts, five bios and five
headshots, and the live site supplied the alumni list.

## Still blocking launch

### 6. Her CV — the entire Papers page depends on it

The only substantial content still missing. The doc says: *"Needs to be updated
to include all of my recent papers. I will send along my CV that lists all of
these papers. I would like to have a link to each of those that are available.
If you can't get access to any, let me know and I might be able to."*

`/papers` renders a visible empty state by design. The schema, year/topic
filtering and DOI/PDF link handling are built and will populate the moment real
entries exist. **No citations have been generated** — a fabricated citation on an
academic site is a serious problem.

Once the CV arrives: build the list, then hand back the papers whose PDFs
couldn't be sourced, since she offered to supply those herself.

### 4. Erica Hornstein — bio and photograph

Flagged in the brief, and the Word document doesn't contain them either. She is
the one current member with no bio and no headshot; her card renders an initials
block and the People page carries a visible notice. **Her job title is also
unknown.**

### 14. Job titles for the five lab members

The document lists Hornstein, Crowder, Noble, Blandl and Naclerio under a bare
heading, "Lab members", with no individual titles. They all currently render as
"Lab Member". The bios imply graduate students, but that has not been assumed —
real titles (Graduate Student, Postdoctoral Fellow, etc.) need confirming.

### 15. Kate E. Byrne Haltom — current member or alumna?

The live site lists her as **Lab Manager**, under a separate heading from "Lab
Members". The instruction was "everyone else listed there should be moved to Lab
Alumni", which is ambiguous for a distinct role — especially as her bio says she
manages the SC/AN labs jointly. She has been left off both pages pending a
decision rather than guessed either way.

### 8. Confirm the full contact block

Address is corrected to **5514 Pritzker Hall** per the doc. Phone, email and mail
code were never supplied and render as "TO BE CONFIRMED". All in one place:
`content/site.json`.

## Architectural

### 1. Which editing approach does she want? (§4)

Still open, and still not foreclosed. Content is markdown + frontmatter in
`/content/`, which a git-backed CMS (Decap/Sveltia) reads directly.

**`DOCS/EDITING-GUIDE.md` is deliberately not written yet** — a
screenshot-driven walkthrough can't be written for a CMS that hasn't been chosen.

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

**Still outstanding:** three Shutterstock images from the inspiration set are
used as secondary art — `03-busts-facing-erosion` (landing section break),
`12-paired-hollow-heads-pastel` (overview), and `08-head-ladder-into-mind`
(fallback hero on all four research topic pages). These are unlicensed and must
be replaced or licensed. Each topic page is meant to get its own hero anyway.

### 5. Headshots — five of six supplied

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
