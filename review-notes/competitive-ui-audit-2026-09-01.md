# Competitive UI Audit — DTC Life Insurance (2026-09-01)

**Scope:** Docs only. Research for dustinlife.com conversion UX. No app/, public/, or functions/ changes in this PR.  
**Branch:** `dudbot/ui-research`  
**Live check date:** 2026-09-01 (ET)  
**Sites reviewed:** Ethos, Ladder, Bestow, Fabric, Haven Life (historical), Policygenius, SelectQuote + dustinlife.com baseline

---

## 1. Executive summary

Dustinlife.com sits in a different game than Ethos/Ladder (instant-bind DTC carriers) and SelectQuote (hard-sell phone agency). The closest brand-fit peers are **Policygenius** (human independent-agent marketplace + anti-chatbot) and, historically, **Haven Life** (calm/simple tone — brand worked; unit economics of pure DTC did not). Fabric shows strong family-OS bundling and soft-entry quiz patterns; Ethos dominates trust density and perk-led conversion.

**What competitors do that dustinlife should steal (calmly):**
1. **Human-first trust strip under hero** (Policygenius: “No chatbots / Always real people” + ratings) — reinforce phone + independent-agent story already in topbar.
2. **Sticky mobile primary CTA** (Policygenius orange “Get a Quote” in header) — polish-pass hamburger alone is incomplete without a persistent assessment/call action.
3. **Expanded FAQ accordion with buyer objections** (Ladder/Ethos/SelectQuote) — extend polish-pass FAQ beyond thin four Qs.
4. **3–4 step “how it works”** with time honesty (Fabric card estimates 5–10 mins; Ethos 10-minute claim is too DTC for us — use “short conversation” framing).
5. **Good-fit / bad-fit + funeral-cost framing** already flagged in merge-review — still the highest-credibility IUL/FE gap vs every DTC site that oversells.

**What to refuse:** live applicant counters (Ladder), #1 / Save 50% / $1-day hard claims (SelectQuote), celebrity paid spokes without disclosure culture fit (Ethos), fake same-day/price/approval claims, chatbot theater.

**Strategic lesson (Haven):** calm DTC brand equity ≠ durable standalone economics. Independent-agent + education (assessment → call → Compass) is the durable path; compete on clarity and trust density, not bind-speed arms race.

---

## 2. Method + caveats

| Item | Detail |
|------|--------|
| Method | Live homepage/key-funnel fetches + verified Sep 1 2026 research brief + browser visual pass (Fabric, Policygenius; Haven redirect confirmed) |
| Live date | 2026-09-01 |
| Bestow | **Not a current DTC competitor.** B2B SaaS for carriers (quote-to-admin). DTC book sold to Sammons/Lantern 2024. Takeaways = platform/illustration clarity only; **lower weight**. |
| Haven Life | **Defunct.** Redirects to MassMutual login. Stopped new apps Jan 12 2024; final policies Mar 31 2024. Tear-down = historical via Wayback Dec 2023 + brand lesson only. |
| dustinlife.com fetch | Cloudflare bot challenge blocked automated fetch; baseline from repo source (`HomeClient.tsx`, FAQ) + user brief. |
| Prior notes | Overlaps called out in §7 — recommendations that touch polish-pass / shipped a11y are framed as reinforce/extend, not net-new. |
| Visual shots | Optional box paths under `/workspace/audit_shots/comp2026/` (parent agent browser pass); not attached to this PR. |

**Research dimensions per competitor:** positioning/hero, CTAs, trust/social proof, product breadth, how-it-works, education/FAQ, palette/type, friction reduction, clever tactics, brand-fit notes for dustinlife.

---

## 3. Competitor tear-downs

### 3.1 Ethos — ethoslife.com

| Dimension | Finding |
|-----------|---------|
| **Positioning / hero** | Title: “Affordable Online Life Insurance & Instant Quotes.” Claims: “The #1 no-medical-exam, instant life insurance provider”; “Get covered in 10 minutes”; “Up to $3 million”; “Free will & trust worth $898”; “Your best price from multiple carriers.” |
| **CTAs** | “Check my price” / “Get my rates” / “Get covered”; nav “Start applying.” Price/rate language dominates. |
| **Trust** | Trustpilot **4.9/5, 7,000+ reviews** above fold + carousels; Google reviews cited; celebrity spokes **Ortiz, Amanda Kloots, Boomer Esiason** (paid, disclosed in footers). Review quotes emphasize simplicity and no blood exams (live Jul 2026 copies). |
| **Product breadth** | Term, Whole, Guaranteed issue, Final expense, IUL, Annuities, Wills & Trusts — full stack + estate perk. |
| **How it works** | 3 steps: answer questions → see rate → activate. “We calculate your rate in real time…” |
| **Education / FAQ** | Accordion “If you’re new to life insurance…” — which policy, how much, employer life enough. Comparison table “Traditionally sold” vs Ethos. |
| **Palette / type** | Teal/green `#04463E` `#078476` `#46F1A4`; blue CTAs `#0788F5` `#2364ff`. Clean DTC SaaS feel. |
| **Friction reduction** | No medical exam messaging, instant underwriting, same-day coverage claims, free W&T as conversion perk. |
| **Clever** | Free will/trust ($898) as soft close; celebrity social proof; traditional-vs-Ethos table. |
| **Brand fit for dustinlife** | Trust density + education accordion = **fits-with-care**. Instant-bind / #1 / 10-minute / free-$898 perk language = **NOT recommended** (compliance + calm brand). Celebrity paid spokes = poor fit for independent agent authenticity. |

### 3.2 Ladder — ladderlife.com

| Dimension | Finding |
|-----------|---------|
| **Positioning / hero** | “Protect what matters — as soon as today.” Apply in minutes, few health questions, no medical exams up to $3M. |
| **CTAs** | “Get started.” |
| **Trust** | Live counters: “**$111+ billion coverage provided**” + “**377 people applying right now**.” Awards: Best Flexible Term, Best of No-Exam. |
| **Product breadth** | Term-focused; differentiator is adjustable coverage (“Laddering”). |
| **How it works** | Digital apply; ≤$3M no doctors/needles/paperwork; >$3M may need at-home health check. |
| **Education / FAQ** | Strong accordion: claim-pay durability, **30-day money-back**, digital process, term vs whole, **10× salary** rule of thumb, human support contact. |
| **Palette / type** | Cream/beige `#DEDBD7` `#E9E3DA`, teal `#1B7260` `#249F84`, red accents `#CB3A3A`. Fonts: Work Sans + Lato + Montserrat. |
| **Friction reduction** | No-exam up to $3M; minutes to apply; 30-day free look emphasized. |
| **Clever** | Product-named verb “Laddering” with visual; live applicant count (urgency). |
| **Brand fit** | Laddering narrative / FAQ depth = **fits-with-care** as educational patterns. Live applicant urgency counter = **NOT recommended** for dustinlife calm brand. Red urgency accents likewise. |

### 3.3 Bestow — bestow.com (caveat: not DTC)

| Dimension | Finding |
|-----------|---------|
| **Status** | As of 2026: **B2B SaaS** for carriers (quote-to-admin platform). DTC carrier sold to Sammons/Lantern in 2024. |
| **Weight** | **Lower.** Not a current consumer funnel competitor. |
| **Platform takeaways only** | Agent dashboards, illustration clarity, straight-through processing (STP) — useful if dustinlife ever builds agent-facing tools; **do not** copy consumer conversion patterns from a site that no longer sells DTC. |
| **Brand fit** | N/A for homepage CTA/trust patterns. |

### 3.4 Fabric (by Gerber Life) — meetfabric.com

| Dimension | Finding |
|-----------|---------|
| **Positioning / hero** | “**Plan like a parent.**” Deep purple full-bleed hero; iPhone app mockup in hero; Gerber/Fabric dual top bar. Parent brand + Western & Southern heritage (135 years, 6.5M customers, claim/annuity stats). |
| **CTAs** | Get Started / Apply Now / Start Now / Open Account. Needs quiz ends in **CONTINUE**. **No sticky header CTA on mobile** (hamburger only) — conversion gap vs Policygenius. |
| **Trust** | Parent testimonials Noah / Judi; heritage stats; Trustpilot ~**4.5 / 2,369** in visual capture. |
| **Product breadth** | Bundle: kids investment + term life + **free will** — family OS. |
| **How it works / form entry** | Progressive needs quiz: “**Select all that apply**” with **8 tiles** (spouse, kids &lt;18, mortgage, will, personal LI, work LI, debt, assets) then CONTINUE. Term eligibility entry: **Age / State / Coverage** only ($250K default) — low friction. |
| **Education** | Time estimates on product cards (e.g. 5–10 mins); compounding **slider** for kids account education; term example $20/mo → $300k / 30yr. Price framing: “**Less than a latte**” / “**as little as $1/day***”. |
| **Palette / type** | Deep purple hero system; Gerber warmth via dual brand chrome. |
| **Friction reduction** | Soft needs discovery before hard quote; card time estimates; minimal eligibility fields. |
| **Clever** | Multi-product family OS; quiz as soft entry; time-on-card honesty. |
| **Brand fit** | Needs-discovery tiles + time estimates = **fits** (maps to dual-path FE vs IUL). $1/day / latte price framing = **fits-with-care** only if ever used with real illustrations + disclosures — default **avoid** on marketing claims. Free-will bundle = interesting but out of scope unless partnered. Sticky CTA absence = opportunity for dustinlife to beat Fabric on mobile. |

### 3.5 Haven Life — havenlife.com (historical only)

| Dimension | Finding |
|-----------|---------|
| **Status** | **LIVE: redirects to MassMutual.** Brand wound down (no new apps after Jan 12 2024; final policies Mar 31 2024). Document via Wayback Dec 2023 snapshot only. |
| **Historical hero** | “Life insurance that’s actually simple” / easy, affordable, dependable; phone **+1 (855) 679-1308**. |
| **Trust / tone** | Soft emotional photography; Trustpilot ~4.8; peaceful/simple testimonials. |
| **Lesson** | Calm tone worked brand-wise; **DTC acquisition costs killed** standalone digital brands. Reinforces dustinlife’s independent-agent + education path vs pure instant-bind arms race. |
| **Brand fit** | Tone/photography lesson = **fits**. Do not resurrect defunct brand patterns as if live competitors. |

### 3.6 Policygenius — policygenius.com

| Dimension | Finding |
|-----------|---------|
| **Positioning / hero** | “**A human approach to buying insurance.**” Serif H1 with italic “human” + hand-drawn orange underline on lifestyle photo. Product tiles: Life / Home / Auto / Disability. |
| **CTAs** | “Get a Free Quote.” **Sticky orange Get a Quote on mobile header** — best-in-class mobile persistence among set. Closing line: “**Finished scrolling? Start saving.**” |
| **Trust** | Strip immediately under hero: “**No chatbots / Always real people**”; **4.7/5 5,675+** and **4.6/5 1,200+** reviews; **2,500+** peer-reviewed articles; **30M+** people served; **320k+** life policies; **363 days** human support. Phone in header/footer: **1-855-695-2255**. Video+text testimonial mosaic. |
| **Product breadth** | Multi-line marketplace (life primary for this audit). |
| **How it works** | 4 steps: choose type → about yourself → expert → choose plan. |
| **Form entry** | Life quote entry: Product + Policy Type prefilled + **ZIP only** — extreme low friction before human handoff. |
| **Education / FAQ** | Content SEO moat (2,500+ articles); FAQ on how PG differs, licensing, affiliate independence, pricing. |
| **Palette / type** | Terracotta/orange `#c94f16` `#eb6424` `#ff6e00`; greens `#226f54`; warm neutrals `#f7f5f3`. |
| **Friction reduction** | ZIP-first; expert step baked into process (not bolted on); anti-chatbot as primary trust claim. |
| **Clever** | Marketplace + content SEO; anti-chatbot aligns with human independent agent story; sticky mobile CTA. |
| **Brand fit** | **Highest overall fit** among live competitors. Anti-chatbot + phone expert + 4-step human process = **fits**. Orange urgency CTA chrome = **fits-with-care** (map to gold `#8F6D34` already shipped, not orange). Multi-line tiles less relevant (dustinlife is life-focused FE/IUL). |

### 3.7 SelectQuote — selectquote.com

| Dimension | Finding |
|-----------|---------|
| **Positioning / hero** | “America’s **#1 Term Life Sales Agency**” / “**Save more than 50%**” / “under **$1 a day**” / Get a Quote. |
| **CTAs** | Get a Quote / Get Coverage Today. Phone-first: “**The Most Important Phone Call You Could Make This Year**”; **1-855-653-6700**. |
| **Trust** | Price social proof carousel: **Kate $500K for $15/mo**, **Jay $500K for $18/mo**. Testimonials stress “no pressure” despite sales-agency framing. Multi-line (life/auto/medicare). |
| **How it works** | Shop carriers via agent phone call; “less than an hour”; some no-exam paths. |
| **Education / FAQ** | Why shop SQ, free quotes, carrier list (50+). |
| **Palette / type** | Orange `#F47B20` `#F18549`, cyan `#07aec7`, yellow `#ffbb00`. Fonts: Poppins + Material Symbols. |
| **Friction reduction** | Sample monthly prices as proof; phone vs online-only framing. |
| **Clever** | Concrete sample prices; multi-line; “no pressure” language coexisting with hard claims. |
| **Brand fit** | Phone-first + licensed human = **fits** (already in dustinlife topbar). Sample $15/$18 prices, #1, Save 50%, $1/day = **NOT recommended** (compliance risk + calm brand). Hard-sell adjacent. |

### 3.8 dustinlife.com — current baseline (recommendation specificity)

- Independent agent; dual-path **Final Expense vs IUL**; gold/beige brand; phone **248-970-9094** topbar (“No obligation, ever.”).
- Hero (live source): “Let’s Figure Out What You *Actually* Need” → primary/outline CTAs including “**Get My Free Assessment**” → `#assessment` form (name/email/phone/state + SMS + terms consent).
- Hero checklist currently claims: Instant underwriting / No medical exams / Same-day coverage / Trusted carriers — **tension with brand constraints and merge-review guidance** (avoid approval-time / day-one coverage claims).
- IUL Compass educational tool; FAQ thin (4 Qs) on main, expanding on polish-pass PR #1.
- SiteChrome / mobile hamburger in polish-pass **not yet merged**.
- Constraints: calm, no-pressure, no dark patterns, no fake urgency.

---

## 4. Cross-site pattern matrix

| Pattern | Ethos | Ladder | Fabric | PG | SelectQuote | dustinlife now |
|---------|-------|--------|--------|-----|-------------|----------------|
| Hero promise type | Instant/#1/perk | Protect today + laddering | Plan like a parent | Human approach | #1 / save 50% / $1 day | “What you actually need” |
| Primary CTA verb | Check price / Get covered | Get started | Get Started / CONTINUE | Get a Free Quote | Get a Quote | Free Assessment |
| Trust above fold | TP 4.9 + celebs | $111B + live applicants | Heritage + TP + parents | No chatbots + ratings | Sample $ prices | Phone + no obligation |
| Sticky mobile CTA | (DTC bind) | (DTC) | **No** (hamburger only) | **Yes** (orange quote) | Phone-heavy | **Gap** (polish hamburger pending) |
| Form entry friction | Full instant UW | Health Qs digital | Age/State/Coverage or 8-tile quiz | Product+type+ZIP | Quote → phone | Name/email/phone/state+SMS |
| How-it-works steps | 3 | Implied digital | Quiz → products | 4 (incl. expert) | Call agent | Soft dual path |
| FAQ depth | Strong | Strong | Product-led | Strong + SEO | Moderate | Thin → polish expands |
| Urgency tactics | Speed claims | Live applicant count | Soft | Soft close copy | Hard claims | Should stay none |
| Brand calm fit | Low–med | Med (minus urgency) | High | **Highest** | Low | Target |

---

## 5. Ranked recommendations for dustinlife.com

Each: Observation → Change → Why conversion → Effort → Brand fit.

### R1. Human-trust strip under hero (Policygenius pattern)
- **Observation:** PG places “No chatbots / Always real people” + star ratings immediately under hero; Ethos floods Trustpilot. dustinlife has phone topbar but thin proof density below hero.
- **Change:** Home hero → add trust strip: licensed independent agent, “Real person — no chatbots,” phone, optional review rating *only if authentic*. Do not invent counts.
- **Why:** Reduces “is this a lead farm?” anxiety; mirrors highest-fit competitor.
- **Effort:** Trivial–moderate  
- **Brand fit:** **Fits**

### R2. Sticky mobile primary CTA (beat Fabric; match PG)
- **Observation:** PG sticky orange “Get a Quote” on mobile header; Fabric visual pass = hamburger only, no sticky CTA. polish-pass adds hamburger/SiteChrome — incomplete without persistent action.
- **Change:** Extend polish-pass SiteChrome: on mobile, keep hamburger **and** a sticky “Free Assessment” or “Call 248-970-9094” control (gold, not orange urgency).
- **Why:** Mobile scroll abandonment; every DTC/marketplace that converts keeps CTA visible.
- **Effort:** Moderate (reinforce polish-pass)  
- **Brand fit:** **Fits**

### R3. Soft needs-discovery before/beside assessment (Fabric quiz tiles)
- **Observation:** Fabric “Select all that apply” 8-tile quiz then CONTINUE; PG product tiles. dustinlife dual-path FE vs IUL is the right split but entry is form-first.
- **Change:** Home or FE/IUL hubs: 2–4 tile chooser (“Burial / final bills” vs “Permanent + cash value exploration” vs “Not sure — talk it through”) → routes to assessment with intent prefills or Compass.
- **Why:** Lowers commitment; improves lead quality; matches calm education brand.
- **Effort:** Moderate  
- **Brand fit:** **Fits**

### R4. Expand FAQ accordion with buyer objections (Ladder/Ethos/PG) — extend polish-pass
- **Observation:** Ladder FAQ covers free look, term vs whole, 10× rule, claim durability; Ethos “not sure where to begin”; polish-pass already expands FAQ — main still thin (4 Qs).
- **Change:** Extend polish-pass FAQ topics: exam vs no-exam expectations, what independent agent means, FE vs IUL differences, how Compass works, what happens after assessment, SMS consent why.
- **Why:** SEO + objection handling without sales call; reduces bounce.
- **Effort:** Trivial–moderate (reinforce polish-pass)  
- **Brand fit:** **Fits**

### R5. Honest 3–4 step process including human expert (PG 4-step)
- **Observation:** PG: choose → about you → **expert** → plan. Ethos 3-step binds online. Haven historical phone-forward simplicity.
- **Change:** Home section: (1) Tell us what you need (2) Free assessment (3) Talk with Dustin (4) Compare options / decide — no fake bind-speed.
- **Why:** Sets expectation; converts “what happens next?” anxiety; differentiates from DTC instant-bind.
- **Effort:** Trivial  
- **Brand fit:** **Fits**

### R6. Hero headline/tone decision + checklist claim hygiene (merge-review + live tension)
- **Observation:** merge-review (2026-04-14) already: pick hero headline/tone; avoid price/approval-time/fake quote claims. Live hero checklist still lists Instant underwriting / Same-day coverage — DTC-flavored.
- **Change:** Decide final H1; rewrite checklist to verifiable agent truths (licensed nationwide independent, no obligation, dual-path education, human callback) — drop or heavily qualify same-day/instant UW unless product-true with disclosures.
- **Why:** Credibility; compliance; calm brand consistency.
- **Effort:** Trivial–moderate  
- **Brand fit:** **Fits** (fixes current misfit)

### R7. IUL good-fit / bad-fit + FE funeral-cost framing (merge-review reinforce)
- **Observation:** Forge merge-review already drafted these; live pages still need ballast vs Ethos/Ladder oversell.
- **Change:** Ship (when approved) FE funeral-cost/family-burden framing; IUL explicit good-fit/bad-fit — no 401(k) hype, no return absolutes.
- **Why:** Trust + qualification; fewer bad-fit leads.
- **Effort:** Moderate (content already drafted in `review/`)  
- **Brand fit:** **Fits**

### R8. ZIP-or-intent-light entry experiment (PG ZIP-only; Fabric Age/State/Coverage)
- **Observation:** PG life entry = product/type prefilled + ZIP; Fabric term = Age/State/Coverage. dustinlife assessment asks name/email/phone/state up front (necessary for agent callback) — higher friction.
- **Change:** Optional two-stage: intent/state (or ZIP) first → then contact fields; or keep contact-first but show “Takes ~2 minutes · No obligation” time honesty (Fabric card pattern).
- **Why:** Completion rate; still agent-led so don’t strip phone.
- **Effort:** Moderate  
- **Brand fit:** **Fits-with-care** (don’t lose SMS/consent compliance)

### R9. Time estimates on key cards (Fabric)
- **Observation:** Fabric shows 5–10 min style estimates on product cards.
- **Change:** Assessment CTA and Compass entry: “About 2 minutes” / “Explore at your pace” — honest, no “covered in 10 minutes.”
- **Why:** Reduces abandonment from unknown time cost.
- **Effort:** Trivial  
- **Brand fit:** **Fits**

### R10. Sample educational numbers only with heavy care (SelectQuote carousel / Fabric examples)
- **Observation:** SelectQuote Kate/Jay $15–$18/mo; Fabric $20/mo → $300k example. Powerful but claim-risky.
- **Change:** If used, only as clearly labeled hypotheticals with age/health/state assumptions — prefer Compass illustrations over homepage price carousels.
- **Why:** Conversion vs compliance tradeoff.
- **Effort:** Significant (if homepage); trivial (if Compass-only)  
- **Brand fit:** **Fits-with-care** / homepage carousel **NOT recommended**

### R11. Content SEO moat lite (PG 2,500+ articles)
- **Observation:** PG’s article volume is a moat dustinlife won’t match soon.
- **Change:** Extend FAQ + 3–5 pillar guides (FE, IUL basics, how independent agents work) — reinforce polish FAQ/sitemap, don’t pretend net-new IA discovery.
- **Why:** Organic + trust.
- **Effort:** Significant  
- **Brand fit:** **Fits**

### R12. Free will / perk bundle (Ethos / Fabric) — defer
- **Observation:** Ethos “Free will & trust worth $898”; Fabric free will in bundle.
- **Change:** Out of scope unless real partner ops exist.
- **Why:** High conversion elsewhere; empty perk destroys trust.
- **Effort:** Significant  
- **Brand fit:** **NOT recommended** until real

---

## 6. Impact / effort ranked list

| Rank | Rec | Impact | Effort | Notes |
|------|-----|--------|--------|-------|
| 1 | R6 Hero + checklist hygiene | High | Trivial–mod | Fixes live brand/compliance tension |
| 2 | R1 Human trust strip | High | Trivial–mod | PG pattern, calm |
| 3 | R2 Sticky mobile CTA | High | Moderate | Extend polish-pass SiteChrome |
| 4 | R5 How-it-works 3–4 steps | High | Trivial | Expectation setting |
| 5 | R4 FAQ objection expansion | High | Trivial–mod | Extend polish-pass |
| 6 | R7 FE/IUL credibility ballast | High | Moderate | merge-review drafts exist |
| 7 | R3 Needs-discovery tiles | Med–High | Moderate | Fabric soft entry |
| 8 | R9 Time estimates | Med | Trivial | Easy win |
| 9 | R8 Two-stage / lighter entry | Med | Moderate | Careful w/ consent |
| 10 | R11 Pillar content | Med | Significant | SEO long game |
| 11 | R10 Price examples | Med (risky) | Varies | Prefer Compass |
| 12 | R12 Will/perk bundle | — | Significant | Defer |

---

## 7. Overlaps with prior review notes / polish-pass

**Do not treat the following as net-new discoveries.** Frame work as reinforce / extend.

### Highest duplicate risk — PR #1 `dudbot/polish-pass` (OPEN)
- Mobile hamburger / **SiteChrome**
- Unified legal chrome
- Expanded FAQ
- Sitemap completeness
- Trust / CTA hierarchy

→ Competitive recs **R2, R4, R1 (partial), R11** = **reinforce/extend polish-pass**, not parallel redesigns.

### Already shipped on main
- Form a11y
- Gold contrast `#8F6D34`
- Focus / scroll-padding
- SEO metadata / schema / robots

→ Do not re-propose these. Sticky CTA / trust strip should **reuse** shipped gold token, not invent orange urgency (PG color is reference only).

### `review/merge-review-notes.md` (Forge, 2026-04-14)
Already flagged:
- FE funeral-cost framing
- IUL good-fit / bad-fit credibility ballast
- Avoid price / approval-time / fake quote claims
- Pick hero headlines / tone

→ **R6, R7** explicitly continue that work.

### REVIEW-REPORT 1–5
API-only → **ignore for UI** competitive work.

### REVIEW-REPORT 6–7
Compass link / a11y / fonts → if CTA hierarchy touches Compass entry, coordinate; not a consumer homepage audit substitute.

### Untracked `REVIEW-REPORT*.md` (general)
Mostly IUL Compass integration / build safety — **not** consumer UI competitive audit. This document fills that gap.

### Visual pass note (Fabric sticky gap)
Fabric’s lack of sticky mobile CTA is an opportunity **on top of** polish-pass hamburger — implement as extension of SiteChrome, not a separate nav rewrite.

---

## 8. Explicit NOT recommended competitor tactics

| Tactic | Source | Why reject for dustinlife |
|--------|--------|---------------------------|
| Live “people applying right now” counters | Ladder | Fake urgency / dark pattern vs calm brand |
| “#1 …” / “Save 50%+” / “under $1 a day” hard claims | SelectQuote, Ethos #1 | Compliance + tone misfit |
| Homepage sample price carousels ($15/$18 / mo) without full underwriting context | SelectQuote | Misleading lead gen |
| Celebrity paid spokes as primary trust | Ethos | Inauthentic for local independent agent |
| Instant bind / “covered in 10 minutes” as hero promise | Ethos | Wrong model (agent + education) |
| Same-day / instant UW checklist without product-true disclosures | Ethos / current hero tension | merge-review already warned |
| Chatbot theater or fake “AI advisor” | Anti-pattern vs PG | Conflicts with human-agent story |
| Empty free will / $898 perk | Ethos / Fabric | Only if real ops |
| Bestow consumer funnel cloning | Bestow | Not DTC anymore |
| Treating Haven as live competitor | Haven | Defunct; lesson only |
| Red urgency accent systems | Ladder | Anxiety chrome |

---

## 9. Suggested greenlight batches for Dustin

### Batch A — Ship with / right after polish-pass (trivial–moderate, high fit)
1. Hero checklist claim hygiene (R6)  
2. Human trust strip under hero (R1)  
3. Sticky mobile Assessment/Call CTA on SiteChrome (R2)  
4. How-it-works 3–4 steps with human expert (R5)  
5. Time estimates on Assessment + Compass CTAs (R9)  
6. FAQ objection topics extending polish FAQ (R4)

### Batch B — Content credibility (moderate; drafts exist)
1. FE funeral-cost / family-burden framing from merge-review (R7)  
2. IUL good-fit / bad-fit section (R7)  
3. Final H1 tone decision per page (R6 remainder)

### Batch C — Soft entry experiments (moderate)
1. Dual-path needs tiles → assessment intent (R3)  
2. Optional two-stage form / lighter first step (R8) — legal review on SMS consent flow

### Batch D — Later / only with ops
1. Pillar educational articles (R11)  
2. Hypothetical numbers only via Compass, never SelectQuote-style homepage price carousel (R10)  
3. Will/estate perk only if real partner (R12) — else never

**Explicitly out of greenlight:** Ladder live counters, SelectQuote hard-sell claims, Ethos celebrity/#1/10-minute bind race, Bestow-as-DTC, Haven-as-live.

---

## Appendix — Quote bank (live / verified 2026-09-01)

- Ethos: “The #1 no-medical-exam, instant life insurance provider” · “Get covered in 10 minutes” · “Free will & trust worth $898”
- Ladder: “$111+ billion coverage provided” · “377 people applying right now” · “Laddering”
- Fabric: “Plan like a parent” · “Less than a latte” · “Select all that apply.” · heritage “Over 135 years”
- Policygenius: “A human approach to buying insurance.” · “No chatbots / Always real people” · “Finished scrolling? Start saving.”
- SelectQuote: “America’s #1 Term Life Sales Agency” · “Save more than 50%” · “Kate $500K for $15/month”
- Haven (historical): “Life insurance that’s actually simple”
- dustinlife (source): “Let’s Figure Out What You Actually Need” · “Get My Free Assessment” · “No obligation, ever.”

---

*Docs-only deliverable. No site app code changed in this PR. Last updated: 2026-09-01 ET.*
