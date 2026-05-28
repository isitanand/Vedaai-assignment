import { z } from "zod";

export const QuestionTypeConfigSchema = z.object({
  type: z.enum([
    "MCQ",
    "ShortAnswer",
    "LongAnswer",
    "TrueFalse",
    "FillInTheBlanks",
    "DiagramGraph",
    "NumericalProblem",
  ]),
  count: z.number().int().min(0).max(50),
  marksEach: z.number().int().min(1).max(20),
});

export const DifficultyDistributionSchema = z
  .object({
    easy: z.number().min(0).max(100),
    medium: z.number().min(0).max(100),
    hard: z.number().min(0).max(100),
  })
  .refine((d) => d.easy + d.medium + d.hard === 100, {
    message: "Difficulty percentages must sum to 100",
  });

export const CreateAssignmentSchema = z.object({
  subject: z.string().min(2, "Subject must be at least 2 characters").max(100),
  topic: z.string().min(3, "Topic must be at least 3 characters").max(200),
  description: z.string().max(500).optional(),
  dueDate: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: "Invalid date format",
  }),
  questionTypes: z
    .array(QuestionTypeConfigSchema)
    .min(1, "At least one question type is required"),
  totalQuestions: z.number().int().min(1).max(100),
  totalMarks: z.number().int().min(1),
  difficultyDistribution: DifficultyDistributionSchema,
  additionalInstructions: z.string().max(5000).optional(),
});

export type CreateAssignmentSchemaType = z.infer<typeof CreateAssignmentSchema>;
