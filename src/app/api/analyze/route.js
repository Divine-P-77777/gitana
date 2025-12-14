import { NextResponse } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const githubToken = process.env.GITHUB_TOKEN_FINE;

const openai = new OpenAI({
    baseURL: endpoint,
    apiKey: githubToken,
});

export async function POST(req) {
    try {
        const { task, signals } = await req.json();

        // ------------------
        // Validation
        // ------------------
        if (!signals || typeof signals !== "object") {
            return NextResponse.json(
                { error: "Repository signals are required" },
                { status: 400 }
            );
        }

        if (!task || typeof task !== "string") {
            return NextResponse.json(
                { error: "Analysis task is required" },
                { status: 400 }
            );
        }

        let systemPrompt = "";
        let userPrompt = "";

        // ------------------
        // Task router
        // ------------------
        switch (task) {
            case "understanding":
                systemPrompt = `
You are Gitana, an AI software mentor.
Respond ONLY in valid JSON.
`;
                userPrompt = `
Based ONLY on the repository signals below, determine:
1. Project type
2. Maturity level (beginner / intermediate / advanced)
3. Whether it is production-ready

Repository Signals:
${JSON.stringify(signals, null, 2)}

Return JSON:
{
  "project_type": "",
  "maturity_level": "",
  "production_ready": true,
  "short_reason": ""
}
`;
                break;

            case "score":
                systemPrompt = `
You are an expert code reviewer.
`;
                userPrompt = `
Evaluate the repository using ONLY the signals below.

Scoring:
- Structure & organization (25)
- Documentation (15)
- Testing & maintainability (15)
- Version control practices (15)
- Real-world relevance (20)
- Tooling & automation (10)

Repository Signals:
${JSON.stringify(signals, null, 2)}

Return EXACTLY:
Score: XX / 100
`;
                break;

            case "summary":
                systemPrompt = `
You are a senior developer reviewing a student's project.
`;
                userPrompt = `
Write a short evaluation (2–3 sentences) covering:
- Key strengths
- Main weaknesses

Use ONLY these repository signals:
${JSON.stringify(signals, null, 2)}
`;
                break;

            case "roadmap":
                systemPrompt = `
You are a coding mentor.
`;
                userPrompt = `
Generate a personalized improvement roadmap.

Rules:
- Bullet points
- Actionable steps
- Highest-impact first
- Assume the developer is a student
- Use ONLY the given signals

Repository Signals:
${JSON.stringify(signals, null, 2)}
`;
                break;

            default:
                return NextResponse.json(
                    { error: "Unknown analysis task" },
                    { status: 400 }
                );
        }

        // ------------------
        // LLM call
        // ------------------
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4.1",
            messages: [
                { role: "system", content: systemPrompt.trim() },
                { role: "user", content: userPrompt.trim() },
            ],
            temperature: 0.2,
        });

        const output =
            response.choices?.[0]?.message?.content?.trim() || "";

        return NextResponse.json({
            success: true,
            task,
            output,
        });
    } catch (err) {
        console.error("Analyze API error:", err);
        return NextResponse.json(
            { success: false, error: "AI analysis failed" },
            { status: 500 }
        );
    }
}
