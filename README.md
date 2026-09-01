# dustinlife.com

Static marketing site for **Dustin McCormick**, independent life insurance agent (licensed nationwide). Built with Next.js App Router as a **static export**, deployed on **Cloudflare Pages**, with a Cloudflare Pages Function for lead intake.

> **Out of scope for polish PRs:** IUL Compass under `public/iul-compass/` and Compass-related lead paths are maintained separately. Do not mix Compass assumption/API work into general site polish.

## Stack

- **Next.js** (`output: "export"`) → static HTML/CSS/JS in `out/`
- **Cloudflare Pages** hosts `out/` (and copies static assets from `public/`)
- **Cloudflare Pages Function** at `functions/api/lead.ts` handles form POSTs to `/api/lead`
- Styling: CSS module `app/dustinlife-v2.module.css` + Tailwind utilities where used

## Local development

Ensure Node is on PATH (Homebrew and/or nvm), then:

1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000

Suggested PATH prefix on the Mac Mini: /opt/homebrew/bin and the active nvm node bin directory.

## Production build (static export)

Run `npm run build`. This writes the static site to `out/`. Cloudflare Pages should use build command `npm run build` and output directory `out/`.

## Cloudflare Pages env vars (lead function)

Configure these in the Cloudflare Pages project **Settings → Environment variables** (names only — never commit values):

- `GHL_WEBHOOK_URL` (required) – GoHighLevel webhook for lead delivery
- `CONVEX_ADMIN_KEY` (required) – Convex admin/mutation auth for lead persistence
- `CONVEX_TIMEOUT_MS` (optional) – Convex request timeout override (ms)
- `TELEGRAM_BOT_TOKEN` (optional) – Telegram alert bot token
- `TELEGRAM_CHAT_ID` (optional) – Telegram chat/channel id

Do **not** change Convex/GHL project config from application polish PRs.

## Key routes

- `/` – Home + free assessment form
- `/final-expense` – Final Expense landing + quote flow
- `/indexed-universal-life` – IUL explainer
- `/iul-compass/` – Static Compass tool (separate ownership)
- `/faq` – FAQ
- `/privacy`, `/terms`, `/disclosures` – Legal

## Repo hygiene

- Untracked `*.bak*`, `REVIEW-REPORT*.md`, and `drafts/` are local scratch — do not commit them
- Stock Next/Vercel placeholder SVGs are not used by the site

## Scripts

- `npm run dev` – local Next dev server
- `npm run build` – static export to `out/`
- `npm run lint` – ESLint

## Branch / deploy policy

Permanent production changes only after human review of a PR against `main`. Do not merge, push to `main`, or deploy from automated polish agents unless explicitly asked.
