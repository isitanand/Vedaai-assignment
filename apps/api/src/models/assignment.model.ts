import { Schema, model, type InferSchemaType } from "mongoose";

const QuestionTypeConfigSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["MCQ", "ShortAnswer", "LongAnswer", "TrueFalse", "FillInTheBlanks", "DiagramGraph", "NumericalProblem"],
      required: true,
    },
    count: { type: Number, required: true },
    marksEach: { type: Number, required: true },
  },
  { _id: false }
);

const DifficultyDistributionSchema = new Schema(
  {
    easy: { type: Number, required: true },
    medium: { type: Number, required: true },
    hard: { type: Number, required: true },
  },
  { _id: false }
);

const AssignmentSchema = new Schema(
  {
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String, required: true },
    questionTypes: { type: [QuestionTypeConfigSchema], required: true },
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    difficultyDistribution: { type: DifficultyDistributionSchema, required: true },
    additionalInstructions: { type: String },
    fileContent: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "complete", "error"],
      default: "pending",
      index: true,
    },
    paperId: { type: String },
    jobId: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

AssignmentSchema.index({ createdAt: -1 });

export type AssignmentDoc = InferSchemaType<typeof AssignmentSchema>;
export const AssignmentModel = model("Assignment", AssignmentSchema);
