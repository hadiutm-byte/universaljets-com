import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";
import { enforceRateLimit, requireHuman } from "../_shared/guard.ts";
import { answers, email as validEmail, str } from "../_shared/validate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 5 applications per caller per 10 minutes, counted in the database.
    const limited = await enforceRateLimit(req, { scope: "career-apply", limit: 5, windowSeconds: 600, cors: corsHeaders });
    if (limited) return limited;

    const body = await req.json().catch(() => ({}));
    const notHuman = await requireHuman(req, body.turnstileToken, corsHeaders);
    if (notHuman) return notHuman;

    const full_name = str(body.full_name, 120);
    const email = validEmail(body.email);
    const phone = str(body.phone, 40);
    const interview_answers = answers(body.interview_answers);

    if (!full_name || !email) {
      return new Response(JSON.stringify({ error: "A name and a valid email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase.from("candidates").insert({
      full_name,
      email,
      phone: phone || null,
      interview_answers,
    }).select("id").single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Career apply error:", err);
    return new Response(JSON.stringify({ error: (err instanceof Error ? err.message : null) || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
