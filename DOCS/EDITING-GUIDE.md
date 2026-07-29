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
| **Lab Members** | Everyone on the People page |
| **Lab Alumni** | Everyone on the Alumni page |
| **Research Topics** | The research pages, their summaries and header images |
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

They appear on the People page, and they also get their own page at
`/people/their-name` automatically.

### Move someone to Alumni

Open the person and change **Currently in the lab?** to *No — move to Lab
Alumni*. That's the whole job. They disappear from People and appear on Alumni.

Nothing is deleted this way, which is deliberate — it's very hard to lose
someone by accident.

### Remove someone completely

Open them and choose **Delete** in the entry menu. Use this for an entry created
by mistake; for someone who has genuinely left, move them to Alumni instead.

Even a deletion is recoverable — it's stored as a version like everything else.

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
| Add a lab member | ✅ Yes |
| Delete a lab member | ✅ Yes |
| Move someone to (or back from) Alumni | ✅ Yes |
| Add, edit or remove a paper | ✅ Yes |
| Add a whole new research topic page | ✅ Yes |
| Rewrite any text on the site | ✅ Yes |
| Replace any photograph, including headers | ✅ Yes |
| Update contact details | ✅ Yes |
| Reorder anyone or anything | ✅ Yes |
| Add a **brand-new type of page** — a "Join the Lab" page, a news section, a contact form | ❌ Needs a developer |
| Change the design, colours, or layout | ❌ Needs a developer |
| Reorganise the navigation menu | ❌ Needs a developer |

The last three are genuinely small jobs — an hour or two of developer time, not a
rebuild. They're excluded on purpose: letting a content editor rearrange page
structure is how sites get accidentally broken.

If you want a new section, that's a good moment to ask for help rather than
something to wrestle with yourself.

---

## For the developer: trying it before the site is deployed

The admin can run against the files on this machine, with no GitHub account and
nothing deployed. In two terminals:

```bash
npm run admin
```

```bash
npm run dev
```

Then open `http://localhost:4321/admin/` and choose **Work with Local
Repository**, selecting the repository folder when prompted. Edits write
straight to `content/`.

## Who can get in

Signing in is limited to named `@ucla.edu` addresses, and you add or remove
people yourself without touching any code. The full setup — and the reasoning —
is in [`ADMIN-ACCESS.md`](ADMIN-ACCESS.md).

## Setup still required before *she* can use it

**The admin page exists but is not yet connected to GitHub.** It needs two
things, both one-time jobs for whoever deploys the site:

1. **The site has to be deployed** somewhere (Netlify or Cloudflare Pages), which
   depends on the unresolved question of whether UCLA IT will point
   `sanlab.psych.ucla.edu` at outside hosting — see `QUESTIONS.md` #2.
2. **GitHub sign-in has to be authorised** so the admin can save changes. On
   Netlify this is a setting; elsewhere it's a small auth helper. Roughly fifteen
   minutes either way.

Until then `/admin` will load and then fail to sign in. That's expected.

Configuration lives in `public/admin/config.yml` if it needs changing.
