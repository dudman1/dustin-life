// Cloudflare Pages Function — /api/lead
// Supports both homepage IUL leads and /final-expense leads.

interface Env {
  GHL_WEBHOOK_URL: string;
  CONVEX_ADMIN_KEY: string;
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

type LeadPayload = IulLeadPayload & FinalExpenseLeadPayload;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildLeadShape(body: LeadPayload) {
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
  try {
    const body: LeadPayload = await context.request.json();
    const shaped = buildLeadShape(body);

    if ("error" in shaped) {
      return json({ error: shaped.error }, 400);
    }

    const GHL_WEBHOOK = context.env.GHL_WEBHOOK_URL;
    const CONVEX_KEY = context.env.CONVEX_ADMIN_KEY;
    const timestamp = Date.now();

    const [ghl, convex] = await Promise.all([
      fetch(GHL_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...shaped.ghlPayload,
          timestamp,
        }),
      }),
      fetch("https://rapid-hummingbird-980.convex.cloud/api/mutation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Convex ${CONVEX_KEY}`,
        },
        body: JSON.stringify({
          path: "insuranceLeads:create",
          args: {
            source: shaped.source,
            fullName: shaped.fullName,
            phone: shaped.phone,
            state: shaped.state,
            product: shaped.product,
            notes: shaped.notes,
          },
        }),
      }),
    ]);

    if (!ghl.ok) {
      const errorText = await ghl.text();
      throw new Error(`GHL webhook failed: ${ghl.status} ${errorText}`);
    }

    if (!convex.ok) {
      const errorText = await convex.text();
      throw new Error(`Convex mutation failed: ${convex.status} ${errorText}`);
    }

    return json({ success: true, message: "Lead received." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return json({ error: message }, 500);
  }
}

/*
---
*Last updated: 2026-04-16 20:45 ET | Updated by: Forge*
*/
