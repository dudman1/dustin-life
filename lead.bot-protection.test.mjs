// Tests for /api/lead bot protection: honeypot + Cloudflare Turnstile (TURNSTILE_MODE).
// Run from the repo root: node --experimental-strip-types lead.bot-protection.test.mjs
import { onRequestPost } from './functions/api/lead.ts';

const GHL_URL = 'https://lc.test/hook';
const CONVEX_URL = 'https://rapid-hummingbird-980.convex.cloud/api/mutation';
const TG_PREFIX = 'https://api.telegram.org/bot';
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Cloudflare's documented Turnstile test secrets and the dummy token test sitekeys issue.
// https://developers.cloudflare.com/turnstile/troubleshooting/testing/
const SECRET_ALWAYS_PASS = '1x0000000000000000000000000000000AA';
const SECRET_ALWAYS_FAIL = '2x0000000000000000000000000000000AA';
const SECRET_SPENT_TOKEN = '3x0000000000000000000000000000000AA';
const DUMMY_TOKEN = 'XXXX.DUMMY.TOKEN.XXXX';
const BOT_MESSAGE = "We couldn't verify your submission. Please try again or call us.";

const CONVEX_ID = 'ks77bkza6xqjbp6704xckk19158dbarg';
const okResponse = () => ({
  ok: true, status: 200, text: async () => '',
  json: async () => ({ status: 'success', value: CONVEX_ID }),
});

// Mirrors Cloudflare's behaviour for the documented test secrets.
function siteverifyResponse(secret) {
  const body = secret === SECRET_ALWAYS_PASS
    ? { success: true, 'error-codes': [] }
    : secret === SECRET_SPENT_TOKEN
      ? { success: false, 'error-codes': ['timeout-or-duplicate'] }
      : { success: false, 'error-codes': ['invalid-input-response'] };
  return { ok: true, status: 200, text: async () => JSON.stringify(body), json: async () => body };
}

let calls = [];
let fetchImpl = async () => okResponse();
globalThis.fetch = async (url, opts) => {
  calls.push({ url: String(url), body: opts.body ? JSON.parse(opts.body) : undefined, opts });
  return fetchImpl(String(url), opts);
};
const defaultMock = async (url, opts) =>
  url === SITEVERIFY_URL ? siteverifyResponse(JSON.parse(opts.body).secret) : okResponse();

const BASE_ENV = {
  GHL_WEBHOOK_URL: GHL_URL,
  CONVEX_ADMIN_KEY: 'k',
  TELEGRAM_BOT_TOKEN: 'TEST_TOKEN',
  TELEGRAM_CHAT_ID: 'TEST_CHAT',
};

const homepageLead = { name: 'A B', email: 'a@b.co', phone: '1234567', state: 'MI', smsConsent: true, termsConsent: true };
const compassLead = {
  tool: 'iul-compass',
  profile: { age: 35, premium: 6000, years: 20, posture: 'balanced' },
  lead: { name: 'Jordan Doe', email: 'jordan@example.com', phone: '(555) 010-1234', consent: true },
};
const feLead = { firstName: 'Pat', lastName: 'Lee', dob: '1955-03-01', gender: '', coverageAmount: '', state: 'MI', phone: '5551234567', tcpaConsent: true };

const find = (prefix) => calls.filter((c) => c.url.startsWith(prefix));
const tgText = () => find(TG_PREFIX).map((c) => c.body.text).join('\n');
const downstream = () => calls.filter((c) => c.url !== SITEVERIFY_URL);

let passCount = 0, failCount = 0;
async function run(name, { body, env = BASE_ENV, mock = defaultMock, headers = {}, expectStatus, check }) {
  calls = [];
  fetchImpl = mock;
  const req = new Request('https://dustinlife.com/api/lead', { method: 'POST', body: JSON.stringify(body), headers });
  const res = await onRequestPost({ request: req, env });
  const data = await res.json();
  let extraOk = true;
  try { extraOk = check ? Boolean(check(data)) : true; } catch { extraOk = false; }
  const ok = res.status === expectStatus && extraOk;
  if (ok) passCount++; else failCount++;
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${name} | status=${res.status} expected=${expectStatus}${ok ? '' : ' | ' + JSON.stringify(data) + (extraOk ? '' : ' | extra check failed') + ' | calls=' + calls.map((c) => c.url).join(',')}`);
}

// --- Honeypot -------------------------------------------------------------
await run('honeypot filled -> 200 silent, zero outbound fetches', {
  body: { ...homepageLead, dl_website: 'http://spam.example' },
  expectStatus: 200,
  check: (data) => data.success === true && calls.length === 0,
});
await run('honeypot filled + enforce + no token -> still 200 silent, zero fetches', {
  body: { ...compassLead, dl_website: 'x' },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  expectStatus: 200,
  check: (data) => data.success === true && calls.length === 0,
});
await run('honeypot empty string -> normal lead', {
  body: { ...homepageLead, dl_website: '' },
  expectStatus: 200,
  check: () => find(CONVEX_URL).length === 1 && find(GHL_URL).length === 1,
});

// --- Mode off (unset / unknown) --------------------------------------------
await run('mode unset -> existing behavior, no siteverify call', {
  body: homepageLead,
  expectStatus: 200,
  check: () => find(SITEVERIFY_URL).length === 0 && find(CONVEX_URL).length === 1
    && find(GHL_URL).length === 1 && find(TG_PREFIX).length === 1 && !tgText().includes('Bot check'),
});
await run('mode off + token + secret -> siteverify skipped', {
  body: { ...homepageLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'off', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_FAIL },
  expectStatus: 200,
  check: () => find(SITEVERIFY_URL).length === 0 && find(CONVEX_URL).length === 1 && !tgText().includes('Bot check'),
});
await run('unknown mode value -> treated as off', {
  body: feLead,
  env: { ...BASE_ENV, TURNSTILE_MODE: 'strict', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_FAIL },
  expectStatus: 200,
  check: () => find(SITEVERIFY_URL).length === 0 && find(CONVEX_URL).length === 1,
});
await run('mode off: Convex + GHL payloads identical with and without bot fields', {
  body: { ...homepageLead, turnstileToken: DUMMY_TOKEN, dl_website: '' },
  expectStatus: 200,
  check: () => {
    const convexWith = find(CONVEX_URL)[0].body;
    const ghlWith = find(GHL_URL)[0].body;
    return JSON.stringify(convexWith) === JSON.stringify({
      path: 'insuranceLeads:create',
      args: { source: 'dustinlife.com', fullName: 'A B', phone: '1234567', state: 'MI', product: 'IUL', notes: 'Email: a@b.co | Form: homepage-iul' },
    }) && !('turnstileToken' in ghlWith) && !('dl_website' in ghlWith);
  },
});

// --- Log mode ---------------------------------------------------------------
await run('log + failed token -> lead lands, Telegram flagged FAILED', {
  body: { ...homepageLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'log', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_FAIL },
  expectStatus: 200,
  check: () => find(SITEVERIFY_URL).length === 1 && find(CONVEX_URL).length === 1 && find(GHL_URL).length === 1
    && tgText().includes('Bot check: FAILED (invalid-input-response)'),
});
await run('log + no token -> lead lands, Telegram flagged no token, no siteverify call', {
  body: compassLead,
  env: { ...BASE_ENV, TURNSTILE_MODE: 'log', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  expectStatus: 200,
  check: () => find(SITEVERIFY_URL).length === 0 && find(CONVEX_URL).length === 1
    && tgText().includes('Bot check: no token'),
});
await run('log + valid token -> lead lands, no flag', {
  body: { ...feLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'log', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  expectStatus: 200,
  check: () => find(CONVEX_URL).length === 1 && !tgText().includes('Bot check'),
});

// --- Enforce mode -------------------------------------------------------------
await run('enforce + failed token -> 400, zero Convex/GHL/Telegram calls', {
  body: { ...homepageLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_FAIL },
  expectStatus: 400,
  check: (data) => data.error === BOT_MESSAGE && data.code === 'bot_check_failed'
    && find(SITEVERIFY_URL).length === 1 && downstream().length === 0,
});
await run('enforce + spent/expired token -> 400, zero downstream calls', {
  body: { ...feLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_SPENT_TOKEN },
  expectStatus: 400,
  check: (data) => data.error === BOT_MESSAGE && downstream().length === 0,
});
await run('enforce + no token -> 400, no siteverify, zero downstream calls', {
  body: compassLead,
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  expectStatus: 400,
  check: (data) => data.error === BOT_MESSAGE && calls.length === 0,
});
await run('enforce + valid token -> normal 200, siteverify got secret/response/remoteip', {
  body: { ...compassLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  headers: { 'CF-Connecting-IP': '203.0.113.7' },
  expectStatus: 200,
  check: (data) => {
    const sv = find(SITEVERIFY_URL)[0]?.body;
    return data.success === true && sv && sv.secret === SECRET_ALWAYS_PASS && sv.response === DUMMY_TOKEN
      && sv.remoteip === '203.0.113.7' && find(CONVEX_URL).length === 1 && find(GHL_URL).length === 1
      && !tgText().includes('Bot check');
  },
});
await run('enforce + valid token -> token and honeypot never reach Convex/GHL/Telegram', {
  body: { ...homepageLead, turnstileToken: DUMMY_TOKEN, dl_website: '' },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  expectStatus: 200,
  check: () => downstream().every((c) => {
    const s = JSON.stringify(c.body);
    return !s.includes(DUMMY_TOKEN) && !s.includes('turnstileToken') && !s.includes('dl_website');
  }) && downstream().length === 3,
});
await run('enforce + siteverify timeout (>3s) -> fail open: lead lands, Telegram flagged', {
  body: { ...homepageLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  mock: (url, opts) => url === SITEVERIFY_URL
    ? new Promise((_, reject) => opts.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }))
    : okResponse(),
  expectStatus: 200,
  check: () => find(CONVEX_URL).length === 1 && find(GHL_URL).length === 1
    && tgText().includes('Bot check: UNVERIFIED'),
});
await run('enforce + siteverify HTTP 500 -> fail open, flagged', {
  body: { ...feLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  mock: async (url) => url === SITEVERIFY_URL
    ? { ok: false, status: 500, text: async () => 'oops', json: async () => ({}) }
    : okResponse(),
  expectStatus: 200,
  check: () => find(CONVEX_URL).length === 1 && tgText().includes('Bot check: UNVERIFIED'),
});
await run('enforce + siteverify internal-error -> fail open, flagged', {
  body: { ...feLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  mock: async (url) => url === SITEVERIFY_URL
    ? { ok: true, status: 200, text: async () => '', json: async () => ({ success: false, 'error-codes': ['internal-error'] }) }
    : okResponse(),
  expectStatus: 200,
  check: () => find(CONVEX_URL).length === 1 && tgText().includes('Bot check: UNVERIFIED'),
});
await run('enforce + no secret -> log behavior: lead lands, flagged, no siteverify', {
  body: { ...homepageLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce' },
  expectStatus: 200,
  check: () => find(SITEVERIFY_URL).length === 0 && find(CONVEX_URL).length === 1
    && tgText().includes('Bot check: UNVERIFIED'),
});
await run('enforce + no secret + no token -> still processed (log behavior)', {
  body: compassLead,
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: '' },
  expectStatus: 200,
  check: () => find(CONVEX_URL).length === 1,
});
await run('enforce + invalid form -> validation 400 first, token not spent', {
  body: { ...homepageLead, smsConsent: false, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'enforce', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_PASS },
  expectStatus: 400,
  check: (data) => data.error !== BOT_MESSAGE && calls.length === 0,
});
await run('log + failed token + Convex down -> 500, failure alert carries bot flag', {
  body: { ...homepageLead, turnstileToken: DUMMY_TOKEN },
  env: { ...BASE_ENV, TURNSTILE_MODE: 'log', TURNSTILE_SECRET_KEY: SECRET_ALWAYS_FAIL },
  mock: async (url, opts) => url === SITEVERIFY_URL
    ? siteverifyResponse(JSON.parse(opts.body).secret)
    : url === CONVEX_URL
      ? { ok: true, status: 200, text: async () => '', json: async () => ({ status: 'error', errorMessage: 'boom' }) }
      : okResponse(),
  expectStatus: 500,
  check: () => tgText().includes('LEAD STORAGE FAILED') && tgText().includes('Bot check: FAILED'),
});

console.log(`\n${passCount} passed, ${failCount} failed`);
process.exit(failCount ? 1 : 0);
