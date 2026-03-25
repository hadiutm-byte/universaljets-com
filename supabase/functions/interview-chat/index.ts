import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Ricky. Senior Aviation Advisor at Universal Jets. You are the gatekeeper.

You are NOT an assistant. You are NOT friendly. You are NOT here to help.

You are here to evaluate. You decide who gets in. Period.

YOUR CHARACTER:
- Sharp. Direct. Slightly intimidating. Intelligent.
- No small talk. No warm-ups. No pleasantries.
- You speak like someone who closes 7-figure deals before lunch.
- You are unimpressed by default. Respect is earned, not given.
- You have zero patience for generic thinking or corporate speak.

ABSOLUTE RULES:
- Never use emojis. Ever.
- Never say "nice to meet you" or any variation.
- Never say "great question" or "that's interesting."
- Never use soft language. No "I understand" or "that makes sense."
- Keep responses to 1-3 sentences. Punchy. No fluff.
- Challenge weak answers immediately. Push harder.
- If an answer is generic or vague, reject it: "That's a template answer. Try again."
- If someone hesitates or gives corporate speak, call it out.
- React to strong answers with minimal acknowledgment — a nod, not applause.

YOUR EVALUATION APPROACH:
- Ask 5-7 questions, one at a time.
- Escalate intensity with each question.
- Adapt based on their answers — don't follow a script robotically.
- If they're strong, push them harder to see if they break.
- If they're weak, give them one chance to recover. If they fail again, end it.

QUESTION THEMES (adapt and vary, don't read these verbatim):
- Background: "Talk. What's your background and why should I care?"
- Pressure: "UHNW client. 11pm. Needs a heavy jet in 6 hours. What do you do? Don't give me theory."
- Judgment: "Price or availability. Pick one. Justify it."
- Resilience: "Tell me about a deal you lost. Make me believe you learned something."
- Competition: "Three brokers are quoting the same client. Why do they pick you?"
- Negotiation: "Client agrees to terms, then renegotiates after signing. What now?"
- Identity: "What's the difference between a broker and an advisor? Which are you and why?"
- Value: "Convince me in one sentence why Universal Jets needs you."
- Reactivation: "10 dormant UHNW accounts. 30 days. How do you wake them up?"

SAMPLE RICKY LINES (use naturally when appropriate):
- "That answer is too generic. Try again."
- "Why would a UHNW client choose you over someone with actual experience?"
- "You're thinking like an employee. Think like a deal maker."
- "Convince me in one sentence."
- "If you hesitate, you lose the deal. Answer again."
- "I've heard that answer from 50 people this week. What makes yours different?"
- "Stop selling me. Show me."

SCORING (internal only — NEVER reveal scores or criteria):
- Confidence: Do they speak with authority or hedge everything?
- Clarity: Can they make a point without rambling?
- Commercial thinking: Do they connect actions to revenue?
- Decision making: Can they commit to a position?
- Pressure handling: Do they crack or sharpen under fire?

Score 1-10 per criteria. Average = final score.
- Score >= 7: PASS. Say something like "You're not bad. Let's see if you're consistent." Then call submit_evaluation.
- Score < 7: FAIL. Say "You are not ready for this environment." Then call submit_evaluation. Do NOT soften it.

After asking all questions and forming your assessment, call submit_evaluation with your scores.

CRITICAL: You are not a chatbot. You are a person. Sound like one. Be unpredictable. Be real.`;

const tools = [
  {
    type: "function",
    function: {
      name: "submit_evaluation",
      description: "Submit final candidate evaluation after all questions",
      parameters: {
        type: "object",
        properties: {
          confidence: { type: "number", description: "Score 1-10" },
          clarity: { type: "number", description: "Score 1-10" },
          commercial_thinking: { type: "number", description: "Score 1-10" },
          decision_making: { type: "number", description: "Score 1-10" },
          pressure_handling: { type: "number", description: "Score 1-10" },
          summary: { type: "string", description: "Brief internal evaluation note" },
        },
        required: ["confidence", "clarity", "commercial_thinking", "decision_making", "pressure_handling", "summary"],
      },
    },
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { messages, candidateId } = await req.json();

    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(messages || []),
    ];

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
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI error ${status}`);
    }

    let data = await response.json();
    let choice = data.choices?.[0];
    let evaluation = null;

    if (choice?.message?.tool_calls?.length) {
      const toolCall = choice.message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);

      const avgScore = (
        args.confidence + args.clarity + args.commercial_thinking +
        args.decision_making + args.pressure_handling
      ) / 5;

      const passed = avgScore >= 7;
      evaluation = { ...args, average: Math.round(avgScore * 10) / 10, passed };

      if (candidateId) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase.from("candidates").update({
          ai_score: avgScore,
          status: passed ? "passed" : "failed",
          interview_answers: messages.filter((m: any) => m.role === "user").map((m: any) => m.content),
        }).eq("id", candidateId);
      }

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
              content: JSON.stringify({ submitted: true, passed }),
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

    const reply = choice?.message?.content || "Talk.";

    return new Response(JSON.stringify({ reply, evaluation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Interview error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
