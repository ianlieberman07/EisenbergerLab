# CLAUDE.md — UCLA Social & Affective Neuroscience Lab Website

This file is the standing brief for this repo. Read it fully before writing code.

---

## 1. What this project is

A complete rebuild of the website for the **Social and Affective Neuroscience
Laboratory (SAN Lab)** at UCLA, directed by **Dr. Naomi Eisenberger**.

- **Current site (to be replaced):** https://sanlab.psych.ucla.edu/ — WordPress,
  dated, generic theme. Content is mostly reusable; the design is not.
- **The client is the lab director**, a non-technical scientist. She is the only
  person who will maintain the site after launch.

### The two goals, in her words and in plain terms

1. **It has to look genuinely beautiful.** Her words were "nicer, sexier,
   professional… an amazing website." Read that as: the current site looks like a
   default WordPress theme, and she wants something that looks like it was made
   by a design studio. This is not a "make it a bit cleaner" job. Visual quality
   is a first-class requirement, equal in weight to functionality.
2. **She has to be able to edit it herself, easily.** Text, photos, adding a new
   lab member, adding a new paper — without a developer, without touching code,
   without a terminal. See §4.

**When those two goals conflict, do not silently sacrifice either one.** Surface
the tradeoff and ask.

### Reference sites she likes

| Site | What to take from it |
|---|---|
| https://carolinasnhlab.com/overview | The research-page pattern she explicitly asked for: a general lab overview that links out to individual research-topic pages |
| https://www.uclascnlab.com/ | She named this as an aesthetic reference (Matthew Lieberman's SCN Lab, same department) |

---

## 2. Design direction

### The mood

She supplied 17 reference images (see `/design/inspiration/`). **Look at them
before you design anything** — they are the single clearest signal of her taste.
They are not necessarily meant to appear on the site; they show the *register*
she wants.

What they have in common:

- **Surreal, editorial, conceptual art photography** — sculptural human heads and
  busts, figures half-submerged in still water, trees shaped like faces, a tiny
  person carrying a red heart through a doorway in a stone head.
- **Dark, moody, muted palettes** — charcoal, slate, sage green, dusty rose,
  bone white. Low saturation. High-contrast subject against a soft or dark ground.
- **A recurring visual thesis: two entities in relation.** Two heads facing each
  other, hands clasped, a brain connected by yarn to a heart. That *is* the lab's
  research — social connection, the link between the social world and the body.
  Lean on it.
- **A minority of bolder, flatter illustration** (the orange/teal clasped hands,
  the blue-and-red gear heads). Use these sparingly, as accent, not as the base
  language.

What she is clearly **not** asking for: stock photos of smiling students, rainbow
fMRI glass brains, clip-art neurons, corporate-blue gradients, or a "science
website" look.

### Concrete direction (propose this, then confirm before building out)

- **Palette:** deep near-black / charcoal ground (`#12100F`-ish, warm not blue),
  bone/off-white text (`#F2EFE9`), one restrained accent drawn from the imagery —
  a muted terracotta or dusty rose reads better against her photos than UCLA blue
  does. Keep UCLA blue/gold as a small institutional nod (footer, links) rather
  than the primary palette, unless UCLA branding rules require otherwise — **check
  with the UCLA Psychology web team on this before finalizing.**
- **Typography:** an editorial serif for display headings (something with real
  character — think a high-contrast or transitional serif, not Times), paired with
  a clean neutral sans for body copy. Big type. Generous line height. Long-form
  reading is the primary activity on this site.
- **Layout:** wide margins, real whitespace, full-bleed imagery at section breaks,
  a slow and confident vertical rhythm. Restraint over density.
- **Motion:** subtle only. Gentle fade/rise on scroll, smooth image transitions.
  No parallax circus, no autoplaying video, no scroll-jacking.
- **Accessibility is non-negotiable:** WCAG AA contrast minimum, real focus
  states, semantic HTML, alt text on every image, `prefers-reduced-motion`
  respected. A university site will be audited on this.
- **Performance:** the site must be fast on a phone. Images optimized and served
  as modern formats at multiple sizes.

### ⚠️ Image licensing — resolve before launch

The reference images are **Shutterstock files** (original filenames preserved in
`/design/inspiration/MANIFEST.md`). Do **not** ship any of them to production
unless the lab has purchased a license for that specific asset. Ask the client
which, if any, are licensed. For anything unlicensed, source replacements from
Unsplash / Pexels / a purchased Shutterstock license that match the mood
described above.

---

## 3. Site structure and content

Content lives in `/content/` (see §4). The source of truth for launch copy is
`Information_for_Website.docx` from the client, transcribed below.

### Pages

```
/                    Landing / splash
/overview            Home — lab overview + contact
/research            Research overview + links to topic pages
/research/[topic]    Four individual research topic pages
/papers              Publications
/people              Current lab members
/people/alumni       Lab alumni
```

**Removed from the old site:** the Press Release page. She explicitly does not
want it. Don't carry it over, and don't leave orphaned links to it.

### Landing page
- Keep the existing brain cover image from the current site (she approved it),
  *or* propose a stronger alternative in the same register from the inspiration set.
- Must show **her name** in addition to the lab name. On the current site only the
  lab name appears; she specifically asked for both.

### Overview / Home
- Existing overview copy is fine to reuse.
- **Correct the address.** The old site says 4444 Franz Hall. It should be
  **5514 Pritzker Hall**. Verify the rest of the contact block (phone, email,
  mailing box number) with her rather than copying the old one blindly.

### Research page
Structure it the way carolinasnhlab.com does: a lab overview up top, then links
into four topic pages. (She's open to the overview living on the Overview page
instead — ask her which she prefers.)

Full final copy for the lab overview and all four topics — **The Neural Bases of
Social Pain**, **Inflammation and Social Experience**, **Social Support Figures,
Loneliness, and Fear Learning**, and **Prosocial Behavior and Health** — is in
`/content/research/`. It is already written and approved; transcribe it exactly,
preserving her emphasis (italics on words like *hurt*, *crushed*, *social*,
*prepared fear suppressors*). Do not paraphrase, tighten, or "improve" her prose.

Each topic page should get its own hero image in the house style.

### Papers page
- Needs a full refresh from her CV, which she is sending separately. **Do not
  fabricate or guess citations** — if the CV isn't in the repo yet, build the page
  structure with the existing publications and flag the gap.
- Every paper that has an accessible PDF or DOI gets a link. Keep a running list
  of any she'll need to supply herself, and surface it to her.
- Make it filterable/searchable by year and by research topic if the volume
  justifies it (it does — there are hundreds of entries).

### People page
**Current members:** Naomi Eisenberger (Director), Erica Hornstein, Celeste
Crowder, Russell Noble, Flora Blandl, Maria Naclerio.

**Everyone else currently listed on the live site moves to Lab Alumni.** Pull the
existing alumni names off the old site; don't drop anyone.

Bios for Eisenberger, Crowder, Noble, Blandl, and Naclerio are in
`/content/people/`. **Erica Hornstein's bio was not supplied — flag this and ask
for it.** Don't write one for her.

Headshots are needed for all current members; ask the client. Design the person
card so it degrades gracefully with a placeholder if a photo is missing.

---

## 4. How she edits the site — the central architectural decision

**This is the decision that determines the whole stack. Do not start building
until it's settled with the client.**

Her developer's initial instinct was a custom admin login. That works, but it's
the most expensive path: it means a database, session management, password
resets, an image-upload pipeline, a rich-text editor, and a permanent security
surface on a university domain — all built and maintained by you, forever, for
one editor. There are better-fitting options.

### Recommended: Git-backed CMS (Astro + Decap/Sveltia CMS)

Static site generator, content in markdown in this repo, edited through a
friendly admin UI.

- **How it feels to her:** she goes to `sanlab.../admin`, logs in, sees a form —
  "Lab Members," "Papers," "Research Topics" — edits text in a rich-text box,
  drags in a photo, clicks Publish. Site rebuilds and deploys in ~60 seconds.
- **Why it's good here:** no database, no server to maintain, free hosting
  (Netlify / Cloudflare Pages), every edit is a git commit so *everything is
  revertable*, and the site is static — which means very fast and essentially
  unhackable. Content stays in the repo, so it's never locked in a vendor.
- **Cost:** $0/mo plus the domain.
- **Friction:** she needs a GitHub account, and the OAuth setup is a one-time
  fiddle. Media handling is decent but not luxurious.

### Strong alternative: hosted headless CMS (Astro/Next + Sanity)

- **How it feels to her:** logs into a polished studio with her Google account.
  Best-in-class editing and media experience — genuinely pleasant to use.
- **Why consider it:** lowest possible friction for a non-technical editor;
  excellent image handling (cropping, hotspots) which matters given how
  image-forward this design is.
- **Cost:** free tier is generous and this site will not exceed it.
- **Friction:** content lives in Sanity's cloud, not the repo. Vendor dependency.

### Her developer's original idea: custom admin + database

Viable, and gives total control — but it's materially more work, more ongoing
maintenance, and more risk than either option above, for no gain she'd actually
notice. **Recommend against it unless a specific requirement demands it.**

### What to do

Present the first two to her in plain language — no jargon, describe what her
Tuesday-afternoon "I want to add a new grad student" flow looks like in each —
and let her choose. **Default to the Git-backed CMS if she has no preference.**

### Editing requirements, whichever path is chosen

Every one of these must be editable by her without a developer:

- All body copy on every page
- All images, including hero images (upload + replace + alt text)
- Add / edit / remove / reorder lab members; move a member to Alumni
- Add / edit / remove publications, including PDF uploads and links
- Add / edit / remove research topic pages
- Contact info in the footer

She should **never** need to open a terminal, edit HTML, or understand markdown
syntax. Anything she can't do herself is a maintenance request forever — treat
each one as a design failure.

Also write `/DOCS/EDITING-GUIDE.md`: a short, screenshot-driven, jargon-free
walkthrough written for her, not for a developer.

---

## 5. Technical conventions

*(Fill in once §4 is decided. Defaults below assume the recommended path.)*

- **Framework:** Astro (content-collections for markdown, ships zero JS by default,
  excellent image optimization — a good fit for a content site that must be fast
  and beautiful).
- **Styling:** Tailwind with a **custom theme**. Define the palette, type scale,
  and spacing as design tokens in one place. Do not litter the codebase with
  arbitrary hex values or one-off utility soup.
- **Hosting:** Netlify or Cloudflare Pages, deploy on push to `main`.
- **Domain:** the lab currently lives at `sanlab.psych.ucla.edu`, a UCLA-managed
  subdomain. **Confirm early with UCLA Psychology IT** whether they'll point that
  subdomain at external hosting, or whether the site must live on their
  infrastructure — this can invalidate the whole hosting plan, so ask before
  building.
- **Content:** markdown + frontmatter under `/content/`. Content and presentation
  stay separate; no copy hardcoded in components.
- **Images:** originals in `/src/assets/`, served through the framework's image
  pipeline. Never ship a 14MB JPEG.
- **Repo hygiene:** small, focused commits with clear messages. Don't commit
  secrets, `.env` files, or unlicensed stock imagery.

---

## 6. Working agreements for Claude

- **Ask before assuming.** Where this file says "confirm with the client," stop
  and ask rather than guessing. Open questions are tracked in `/DOCS/QUESTIONS.md`
  — add to it as they come up.
- **Never invent content.** No fabricated citations, bios, dates, awards, or
  statistics. If content is missing, use a clearly-marked placeholder and flag it.
  This is an academic site; a made-up citation is a serious problem.
- **Preserve her voice.** The research and bio copy is hers and is good. Transcribe
  it exactly. Don't rewrite it.
- **Design deliberately.** Before building pages, propose a direction — palette,
  type pairing, and one page mocked to a high standard — and get sign-off. Don't
  bulk-generate seven mediocre pages.
- **Every page must work on a phone.** She and her colleagues will look at this on
  phones first.
- **Check the inspiration folder** whenever making a visual decision.
- Suggest a better approach when you see one. Say so plainly; don't just comply.

---

## 7. Open questions (as of first draft)

1. Which editing approach does she want (§4)?
2. Will UCLA IT point `sanlab.psych.ucla.edu` at external hosting?
3. Are any of the Shutterstock reference images actually licensed?
4. Erica Hornstein's bio — needed.
5. Headshots for all current lab members — needed.
6. Her CV, for the Papers page — needed.
7. Lab overview on the Research page or the Overview page?
8. Confirm full contact block (the address correction is known; verify phone,
   email, mail code).
9. Is there UCLA branding policy that constrains the palette?
10. Does she want anything new that isn't on the old site — a "Join the Lab" /
    participant recruitment page, news, press coverage, contact form?
