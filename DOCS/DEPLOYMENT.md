# Deploying the site

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
                    Cloudflare Pages builds
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

You do **not** need a domain yet. Cloudflare gives you a working
`something.pages.dev` address immediately, which is the right thing to send
Dr. Eisenberger for sign-off before anyone talks to UCLA IT.

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

Everything so far is committed locally but has never left this machine. Check:

```bash
git status -sb
```

If it says `ahead N`, those commits only exist here. Push them:

```bash
git push -u origin main
```

That is the only terminal command in this document that changes anything
outside your computer.

> **Note:** this repository is public. Nothing in it is secret — no keys, no
> tokens, no `.env` — but it does contain the lab's photographs and copy. That
> is intended, and it is what lets the CMS work without a server. If it ever
> needs to be private, Cloudflare Pages supports private repos on the free tier
> too; nothing below changes.

---

## Step 2 — Connect Cloudflare Pages to the repo

1. Go to **dash.cloudflare.com** → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git**.
2. Authorise GitHub and pick **EisenbergerLab**.
3. Set the build configuration:

   | Field | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | **Astro** |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. Add one **environment variable** (Settings → Environment variables →
   Production):

   | Name | Value |
   |---|---|
   | `SITE_URL` | the `https://….pages.dev` address Cloudflare gives you |

   This is what stops the live preview from advertising canonical URLs and a
   sitemap for `sanlab.psych.ucla.edu`, which does not point here yet.
   **Delete this variable once the real domain is attached** (step 6) so `site`
   falls back to the real address.

5. **Save and Deploy.**

First build takes two or three minutes, mostly generating the image sizes.
Later builds are faster — Cloudflare caches `node_modules`.

When it finishes you have a working site. Send that URL to Dr. Eisenberger.

### If the build fails

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

**4a. Register a GitHub OAuth App**

GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth
App**.

| Field | Value |
|---|---|
| Application name | `SAN Lab website admin` |
| Homepage URL | your site address |
| Authorization callback URL | `https://sanlab-cms-auth.<your-subdomain>.workers.dev/callback` |

You won't know the worker address until 4b, so put a placeholder in and come
back and correct it. Generate a **client secret** and keep both the client ID
and the secret to hand — the secret is shown once.

**4b. Deploy the auth worker**

Follow the README at
[github.com/sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth).
It is a deploy-to-Cloudflare button plus two secrets:

| Secret | Value |
|---|---|
| `GITHUB_CLIENT_ID` | from 4a |
| `GITHUB_CLIENT_SECRET` | from 4a |
| `ALLOWED_DOMAINS` | your site's hostname |

Then go back and fix the callback URL in 4a to the worker's real address.

**4c. Point the CMS at it**

In [`public/admin/config.yml`](../public/admin/config.yml), uncomment `base_url`
under `backend:` and set it to the worker's address:

```yaml
backend:
  name: github
  repo: ianlieberman07/EisenbergerLab
  branch: main
  base_url: https://sanlab-cms-auth.<your-subdomain>.workers.dev
```

Commit and push. Cloudflare rebuilds, and `/admin` can now sign in.

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

---

## Step 6 — The real domain

The site currently lives at `….pages.dev`. Moving it to
`sanlab.psych.ucla.edu` is **not** yours to decide — it is UCLA Psychology IT's,
and it is [`QUESTIONS.md`](QUESTIONS.md) #2, still unanswered.

Ask them one question: **will you point `sanlab.psych.ucla.edu` at outside
hosting via a CNAME, or does the site have to live on UCLA infrastructure?**

- **CNAME is fine** → Cloudflare Pages → your project → **Custom domains** → add
  the hostname, give IT the CNAME target they need to create. Then delete the
  `SITE_URL` variable from step 2, redeploy, and every canonical URL and the
  sitemap correct themselves.
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
npm run build     # confirm it builds
git add -A && git commit -m "..." && git push
```

The push deploys. There is no separate deploy step and no "publish" button.

`git pull` first genuinely matters: if she has edited anything since you last
pulled, your local `main` is behind, and pushing will be rejected.

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

Cloudflare Pages keeps every build. Dashboard → the project → **Deployments** →
find a good one → **Rollback**. Instant, and it doesn't touch the repository —
useful if a build is broken and you want the site right *now* while you work out
why.
