# Editing the website

Written for Dr. Eisenberger. No coding, no terminal.

You edit the site at:

```
https://<the-site-address>/admin
```

Sign in with GitHub once, and after that it remembers you.

---

## What you'll see

A list of sections down the side:

| Section | What it controls |
|---|---|
| **Lab Members** | Everyone on the People page, and the Alumni page |
| **Research Topics** | The four research pages and their summaries |
| **Page Text** | The lab overview that appears on Overview and Research |
| **Papers** | The full publication list |
| **Site Details** | Lab name, director, address, email, phone |

Click a section, click an entry, change what you want, click **Save**. The site
rebuilds itself and the change is live in about a minute.

---

## Common things you'll want to do

### Add a new lab member

**Lab Members → New Lab member.** Fill in their name and title, drag in a
photograph, and type their bio. Set *Position in the list* to control where they
appear — lower numbers come first.

If you don't have a photo yet, leave it blank. The card shows their initials
instead of breaking.

### Move someone to Alumni

Open the person and change **Currently in the lab?** to *No — move to Lab
Alumni*. That's the whole job. They disappear from People and appear on Alumni.

Nobody is ever deleted this way, which is deliberate — it's very hard to lose
someone by accident.

### Add a paper

**Papers → Publication list → Add Publication.** Fill in title, authors, journal
and year. If there's a DOI or PDF link, paste it in; if not, leave those blank
and the site shows a "Find this paper" search link instead.

For papers that are in press, tick **In press** and set the year to 9999 — that
keeps them at the top of the list.

### Fix a typo anywhere

Find the section it lives in and edit the text. Everything on the site is in one
of the five sections above.

### Change the address, email or phone

**Site Details.** These appear in the footer and on the Overview page, and
updating them here updates both at once.

---

## Two useful things to know

**Every save is undoable.** Each edit is stored as a separate version. If
something goes wrong, it can be rolled back to exactly how it was — nothing is
ever really lost.

**Italics carry meaning in your research text.** The words you italicised —
*hurt*, *crushed*, *social*, *prepared fear suppressors* — are preserved. Use the
italic button in the editor to add more.

---

## What you can't do here (and what to do instead)

This is the honest boundary. The admin handles **content**. It does not handle
**structure**.

| You want to… | Can you do it here? |
|---|---|
| Add/edit/remove a lab member | ✅ Yes |
| Add/edit/remove a paper | ✅ Yes |
| Add a new research topic | ✅ Yes |
| Rewrite any text on the site | ✅ Yes |
| Replace any photograph | ✅ Yes |
| Update contact details | ✅ Yes |
| Add a **brand-new type of page** — a "Join the Lab" page, a news section, a contact form | ❌ Needs a developer |
| Change the design, colours, or layout | ❌ Needs a developer |
| Reorganise the navigation menu | ❌ Needs a developer |

The last three are genuinely small jobs — an hour or two of developer time, not a
rebuild. They're excluded on purpose: letting a content editor rearrange page
structure is how sites get accidentally broken.

If you want a new section, that's a good moment to ask for help rather than
something to wrestle with yourself.

---

## Setup still required before this works

**The admin page exists but is not yet connected.** It needs two things, both
one-time jobs for whoever deploys the site:

1. **The site has to be deployed** somewhere (Netlify or Cloudflare Pages), which
   depends on the unresolved question of whether UCLA IT will point
   `sanlab.psych.ucla.edu` at outside hosting — see `QUESTIONS.md` #2.
2. **GitHub sign-in has to be authorised** so the admin can save changes. On
   Netlify this is a setting; elsewhere it's a small auth helper. Roughly fifteen
   minutes either way.

Until then `/admin` will load and then fail to sign in. That's expected.

Configuration lives in `public/admin/config.yml` if it needs changing.
