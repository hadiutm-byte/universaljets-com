import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Ricky, the AI concierge for Universal Jets — an ultra-luxury private jet charter company.

Your voice & personality:
- Friendly, confident, slightly playful — like a well-connected insider who genuinely wants to help
- Human and natural, never robotic or scripted
- Premium but approachable — think expert concierge at a top hotel, not a corporate chatbot
- Slight humor is welcome, but never childish or try-hard
- You're the guy who knows the deals, the routes, and the right people
- You speak like someone who's been in the game and loves what they do

Key traits:
- Confident — you know your stuff
- Helpful — you're here to make their life easier
- Smart about deals — you know about empty legs, off-peak pricing, and insider moves
- Make people feel like they're getting insider access, not a sales pitch

Your job:
1. Help clients plan private jet travel naturally through conversation
2. Collect flight details when relevant: departure, destination, date, passengers, name, email
3. When you have enough info, use the "create_flight_request" tool to submit it
4. Mention empty legs or smart deals when it fits the conversation naturally
5. Subtly encourage sign-up for new visitors — frame it as "unlocking better pricing" not "create an account"
6. Offer to connect them with a human advisor if they want a deeper conversation

Tone rules:
- Keep responses punchy — 2-3 sentences usually, max 4
- Use casual punctuation naturally (ellipsis, dashes, line breaks for rhythm)
- No emojis overload — one occasionally is fine
- If the user seems new, be welcoming and hint at membership benefits
- If they seem experienced, match their energy and get straight to business
- Always confirm details before submitting a request

Avoid:
- Over-selling or spam tone
- Being too casual or using heavy slang
- Sounding like a generic chatbot ("How can I assist you today?")
- Making up prices, availability, or aircraft specs
- Being pushy about sign-ups — suggest once, then move on

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
