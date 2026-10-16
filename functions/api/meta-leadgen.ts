// /api/meta-leadgen — Meta Lead Ads webhook receiver.
//
// GET  — Meta verification handshake (hub.mode / hub.verify_token / hub.challenge).
// POST — Leadgen change notification.  Validates X-Hub-Signature-256, fetches
//        lead details from the Meta Graph API, maps them to the shared lead
//        pipeline, and returns 200 immediately.  Convex/GHL/Telegram processing
//        continues in the background via waitUntil so Meta never sees a failure.
//
// Idempotency: dedupes on leadgen_id via a Convex notes-field check before insert.
// Each leadgen_id is only processed once.

import {
  type Env,
  type ShapedLead,
  json,
  processLeadSubmission,
  isDuplicateLeadgenId,
} from "@/lib/lead-pipeline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MetaWebhookEntry {
  id?: string;
  time?: number;
  changes?: Array<{
    field?: string;
    value?: Record<string, unknown>;
  }>;
}

interface MetaWebhookPayload {
  object?: string;
  entry?: MetaWebhookEntry[];
}

interface MetaLeadgenFieldData {
  name: string;
  values: string[];
}

interface MetaLeadgenResponse {
  id?: string;
  created_time?: string;
  field_data?: MetaLeadgenFieldData[];
  form_id?: string;
  ad_id?: string;
  campaign_id?: string;
  error?: { message: string; type: string };
}

// ---------------------------------------------------------------------------
// Signature validation
// ---------------------------------------------------------------------------

async function validateSignature(
  rawBody: string,
  appSecret: string,
  headers: Headers,
): Promise<boolean> {
  const sigHeader = headers.get("X-Hub-Signature-256");
  if (!sigHeader || !sigHeader.startsWith("sha256=")) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const expectedHex = sigHeader.slice(7);
  const expectedBytes = new Uint8Array(expectedHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
  return crypto.subtle.verify("HMAC", key, expectedBytes, encoder.encode(rawBody));
}

// ---------------------------------------------------------------------------
// Lead retrieval from Meta Graph API
// ---------------------------------------------------------------------------

async function fetchMetaLead(
  leadgenId: string,
  pageToken: string,
): Promise<MetaLeadgenResponse | null> {
  try {
    const url = `https://graph.facebook.com/v21.0/${leadgenId}?fields=field_data,created_time,form_id,ad_id,campaign_id&access_token=${encodeURIComponent(pageToken)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[meta-leadgen] Meta API fetch failed for ${leadgenId}: ${res.status}`);
      return null;
    }
    return (await res.json()) as MetaLeadgenResponse;
  } catch (err) {
    console.error(`[meta-leadgen] Meta API fetch error for ${leadgenId}: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Map Meta field_data → shaped lead
// ---------------------------------------------------------------------------

function mapToShapedLead(lead: MetaLeadgenResponse): ShapedLead | { error: string } {
  const fieldData = lead.field_data ?? [];

  const find = (name: string): string =>
    fieldData.find((f) => f.name === name)?.values?.[0] ?? "";

  // Meta's common field names for benefit / insurance / final expense lead forms.
  const fullName = find("full_name") || [find("first_name"), find("last_name")].filter(Boolean).join(" ").trim();
  const phone = find("phone_number") || find("phone") || "";
  const email = find("email") || "";
  const state = find("state") || find("region") || find("state_province") || "";
  const zip = find("zip_code") || find("zip") || "";
  const dob = find("date_of_birth") || find("dob") || "";

  if (!fullName || !phone) {
    return { error: "Missing required fields (full_name / phone) in leadgen data." };
  }

  const bestCallTime = find("best_call_time");
  const formId = lead.form_id ?? "";

  const notesParts: string[] = [];
  if (email) notesParts.push(`Email: ${email}`);
  if (dob) notesParts.push(`DOB: ${dob}`);
  if (zip) notesParts.push(`Zip: ${zip}`);
  if (bestCallTime) notesParts.push(`Best call: ${bestCallTime}`);
  notesParts.push(`Form: meta-leadgen | leadgen_id:${lead.id ?? "?"} | form_id:${formId}`);
  if (lead.ad_id) notesParts.push(`ad_id:${lead.ad_id}`);
  if (lead.campaign_id) notesParts.push(`campaign_id:${lead.campaign_id}`);

  return {
    product: "Final Expense",
    source: "FB Lead Ad",
    fullName,
    email,
    phone,
    state,
    notes: notesParts.join(" | "),
    ghlPayload: {
      source: "FB Lead Ad",
      product: "Final Expense",
      name: fullName,
      full_name: fullName,
      first_name: fullName.split(" ")[0] ?? "",
      last_name: fullName.split(" ").slice(1).join(" ") ?? "",
      email,
      phone,
      state,
      dob,
      tcpa_consent: true,
      form_name: "meta-leadgen",
      leadgen_id: lead.id ?? "",
      form_id: formId,
    },
  };
}

// ---------------------------------------------------------------------------
// Process all leadgen changes in a single Page webhook payload
// ---------------------------------------------------------------------------

async function processLeadgenChanges(env: Env, changes: Array<{ value?: Record<string, unknown> }>) {
  const pageToken = env.META_PAGE_TOKEN;
  if (!pageToken) {
    console.error("[meta-leadgen] META_PAGE_TOKEN not configured — cannot fetch leads");
    return;
  }

  for (const change of changes) {
    const leadgenId = change.value && typeof change.value === "object" && "leadgen_id" in change.value
      ? String(change.value.leadgen_id)
      : null;
    if (!leadgenId) continue;

    // Dedupe before fetching (avoid a Graph API call for known duplicates).
    const dup = await isDuplicateLeadgenId(env, leadgenId);
    if (dup) {
      console.log(`[meta-leadgen] leadgen_id ${leadgenId} already processed — skipping`);
      continue;
    }

    const lead = await fetchMetaLead(leadgenId, pageToken);
    if (!lead || lead.error) {
      console.error(`[meta-leadgen] failed to fetch leadgen_id ${leadgenId}: ${lead?.error?.message ?? "null body"}`);
      continue;
    }

    const shaped = mapToShapedLead(lead);
    if ("error" in shaped) {
      console.error(`[meta-leadgen] cannot shape leadgen_id ${leadgenId}: ${shaped.error}`);
      continue;
    }

    await processLeadSubmission(
      env,
      shaped,
      {
        source: shaped.source,
        fullName: shaped.fullName,
        phone: shaped.phone,
        state: shaped.state,
        product: shaped.product,
        notes: shaped.notes,
      },
      // No CAPI for FB Lead Ad source — these are Meta-native, not website.
      {},
    );
  }
}

// ---------------------------------------------------------------------------
// Page Function exports — called by Cloudflare
// ---------------------------------------------------------------------------

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const params = new URL(context.request.url).searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode !== "subscribe") {
    return json({ error: "Only hub.mode=subscribe is supported." }, 400);
  }

  const expectedToken = context.env.META_LEADGEN_VERIFY_TOKEN;
  if (!expectedToken) {
    return json({ error: "Server configuration error: META_LEADGEN_VERIFY_TOKEN not set." }, 500);
  }
  if (token !== expectedToken) {
    // Return 403 so Meta's test tool reports "Verify token mismatch".
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(challenge ?? "", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
  waitUntil?: (promise: Promise<unknown>) => void;
}): Promise<Response> {
  const rawBody = await context.request.text();

  // Verify signature upfront — reject bad requests before spending any cycles.
  const appSecret = context.env.META_APP_SECRET;
  if (!appSecret) {
    console.error("[meta-leadgen] META_APP_SECRET missing; cannot validate payload");
    return json({ error: "Server configuration error." }, 500);
  }
  const valid = await validateSignature(rawBody, appSecret, context.request.headers);
  if (!valid) {
    return json({ error: "Invalid signature." }, 403);
  }

  let payload: MetaWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as MetaWebhookPayload;
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  if (payload.object !== "page") {
    return json({ success: true, message: "Event type ignored." });
  }

  const entries = payload.entry ?? [];
  const changes = entries.flatMap((e) => e.changes ?? []).filter(
    (c) => c.field === "leadgen" && c.value,
  );

  // Process in the background so Meta gets a 200 immediately.
  if (changes.length > 0) {
    const p = processLeadgenChanges(context.env, changes);
    if (context.waitUntil) {
      context.waitUntil(p);
    } else {
      // Fire-and-forget in envs without waitUntil (e.g. local wrangler dev).
      p.catch((err) => console.error(`[meta-leadgen] background processing failed: ${err instanceof Error ? err.message : String(err)}`));
    }
  }

  return json({ success: true });
}