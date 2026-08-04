# Deploying the site

**Live:** https://eisenbergerlab.ianlieberman07.workers.dev — Cloudflare Workers,
built automatically from `main`.

Written for you, not for Dr. Eisenberger. Her guide is
[`EDITING-GUIDE.md`](EDITING-GUIDE.md) — she never needs anything on this page.

---

## The shape of it

```
        you push to GitHub                she clicks Save in /admin
                │                                    │
                └──────────────┬─────────────────────┘
                               ▼
                   GitHub repo (main branch)
                               │
                    push triggers a build
                               ▼
                     Cloudflare builds it
                       `npm run build`
                               ▼
                     live site, ~60 seconds
```

The important thing: **both routes are the same route.** Her saves in the admin
are git commits to `main`, exactly like yours. There is one source of truth and
one deploy path, so "how do I redeploy" has the same answer for both of you —
you don't. Pushing *is* deploying.

She needs no files, no terminal, and no copy of this repository. That is the
whole reason the site was built this way.

---

## Before you start

You need:

- **A GitHub account** with push access to `ianlieberman07/EisenbergerLab` (you
  own it, so this is already true).
- **A Cloudflare account.** Free. Everything below is inside the free tier and
  will stay there — this site is a few hundred kilobytes of static files.

You do **not** need a domain to get started. Cloudflare gives you a working
`….workers.dev` address immediately, which is the right thing to send
Dr. Eisenberger for sign-off before anyone talks to UCLA IT. It is not enough to
finish on, though — see step 5.

### Why Cloudflare rather than Netlify

Netlify is slightly simpler for step 4 — it provides the GitHub sign-in
handshake for free, and on Cloudflare you deploy a small worker to do the same
job. Cloudflare wins anyway, for one specific reason: **Cloudflare Access is the
only free option that can restrict the admin to `@ucla.edu` addresses**, which
is what was asked for. See [`ADMIN-ACCESS.md`](ADMIN-ACCESS.md).

If that requirement ever goes away, Netlify is a fine choice and steps 2–4
collapse into one.

---

## Step 1 — Push the site to GitHub

**Done.** Kept here because it is the step you repeat forever: a push to `main`
is what triggers every deploy. Check where you stand with:

```bash
git status -sb
```

If it says `ahead N`, those commits only exist here. Push them:

```bash
git push -u origin main
```

That is the only terminal command in this document that changes anything
outside your computer — and it is the one that deploys.

> **Note:** this repository is public. Nothing in it is secret — no keys, no
> tokens, no `.env` — but it does contain the lab's photographs and copy. That
> is intended, and it is what lets the CMS work without a server. If it ever
> needs to be private, Cloudflare supports private repos on the free tier too;
> nothing below changes.

---

## Step 2 — Connect Cloudflare to the repo

**Done.** The site is live at

```
https://eisenbergerlab.ianlieberman07.workers.dev
```

It is deployed on **Cloudflare Workers** with static assets, via **Workers
Builds** — Cloudflare's Git integration — rather than Cloudflare Pages. The two
are near-identical for a static site: same build, same `_headers` support, same
caching. Everything below applies to either, and where it doesn't, it says so.

The settings in the dashboard are:

| Field | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Build variables | none needed yet — see `SITE_URL` below |

### These commands run on Cloudflare, not on your machine

This is the part worth being clear about, because it is the difference between
the site working for Dr. Eisenberger and not working at all.

Those two commands are what **Cloudflare's** build machine runs, on its own,
every time a commit lands on `main`. You do not run them locally, and you must
not deploy by hand — see [After launch](#after-launch-how-changes-get-made).

It matters because **her saves in `/admin` are commits to `main`.** They come
from the CMS in her browser, not from anyone's terminal. If the site were
deployed manually, her edits would sit in GitHub forever and never appear. The
Git-triggered build is the thing that makes her independent of you.

### `SITE_URL` — leave it unset until launch day

`site` in `astro.config.mjs` defaults to the workers.dev address, which is where
the site is actually served from, so canonical URLs, the sitemap and link
previews are all correct as they stand. **Nothing to set right now.**

It used to default to `sanlab.psych.ucla.edu`, which was wrong in a way worth
remembering: that domain is **not** a placeholder. It resolves, and it is still
serving the old WordPress site. So every page here was telling Google and every
link preview that its real self was the old site, and the Open Graph image
404'd, which is why sharing the review link produced a card with no picture.

Because the hostname does not match `PRODUCTION_HOST` (`src/config.ts`), this
deployment also serves `noindex, nofollow` on every page and a
`Disallow: /` robots.txt. A full copy of the lab's pages and its members'
photographs sitting at a throwaway URL should not be crawlable, and that
protection is derived from the address rather than from a checkbox someone has
to remember.

**On launch day**, once IT has pointed the domain here, add one build variable:

| Name | Value |
|---|---|
| `SITE_URL` | `https://sanlab.psych.ucla.edu` |

Redeploy. Canonicals, Open Graph tags and the sitemap switch to the real domain
and the noindex lifts by itself. Both states are verified by building with and
without the variable.

A build takes two or three minutes, mostly generating the image sizes. Later
builds are faster — Cloudflare caches `node_modules`. You can watch one run in
the dashboard under the Worker's **Deployments**.

### If a build fails

Almost always one of two things:

- **Node version.** Cloudflare's default is usually fine, but if you see a
  syntax error from a dependency, add an environment variable
  `NODE_VERSION` = `22`.
- **`npm ci` cannot resolve.** `package-lock.json` is committed, so this
  shouldn't happen. If it does, the build log names the package.

The full build log is under the deployment in the Cloudflare dashboard.

---

## Step 3 — Check the deployed site

Worth two minutes now, because these are the things that break in production and
not in `npm run dev`:

- Every page loads: `/`, `/research`, the four topic pages, `/papers`,
  `/people`, `/people/alumni`.
- Images appear. If they don't, the build output directory is wrong.
- `/papers` search and the decade filters work.
- `/sitemap-index.xml` lists real URLs at the address you're actually on.
- `/admin` loads and shows a sign-in screen. It will **not** let you in yet —
  that is step 4.

---

## Step 4 — Make `/admin` able to sign in

This is the one genuinely fiddly step, and it is a one-time job.

The admin is [Sveltia CMS](https://github.com/sveltia/sveltia-cms). To save, it
signs in to GitHub on your behalf, and that handshake needs an OAuth client
somewhere. Netlify ships one; Cloudflare doesn't, so you deploy the official
tiny worker that does exactly this and nothing else.

### The symptom, if you get here before reading this

`/admin` loads, you click **Sign In with GitHub**, a popup opens at
`api.netlify.com/auth?provider=github&site_id=…` and says **Not Found**. The
page then reports **"Authentication aborted. Please try again."**

Nothing is broken. `api.netlify.com` is simply Sveltia's *default* sign-in
service, it only serves sites hosted on Netlify, and this site is on Cloudflare
— so Netlify has never heard of it. The fix is to point the CMS at a sign-in
service of your own, which is what the rest of step 4 does.

**4a. Deploy the auth worker**

[github.com/sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
— click **Deploy to Cloudflare**. It lands at

```
https://sveltia-cms-auth.<your-subdomain>.workers.dev
```

Your subdomain is the same one the site is on: `ianlieberman07`. **Note the
address it actually gives you** — if it differs, it has to match 4b and 4c.

**4b. Register a GitHub OAuth App**

[github.com/settings/applications/new](https://github.com/settings/applications/new)

| Field | Value |
|---|---|
| Application name | `SAN Lab website admin` |
| Homepage URL | `https://eisenbergerlab.ianlieberman07.workers.dev` |
| Authorization callback URL | the worker address from 4a **+ `/callback`** |

The callback must be exact, including `/callback` on the end. Then **Generate a
new client secret** — it is shown once, so copy it now.

**4c. Give the worker the credentials**

Cloudflare dashboard → the `sveltia-cms-auth` worker → **Settings** →
**Variables and Secrets**:

| Name | Value |
|---|---|
| `GITHUB_CLIENT_ID` | from 4b |
| `GITHUB_CLIENT_SECRET` | from 4b — mark it **encrypted** |
| `ALLOWED_DOMAINS` | `eisenbergerlab.ianlieberman07.workers.dev` |

`ALLOWED_DOMAINS` is what stops anyone else pointing their own CMS at your
worker. Add the real domain here too, comma-separated, once it exists.

**4d. Point the CMS at it**

Already done — [`public/admin/config.yml`](../public/admin/config.yml) carries:

```yaml
backend:
  name: github
  repo: ianlieberman07/EisenbergerLab
  branch: main
  base_url: https://sveltia-cms-auth.ianlieberman07.workers.dev
```

If the worker in 4a got a different address, correct that one line. Then
`git push`, wait for the rebuild, and `/admin` can sign in.

> **Test it by making a real edit** — change a word somewhere harmless, save, and
> watch the commit land in GitHub and the site rebuild. If that round trip works,
> the CMS works, and Dr. Eisenberger's whole workflow works.

---

## Step 5 — Gate the admin

Right now anyone who finds `/admin` can load it. They can't *save* anything —
that needs write access to the repository — but a login page open to the world
is the wrong shape for a university site, and it isn't the assign/revoke control
that was asked for.

[`ADMIN-ACCESS.md`](ADMIN-ACCESS.md) has the full reasoning and the exact
Cloudflare Access policy. In short: Zero Trust → Access → Applications →
self-hosted, path `admin`, allow *emails ending in `@ucla.edu`* **and** *email in
{her address, yours}*, login method **One-time PIN**.

She then gets a code in her UCLA inbox and never sees a password.

> **This step is blocked until there is a real domain.** Cloudflare Access can
> only protect a hostname in a zone you control, and `workers.dev` is
> Cloudflare's zone, not yours — there is no way to put an Access policy in
> front of `eisenbergerlab.ianlieberman07.workers.dev`.
>
> So the order is: step 6 first, then step 5. Until then `/admin` is reachable
> by anyone who guesses the URL. They still cannot **save** anything — that
> needs write access to the GitHub repository — so this is untidy rather than
> dangerous. But do not hand the address to Dr. Eisenberger and call it done
> until the gate is up.
>
> If the UCLA domain drags on, any cheap domain parked on Cloudflare works as a
> temporary home and unblocks both this and step 4.

---

## Cutover checklist — the day UCLA points the domain

Strict order. Doing these out of sequence briefly points the site at the old
WordPress install, or makes the preview crawlable.

- [ ] **1.** UCLA removes the A record for `sanlab.psych.ucla.edu`
      (`164.67.110.64`, the old site) and adds:
      `CNAME  sanlab.psych.ucla.edu  ->  eisenbergerlab.pages.dev`
- [ ] **2.** Wait for DNS to propagate and Cloudflare to issue the certificate.
      Minutes to a few hours. The custom domain in the Pages project flips from
      pending to active on its own.
- [ ] **3.** Check `https://sanlab.psych.ucla.edu` is serving the new site over
      a valid certificate. **Do not skip to 4 before this passes.**
- [ ] **4.** Pages project -> Settings -> Variables -> set
      `SITE_URL` = `https://sanlab.psych.ucla.edu`, then redeploy.
- [ ] **5.** Confirm: no `noindex` in the page source, `robots.txt` back to
      `Allow: /`, canonical and sitemap on the real domain.
- [ ] **6.** Sign in to `/admin` once on the new hostname to confirm the CMS
      still authenticates. (`ALLOWED_DOMAINS` on the auth worker already covers
      it — done ahead of time so there is no window where it is broken.)

**Step 4 is the one that gets missed.** Between 3 and 4 the site is live on the
real domain and still asking search engines to ignore it. Nothing looks wrong,
nothing errors, and the site simply never appears in Google. If only one line of
this document survives, make it that one.

## Step 6 — The real domain

The site currently lives at `….pages.dev`. Moving it to
`sanlab.psych.ucla.edu` is **not** yours to decide — it is UCLA Psychology IT's,
and it is [`QUESTIONS.md`](QUESTIONS.md) #2, still unanswered.

Ask them one question: **will you point `sanlab.psych.ucla.edu` at outside
hosting via a CNAME, or does the site have to live on UCLA infrastructure?**

- **CNAME is fine** → Cloudflare dashboard → the Worker → **Domains & Routes** → add
  the hostname, give IT the CNAME target they need to create. Then **add**
  `SITE_URL` = `https://sanlab.psych.ucla.edu` (step 2), redeploy, and the
  canonical URLs, the sitemap and the noindex all correct themselves.
- **It must live on UCLA servers** → the build output in `dist/` is plain static
  files and will sit on any web server. But the CMS stops working, because it
  needs the git-backed deploy loop. That would be a different conversation, and
  worth having *before* Dr. Eisenberger gets used to the admin.

Until that is settled, the `.pages.dev` address is a perfectly good place for
her to review the site.

---

## After launch: how changes get made

**Her**, for anything on the site — text, photographs, people, papers:
`/admin`, edit, **Save**. Live in about a minute. That is the entire process,
and [`EDITING-GUIDE.md`](EDITING-GUIDE.md) is written for her.

**You**, for anything structural:

```bash
git pull          # her saves are commits — pull before you start
# ...make changes...
npm run dev       # check locally
npm run build     # confirm it builds before CI has to
git add -A && git commit -m "..." && git push
```

The push deploys. There is no separate deploy step and no "publish" button.

`npm run build` here is a **check, not a deploy.** It catches a broken build in
five seconds instead of after a push. The `dist/` folder it produces is
gitignored and never leaves your machine — Cloudflare builds its own copy from
the commit.

`git pull` first genuinely matters: if she has edited anything since you last
pulled, your local `main` is behind and the push will be rejected.

### Do not run `npx wrangler deploy` by hand

It is listed as the deploy command in the dashboard because that is what
**Cloudflare's** build machine runs after it checks out your commit. Running it
yourself is a different thing and a bad idea:

- It uploads whatever is in your local `dist/` — which may be stale, or built
  from uncommitted work — and it wins, silently. The live site then no longer
  matches `main`, and nothing in the dashboard says so.
- It skips the commit entirely, so there is no record of what was deployed and
  nothing to revert to.
- `wrangler` is not even a dependency here and there is no `wrangler.toml` in
  the repo; the configuration lives in Cloudflare. Running it locally would
  need setting all of that up a second time, in a second place, to do a job
  that already happens automatically.

**`git push` is the deploy.** That is the entire mechanism, and it is the same
one Dr. Eisenberger uses when she clicks Save.

### Undoing something

Every change — hers or yours — is a commit. In the GitHub web interface, open
the commit and hit **Revert**, or:

```bash
git revert <commit>
git push
```

The site rebuilds to the previous state in about a minute. This is the real
answer to "what if she breaks something": nothing is unrecoverable, ever.

### Rolling back a whole deploy

Cloudflare keeps every build. Dashboard → the Worker → **Deployments** →
find a good one → **Rollback**. Instant, and it doesn't touch the repository —
useful if a build is broken and you want the site right *now* while you work out
why.
