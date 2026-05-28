



export type QuestionType =
  | "MCQ"
  | "ShortAnswer"
  | "LongAnswer"
  | "TrueFalse"
  | "FillInTheBlanks"
  | "DiagramGraph"
  | "NumericalProblem";

export type AssignmentStatus = "pending" | "processing" | "complete" | "error";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface QuestionTypeConfig {
  type: QuestionType;
  count: number;
  marksEach: number;
}

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export interface Assignment {
  _id: string;
  subject: string;
  topic: string;
  description?: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
  additionalInstructions?: string;
  fileContent?: string;
  status: AssignmentStatus;
  paperId?: string;
  jobId?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentInput {
  subject: string;
  topic: string;
  description?: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  difficultyDistribution: DifficultyDistribution;
  additionalInstructions?: string;
}
