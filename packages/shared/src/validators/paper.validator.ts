import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  type: z.enum([
    "MCQ",
    "ShortAnswer",
    "LongAnswer",
    "TrueFalse",
    "FillInTheBlanks",
    "DiagramGraph",
    "NumericalProblem",
  ]),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  marks: z.number().int().min(1),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
  explanation: z.string().optional(),
});

export const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  instruction: z.string(),
  questions: z.array(QuestionSchema).min(1),
});

export const GeneratedPaperSchema = z.object({
  title: z.string(),
  subject: z.string(),
  totalMarks: z.number().int(),
  duration: z.string(),
  sections: z.array(SectionSchema).min(1),
});

export type GeneratedPaperSchemaType = z.infer<typeof GeneratedPaperSchema>;
