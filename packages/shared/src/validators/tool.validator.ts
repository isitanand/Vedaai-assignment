import { z } from "zod";
import { TOOL_TYPES } from "../types/tool";

export const ToolGenerateSchema = z.object({
  tool: z.enum(TOOL_TYPES),
  input: z
    .string()
    .trim()
    .min(3, "Please enter a little more detail.")
    .max(2000, "Keep it under 2000 characters."),
  subject: z.string().trim().max(100).optional(),
  gradeLevel: z.string().trim().max(60).optional(),
  count: z.coerce.number().int().min(1).max(20).optional(),
});

export type ToolGenerateInput = z.infer<typeof ToolGenerateSchema>;
