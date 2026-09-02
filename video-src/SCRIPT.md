# IUL Intro — Whiteboard Explainer Script (v1 draft)

**Status:** Draft for compliance review BEFORE live use  
**Length target:** 75–100 seconds  
**Tone:** Warm, calm, unhurried — “without the sales pitch”  
**Visual system:** Hand-drawn dark ink on off-white board; site gold (`#C9A96E` / `#8F6D34`) as ONLY accent  
**Compliance:** No guaranteed returns; no tax-free retirement hype; no beats-market / better-than-401k; no carrier names or carrier-specific numbers; every on-screen number labeled **hypothetical**

---

## Full narration (spoken)

Indexed Universal Life is permanent life insurance first — a death benefit for the people you care about, plus a cash value that can grow inside the policy.

When you pay a premium, it splits. Part covers the cost of insurance and charges. What is left can go toward cash value.

That cash value may receive indexed crediting — tied to how an index moves, but not invested in the index itself. Policies typically use a floor so credited interest does not go below zero for that period, and a cap or participation rate that limits the upside. Any numbers you see here are hypothetical.

Here is what people often get wrong. An illustration is not a guarantee. If a policy is underfunded, it can lapse. Insurance costs generally rise with age. And loans against cash value have real mechanics and tradeoffs.

Who it can fit: someone who wants permanent coverage, can fund it consistently, and wants a clear explanation — not hype. Who it usually does not fit: anyone chasing guaranteed market-beating returns, or who needs short-term, temporary coverage only.

Let’s figure out whether it actually fits — no pressure, no obligation. Call 248-970-9094.

---

## Timed beats (approximate; final times follow rendered audio)

**Rendered length (v1):** ~79.9s narration (within 75–100s). TTS: macOS `say -v Samantha -r 160`.

| Beat | Time (rendered) | Narration | On-screen visual |
|------|------|-----------|------------------|
| 1 | **0:00–0:10** | “Indexed Universal Life is permanent life insurance first — a death benefit for the people you care about, plus a cash value that can grow inside the policy.” | Title “IUL” sketches in ink. Icon: simple shield. Two labeled boxes draw on: **Death benefit** and **Cash value**, connected under “Permanent life insurance.” Gold underline accent only. |
| 2 | **0:10–0:18** | “When you pay a premium, it splits. Part covers the cost of insurance and charges. What is left can go toward cash value.” | Horizontal bar labeled **Premium** draws, then splits into two segments: larger/left **COI / charges**, remainder **to cash value**. Hand-drawn bracket and arrows. Tiny note: “Simplified — design varies.” |
| 3 | **0:18–0:38** | “That cash value may receive indexed crediting — tied to how an index moves, but not invested in the index itself. Policies typically use a floor so credited interest does not go below zero for that period, and a cap or participation rate that limits the upside. Any numbers you see here are hypothetical.” | Simple line chart draws left→right. Wavy “index move” line in light ink. Flat **floor** line at 0% (gold label “typical floor”). Dashed **cap** line above (gold). Callout bubble: **Not invested in the index**. Corner stamp in gold ink: **HYPOTHETICAL**. Sample markers only if needed, e.g. “0% floor (hyp.)” / “cap (hyp.)” — never presented as a real offer. |
| 4 | **0:38–0:52** | “Here is what people often get wrong. An illustration is not a guarantee. If a policy is underfunded, it can lapse. Insurance costs generally rise with age. And loans against cash value have real mechanics and tradeoffs.” | Heading “What people get wrong.” Four sketch lines check off in sequence: (1) Illustration ≠ guarantee (2) Underfunded → can lapse (3) Costs rise with age (4) Loans: mechanics & tradeoffs. No smiling stock people; ink icons only (doc with X, warning triangle, rising steps, loan arrow). |
| 5 | **0:53–1:10** | “Who it can fit: someone who wants permanent coverage, can fund it consistently, and wants a clear explanation — not hype. Who it usually does not fit: anyone chasing guaranteed market-beating returns, or who needs short-term, temporary coverage only.” | Two columns sketch in: **Can fit** (short bullets) vs **Usually doesn’t** (short bullets). Gold vertical rule between columns. Avoid absolute “always/never.” |
| 6 | **1:10–1:20** | “Let’s figure out whether it actually fits — no pressure, no obligation. Call 248-970-9094.” | Calm close card: “No pressure. No obligation.” Phone **248-970-9094** large in ink with gold underline. Soft “DustinLife.com” / “Dustin McCormick” credit line. |

*Final cue times in the shipped `.vtt` are generated from the rendered TTS audio and may differ by a second or two from this planning table.*

---

## Compliance checklist (reviewer)

- [ ] No guaranteed returns or rate promises
- [ ] No “tax-free retirement” framing
- [ ] No “beats the market” / “better than 401(k)” claims
- [ ] No carrier names; no carrier-specific caps/participation/bonuses
- [ ] All numeric callouts marked hypothetical
- [ ] Floor/cap described with “typically” language only
- [ ] Close is invitational, not urgency/scarcity
- [ ] Phone on screen matches site: 248-970-9094

---

## Hosting recommendation (DECISION FOR USER — not implemented)

Self-hosting the MP4 from Cloudflare Pages/R2 is fine for a ~≤15MB 720p file, but **Cloudflare Stream** (adaptive bitrate, captions, thumbnails) or an **unlisted YouTube** embed may be better if you expect mobile bandwidth variance or want analytics. Prefer Stream/R2 if you want the player to stay fully on-brand on dustinlife.com; prefer unlisted YouTube if you want zero infra and easy caption editing. **No hosting change is included in this PR.**

---

## Rebuild

Editable source lives in `video-src/`. See `video-src/README.md`.
