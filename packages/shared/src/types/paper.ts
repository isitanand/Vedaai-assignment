import type { QuestionType, Difficulty } from "./assignment";





export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  marks: number;
  options?: string[]; 
  answer?: string; 
  explanation?: string; 
}

export interface Section {
  id: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  title: string;
  subject: string;
  totalMarks: number;
  duration: string;
  sections: Section[];
  rawPrompt?: string;
  generatedAt: string;
}
