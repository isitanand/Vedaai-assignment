import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ToolGenerateInput, ToolGenerateResult } from "@vedaai/shared";
import { env, hasGemini } from "../config/env";


export function buildToolPrompt(req: ToolGenerateInput): string {
  const ctx = [
    req.subject ? `Subject: ${req.subject}` : "",
    req.gradeLevel ? `Grade / level: ${req.gradeLevel}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const ctxBlock = ctx ? `\n${ctx}\n` : "\n";

  switch (req.tool) {
    case "quiz": {
      const n = req.count ?? 5;
      return `You are an expert teacher. Create a ${n}-question multiple-choice quiz on the topic below.
${ctxBlock}TOPIC: ${req.input}

RULES:
- Number each question.
- Give exactly four options labelled (a)–(d).
- After all questions, add an "Answer Key" section listing the correct option letter for each.
- Keep questions clear and grade-appropriate. Use plain text (no markdown tables).`;
    }
    case "concept": {
      return `You are a patient, expert teacher. Explain the concept below so a student can understand it.
${ctxBlock}CONCEPT: ${req.input}

RULES:
- Start with a one-sentence simple definition.
- Then explain in 2–4 short paragraphs, building intuition.
- Include one concrete real-world example or analogy.
- End with a short "Key points" list of 3–5 bullets.
- Keep the tone encouraging and the language grade-appropriate.`;
    }
    case "doubt": {
      return `You are a helpful tutor. Solve the student's question with a clear, step-by-step explanation.
${ctxBlock}QUESTION: ${req.input}

RULES:
- Restate what is being asked in one line.
- Show the reasoning in numbered steps.
- State the final answer clearly on its own line, prefixed with "Answer:".
- If the question is conceptual rather than numeric, give a structured explanation instead of steps.`;
    }
    default: {
      
      const _never: never = req.tool;
      return _never;
    }
  }
}

async function generateWithGemini(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
    generationConfig: { temperature: 0.7 },
  });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}


function generateMock(req: ToolGenerateInput): string {
  const topic = req.input;
  const subject = req.subject ? ` (${req.subject})` : "";

  switch (req.tool) {
    case "quiz": {
      const n = req.count ?? 5;
      const lines: string[] = [`Quiz: ${topic}${subject}`, ""];
      for (let i = 1; i <= n; i++) {
        lines.push(
          `${i}. Sample question ${i} about "${topic}".`,
          `   (a) Option A`,
          `   (b) Option B`,
          `   (c) Option C`,
          `   (d) Option D`,
          ""
        );
      }
      lines.push("Answer Key");
      for (let i = 1; i <= n; i++) lines.push(`${i}. (a)`);
      return lines.join("\n");
    }
    case "concept":
      return [
        `${topic}${subject} — Explanation`,
        "",
        `In simple terms, "${topic}" is a core idea that connects several smaller concepts.`,
        "",
        `Think of it like a familiar everyday situation: once you see the pattern, the rest follows naturally. Building from the basics, each part supports the next so the whole picture makes sense.`,
        "",
        "Key points",
        `• "${topic}" has a clear, definable meaning.`,
        "• It builds on simpler ideas you already know.",
        "• A real-world example makes it easier to remember.",
        "",
        "(This is sample output — set GEMINI_API_KEY for full AI explanations.)",
      ].join("\n");
    case "doubt":
      return [
        `Question: ${topic}`,
        "",
        "Step 1. Identify what is being asked.",
        "Step 2. Note the relevant rule or formula.",
        "Step 3. Apply it carefully to the given values.",
        "Step 4. Simplify to reach the result.",
        "",
        "Answer: (sample) — set GEMINI_API_KEY for a full worked solution.",
      ].join("\n");
    default: {
      const _never: never = req.tool;
      return _never;
    }
  }
}

export async function runTool(req: ToolGenerateInput): Promise<ToolGenerateResult> {
  if (!hasGemini) {
    return { text: generateMock(req), source: "mock" };
  }
  try {
    const text = await generateWithGemini(buildToolPrompt(req));
    if (text) return { text, source: "gemini" };
    return { text: generateMock(req), source: "mock" };
  } catch (err) {
    console.error("[tools] generation failed, falling back to mock:", err);
    return { text: generateMock(req), source: "mock" };
  }
}
