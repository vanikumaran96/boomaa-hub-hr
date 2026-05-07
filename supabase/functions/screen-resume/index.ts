import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { resumeText, jobDescription, candidateName, position } = await req.json();

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 30) {
      return new Response(JSON.stringify({ error: "resumeText is required (min 30 chars)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 20) {
      return new Response(JSON.stringify({ error: "jobDescription is required (min 20 chars)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert technical recruiter. Compare a candidate's resume against a job description and produce a structured match assessment. Be objective, specific, and concise. Score strictly: 90+ only for near-perfect fit, 70-89 strong fit, 50-69 partial fit, <50 weak fit.`;

    const userPrompt = `JOB DESCRIPTION${position ? ` (Position: ${position})` : ""}:\n${jobDescription}\n\nCANDIDATE RESUME${candidateName ? ` (Candidate: ${candidateName})` : ""}:\n${resumeText}\n\nAnalyze the fit and call the function with your assessment.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_screening",
            description: "Submit the resume screening assessment.",
            parameters: {
              type: "object",
              properties: {
                matchScore: { type: "number", description: "Overall match score from 0 to 100" },
                recommendation: { type: "string", enum: ["strong_match", "good_match", "partial_match", "weak_match"] },
                summary: { type: "string", description: "2-3 sentence summary of fit" },
                matchedSkills: { type: "array", items: { type: "string" }, description: "Skills/requirements from JD that the candidate has" },
                missingSkills: { type: "array", items: { type: "string" }, description: "Skills/requirements from JD that the candidate lacks" },
                strengths: { type: "array", items: { type: "string" }, description: "Top 3-5 candidate strengths for this role" },
                concerns: { type: "array", items: { type: "string" }, description: "Top concerns or gaps (can be empty)" },
                yearsOfExperience: { type: "number", description: "Estimated total years of relevant experience" },
              },
              required: ["matchScore", "recommendation", "summary", "matchedSkills", "missingSkills", "strengths", "concerns", "yearsOfExperience"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_screening" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI did not return a structured response" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("screen-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
