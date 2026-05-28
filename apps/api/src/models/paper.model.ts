import { Schema, model, type InferSchemaType } from "mongoose";

const QuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["MCQ", "ShortAnswer", "LongAnswer", "TrueFalse", "FillInTheBlanks", "DiagramGraph", "NumericalProblem"],
      required: true,
    },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    marks: { type: Number, required: true },
    options: { type: [String] },
    answer: { type: String },
    explanation: { type: String },
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false }
);

const PaperSchema = new Schema(
  {
    assignmentId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    duration: { type: String, required: true },
    sections: { type: [SectionSchema], required: true },
    rawPrompt: { type: String },
    generatedAt: { type: String, required: true },
  },
  { timestamps: true }
);

export type PaperDoc = InferSchemaType<typeof PaperSchema>;
export const PaperModel = model("Paper", PaperSchema);
