import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
  GeneratedPaperSchema,
  type Assignment,
  type GeneratedPaperSchemaType,
  type Question,
  type QuestionType,
  type Section,
} from "@vedaai/shared";
import { env, hasGemini } from "../config/env";
import { difficultySequence } from "./distribution";

const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  MCQ: "Multiple Choice Questions",
  ShortAnswer: "Short Answer Questions",
  LongAnswer: "Long Answer Questions",
  TrueFalse: "True / False",
  FillInTheBlanks: "Fill in the Blanks",
  DiagramGraph: "Diagram / Graph-Based Questions",
  NumericalProblem: "Numerical Problems",
};


const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    subject: { type: SchemaType.STRING },
    totalMarks: { type: SchemaType.NUMBER },
    duration: { type: SchemaType.STRING },
    sections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          instruction: { type: SchemaType.STRING },
          questions: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.STRING },
                text: { type: SchemaType.STRING },
                type: {
                  type: SchemaType.STRING,
                  enum: ["MCQ", "ShortAnswer", "LongAnswer", "TrueFalse", "FillInTheBlanks", "DiagramGraph", "NumericalProblem"],
                },
                difficulty: {
                  type: SchemaType.STRING,
                  enum: ["Easy", "Medium", "Hard"],
                },
                marks: { type: SchemaType.NUMBER },
                options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                answer: { type: SchemaType.STRING },
                explanation: { type: SchemaType.STRING },
              },
              required: ["id", "text", "type", "difficulty", "marks", "answer"],
            },
          },
        },
        required: ["id", "title", "instruction", "questions"],
      },
    },
  },
  required: ["title", "subject", "totalMarks", "duration", "sections"],
} as const;

export function buildPrompt(a: Assignment): string {
  const seq = difficultySequence(a.totalQuestions, a.difficultyDistribution);
  const diffSummary = `Easy: ${seq.filter((d) => d === "Easy").length}, Medium: ${seq.filter((d) => d === "Medium").length}, Hard: ${seq.filter((d) => d === "Hard").length}`;
  const typeLines = a.questionTypes
    .map((q) => `- ${q.count} × ${QUESTION_TYPE_LABEL[q.type]} (${q.marksEach} marks each)`)
    .join("\n");

  return `You are an expert exam-paper setter. Create a complete, original question paper.

SUBJECT: ${a.subject}
TOPIC: ${a.topic}
${a.description ? `CONTEXT: ${a.description}` : ""}
TOTAL QUESTIONS: ${a.totalQuestions}
TOTAL MARKS: ${a.totalMarks}
DIFFICULTY MIX (overall): ${diffSummary}

QUESTION BREAKDOWN:
${typeLines}
${a.additionalInstructions ? `\nADDITIONAL INSTRUCTIONS: ${a.additionalInstructions}` : ""}

RULES:
- Group questions into one section per question type, in the order listed above.
- Give each section a clear title and an instruction line.
- For MCQ questions, provide exactly 4 plausible options and set "answer" to the correct option text.
- For TrueFalse, options must be ["True", "False"].
- Every question MUST include "answer" (the answer key) and a short "explanation".
- Respect the requested counts, marks-per-question, and overall difficulty mix.
- "duration" should be a human label like "1 hour 30 minutes" sized to the paper.
- Use unique string ids for sections (s1, s2, ...) and questions (q1, q2, ...).
- Return ONLY JSON matching the provided schema. No markdown, no commentary.`;
}

async function generateWithGemini(assignment: Assignment): Promise<unknown> {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      
      responseSchema: responseSchema as any,
      temperature: 0.7,
    },
  });
  const result = await model.generateContent(buildPrompt(assignment));
  return JSON.parse(result.response.text());
}


function generateMock(assignment: Assignment): GeneratedPaperSchemaType {
  const diffSeq = difficultySequence(assignment.totalQuestions, assignment.difficultyDistribution);
  let globalIdx = 0;
  let qNum = 0;

  const sections: Section[] = assignment.questionTypes.map((cfg, sIdx) => {
    const questions: Question[] = [];
    for (let i = 0; i < cfg.count; i++) {
      const difficulty = diffSeq[globalIdx % diffSeq.length] ?? "Medium";
      globalIdx++;
      qNum++;
      const base: Question = {
        id: `q${qNum}`,
        type: cfg.type,
        difficulty,
        marks: cfg.marksEach,
        text:
          cfg.type === "FillInTheBlanks"
            ? `In ${assignment.topic}, ____ is a key concept (${difficulty.toLowerCase()}).`
            : `[${difficulty}] Explain concept #${i + 1} of "${assignment.topic}" in ${assignment.subject}.`,
        answer: `Sample answer for ${assignment.topic} question ${i + 1}.`,
        explanation: `This assesses understanding of ${assignment.topic} at a ${difficulty.toLowerCase()} level.`,
      };
      if (cfg.type === "MCQ") {
        base.options = ["Option A", "Option B", "Option C", "Option D"];
        base.answer = "Option A";
      } else if (cfg.type === "TrueFalse") {
        base.options = ["True", "False"];
        base.answer = "True";
        base.text = `[${difficulty}] Statement #${i + 1} about ${assignment.topic} is correct.`;
      }
      questions.push(base);
    }
    return {
      id: `s${sIdx + 1}`,
      title: `Section ${String.fromCharCode(65 + sIdx)}: ${QUESTION_TYPE_LABEL[cfg.type]}`,
      instruction: `Answer all ${cfg.count} questions. Each carries ${cfg.marksEach} mark(s).`,
      questions,
    };
  });

  const estMinutes = Math.max(30, assignment.totalMarks * 2);
  const duration =
    estMinutes >= 60
      ? `${Math.floor(estMinutes / 60)} hour${Math.floor(estMinutes / 60) > 1 ? "s" : ""}${estMinutes % 60 ? ` ${estMinutes % 60} minutes` : ""}`
      : `${estMinutes} minutes`;

  return {
    title: `${assignment.subject}: ${assignment.topic}`,
    subject: assignment.subject,
    totalMarks: assignment.totalMarks,
    duration,
    sections,
  };
}

export interface GenerateResult {
  paper: GeneratedPaperSchemaType;
  source: "gemini" | "mock";
  rawPrompt: string;
}


function normalizeQuestionType(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("mcq") || t.includes("choice") || t.includes("multiple")) return "MCQ";
  if (t.includes("short")) return "ShortAnswer";
  if (t.includes("long")) return "LongAnswer";
  if (t.includes("true") || t.includes("false")) return "TrueFalse";
  if (t.includes("blank")) return "FillInTheBlanks";
  if (t.includes("diagram") || t.includes("graph")) return "DiagramGraph";
  if (t.includes("numerical") || t.includes("math") || t.includes("problem")) return "NumericalProblem";
  return type;
}

function normalizeDifficulty(diff: string): string {
  const d = diff.toLowerCase();
  if (d.includes("easy")) return "Easy";
  if (d.includes("hard")) return "Hard";
  return "Medium";
}

export async function generatePaper(assignment: Assignment): Promise<GenerateResult> {
  const rawPrompt = buildPrompt(assignment);

  if (!hasGemini) {
    return { paper: generateMock(assignment), source: "mock", rawPrompt };
  }

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await generateWithGemini(assignment) as any;
      
      
      if (raw && typeof raw === "object" && Array.isArray(raw.sections)) {
        for (const section of raw.sections) {
          if (section && typeof section === "object" && Array.isArray(section.questions)) {
            for (const q of section.questions) {
              if (q && typeof q === "object") {
                if (typeof q.type === "string") {
                  q.type = normalizeQuestionType(q.type);
                }
                if (typeof q.difficulty === "string") {
                  q.difficulty = normalizeDifficulty(q.difficulty);
                }
              }
            }
          }
        }
      }

      const parsed = GeneratedPaperSchema.safeParse(raw);
      if (parsed.success) {
        return { paper: parsed.data, source: "gemini", rawPrompt };
      }
      lastError = parsed.error;
    } catch (err) {
      lastError = err;
    }
  }
  console.error("[gemini] generation failed, falling back to mock:", lastError);
  return { paper: generateMock(assignment), source: "mock", rawPrompt };
}
