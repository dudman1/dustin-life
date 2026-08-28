// Integration test for functions/api/lead.ts — IUL Compass branch + regressions + lead hardening.
// Run: node --experimental-strip-types /tmp/iul-compass-test.mjs
import { onRequestPost } from '/Users/openclaw/dustin-life/functions/api/lead.ts';

const GHL_URL = 'https://lc.test/hook';
const CONVEX_URL = 'https://rapid-hummingbird-980.convex.cloud/api/mutation';
const TG_PREFIX = 'https://api.telegram.org/bot';

const CONVEX_ID = 'ks77bkza6xqjbp6704xckk19158dbarg'; // real Id-string shape db.insert returns
const okResponse = (overrides = {}) => ({
  ok: true, status: 200, text: async () => '',
  json: async () => ({ status: 'success', value: CONVEX_ID, ...overrides }),
});
const convexErrorResponse = (status = 200, errMsg = 'boom') => ({
  ok: status < 400, status, text: async () => errMsg,
  json: async () => ({ status: 'error', errorMessage: errMsg }),
});
const flatIdResponse = () => ({
  ok: true, status: 200, text: async () => '',
  json: async () => ({ _id: CONVEX_ID }),
});

let calls = [];
let fetchImpl = async () => okResponse();

globalThis.fetch = async (url, opts) => {
  calls.push({ url: String(url), body: opts.body ? JSON.parse(opts.body) : undefined, opts });
  return fetchImpl(String(url), opts);
};

const ENV = {
  GHL_WEBHOOK_URL: GHL_URL,
  CONVEX_ADMIN_KEY: 'k',
  TELEGRAM_BOT_TOKEN: 'TEST_TOKEN',
  TELEGRAM_CHAT_ID: 'TEST_CHAT',
};

let passCount = 0, failCount = 0;
async function run(name, body, expectStatus, extra, mock = async () => okResponse(), env = ENV) {
  calls = [];
  fetchImpl = mock;
  const req = new Request('https://dustinlife.com/api/lead', { method: 'POST', body: JSON.stringify(body) });
  const res = await onRequestPost({ request: req, env });
  const data = await res.json();
  let extraOk = true;
  if (extra) {
    extraOk = extra(calls, data);
  }
  const ok = res.status === expectStatus && extraOk;
  if (ok) passCount++; else failCount++;
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${name} | status=${res.status} expected=${expectStatus}${ok ? '' : ' | ' + JSON.stringify(data) + (extraOk ? '' : ' | extra check failed')}`);
}

const compassPayload = {
  tool: 'iul-compass',
  submittedAt: '2026-08-28T14:00:00.000Z',
  profile: { age: 35, income: 85000, premium: 6000, years: 20, posture: 'balanced' },
  lead: { name: 'Jordan Doe', email: 'jordan@example.com', phone: '(555) 010-1234', consent: true },
};

// 1. IUL Compass happy path — Convex + GHL + Telegram all fire, telegram text complete.
await run('compass happy path', compassPayload, 200, (calls) => {
  const ghl = calls.find((c) => c.url === GHL_URL);
  const convex = calls.find((c) => c.url === CONVEX_URL);
  const tg = calls.find((c) => c.url.startsWith(TG_PREFIX));
  if (!ghl || !convex || !tg) return false;
  const g = ghl.body;
  const n = convex.body.args.notes;
  const tgText = tg.body.text;
  return g.form_name === 'iul-compass'
    && g.age === 35 && g.premium === 6000 && g.posture === 'balanced'
    && g.sms_consent === true && g.terms_consent === true
    && n.includes('Age: 35') && n.includes('Premium: $6000/yr')
    && convex.body.path === 'insuranceLeads:create'
    && convex.body.args.source === 'dustinlife.com/iul-compass'
    && tgText.includes('iul-compass') && tgText.includes('Jordan Doe')
    && tgText.includes('(555) 010-1234') && tgText.includes('jordan@example.com')
    && tgText.includes('Age 35') && tgText.includes('Premium $6000/yr')
    && tgText.includes('Profile:');
});

// 2. Compass missing consent
await run('compass missing consent', { ...compassPayload, lead: { ...compassPayload.lead, consent: false } }, 400);
// 3. Compass empty name
await run('compass empty name', { ...compassPayload, lead: { ...compassPayload.lead, name: '  ' } }, 400);
// 4. Compass missing profile (should still work, profile optional; no Profile line in telegram)
await run('compass without profile', { tool: 'iul-compass', lead: { name: 'A B', email: 'a@b.co', consent: true } }, 200, (calls) => {
  const g = calls.find((c) => c.url === GHL_URL)?.body;
  const tg = calls.find((c) => c.url.startsWith(TG_PREFIX))?.body;
  return g && g.form_name === 'iul-compass' && g.age === '' && tg && !tg.text.includes('Profile:');
});

// 5. Regression: homepage IUL lead
await run('homepage-iul regression', { name: 'A B', email: 'a@b.co', phone: '1234567', state: 'MI', smsConsent: true, termsConsent: true }, 200, (calls) => {
  const g = calls.find((c) => c.url === GHL_URL)?.body;
  const convex = calls.find((c) => c.url === CONVEX_URL);
  const tg = calls.find((c) => c.url.startsWith(TG_PREFIX))?.body;
  return g && g.form_name === 'homepage-iul' && Boolean(convex) && tg && tg.text.includes('homepage-iul');
});
// 6. Regression: final expense lead — LIVE form payload (no zip, no email; state required on main)
await run('final-expense regression (live payload)', {
  firstName: 'F', lastName: 'L', phone: '1234567', state: 'MI', dob: '1980-01-01',
  gender: '', coverageAmount: '', tcpaConsent: true,
}, 200, (calls) => {
  const g = calls.find((c) => c.url === GHL_URL)?.body;
  const convex = calls.find((c) => c.url === CONVEX_URL);
  const tg = calls.find((c) => c.url.startsWith(TG_PREFIX))?.body;
  return g && g.form_name === 'final-expense' && g.state === 'MI' && Boolean(convex) && tg && tg.text.includes('final-expense');
});
// 7. Regression: final expense missing consent (live payload, no zip/email)
await run('final-expense missing consent', {
  firstName: 'F', lastName: 'L', phone: '1234567', state: 'MI', dob: '1980-01-01',
  tcpaConsent: false,
}, 400);

// 8. HARDENING: GHL fetch rejects → 200, Convex + Telegram still happen.
await run('GHL fetch rejects -> 200, Convex + Telegram still happen', compassPayload, 200,
  (calls) => {
    const convex = calls.find((c) => c.url === CONVEX_URL);
    const tg = calls.find((c) => c.url.startsWith(TG_PREFIX));
    return Boolean(convex && convex.body.path === 'insuranceLeads:create') && Boolean(tg);
  },
  async (url) => {
    if (url === GHL_URL) throw new Error('GHL network down');
    return okResponse();
  });

// 9. HARDENING: GHL hangs past the 5s timeout → 200, Convex still written.
await run('GHL hangs past 5s timeout -> 200, Convex written', compassPayload, 200,
  (calls) => calls.some((c) => c.url === CONVEX_URL),
  (url, opts) => {
    if (url === GHL_URL) {
      return new Promise((resolve, reject) => {
        opts.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
      });
    }
    return okResponse();
  });

// 10. HARDENING: Telegram fails → 200, GHL + Convex still happen.
await run('Telegram fails -> 200, GHL + Convex written', compassPayload, 200,
  (calls) => calls.some((c) => c.url === CONVEX_URL) && calls.some((c) => c.url === GHL_URL),
  async (url) => {
    if (url.startsWith(TG_PREFIX)) throw new Error('Telegram API down');
    return okResponse();
  });

// 11. HARDENING: Telegram env vars missing → 200, no Telegram call, no crash.
await run('Telegram env missing -> 200, no Telegram call', compassPayload, 200,
  (calls) => !calls.some((c) => c.url.startsWith(TG_PREFIX)),
  async () => okResponse(),
  { GHL_WEBHOOK_URL: GHL_URL, CONVEX_ADMIN_KEY: 'k' });

// 12. HARDENING: Convex fails → 500 even though GHL succeeds (Convex is must-land).
await run('Convex fails -> 500 even if GHL succeeds', compassPayload, 500,
  (calls) => calls.some((c) => c.url === GHL_URL),
  async (url) => {
    if (url === CONVEX_URL) return convexErrorResponse(500);
    return okResponse();
  });

// 12b. HARDENING: Convex returns HTTP 200 but a logical error envelope → 500,
//      AND the Telegram failure alert fires (the one moment we must be paged).
await run('Convex HTTP 200 + status:error -> 500 + Telegram failure alert', compassPayload, 500,
  (calls) => {
    const ghl = calls.some((c) => c.url === GHL_URL);
    const tgFailure = calls.find((c) => c.url.startsWith(TG_PREFIX))?.body?.text ?? '';
    return ghl && tgFailure.includes('🚨 LEAD STORAGE FAILED')
      && tgFailure.includes('iul-compass') && tgFailure.includes('Jordan Doe')
      && tgFailure.includes('error: convex mutation failed: UserError: duplicate lead');
  },
  async (url) => {
    if (url === CONVEX_URL) return convexErrorResponse(200, 'UserError: duplicate lead');
    return okResponse();
  });

// 12c. LEGACY FALLBACK: object-wrapped value {_id} still counts as success + id extracted.
const objectWrappedResponse = () => ({
  ok: true, status: 200, text: async () => '',
  json: async () => ({ status: 'success', value: { _id: CONVEX_ID } }),
});
await run('Convex object-wrapped value {_id} -> 200', compassPayload, 200,
  (calls) => calls.some((c) => c.url === GHL_URL) && calls.some((c) => c.url === CONVEX_URL),
  async (url) => {
    if (url === CONVEX_URL) return objectWrappedResponse();
    return okResponse();
  });

// 12d. HARDENING (missing-success rule): body with no status envelope → 500.
await run('Convex body missing success status -> 500', compassPayload, 500,
  (calls) => calls.some((c) => c.url === GHL_URL),
  async (url) => {
    if (url === CONVEX_URL) return flatIdResponse();
    return okResponse();
  });

// 12e. HARDENING: Convex hangs past timeout → 500 (env override keeps test fast;
//      production default stays 15s).
await run('Convex hangs past timeout -> 500', compassPayload, 500,
  (calls) => calls.some((c) => c.url === GHL_URL),
  (url, opts) => {
    if (url === CONVEX_URL) {
      return new Promise((resolve, reject) => {
        opts.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
      });
    }
    return okResponse();
  },
  { GHL_WEBHOOK_URL: GHL_URL, CONVEX_ADMIN_KEY: 'k', CONVEX_TIMEOUT_MS: 1000 });

// 12f. HARDENING: GHL + Telegram run CONCURRENTLY (both 60ms → elapsed ≈60ms,
//      sequential would be ≈120ms).
{
  calls = [];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const slowResponse = () => ({ ok: true, status: 200, text: async () => '', json: async () => ({ status: 'success', value: CONVEX_ID }) });
  fetchImpl = async (url, opts) => {
    calls.push({ url: String(url), body: opts.body ? JSON.parse(opts.body) : undefined });
    if (url === CONVEX_URL) return slowResponse(); // Convex fast — not the thing under test
    await sleep(60); // GHL + Telegram both slow
    return slowResponse();
  };
  const req = new Request('https://dustinlife.com/api/lead', { method: 'POST', body: JSON.stringify(compassPayload) });
  const start = Date.now();
  const res = await onRequestPost({ request: req, env: ENV });
  const elapsed = Date.now() - start;
  const ok = res.status === 200 && elapsed < 110 && calls.some((c) => c.url === GHL_URL) && calls.some((c) => c.url.startsWith(TG_PREFIX));
  if (ok) passCount++; else failCount++;
  console.log(`${ok ? 'PASS' : 'FAIL'} | GHL + Telegram concurrent (elapsed=${elapsed}ms) | status=${res.status} expected=200`);
}

// 13. HARDENING: malformed body — JSON null → clean 400, no throw.
await run('body is null -> 400 clean', null, 400, (calls, data) => data && data.error);

// 14. HARDENING: malformed body — JSON array → clean 400, no throw.
await run('body is array -> 400 clean', [], 400, (calls, data) => data && data.error);

// 15. HARDENING: malformed body — JSON primitive (string) → clean 400, no throw.
await run('body is string -> 400 clean', 'not-an-object', 400, (calls, data) => data && data.error);

// 16. FIX6: Convex sends headers FAST but the body (json) never resolves except
//      on abort → 500 within the cap + failure alert fired. Sanitized floor
//      (1000ms) forces using 1000 instead of 50.
await run('Convex body stall past timeout -> 500 + failure alert', compassPayload, 500,
  (calls) => {
    const convexHit = calls.some((c) => c.url === CONVEX_URL);
    const tgFailure = calls.find((c) => c.url.startsWith(TG_PREFIX))?.body?.text ?? '';
    return convexHit && tgFailure.includes('🚨 LEAD STORAGE FAILED');
  },
  (url, opts) => {
    if (url === CONVEX_URL) {
      // Headers delivered instantly; body stalls until the abort signal fires.
      return {
        ok: true, status: 200, text: async () => '',
        json: () => new Promise((resolve, reject) => {
          opts.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
        }),
      };
    }
    return okResponse();
  },
  { GHL_WEBHOOK_URL: GHL_URL, CONVEX_ADMIN_KEY: 'k', CONVEX_TIMEOUT_MS: 1000, TELEGRAM_BOT_TOKEN: 'TEST_TOKEN', TELEGRAM_CHAT_ID: 'TEST_CHAT' });

// 17. FIX6 mirror: GHL sends fast non-2xx headers, then body stalls → best-effort
//      absorbs it → 200. (GHL_TIMEOUT_MS is 5s, so this takes ~5 real seconds.)
await run('GHL non-2xx body stall -> 200 absorbed', compassPayload, 200,
  (calls) => calls.some((c) => c.url === CONVEX_URL) && calls.some((c) => c.url.startsWith(TG_PREFIX)),
  (url, opts) => {
    if (url === GHL_URL) {
      return {
        ok: false, status: 500, json: async () => ({}),
        text: () => new Promise((resolve, reject) => {
          opts.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
        }),
      };
    }
    return okResponse();
  });

console.log(`\n${passCount} passed, ${failCount} failed`);
process.exit(failCount ? 1 : 0);