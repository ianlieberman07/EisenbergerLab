# Admin access and security

Who can edit the site, and how that is enforced.

---

## Where things stand right now

**Nobody can currently edit the site through `/admin`, including you.** The page
loads, but every save path is closed because the site isn't deployed and no
sign-in is configured. That is the safe default, not a bug.

It's worth being precise about the current risk, because "anyone could just be
the admin" is not quite the situation:

| | Today |
|---|---|
| Can a stranger **load** `/admin`? | Yes — it's a static page in a public repo |
| Can a stranger **save** anything? | **No.** Saving writes to this GitHub repository, which requires write access to it |
| Can a stranger **see** unpublished content? | No — everything the CMS shows is already public in the repo |

So the page being reachable is cosmetic, not a breach. But "reachable by
strangers" is still the wrong shape for a university site, and it does not give
you the assign/revoke control you asked for. That needs a gate in front.

---

## What you asked for, and what actually delivers it

> Password protected · only people I assign · I can revoke myself · only
> `@ucla.edu` emails

**None of this can be enforced by the CMS configuration.** `config.yml` decides
what fields exist, not who may sign in. Anything claiming otherwise in a CMS
config is theatre — the file is publicly readable.

Authentication has to sit at the **hosting layer**, in front of `/admin`. The
recommendation below does all four things.

### Recommended: Cloudflare Pages + Cloudflare Access

Cloudflare Access sits in front of `/admin/*`. Someone visiting it is asked for
their email, sent a one-time code, and only let through if they match your
policy. It is free at this scale.

**Why this one:** it is the only common option that enforces an email *domain*
natively, which is the `@ucla.edu` requirement.

Setup, once the site is deployed to Cloudflare Pages:

1. Cloudflare dashboard → **Zero Trust** → **Access** → **Applications** → *Add
   an application* → **Self-hosted**.
2. Application domain: your domain, path `admin`.
3. Add a policy:
   - Action: **Allow**
   - Include → **Emails ending in** → `@ucla.edu`
4. Add a second Include rule listing specific addresses if you want it tighter
   than "any UCLA address" — which you probably do. A policy of *Emails ending
   in `@ucla.edu`* **AND** *Email in `{her address, yours}`* means only named
   UCLA people get in.
5. Login method: **One-time PIN** — no new account or password for her to
   remember; the code goes to her UCLA inbox.

**Assigning and revoking** is then editing that policy list. Removing your own
address revokes you, immediately, with no code change and no deploy.

### Alternative: Netlify + Netlify Identity

Workable if the site lands on Netlify instead. Registration set to
**invite-only** gives you the assign/revoke control, and she gets an email
invite and sets her own password — no GitHub account needed, which is a genuine
advantage.

The gap: Netlify Identity does **not** natively restrict by email domain. You'd
add that with a small signup-validation function, or accept invite-only as
sufficient — since if only you can send invites, only people you invite get in.

### Not recommended: relying on GitHub permissions alone

This is what the current config does by default. It's real security — repo write
access is genuinely required to save — but it's the wrong tool here: it means
every editor needs a GitHub account, permissions are managed in a place she'll
never look, and there is no `@ucla.edu` guarantee, since GitHub accounts are
tied to whatever email someone signed up with.

---

## Recommended combination

```
Cloudflare Access  (gate: @ucla.edu, one-time PIN, you assign/revoke)
        ↓
      /admin
        ↓
Sveltia CMS → writes to this GitHub repo
```

Access controls **who reaches the door**; GitHub controls **what happens when
they save**. Two independent layers, and the one you administer day to day is
the Access policy.

One wrinkle to expect: behind the gate, the CMS still needs its own GitHub
authorisation to write. For a single editor the cleanest route is a dedicated
GitHub account with write access to just this repository, signed in once and
left signed in. She then only ever sees the Access email code.

---

## Hardening already done in the repo

- `/admin` carries `<meta name="robots" content="noindex">`
- `robots.txt` disallows `/admin`
- The CMS shows only content that is already public in this repository, so
  nothing confidential is exposed even before the gate exists
- No API keys, tokens or secrets are stored in the repo or in `config.yml`

---

## Blocked on

The gate cannot be configured until the site is actually deployed somewhere, and
that is waiting on whether UCLA IT will point `sanlab.psych.ucla.edu` at outside
hosting — `QUESTIONS.md` #2. If they insist on hosting it themselves, this whole
approach changes, and their own SSO (UCLA Logon) becomes the obvious gate
instead. **Worth asking them before committing to Cloudflare.**
