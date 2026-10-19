// Shared lead pipeline — used by both /api/lead and /api/meta-leadgen.
// Convex is the must-land system of record. GHL, Telegram, and CAPI are best-effort.

export interface Env {
  GHL_WEBHOOK_URL: string;
  CONVEX_ADMIN_KEY: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  CONVEX_TIMEOUT_MS?: number;
  META_CAPI_TOKEN?: string;
  META_CAPI_TEST_EVENT_CODE?: string;
  META_LEADGEN_VERIFY_TOKEN?: string;
  META_APP_SECRET?: string;
  META_PAGE_TOKEN?: string;
  V1_API_KEY?: string;
}

export interface BaseLeadPayload {
  phone?: string;
  state?: string;
}

export interface IulLeadPayload extends BaseLeadPayload {
  name?: string;
  email?: string;
  smsConsent?: boolean;
  termsConsent?: boolean;
}

export interface FinalExpenseLeadPayload extends BaseLeadPayload {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string | null;
  coverageAmount?: string | null;
  tcpaConsent?: boolean;
}

export interface IulCompassLeadPayload extends BaseLeadPayload {
  tool?: string;
  profile?: {
    age?: number | string;
    income?: number | string;
    premium?: number | string;
    years?: number | string;
    posture?: string;
  };
  lead?: {
    name?: string;
    email?: string;
    phone?: string;
    consent?: boolean;
  };
}

export type LeadPayload = IulLeadPayload & FinalExpenseLeadPayload & IulCompassLeadPayload;

export interface ShapedLead {
  product: string;
  source: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  notes: string;
  ghlPayload: Record<string, unknown>;
  /** Optional extra segments shown after the phone in the Telegram alert; empty values are skipped. */
  alertDetails?: string[];
}

const CONVEX_MUTATION_URL = "https://rapid-hummingbird-980.convex.cloud/api/mutation";
const CONVEX_QUERY_URL = "https://rapid-hummingbird-980.convex.cloud/api/query";
const GHL_TIMEOUT_MS = 5_000;
const TELEGRAM_TIMEOUT_MS = 5_000;
const CAPI_TIMEOUT_MS = 5_000;

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
export { json };

export function generateEventId(): string {
  return crypto.randomUUID();
}

export function convexTimeoutMs(env: Env): number {
  const raw = Number(env.CONVEX_TIMEOUT_MS);
  if (Number.isFinite(raw) && raw >= 1_000 && raw <= 60_000) return raw;
  return 15_000;
}

// SHA-256 hex digest — used for CAPI hashing. CF Workers >=2023 ship
// the Web Crypto API; this is a zero-dependency thin wrapper.
async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// Best-effort HTTP helpers
// ---------------------------------------------------------------------------

interface TimedResponse {
  res: Response;
  done: () => void;
}

async function postWithTimeout(
  url: string,
  body: unknown,
  timeoutMs: number,
  authHeader?: string,
): Promise<TimedResponse> {
  const controller = new AbortController();
  const timer = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : null;
  const done = () => {
    if (timer) clearTimeout(timer);
  };
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authHeader) headers.Authorization = authHeader;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return { res, done };
  } catch (err) {
    done();
    throw err;
  }
}

export type SafePostResult = { ok: boolean; res?: Response; error?: string };

export async function safePost(
  url: string,
  body: unknown,
  timeoutMs: number,
  authHeader?: string,
): Promise<SafePostResult> {
  try {
    const timed = await postWithTimeout(url, body, timeoutMs, authHeader);
    try {
      if (timed.res.ok) return { ok: true, res: timed.res };
      const error = `${timed.res.status} ${await timed.res.text().catch(() => "")}`;
      return { ok: false, error };
    } finally {
      timed.done();
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export type ConvexPostResult = {
  ok: boolean;
  res?: Response;
  convexId?: string | null;
  error?: string;
};

async function postConvex(
  url: string,
  args: unknown,
  timeoutMs: number,
  authHeader: string,
): Promise<ConvexPostResult> {
  try {
    const timed = await postWithTimeout(url, args, timeoutMs, authHeader);
    try {
      let data: unknown = null;
      try { data = await timed.res.json(); } catch { /* non-JSON */ }
      const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
      if (obj && obj.status === "success") {
        return { ok: true, res: timed.res, convexId: extractConvexId(obj) };
      }
      const errorDetail =
        obj && typeof obj.errorMessage === "string" ? obj.errorMessage
          : obj && typeof obj.message === "string" ? obj.message
          : obj && typeof obj.error === "string" ? obj.error
          : `${timed.res.status} ${JSON.stringify(data ?? "")}`;
      return { ok: false, error: `convex mutation failed: ${errorDetail}` };
    } finally {
      timed.done();
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function extractConvexId(obj: Record<string, unknown>): string | null {
  const value = obj.value;
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "_id" in (value as Record<string, unknown>) && typeof (value as Record<string, unknown>)._id === "string") {
    return (value as Record<string, unknown>)._id as string;
  }
  if (typeof obj._id === "string") return obj._id;
  return null;
}

// ---------------------------------------------------------------------------
// Shape builder
// ---------------------------------------------------------------------------

function buildCompassProfileLine(body: LeadPayload): string {
  if (body.tool !== "iul-compass" || !body.profile) return "";
  const p = body.profile;
  const parts: string[] = [];
  if (p.age !== undefined && p.age !== null && p.age !== "") parts.push(`Age ${p.age}`);
  if (p.income !== undefined && p.income !== null && p.income !== "") parts.push(`Income $${p.income}`);
  if (p.premium !== undefined && p.premium !== null && p.premium !== "") parts.push(`Premium $${p.premium}/yr`);
  if (p.years !== undefined && p.years !== null && p.years !== "") parts.push(`Horizon ${p.years}y`);
  if (p.posture) parts.push(`Posture ${p.posture}`);
  return parts.length ? `Profile: ${parts.join(" | ")}` : "";
}

export function buildLeadShape(body: LeadPayload): ShapedLead | { error: string } {
  if (body.tool === "iul-compass" && body.lead) {
    const name = body.lead.name?.trim() ?? "";
    const email = body.lead.email?.trim() ?? "";
    const phone = body.lead.phone?.trim() ?? "";
    const consent = Boolean(body.lead.consent);
    if (!name || !email || !consent) {
      return { error: "Missing required IUL Compass lead fields or consent." };
    }
    const p = body.profile ?? {};
    const notes = [
      `Email: ${email}`,
      ...["age","income","premium","years","posture"].map((f) => {
        const v = (p as Record<string,unknown>)[f];
        return v !== undefined && v !== null && v !== "" ? `${f.charAt(0).toUpperCase()+f.slice(1)}: ${v}` : `${f.charAt(0).toUpperCase()+f.slice(1)}: not provided`;
      }),
      "Form: iul-compass",
    ].join(" | ");
    return {
      product: "IUL", source: "dustinlife.com/iul-compass",
      fullName: name, email, phone, state: "", notes,
      ghlPayload: {
        source: "dustinlife.com/iul-compass", product: "IUL",
        name, full_name: name, email, phone,
        age: p.age, income: p.income, premium: p.premium, years: p.years, posture: p.posture,
        sms_consent: consent, terms_consent: consent, form_name: "iul-compass",
      },
    };
  }

  const isFinalExpense = Boolean(body.firstName || body.lastName || body.dob);
  if (isFinalExpense) {
    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const state = body.state?.trim() ?? "";
    const dob = body.dob?.trim() ?? "";
    if (!firstName || !lastName || !phone || !state || !dob || !body.tcpaConsent) {
      return { error: "Missing required final expense fields or consent." };
    }
    const fullName = `${firstName} ${lastName}`.trim();
    return {
      product: "Final Expense", source: "dustinlife.com/final-expense",
      fullName, email: "", phone, state,
      notes: `DOB: ${dob} | Form: final-expense`,
      ghlPayload: {
        source: "dustinlife.com/final-expense", product: "Final Expense",
        first_name: firstName, last_name: lastName, full_name: fullName,
        dob, gender: body.gender ?? "", coverage_amount: body.coverageAmount ?? "",
        state, phone, tcpa_consent: true, form_name: "final-expense",
      },
    };
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const state = body.state?.trim() ?? "";
  if (!name || !email || !phone || !state || !body.smsConsent || !body.termsConsent) {
    return { error: "Missing required IUL lead fields or consent." };
  }
  return {
    product: "IUL", source: "dustinlife.com",
    fullName: name, email, phone, state,
    notes: `Email: ${email} | Form: homepage-iul`,
    ghlPayload: {
      source: "dustinlife.com", product: "IUL",
      name, full_name: name, email, phone, state,
      sms_consent: true, terms_consent: true, form_name: "homepage-iul",
    },
  };
}

// ---------------------------------------------------------------------------
// Best-effort legs (GHL, Telegram, CAPI)
// ---------------------------------------------------------------------------

async function fireGhlBestEffort(env: Env, shaped: ShapedLead, convexId: string | null) {
  try {
    const result = await safePost(
      env.GHL_WEBHOOK_URL,
      { ...shaped.ghlPayload, timestamp: Date.now() },
      GHL_TIMEOUT_MS,
    );
    if (!result.ok) {
      console.error(`[lead] GHL webhook best-effort failed (convex id: ${convexId ?? "none"}): ${result.error}`);
    }
  } catch (err) {
    console.error(`[lead] GHL webhook best-effort threw (convex id: ${convexId ?? "none"}): ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function sendTelegramAlert(env: Env, shaped: ShapedLead, convexId: string | null, body?: LeadPayload) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[lead] Telegram alert skipped — TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not configured");
    return;
  }
  const formName = String(shaped.ghlPayload.form_name ?? "unknown");
  const name = shaped.fullName || String(shaped.ghlPayload.name ?? "");
  const details = (shaped.alertDetails ?? []).filter(Boolean).map((d) => ` | ${d}`).join("");
  const text = [
    `🔔 New lead — ${formName} | ${name} | ${shaped.phone}${details} | ${shaped.email}`,
    body ? buildCompassProfileLine(body) : "",
  ].filter(Boolean).join("\n");
  await sendTelegramText(env, text, convexId);
}

async function sendTelegramFailureAlert(env: Env, shaped: ShapedLead, convexId: string | null, error: string) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const formName = String(shaped.ghlPayload.form_name ?? "unknown");
  const name = shaped.fullName || String(shaped.ghlPayload.name ?? "");
  const text = `🚨 LEAD STORAGE FAILED — ${formName} | ${name} | ${shaped.phone} | ${shaped.email} | error: ${error}`;
  await sendTelegramText(env, text, convexId);
}

async function sendTelegramText(env: Env, text: string, convexId: string | null) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    const result = await safePost(
      `https://api.telegram.org/bot${token}/sendMessage`,
      { chat_id: chatId, text },
      TELEGRAM_TIMEOUT_MS,
    );
    if (!result.ok) {
      console.error(`[lead] Telegram alert best-effort failed (convex id: ${convexId ?? "none"}): ${result.error}`);
    }
  } catch (err) {
    console.error(`[lead] Telegram alert threw (convex id: ${convexId ?? "none"}): ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function fireCapiBestEffort(
  env: Env,
  eventId: string,
  eventSourceUrl: string,
  shaped: ShapedLead,
  convexId: string | null,
  requestHeaders: Headers | null,
) {
  const token = env.META_CAPI_TOKEN;
  if (!token) {
    console.warn("[lead] CAPI skipped — META_CAPI_TOKEN not configured");
    return;
  }
  try {
    const userData: Record<string, string> = {};
    if (shaped.email) userData.em = await sha256Hex(shaped.email.toLowerCase().trim());
    const digits = shaped.phone.replace(/\D/g, "");
    if (digits.length >= 10) {
      const last10 = digits.slice(-10);
      userData.ph = await sha256Hex(last10);
    }

    // Enrich with browser/client signals when request headers are available
    // (website forms only; Meta webhook has no end-user headers).
    if (requestHeaders) {
      const ip = requestHeaders.get("CF-Connecting-IP");
      if (ip) userData.client_ip_address = ip;

      const ua = requestHeaders.get("User-Agent");
      if (ua) userData.client_user_agent = ua;

      // fbp / fbc from browser cookies (Meta pixel sets these).
      const cookieHeader = requestHeaders.get("Cookie") ?? "";
      const fbp = cookieHeader.match(/_fbp=([^;]+)/);
      if (fbp) userData.fbp = fbp[1];
      const fbc = cookieHeader.match(/_fbc=([^;]+)/);
      if (fbc) userData.fbc = fbc[1];
    }

    if (Object.keys(userData).length === 0) {
      console.warn("[lead] CAPI skipped — no email or phone to hash");
      return;
    }
    const body: Record<string, unknown> = {
      data: [{
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: userData,
      }],
    };
    // Only include test_event_code when the env var is set (preview/staging).
    // In production this is unset → no test code → real CAPI events.
    if (env.META_CAPI_TEST_EVENT_CODE) {
      body.test_event_code = env.META_CAPI_TEST_EVENT_CODE;
    }
    const result = await safePost(
      `https://graph.facebook.com/v21.0/25947417544946778/events?access_token=${encodeURIComponent(token)}`,
      body,
      CAPI_TIMEOUT_MS,
    );
    if (!result.ok) {
      console.error(`[lead] CAPI best-effort failed (convex id: ${convexId ?? "none"}): ${result.error}`);
    }
  } catch (err) {
    console.error(`[lead] CAPI best-effort threw (convex id: ${convexId ?? "none"}): ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---------------------------------------------------------------------------
// Convex dedupe for Meta leadgen webhook
// ---------------------------------------------------------------------------

/**
 * Check whether a leadgen_id has already been inserted into Convex.
 * Searches the notes field of leads with source="FB Lead Ad" for the given
 * leadgen_id.  Best-effort: if Convex is unreachable we log and return false
 * (allow the insert) — Meta may re-send but the notes-based dedupe is itself
 * best-effort so an occasional double is acceptable over a dropped lead.
 *
 * TODO: Replace full-table list with indexed Convex query byMetaLeadgenId
 *       (mission-control repo, separate task) before scaling past ~20 leads/day.
 *       The current scan of up to 100k rows is O(n) per webhook call.
 */
export async function isDuplicateLeadgenId(env: Env, leadgenId: string): Promise<boolean> {
  try {
    const result = await safePost(
      CONVEX_QUERY_URL,
      { path: "insuranceLeads:list", args: { limit: 100000, apiKey: env.V1_API_KEY } },
      10_000,
      `Convex ${env.CONVEX_ADMIN_KEY}`,
    );
    if (!result.ok || !result.res) return false;
    const data = await result.res.json().catch(() => ({}));
    const rows: unknown[] =
      data?.value ?? [] as unknown[];
    if (!Array.isArray(rows)) return false;
    const needle = `leadgen_id:${leadgenId}`;
    return rows.some((r) => {
      if (typeof r !== "object" || r === null) return false;
      return String((r as Record<string, unknown>).notes ?? "").includes(needle);
    });
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Core pipeline
// ---------------------------------------------------------------------------

export interface LeadSubmissionOptions {
  /** Event source URL for CAPI — omit to skip CAPI (e.g. for FB Lead Ad source). */
  capiSourceUrl?: string;
  /** Optional lead body for Telegram alert profile enrichment. */
  originalBody?: LeadPayload;
  /** Request headers from the original HTTP request (for CAPI enrichment). */
  requestHeaders?: Headers;
}

export interface LeadSubmissionResult {
  success: boolean;
  convexId: string | null;
  eventId: string;
  error?: string;
}

/**
 * The central lead relay.  Convex is the must-land system of record;
 * GHL, Telegram and (optionally) CAPI fire in parallel as best-effort.
 * Callers: /api/lead (website forms) and /api/meta-leadgen (Meta webhook).
 */
export async function processLeadSubmission(
  env: Env,
  shaped: ShapedLead,
  mutationArgs: Record<string, unknown>,
  opts: LeadSubmissionOptions = {},
): Promise<LeadSubmissionResult> {
  const eventId = generateEventId();

  const convex = await postConvex(
    CONVEX_MUTATION_URL,
    { path: "insuranceLeads:create", args: mutationArgs },
    convexTimeoutMs(env),
    `Convex ${env.CONVEX_ADMIN_KEY}`,
  );

  if (!convex.ok) {
    console.error(`[lead] Convex write failed: ${convex.error}`);
    await Promise.all([
      fireGhlBestEffort(env, shaped, null),
      sendTelegramFailureAlert(env, shaped, null, convex.error ?? "unknown"),
    ]);
    return { success: false, convexId: null, eventId, error: convex.error ?? "unknown" };
  }

  const convexId = convex.convexId ?? null;

  const bestEffort: Promise<unknown>[] = [
    fireGhlBestEffort(env, shaped, convexId),
    sendTelegramAlert(env, shaped, convexId, opts.originalBody),
  ];

  if (opts.capiSourceUrl && shaped.source !== "FB Lead Ad") {
    bestEffort.push(fireCapiBestEffort(env, eventId, opts.capiSourceUrl, shaped, convexId, opts.requestHeaders ?? null));
  }

  await Promise.all(bestEffort);

  return { success: true, convexId, eventId };
}