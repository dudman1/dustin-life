# STATUS — dustin-life (dustinlife.com)

Audit date: 2026-10-08 · Audited ref: `main` @ `35b8cff` · Read-only audit. No code was changed.

---

## 1. What this is

- Static marketing and lead-gen site for Dustin McCormick, an independent life insurance agent (IUL and Final Expense), served at `https://dustinlife.com`.
- Next.js 16.2.3 App Router with `output: "export"`. The build writes static files to `out/`. One Cloudflare Pages Function (`functions/api/lead.ts`) handles lead intake: Convex is written first, then GoHighLevel and Telegram as best-effort.
- `/iul-compass/` is a separate, hand-built static HTML calculator (`public/iul-compass/index.html`) that posts to the same `/api/lead`.

**Production state (as far as the repo shows):**

| Item | Value |
|---|---|
| Production branch | `main`. Per the README: "human review of a PR against `main`" |
| Last change on `main` | `35b8cff`, merge of [dudman1/dustin-life#10](https://github.com/dudman1/dustin-life/pull/10), 2026-10-01 UTC (compliance: contact email + Final Expense copy) |
| Last deploy-related commit | None explicit. No deploy config, wrangler file or workflow is in the repo. The last change to deploy docs (README) was `5fa71c6` (2026-09-01). The last change to the lead function was `9fb8f23` (2026-08-28) |
| Deploy docs | README sections "Production build (static export)" and "Cloudflare Pages env vars". These cover build settings only, not how a deploy is triggered |
| Rollback marker | Git tag `pre-dustinlife-v2-2026-04-14` (`1b765eb`) |
| Build | `npm run build` succeeds locally and generates 9 static routes (verified 2026-10-08) |

## 2. Infrastructure map

| Concern | Where | Source / notes |
|---|---|---|
| Hosting | Cloudflare Pages (static `out/`) | README. CF project name and account are not in the repo |
| Serverless API | Cloudflare Pages Function `POST /api/lead` | `functions/api/lead.ts` |
| Database / system of record | Convex deployment `rapid-hummingbird-980`, mutation `insuranceLeads:create` | URL is hardcoded in `functions/api/lead.ts:70`. The Convex schema/functions are **not** in this repo |
| CRM | GoHighLevel inbound webhook | `GHL_WEBHOOK_URL` env |
| Alerts | Telegram Bot API (new-lead and lead-storage-failed messages, which include name, phone and email) | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` env |
| Analytics / ads | Meta Pixel ID `25947417544946778` (public ID) | `app/layout.tsx`. `Lead` and `InitiateCheckout` events fire in `app/final-expense/FinalExpenseClient.tsx` |
| Auth | None. The site has no login and `/api/lead` is public/unauthenticated | — |
| Domain | `dustinlife.com` | `lib/seo.ts`, `public/sitemap.xml`, `public/robots.txt`. The DNS provider is not in the repo |
| Contact | `dustin@dustinlife.com`, phone 248-970-9094 | `lib/contact.ts`, `video-src/SCRIPT.md` |
| CI | **None.** No `.github/` directory | — |
| Secrets | Cloudflare Pages → Settings → Environment variables: `GHL_WEBHOOK_URL`, `CONVEX_ADMIN_KEY`, `CONVEX_TIMEOUT_MS` (opt), `TELEGRAM_BOT_TOKEN` (opt), `TELEGRAM_CHAT_ID` (opt) | README. No `.env.example`. `.env*` is gitignored |
| Video build host | "Mac mini" (`~/dustin-life`), using ffmpeg, Pillow and Kokoro-82M TTS | `video-src/README.md` |
| Agent/dev host | Mac Mini at `/Users/openclaw/dustin-life` (Homebrew and nvm) | README, `lead.iul-compass.test.mjs:3` |
| Social | Facebook page `profile.php?id=61577772774808`, LinkedIn `w-dustin-mccormick` | `public/iul-compass/index.html` and SiteChrome |
| Related repo | `dudman1/dustinlife-v2` (branch `variant-a`, "premium redesign prototype") | Not audited (out of scope) |

## 3. Standard procedures

| Procedure | Steps | Status |
|---|---|---|
| Run locally | `npm install` → `npm run dev` → http://localhost:3000 | Documented (README). The `/api/lead` function does **not** run under `next dev`; form submits will fail locally (unverified, inferred from the architecture) |
| Build | `npm run build` → `out/` | Documented. Verified passing on 2026-10-08 |
| Lint | `npm run lint` | Documented. **Currently fails** with 6 errors (see Open Items) |
| Typecheck | `npx tsc --noEmit` | No npm script. Verified passing (exit 0) |
| Tests | `node --experimental-strip-types lead.iul-compass.test.mjs` | Not in npm scripts. As committed it **only runs on the Mac Mini**: it imports `/Users/openclaw/dustin-life/functions/api/lead.ts`. With that path rewritten to the local checkout, all 22 tests pass (Node 22.22.0). It mocks `fetch` and needs no secrets |
| Deploy | Merge a reviewed PR to `main`. Cloudflare Pages builds with `npm run build` and output dir `out/` | Build settings are documented. **The trigger (Git-connected auto-deploy on `main`) is unverified** |
| Rollback | Cloudflare Pages dashboard → Deployments → roll back to the previous deployment, or revert the commit on `main` | **Unverified.** Not documented in the repo |
| Regenerate IUL video | `python3 video-src/render_iul_intro.py` on the Mac mini | Documented (`video-src/README.md`) |
| Env changes | Cloudflare Pages → Settings → Environment variables | Documented (README) |

## 4. Standing rules (quoted)

From `AGENTS.md` (included by `CLAUDE.md` via `@AGENTS.md`):

> This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

From `README.md`:

> **Out of scope for polish PRs:** IUL Compass under `public/iul-compass/` and Compass-related lead paths are maintained separately. Do not mix Compass assumption/API work into general site polish.

> Configure these in the Cloudflare Pages project **Settings → Environment variables** (names only — never commit values)

> Do **not** change Convex/GHL project config from application polish PRs.

> Untracked `*.bak*`, `REVIEW-REPORT*.md`, and `drafts/` are local scratch — do not commit them

> The static IUL Compass page at `public/iul-compass/index.html` includes a **hand-maintained duplicate** of the site chrome from `app/components/SiteChrome.tsx` (and related styles in `app/dustinlife-v2.module.css`). When nav items, footer links, or chrome behavior change, update **both** the React component and the Compass HTML.

> Permanent production changes only after human review of a PR against `main`. Do not merge, push to `main`, or deploy from automated polish agents unless explicitly asked.

From `video-src/README.md`:

> Fallback only: macOS Premium/Enhanced Ava/Zoe/Evan via `say`. Do **not** use Samantha/compact voices.

> Gold accent only (`#C9A96E` / `#8F6D34`)
> No stock footage / clip-art / corporate explainer kit
> Bottom ~15% of frame kept clear for captions

From `video-src/SCRIPT.md`:

> **Status:** Draft for compliance review BEFORE live use

> **Compliance:** No guaranteed returns; no tax-free retirement hype; no beats-market / better-than-401k; no carrier names or carrier-specific numbers; every on-screen number labeled **hypothetical**

From `review-notes/competitive-ui-audit-2026-09-01.md`:

> **Do not treat the following as net-new discoveries.** Frame work as reinforce / extend.

> → Do not re-propose these. Sticky CTA / trust strip should **reuse** shipped gold token, not invent orange urgency (PG color is reference only).

> optional review rating *only if authentic*. Do not invent counts.

## 5. Changelog (last 60 days: 2026-08-09 → 2026-10-08)

**Merged PRs**
- [#10](https://github.com/dudman1/dustin-life/pull/10) 2026-10-01: Compliance: replace carrier-named email; soften Final Expense copy
- [#9](https://github.com/dudman1/dustin-life/pull/9) 2026-09-25: Polish punch list: Compass mobile layout, gold chart line, self-hosted Playfair, lint
- [#7](https://github.com/dudman1/dustin-life/pull/7) 2026-09-03: Compass: contain wide tables (no page H-scroll at 390px)
- [#6](https://github.com/dudman1/dustin-life/pull/6) 2026-09-03: FE chrome-only: SiteChrome wrap + sticky CTA dedupe
- [#2](https://github.com/dudman1/dustin-life/pull/2) 2026-09-02: docs: competitive UI audit of DTC life insurers
- [#1](https://github.com/dudman1/dustin-life/pull/1) 2026-09-02: Polish pass: shared chrome, legal pages, FAQ, sitemap, docs
- [#3](https://github.com/dudman1/dustin-life/pull/3), [#4](https://github.com/dudman1/dustin-life/pull/4), [#5](https://github.com/dudman1/dustin-life/pull/5) were closed unmerged on GitHub, but their content landed on `main` via local merge commits on 2026-09-02 (`6957f32`, `2e22a80`, `b33af91`)

**Commits on `main` (non-merge)**
- `afd3369` 2026-09-25: Replace carrier-named contact email; soften Final Expense copy
- `ae599d0` 2026-09-25: fix(lint): escape apostrophes in Final Expense page copy
- `329ddfa` 2026-09-25: perf(iul-compass): self-host Playfair Display
- `b4a6a73` 2026-09-25: style(iul-compass): recolor death-benefit chart line to site gold
- `6de4ed4` 2026-09-25: fix(iul-compass): widen calculator blocks on phones
- `c406f45` 2026-09-25: fix(iul-compass): sticky Yr column on mobile schedule table
- `390a6b9` 2026-09-03: fix(iul-compass): contain wide tables to stop page horizontal scroll at 390px
- `8c995b7` 2026-09-02: Fix FE sticky CTA to quote form instead of home assessment
- `eb55867` 2026-09-02: Align Final Expense page chrome with shared SiteChrome
- `9f48c0c` 2026-09-02: Fix Compass nav pill collapse from truncated DM logo SVG
- `90a6118` 2026-09-02: Port SiteChrome into IUL Compass static HTML
- `c182f63` 2026-09-01: Fix IUL intro phone TTS rhythm for Kokoro
- `780f85e` 2026-09-01: Revise IUL intro: Kokoro voice, captions, beat-3 charges note
- `10c7900` 2026-09-01: Add IUL whiteboard intro video and fix Quick Intro scroll/sizing
- `ad7e3ad` 2026-09-01: Qualify Final Expense Instant and Same-day claim strings
- `4bee75c` 2026-09-01: Expand FAQ objections and matching JSON-LD
- `40ac605` 2026-09-01: Sticky mobile Assessment and Call CTA in SiteChrome
- `957aa7b` 2026-09-01: Homepage hero hygiene, human trust strip, honest process
- `61c5ce8` 2026-09-01: docs: competitive UI audit of DTC life insurers
- `297beea` 2026-09-01: Remove unused LinkedIn banner
- `5fa71c6` 2026-09-01: Docs, sitemap, and image weight polish
- `e2cb5e1` 2026-09-01: Add shared SiteChrome with mobile nav; unify legal/FAQ/IUL chrome
- `48c2414` 2026-09-01: Fix inaccurate failure message: no local draft persistence
- `f605081` 2026-09-01: Remove all localStorage draft persistence from IUL Compass
- `ecc5638` 2026-09-01: Clamp coverage entries below floor
- `d606359` 2026-09-01: Compass: remove income, add premium toggle + coverage override
- `fb0af2a` 2026-09-01: Stop persisting gender/tobacco in local draft
- `b4f1873` 2026-09-01: Compass: gender and tobacco inputs wired to COI multipliers
- `77369a7` 2026-09-01: Compass: sticky "Your Profile" sidebar
- `d113d6b` 2026-09-01: Compass: collapse sidebar to content height
- `34ab4df` 2026-09-01: Compass: move assumptions panel into content column
- `aae3cd8` 2026-09-01: Restore correct 6-size favicon.ico
- `5aaa4eb` 2026-09-01: Favicon override, logo +20%, a11y labels, Compass inline SVG
- `7e693e9` 2026-09-01: Replace DM monogram with dm-logo.svg; brand-gold CSS var
- `464db0d` 2026-08-31: a11y: form markup, gold contrast, scroll-padding, focus indicators
- `aa56b14` 2026-08-28: Use plain `<a>` for /iul-compass/ links
- `fc71010` 2026-08-28: Reskin IUL Compass + site integration
- `9fb8f23` 2026-08-28: Harden /api/lead: Convex-first, GHL + Telegram best-effort
- `768439b` 2026-08-28: Wire IUL Compass calculator to /api/lead relay

## 6. Open items (ranked)

1. **`/api/lead` is an unguarded public write endpoint.**
   Why: It has no rate limit, bot check (Turnstile), Origin check or field-length caps. Every POST writes to Convex with an admin key and fans out to GHL and Telegram, so spam can flood the system of record, the CRM and the alert channel. Possible mitigation outside the repo (CF WAF) is unknown.
   Owner: Claude Code · Size: M

2. **The Convex *admin* key is used from a public edge function** (`functions/api/lead.ts:482`).
   Why: The key grants full deployment privileges, but the function only needs one insert. A leak or misuse means total DB exposure. A scoped HTTP action or a public mutation with a shared secret would limit the blast radius.
   Owner: Claude Code · Size: M

3. **The Compass disclaimer contradicts the code.** `public/iul-compass/index.html:551` says the tool "stores data only in your own browser (localStorage)", but the lead form POSTs name, email and phone to `/api/lead` → Convex, GHL and Telegram.
   Why: This is an inaccurate privacy statement on an insurance lead form, a compliance and consumer-protection risk.
   Owner: Claude Code · Size: S

4. **The privacy policy does not name lead processors.** `app/privacy/page.tsx` says data is not shared "with any third party for marketing" but does not mention Convex, GoHighLevel or Telegram. Lead PII (name, phone, email) is posted into a Telegram chat.
   Why: Possible disclosure gap, and PII sits in a third-party chat app.
   Owner: Claude Code · Size: S–M (needs a legal decision)

5. **`npm audit --omit=dev` reports 26 vulnerabilities (2 critical, 17 high, 5 moderate, 2 low).** These include `next@16.2.3` (direct, critical; fixed in 16.4.0) and `shadcn@4.2.0`, a CLI listed under `dependencies` that pulls in express, hono, `@modelcontextprotocol/sdk`, proxy-addr and qs.
   Why: Exploitability is low for a static export, but it is noise that hides real issues. Moving `shadcn` to devDependencies removes most findings. The Next bump needs a build and lead-flow check.
   Owner: Claude Code · Size: M

6. **There is no CI.** No `.github/workflows`: lint, typecheck, tests and build are not gated on PRs.
   Why: Regressions (such as the current lint failure) reach `main` unnoticed, and the README's "human review" policy has no automated backstop.
   Owner: Hermes · Size: M

7. **Lint fails on `main`: 6 errors and 6 warnings.**
   - Errors are `react/no-unescaped-entities` in `app/final-expense/FinalExpenseClient.tsx` lines 457, 458 (x2), 492, 550 and 575. These are inside the lead form and were deliberately left by `ae599d0`.
   - Warnings: 5× `<img>`, and a missing `alt` on the Meta Pixel `<noscript>` img in `app/layout.tsx:58`.

   Why: `npm run lint` is red, so any future CI gate fails immediately. The fix is rendering-neutral but touches lead-form JSX.
   Owner: Hermes (needs an explicit OK because the lead form is scoped) · Size: S

8. **The test suite is not runnable as committed.** `lead.iul-compass.test.mjs:3` imports `/Users/openclaw/dustin-life/...`, the header comment says to run `/tmp/iul-compass-test.mjs`, and there is no `npm test` script. With the path fixed: 22/22 pass.
   Why: The only tests (covering the revenue-critical lead path) silently don't run anywhere but one machine.
   Owner: Hermes · Size: S

9. **Open PR [dudman1/dustin-life#8](https://github.com/dudman1/dustin-life/pull/8)** (`dudbot/compass-sched-mobile-cols`, 1 commit `25a43a8`): hides the Credit % and Fees columns on `#sched` at ≤760px. It is now **in conflict** with `main` after #9's sticky-Yr-column change, and the change is not on `main`.
   Why: A stale open PR. Either resolve the conflict against #9's mobile table changes, or close it as superseded.
   Owner: Hermes · Size: S

10. **The IUL intro video is live but its script is marked draft.** `video-src/SCRIPT.md` says "Draft for compliance review BEFORE live use", yet `public/video/iul-intro.mp4` ships on `/indexed-universal-life`.
    Why: Either compliance sign-off is undocumented or unreviewed IUL copy is in production.
    Owner: Hermes (record sign-off) · Size: S

11. **The Compass ↔ API payload has drifted.**
    - Compass sends `gender`, `tobacco` and `faceOverride`, which the server silently drops.
    - The server still builds `Income: not provided` for the removed income field (`functions/api/lead.ts:331`).
    - The dead localStorage "outbox" branch and the comment "stubbed transport — zero network by design" remain (`index.html:853–871`).

    Why: Health/demographic fields are transmitted without being used, and misleading comments around a data path invite mistakes.
    Owner: Claude Code · Size: S

12. **Direct merges to `main` bypassed PR review.** On 2026-08-31 to 09-02, `main` received local merge commits (`4b0e46a`, `72448c9`, `b552015`, `cfaf2f7`, `6957f32`, `2e22a80`, `b33af91`, `0956f7c`). PRs #3, #4 and #5 show "closed, unmerged" while their content is live.
    Why: This contradicts the README branch policy, suggests no branch protection, and makes the PR history an unreliable audit trail.
    Owner: Hermes · Size: S

13. **The Convex deployment URL is hardcoded** (`functions/api/lead.ts:70`, duplicated in the test).
    Why: Preview deploys write to the production DB, and you can't point a preview or staging environment elsewhere without a code change.
    Owner: Claude Code · Size: S

14. **Thirteen stale remote branches**, all fully merged (0 ahead): `dudbot/*` (except compass-sched-mobile-cols), `feature/dm-logo-refresh`, `fix/iul-compass-assumptions-overflow`, `fix/remove-localstorage-draft` and `forge/dustinlife-{age,seo,v2}-preview`.
    Why: Clutter, and agents may mistake them for work in progress.
    Owner: Hermes · Size: S

15. **No `.env.example` and no Node version pin** (`engines` or `.nvmrc`). Env var names live only in the README.
    Why: New environments (including CF Pages builds) depend on undocumented defaults.
    Owner: Hermes · Size: S

16. **Stale "Last updated … Updated by: Forge / Claude Code / Grok Bot" footers** in 8 source files. Examples: `functions/api/lead.ts:512` says 2026-04-16, but the file changed 2026-08-28; also `app/layout.tsx` and `lib/seo.ts`.
    Why: Misleading provenance metadata.
    Owner: Hermes · Size: S

17. **Site chrome is duplicated by hand in the Compass HTML** (acknowledged in the README).
    Why: Nav, footer and phone changes must be made twice, and drift is likely.
    Owner: Hermes · Size: M

18. **The review notes reference artifacts not in the repo.** `review-notes/competitive-ui-audit-2026-09-01.md` cites "merge-review" drafts "in `review/`" (R7), and no such directory exists.
    Why: The doc points to content nobody can find.
    Owner: Hermes · Size: S

**Checked and clean:** typecheck passes. `next build` passes. A pattern scan of full git history found no committed secrets or `.env` files (only public IDs: Meta Pixel, Convex deployment name, Facebook profile). There are no open issues.

## 7. Unknowns

1. Is the Cloudflare Pages project Git-connected with production branch `main` and auto-deploy on push, and what is the project/account name?
2. How do you roll back production today: the CF Pages dashboard, a git revert, or something else?
3. Which provider hosts DNS for `dustinlife.com`, and who holds the login?
4. Which repo holds the Convex functions/schema for `insuranceLeads:create` on `rapid-hummingbird-980`?
5. Is any Cloudflare WAF, rate-limit or Turnstile rule protecting `/api/lead` outside this repo?
6. Is branch protection (required PR review) enabled on `main`?
7. Did the IUL video script and the Final Expense/Compass copy receive compliance sign-off, and where is it recorded?
8. Is `dudman1/dustinlife-v2` (`variant-a`) intended to replace this site, and if so, does this repo freeze?
9. Which Node version does the CF Pages build use?
10. Who are "Forge", "dudbot", "Grok Bot" and "Hermes", and which of them are still allowed to push to this repo?

---
*Generated by Claude Code audit, 2026-10-08.*
