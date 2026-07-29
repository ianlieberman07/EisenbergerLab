# Open questions

Tracked per CLAUDE.md §6. Items 1–10 are from the original brief; items 11+ came
up during the first build.

## Blocking — the site cannot launch without these

### 11. The `/content/` directory referenced throughout the brief was not in the repo

CLAUDE.md §3 states that final, approved copy "is in `/content/research/`" and
`/content/people/`, and that `Information_for_Website.docx` is the source of
truth. None of it was present — the repository contained only `CLAUDE.md` and
`/design/`.

Per §6 ("never invent content"), **nothing has been written in its place.** Every
gap is a marked placeholder:

| What's missing | Where it shows up |
|---|---|
| Lab overview copy | `/overview`, `/research` |
| Four research topic texts | `/research/[topic]` — all four |
| Bios for Eisenberger, Crowder, Noble, Blandl, Naclerio | `/people` |
| Erica Hornstein's bio **and job title** (§3 already flagged the bio) | `/people` |
| Her CV → the entire Papers page | `/papers` — renders empty by design |
| Alumni names from the current live site | `/people/alumni` — renders empty |

Placeholder copy is outlined in dev mode and logged loudly at build time, so
none of it can ship silently.

### 12. Alumni list can be pulled from the current site on request

§3 says to take the existing alumni off sanlab.psych.ucla.edu and drop nobody.
That list has not been invented. It can be scraped from the live site and filled
in as soon as you want it — it just needs saying.

### 3. Are any of the Shutterstock reference images licensed?

Unchanged from the brief, and now urgent: the mockup currently uses four of them
as placeholder heroes (`src/assets/heroes/`). They are marked as placeholders in
the code, but **none may ship to production** without a per-asset license. If
none are licensed, replacements need sourcing from Unsplash/Pexels in the same
register.

Note also that the full 127 MB inspiration set is committed to a **public**
repository.

## Architectural — needed before further build-out

### 1. Which editing approach does she want? (§4)

Nothing here forecloses the choice. Content is markdown + frontmatter in
`/content/`, which is exactly what a git-backed CMS (Decap/Sveltia) reads
directly. Moving to Sanity later would mean rewiring the data layer but not
redesigning the site.

**`/DOCS/EDITING-GUIDE.md` is deliberately not written yet** — a
screenshot-driven walkthrough can't be written for a CMS that hasn't been
chosen.

### 2. Will UCLA IT point `sanlab.psych.ucla.edu` at external hosting?

Still unanswered and still capable of invalidating the hosting plan. Worth
asking before any deployment work. `site` in `astro.config.mjs` is a placeholder
until this is settled.

### 9. Is there UCLA branding policy constraining the palette?

The current direction uses UCLA blue and gold only as a small footer nod, per
§2. If Psychology's web team requires more prominent branding, the palette needs
revisiting before the design is signed off — not after.

## Content details

### 8. Confirm the full contact block

Address is corrected to **5514 Pritzker Hall** (was 4444 Franz Hall). Phone,
email and mail code all render as "TO BE CONFIRMED" in the footer and on
`/overview`. They're in one place: `content/site.json`.

### 4, 5, 6. Hornstein bio · headshots for all six members · her CV

See item 11. Person cards degrade to an initials block when no headshot exists,
so the People page looks deliberate rather than broken while you wait.

### 7. Lab overview on `/research` or `/overview`?

Currently stubbed in both places, following the carolinasnhlab pattern she cited.
Trivial to consolidate once she picks.

### 10. Anything new that isn't on the old site?

Not yet asked — a "Join the Lab" / participant recruitment page, news, press
coverage, or a contact form would each change the nav.

## Design sign-off

### 13. The direction needs her approval before more pages get built

Per §6, one page has been taken to a finished standard (the landing page) rather
than seven built at medium quality. Palette, type pairing, and motion are all
tokenised in `src/styles/global.css` — the whole site re-skins from that one
file if she wants a different register.
