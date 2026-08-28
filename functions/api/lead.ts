// Cloudflare Pages Function — /api/lead
// Supports both homepage IUL leads and /final-expense leads.

interface Env {
  GHL_WEBHOOK_URL: string;
  CONVEX_ADMIN_KEY: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  CONVEX_TIMEOUT_MS?: number;
}

interface BaseLeadPayload {
  phone?: string;
  state?: string;
}

interface IulLeadPayload extends BaseLeadPayload {
  name?: string;
  email?: string;
  smsConsent?: boolean;
  termsConsent?: boolean;
}

interface FinalExpenseLeadPayload extends BaseLeadPayload {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string | null;
  coverageAmount?: string | null;
  tcpaConsent?: boolean;
}

interface IulCompassLeadPayload extends BaseLeadPayload {
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

type LeadPayload = IulLeadPayload & FinalExpenseLeadPayload & IulCompassLeadPayload;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

interface ShapedLead {
  product: string;
  source: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  notes: string;
  ghlPayload: Record<string, unknown>;
}

const CONVEX_MUTATION_URL = "https://rapid-hummingbird-980.convex.cloud/api/mutation";
const GHL_TIMEOUT_MS = 5_000;
const TELEGRAM_TIMEOUT_MS = 5_000;
// Convex is awaited with a bounded timeout. 15s is generous for a healthy
// write (E2E ~sub-second) while keeping the ad-traffic page from hanging on a
// dead Convex. Overridable via CONVEX_TIMEOUT_MS — but sanitized: NaN/strings
// and absurd values (outside 1000..60000) fall back to the default so a garbage
// env var can't make every lead time out.
function convexTimeoutMs(env: Env): number {
  const raw = Number(env.CONVEX_TIMEOUT_MS);
  if (Number.isFinite(raw) && raw >= 1_000 && raw <= 60_000) return raw;
  return 15_000;
}

interface TimedResponse {
  res: Response;
  done: () => void;
}

// POST with an optional AbortController timeout. The abort timer stays armed
// THROUGH the body read: headers arriving is not the same as the body arriving,
// and a peer that sends headers then stalls mid-body must still be cut off by
// the timeout. done() clears the timer — call it after the body has been
// consumed (fetch-error path clears it before rethrowing).
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
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return { res, done };
  } catch (err) {
    done();
    throw err;
  }
}

// A best-effort POST result: ok:true only when the remote returned a 2xx.
// Non-discriminated on purpose — narrows cleanly with or without strict mode.
type SafePostResult = { ok: boolean; res?: Response; error?: string };

// A best-effort POST: never throws. Resolves ok:true only when the remote
// returned a 2xx; anything else (network error, timeout abort, non-2xx) becomes
// { ok: false, error } with the details for logging.
async function safePost(
  url: string,
  body: unknown,
  timeoutMs: number,
  authHeader?: string,
): Promise<SafePostResult> {
  try {
    const timed = await postWithTimeout(url, body, timeoutMs, authHeader);
    try {
      // Body read happens under the still-armed timer.
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

// A best-effort POST result for the Convex leg. Convex /api/mutation can return
// HTTP 200 with {"status":"error"} on a LOGICAL failure — so unlike GHL, we
// classify on the JSON envelope, not the HTTP status. Non-discriminated on
// purpose (narrows cleanly with or without strict mode).
type ConvexPostResult = {
  ok: boolean;
  res?: Response;
  convexId?: string | null;
  error?: string;
};

// POST to Convex /api/mutation. Success = parsed body has status:"success"
// (or the legacy flat {_id} shape). Any envelope error, missing success, or
// network/timeout failure resolves {ok:false, error}. Never throws.
async function postConvex(
  url: string,
  args: unknown,
  timeoutMs: number,
  authHeader: string,
): Promise<ConvexPostResult> {
  try {
    const timed = await postWithTimeout(
      url,
      { path: "insuranceLeads:create", args },
      timeoutMs,
      authHeader,
    );
    try {
      // Parse the body regardless of HTTP status — Convex reports logic errors
      // with 200 + status:"error". Body read happens under the still-armed
      // timer (an AbortError here falls into the failure path below).
      let data: unknown = null;
      try {
        data = await timed.res.json();
      } catch {
        // Non-JSON body — falls through to the "missing success" check below.
      }
      const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
      if (obj && obj.status === "success") {
        return { ok: true, res: timed.res, convexId: extractConvexId(obj) };
      }
      const errorDetail =
        obj && typeof obj.errorMessage === "string"
          ? obj.errorMessage
          : obj && typeof obj.message === "string"
            ? (obj.message as string)
            : obj && typeof obj.error === "string"
              ? (obj.error as string)
              : `${timed.res.status} ${JSON.stringify(data ?? "")}`;
      return { ok: false, error: `convex mutation failed: ${errorDetail}` };
    } finally {
      timed.done();
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// Extract the inserted lead id from Convex's wrapped response:
//   {"status":"success","value":"<id-string>"}   <- insuranceLeads:create (db.insert returns the Id)
//   {"status":"success","value":{_id:"..."}}     <- object-wrapped legacy
//   {"_id":"..."}                                <- flat legacy shape
function extractConvexId(obj: Record<string, unknown>): string | null {
  const value = obj.value;
  if (typeof value === "string") return value;
  if (
    value &&
    typeof value === "object" &&
    "_id" in (value as Record<string, unknown>) &&
    typeof (value as Record<string, unknown>)._id === "string"
  ) {
    return (value as Record<string, unknown>)._id as string;
  }
  if (typeof obj._id === "string") return obj._id;
  return null;
}

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

// GHL is best-effort: 5s timeout, everything caught, never throws.
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
    console.error(
      `[lead] GHL webhook best-effort threw (convex id: ${convexId ?? "none"}): ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// Telegram alert is best-effort: 5s timeout, everything caught, never throws.
async function sendTelegramAlert(env: Env, body: LeadPayload, shaped: ShapedLead, convexId: string | null) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[lead] Telegram alert skipped — TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not configured");
    return;
  }
  const formName = String(shaped.ghlPayload.form_name ?? "unknown");
  const name = shaped.fullName || String(shaped.ghlPayload.name ?? "");
  const text = [
    `🔔 New lead — ${formName} | ${name} | ${shaped.phone} | ${shaped.email}`,
    buildCompassProfileLine(body),
  ].filter(Boolean).join("\n");
  await sendTelegramText(env, text, convexId);
}

// Failure alert for the one moment paging matters most: the system of record
// rejected the lead. Same best-effort semantics — never throws.
async function sendTelegramFailureAlert(env: Env, shaped: ShapedLead, convexId: string | null, error: string) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[lead] Telegram failure alert skipped — TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not configured");
    return;
  }
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
    console.error(
      `[lead] Telegram alert threw (convex id: ${convexId ?? "none"}): ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

function buildLeadShape(body: LeadPayload): ShapedLead | { error: string } {
  // IUL Compass calculator (dustinlife.com/iul-compass) — carries a projection profile.
  if (body.tool === "iul-compass" && body.lead) {
    const name = body.lead.name?.trim() ?? "";
    const email = body.lead.email?.trim() ?? "";
    const phone = body.lead.phone?.trim() ?? "";
    const consent = Boolean(body.lead.consent);

    if (!name || !email || !consent) {
      return { error: "Missing required IUL Compass lead fields or consent." };
    }

    const p = body.profile ?? {};
    const age = p.age ?? "";
    const income = p.income ?? "";
    const premium = p.premium ?? "";
    const years = p.years ?? "";
    const posture = p.posture ?? "";

    const notes = [
      `Email: ${email}`,
      age ? `Age: ${age}` : "Age: not provided",
      income ? `Income: $${income}` : "Income: not provided",
      premium ? `Premium: $${premium}/yr` : "Premium: not provided",
      years ? `Horizon: ${years}y` : "Horizon: not provided",
      posture ? `Posture: ${posture}` : "Posture: not provided",
      "Form: iul-compass",
    ].join(" | ");

    return {
      product: "IUL",
      source: "dustinlife.com/iul-compass",
      fullName: name,
      email,
      phone,
      state: "",
      notes,
      ghlPayload: {
        source: "dustinlife.com/iul-compass",
        product: "IUL",
        name,
        full_name: name,
        email,
        phone,
        age,
        income,
        premium,
        years,
        posture,
        sms_consent: consent,
        terms_consent: consent,
        form_name: "iul-compass",
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
    const gender = body.gender?.trim() ?? "";
    const coverageAmount = body.coverageAmount?.trim() ?? "";

    if (!firstName || !lastName || !phone || !state || !dob || !body.tcpaConsent) {
      return { error: "Missing required final expense fields or consent." };
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const notes = [
      `DOB: ${dob}`,
      "Form: final-expense",
    ].join(" | ");

    return {
      product: "Final Expense",
      source: "dustinlife.com/final-expense",
      fullName,
      email: "",
      phone,
      state,
      notes,
      ghlPayload: {
        source: "dustinlife.com/final-expense",
        product: "Final Expense",
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        dob,
        gender: gender ?? "",
        coverage_amount: coverageAmount ?? "",
        state,
        phone,
        tcpa_consent: true,
        form_name: "final-expense",
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
    product: "IUL",
    source: "dustinlife.com",
    fullName: name,
    email,
    phone,
    state,
    notes: `Email: ${email} | Form: homepage-iul`,
    ghlPayload: {
      source: "dustinlife.com",
      product: "IUL",
      name,
      full_name: name,
      email,
      phone,
      state,
      sms_consent: true,
      terms_consent: true,
      form_name: "homepage-iul",
    },
  };
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  let body: LeadPayload;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  // Malformed body safety: bots/scanners send JSON null, arrays, or primitives.
  // buildLeadShape assumes a plain object — guard before it runs.
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ error: "Request body must be a JSON object." }, 400);
  }

  const shaped = buildLeadShape(body);
  if ("error" in shaped) {
    return json({ error: shaped.error }, 400);
  }

  const env = context.env;

  // 1. Convex is the must-land leg and the source of truth. Await it first with
  //    a bounded 15s timeout — a healthy write is sub-second; the cap keeps a
  //    live-ad page from hanging when Convex is down, and 15s is far past the
  //    point where aborting could mask a write that actually landed.
  const convex = await postConvex(
    CONVEX_MUTATION_URL,
    {
      source: shaped.source,
      fullName: shaped.fullName,
      phone: shaped.phone,
      state: shaped.state,
      product: shaped.product,
      notes: shaped.notes,
    },
    convexTimeoutMs(env),
    `Convex ${env.CONVEX_ADMIN_KEY}`,
  );

  if (!convex.ok) {
    // Convex failed — still fire GHL best-effort so the lead reaches the CRM,
    // but the request is an error: Convex is the system of record. Also page
    // Telegram: this is the one moment we must know a lead was lost.
    console.error(`[lead] Convex write failed: ${convex.error}`);
    await Promise.all([
      fireGhlBestEffort(env, shaped, null),
      sendTelegramFailureAlert(env, shaped, null, convex.error ?? "unknown"),
    ]);
    return json({ error: "Lead storage failed." }, 500);
  }

  const convexId = convex.convexId ?? null;

  // 2. GHL + Telegram in parallel — both best-effort with 5s timeouts, never
  //    fail the request. Parallel so the visitor sees 200 in ~max(leg), not
  //    ~sum(legs) — no double-submit window from a slow best-effort tail.
  await Promise.all([
    fireGhlBestEffort(env, shaped, convexId),
    sendTelegramAlert(env, body, shaped, convexId),
  ]);

  return json({ success: true, message: "Lead received." });
}

/*
---
*Last updated: 2026-04-16 20:45 ET | Updated by: Forge*
*/
