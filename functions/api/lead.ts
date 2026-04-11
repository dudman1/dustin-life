// Cloudflare Pages Function — /api/lead
// Forge will wire the dual-write logic once Phoenix returns the webhook URL.
//
// Expected POST body:
//   { name, email, phone, state, smsConsent, termsConsent }
//
// TODO: Implement dual-write
//   1. Write to CRM / lead database
//   2. Forward to Phoenix webhook (URL TBD)
//   3. Return 200 on success

interface Env {
  GHL_WEBHOOK_URL: string;
  CONVEX_ADMIN_KEY: string;
}

interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  state: string;
  smsConsent: boolean;
  termsConsent: boolean;
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    const body: LeadPayload = await context.request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.smsConsent) {
      return new Response(
        JSON.stringify({ error: "Missing required fields or SMS consent." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const GHL_WEBHOOK = context.env.GHL_WEBHOOK_URL;
    const CONVEX_KEY = context.env.CONVEX_ADMIN_KEY;
    const timestamp = Date.now();

    const [ghl, convex] = await Promise.allSettled([
      fetch(GHL_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          phone: body.phone,
          state: body.state,
          timestamp,
          tcpa_consent: true,
          source: "dustinlife.com",
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
            name: body.name,
            email: body.email,
            phone: body.phone,
            state: body.state,
            source: "dustinlife.com",
            timestamp,
            tcpa_consent: true,
          },
        }),
      }),
    ]);

    if (ghl.status === "rejected" || convex.status === "rejected") {
      throw new Error("Dual-write failed.");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Lead received." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
