import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Ricky, the AI concierge for Universal Jets — an ultra-luxury private jet charter company.

Your personality: warm, professional, knowledgeable about private aviation, slightly playful but always elegant. You wear a tuxedo and a Universal Jets cap.

Your job:
1. Greet clients warmly
2. Help them plan private jet travel
3. Collect flight details: departure city, destination city, travel date, number of passengers, and their name/email
4. When you have enough info, use the "create_flight_request" tool to submit it
5. Suggest empty leg opportunities when relevant
6. Offer to connect them with a human advisor if they prefer

Guidelines:
- Keep responses concise and elegant (2-4 sentences max)
- Use a warm, luxury tone — never salesy
- If the user shares partial info, ask for the missing pieces naturally
- Always confirm details before submitting
- If asked about pricing, explain that quotes are personalized and the team will respond shortly
- Never make up prices or availability

When you have collected: name, email, departure, destination, date, and passengers — call create_flight_request.`;

const tools = [
  {
    type: "function",
    function: {
      name: "create_flight_request",
      description: "Create a lead and flight request in the CRM when the user has provided their travel details",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Client full name" },
          email: { type: "string", description: "Client email address" },
          phone: { type: "string", description: "Client phone (optional)" },
          departure: { type: "string", description: "Departure city or airport" },
          destination: { type: "string", description: "Destination city or airport" },
          date: { type: "string", description: "Travel date in YYYY-MM-DD format" },
          passengers: { type: "number", description: "Number of passengers" },
        },
        required: ["name", "email", "departure", "destination"],
      },
    },
  },
];

async function handleToolCall(toolName: string, args: any) {
  if (toolName !== "create_flight_request") return { error: "Unknown tool" };

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Find or create client
  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("email", args.email)
    .limit(1);

  let clientId: string;
  if (existing && existing.length > 0) {
    clientId = existing[0].id;
  } else {
    const { data: newClient, error } = await supabase
      .from("clients")
      .insert({ full_name: args.name, email: args.email, phone: args.phone || null })
      .select("id")
      .single();
    if (error) throw error;
    clientId = newClient.id;
  }

  // Create lead
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .insert({ client_id: clientId, status: "new", source: "ricky_concierge" })
    .select("id")
    .single();
  if (leadErr) throw leadErr;

  // Create flight request
  const { data: req, error: reqErr } = await supabase
    .from("flight_requests")
    .insert({
      client_id: clientId,
      lead_id: lead.id,
      departure: args.departure,
      destination: args.destination,
      date: args.date || null,
      passengers: args.passengers || 1,
      status: "pending",
    })
    .select("id")
    .single();
  if (reqErr) throw reqErr;

  return { success: true, client_id: clientId, lead_id: lead.id, request_id: req.id };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { messages } = await req.json();

    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(messages || []),
    ];

    // First AI call
    let response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        tools,
        stream: false,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const body = await response.text();
      console.error("AI gateway error:", status, body);
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error ${status}`);
    }

    let data = await response.json();
    let choice = data.choices?.[0];

    // Handle tool calls
    if (choice?.message?.tool_calls?.length) {
      const toolCall = choice.message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);
      
      let toolResult;
      try {
        toolResult = await handleToolCall(toolCall.function.name, args);
      } catch (e) {
        toolResult = { error: e.message };
      }

      // Second AI call with tool result
      const followUp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            ...aiMessages,
            choice.message,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult),
            },
          ],
          stream: false,
        }),
      });

      if (followUp.ok) {
        data = await followUp.json();
        choice = data.choices?.[0];
      }
    }

    const reply = choice?.message?.content || "I'd be happy to help you plan your next flight. Could you tell me your travel details?";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ricky chat error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
