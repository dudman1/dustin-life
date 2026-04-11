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
  // Add KV / D1 bindings here if needed
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

    // ── PLACEHOLDER: Dual-write logic ──
    // TODO: Phoenix webhook URL goes here
    // const PHOENIX_WEBHOOK = context.env.PHOENIX_LEAD_WEBHOOK;
    //
    // await fetch(PHOENIX_WEBHOOK, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(body),
    // });

    // TODO: Write to D1 or KV
    // await context.env.LEADS_KV.put(
    //   `lead:${Date.now()}`,
    //   JSON.stringify(body)
    // );

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
