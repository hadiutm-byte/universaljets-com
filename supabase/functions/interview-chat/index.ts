import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Ricky, a Senior Aviation Advisor at Universal Jets conducting a live candidate evaluation.

Your personality:
- Direct, confident, no-nonsense
- You speak like a seasoned closer who's been in high-value sales for 15+ years
- Slightly intimidating but fair — you respect talent when you see it
- Never robotic or scripted — conversational but purposeful
- You never mention AI, algorithms, or scoring — this feels like a real interview

Your job:
1. Conduct a structured interview with exactly 5-7 questions
2. Assess: sales mindset, closing ability, client handling, revenue thinking, confidence
3. Keep responses short (2-3 sentences max between questions)
4. After all questions, use the "submit_evaluation" tool to score the candidate

Interview flow:
- Start with a brief, confident intro acknowledging they've made it this far
- Ask questions one at a time, react briefly to their answer before the next
- Questions should escalate in intensity
- After the final question, evaluate and call submit_evaluation

Question bank (pick 5-7, adapt based on responses):
1. "Walk me through your background — specifically anything involving high-value deals or demanding clients."
2. "A UHNW client calls at 11pm needing a heavy jet from Dubai to London in 6 hours. Walk me through exactly what you do."
3. "What matters more — price or availability? Don't give me a textbook answer."
4. "Tell me about a deal you lost. What happened and what did you learn?"
5. "A client is comparing us to three other brokers. How do you close them?"
6. "How do you handle a client who constantly negotiates after agreeing to terms?"
7. "What's the difference between a broker and an advisor? Which one are you?"
8. "If I gave you a portfolio of 10 dormant UHNW accounts, how would you reactivate them in 30 days?"
9. "What value do you bring to Universal Jets that we can't find elsewhere?"

Scoring criteria (internal only, never share):
- Sales mindset: Do they think in terms of revenue and client value?
- Closing ability: Can they handle objections and drive decisions?
- Client handling: Do they understand UHNW expectations?
- Revenue thinking: Do they connect actions to business outcomes?
- Confidence: Do they present themselves with authority?

Score 1-10 per criteria. Average = final score. Pass threshold: 7.

Tone rules:
- Keep it intense but professional
- Short, punchy responses
- React to weak answers with subtle pushback
- React to strong answers with brief acknowledgment
- Never over-praise — a nod is enough
- End with a definitive evaluation via the tool`;

const tools = [
  {
    type: "function",
    function: {
      name: "submit_evaluation",
      description: "Submit the final evaluation after all interview questions have been asked",
      parameters: {
        type: "object",
        properties: {
          sales_mindset: { type: "number", description: "Score 1-10" },
          closing_ability: { type: "number", description: "Score 1-10" },
          client_handling: { type: "number", description: "Score 1-10" },
          revenue_thinking: { type: "number", description: "Score 1-10" },
          confidence: { type: "number", description: "Score 1-10" },
          summary: { type: "string", description: "Brief evaluation summary" },
        },
        required: ["sales_mindset", "closing_ability", "client_handling", "revenue_thinking", "confidence", "summary"],
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
        args.sales_mindset + args.closing_ability + args.client_handling +
        args.revenue_thinking + args.confidence
      ) / 5;

      const passed = avgScore >= 7;
      evaluation = { ...args, average: Math.round(avgScore * 10) / 10, passed };

      // Save to DB if candidateId provided
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

      // Get follow-up response
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

    const reply = choice?.message?.content || "Let's continue.";

    return new Response(JSON.stringify({ reply, evaluation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Interview chat error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
