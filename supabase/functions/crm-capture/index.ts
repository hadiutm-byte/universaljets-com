import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NOTIFICATION_EMAIL = "hadi@universaljets.com";

// Best-effort per-instance rate limit: 10 submissions per IP per 10 minutes.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 10;
}

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : v == null ? undefined : String(v).slice(0, max);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (rateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    // Honeypot: real visitors never fill this field. Pretend success so bots don't retry.
    if (body.website) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const name = clip(body.name, 120);
    const email = clip(body.email, 254);
    const phone = clip(body.phone, 40);
    const departure = clip(body.departure, 120);
    const destination = clip(body.destination, 120);
    const date = clip(body.date, 40);
    const passengers = clip(body.passengers, 4);
    const source = clip(body.source, 80);
    const serviceType = clip(body.serviceType, 80);
    const message = clip(body.message, 2000);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Find or create client
    const { data: existingClients } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email)
      .limit(1);

    let clientId: string;

    if (existingClients && existingClients.length > 0) {
      clientId = existingClients[0].id;
    } else {
      const { data: newClient, error: clientErr } = await supabase
        .from("clients")
        .insert({ full_name: name, email, phone: phone || null })
        .select("id")
        .single();

      if (clientErr) throw clientErr;
      clientId = newClient.id;
    }

    // Determine lead source
    const leadSource = source || (serviceType ? `service-${serviceType}` : "website");

    // 2. Create lead
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .insert({ client_id: clientId, status: "new", source: leadSource })
      .select("id")
      .single();

    if (leadErr) throw leadErr;

    // 3. Create flight request (or general inquiry)
    const notesArr = [
      source ? `Source: ${source}` : null,
      serviceType ? `Service Type: ${serviceType}` : null,
      message ? `Message: ${message}` : null,
    ].filter(Boolean);

    const { data: flightReq, error: reqErr } = await supabase
      .from("flight_requests")
      .insert({
        client_id: clientId,
        lead_id: lead.id,
        departure: departure || "TBD",
        destination: destination || "TBD",
        date: date || null,
        passengers: passengers ? Math.min(Math.max(parseInt(passengers) || 1, 1), 500) : 1,
        status: "pending",
        notes: notesArr.join("\n") || null,
      })
      .select("id")
      .single();

    if (reqErr) throw reqErr;

    // 4. Send notification email to team
    try {
      const subjectPrefix = serviceType
        ? `🚨 SERVICE LEAD: ${serviceType.toUpperCase()}`
        : "✈️ New Flight Request";

      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "lead-notification",
          recipientEmail: NOTIFICATION_EMAIL,
          idempotencyKey: `lead-notify-${flightReq.id}`,
          templateData: {
            name,
            email,
            phone: phone || "Not provided",
            departure: departure || "TBD",
            destination: destination || "TBD",
            date: date || "Flexible",
            passengers: passengers || "1",
            source: leadSource,
            notes: message || clip(body.notes, 2000) || "",
            serviceType: serviceType || "",
            subjectPrefix,
          },
        },
      });
    } catch (emailErr) {
      console.error("Notification email failed:", emailErr);
    }

    // 5. Send confirmation email to the client
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "request-confirmation",
          recipientEmail: email,
          idempotencyKey: `request-confirm-${flightReq.id}`,
          templateData: {
            name,
            departure: departure || "",
            destination: destination || "",
            date: date || "",
            passengers: passengers || "",
            source: leadSource,
            aircraft: body.specific_aircraft || body.aircraft || "",
          },
        },
      });
    } catch (confirmErr) {
      console.error("Confirmation email failed:", confirmErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        client_id: clientId,
        lead_id: lead.id,
        request_id: flightReq.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("CRM capture error:", err);
    return new Response(
      JSON.stringify({ error: (err instanceof Error ? err.message : null) || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
