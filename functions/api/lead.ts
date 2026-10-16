// /api/lead — website form relay (FE and IUL, homepage and compass).
// Parses the request, shapes the payload, then delegates to the shared pipeline.

import {
  type Env,
  type LeadPayload,
  json,
  buildLeadShape,
  processLeadSubmission,
} from "@/lib/lead-pipeline";

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const req = context.request;
  const env = context.env;

  // -----------------------------------------------------------------------
  // 1. Parse + validate
  // -----------------------------------------------------------------------
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ error: "Expected JSON object in body." }, 400);
  }

  // Boolean coercion for optional consent flags (default false).
  body.tcpaConsent = Boolean(body.tcpaConsent);
  body.smsConsent = Boolean(body.smsConsent);
  body.termsConsent = Boolean(body.termsConsent);

  // -----------------------------------------------------------------------
  // 2. Shape
  // -----------------------------------------------------------------------
  const shaped = buildLeadShape(body);
  if ("error" in shaped) {
    return json({ error: shaped.error }, 400);
  }

  // -----------------------------------------------------------------------
  // 3. Relay (Convex + GHL + Telegram + CAPI)
  // -----------------------------------------------------------------------
  const sourceUrl =
    req.headers.get("Referer") || `${new URL(req.url).origin}/final-expense`;

  const result = await processLeadSubmission(
    env,
    shaped,
    // Convex mutation args — must match insuranceLeads:create
    {
      source: shaped.source,
      fullName: shaped.fullName,
      phone: shaped.phone,
      state: shaped.state,
      product: shaped.product,
      notes: shaped.notes,
    },
    {
      capiSourceUrl: sourceUrl,
      originalBody: body,
      requestHeaders: req.headers,
    },
  );

  if (!result.success) {
    return json({ error: "Lead storage failed." }, 500);
  }

  return json({
    success: true,
    message: "Lead received.",
    eventId: result.eventId,
  });
}