import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NOTIFICATION_EMAIL = "hadi@universaljets.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, email, phone, departure, destination, date, passengers, source } = body;

    if (!name || !email || !departure || !destination) {
      return new Response(JSON.stringify({ error: "Name, email, departure, and destination are required" }), {
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
    const leadSource = source || "website";

    // 2. Create lead
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .insert({ client_id: clientId, status: "new", source: leadSource })
      .select("id")
      .single();

    if (leadErr) throw leadErr;

    // 3. Create flight request (or general inquiry)
    const { data: flightReq, error: reqErr } = await supabase
      .from("flight_requests")
      .insert({
        client_id: clientId,
        lead_id: lead.id,
        departure,
        destination,
        date: date || null,
        passengers: passengers ? parseInt(passengers) : 1,
        status: "pending",
        notes: source ? `Source: ${source}` : null,
      })
      .select("id")
      .single();

    if (reqErr) throw reqErr;

    // 4. Send notification email to hadi@universaljets.com
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "lead-notification",
          recipientEmail: NOTIFICATION_EMAIL,
          idempotencyKey: `lead-notify-${flightReq.id}`,
          templateData: {
            name,
            email,
            phone: phone || "Not provided",
            departure,
            destination,
            date: date || "Flexible",
            passengers: passengers || "1",
            source: leadSource,
            notes: body.notes || "",
          },
        },
      });
    } catch (emailErr) {
      // Don't fail the capture if email notification fails
      console.error("Notification email failed:", emailErr);
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
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
