"use client";

import { create } from "zustand";
import type { QuestionTypeConfig } from "@vedaai/shared";

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function defaultQuestionTypes(): QuestionTypeConfig[] {
  return [
    { type: "MCQ", count: 4, marksEach: 1 },
    { type: "ShortAnswer", count: 3, marksEach: 2 },
    { type: "DiagramGraph", count: 5, marksEach: 5 },
    { type: "NumericalProblem", count: 5, marksEach: 5 },
  ];
}

interface AssignmentFormState {
  subject: string;
  topic: string;
  dueDate: string;
  fileText: string | null;
  additionalInstructions: string;
  questionTypes: QuestionTypeConfig[];
  difficultyDistribution: { easy: number; medium: number; hard: number };
  error: string | null;

  setSubject: (v: string) => void;
  setTopic: (v: string) => void;
  setDueDate: (v: string) => void;
  setFileText: (v: string | null) => void;
  setAdditionalInstructions: (v: string) => void;
  appendInstructions: (v: string) => void;
  setQuestionTypes: (v: QuestionTypeConfig[]) => void;
  setDifficultyDistribution: (v: { easy: number; medium: number; hard: number }) => void;
  setError: (v: string | null) => void;
  reset: () => void;
}

export const useAssignmentFormStore = create<AssignmentFormState>()((set) => ({
  subject: "",
  topic: "",
  dueDate: todayPlus(7),
  fileText: null,
  additionalInstructions: "",
  questionTypes: defaultQuestionTypes(),
  difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
  error: null,

  setSubject: (subject) => set({ subject }),
  setTopic: (topic) => set({ topic }),
  setDueDate: (dueDate) => set({ dueDate }),
  setFileText: (fileText) => set({ fileText }),
  setAdditionalInstructions: (additionalInstructions) => set({ additionalInstructions }),
  appendInstructions: (text) =>
    set((s) => ({ additionalInstructions: s.additionalInstructions ? `${s.additionalInstructions} ${text}` : text })),
  setQuestionTypes: (questionTypes) => set({ questionTypes }),
  setDifficultyDistribution: (difficultyDistribution) => set({ difficultyDistribution }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      subject: "",
      topic: "",
      dueDate: todayPlus(7),
      fileText: null,
      additionalInstructions: "",
      questionTypes: defaultQuestionTypes(),
      difficultyDistribution: { easy: 40, medium: 40, hard: 20 },
      error: null,
    }),
}));

export const selectTotalQuestions = (s: AssignmentFormState) =>
  s.questionTypes.reduce((sum, q) => sum + q.count, 0);

export const selectTotalMarks = (s: AssignmentFormState) =>
  s.questionTypes.reduce((sum, q) => sum + q.count * q.marksEach, 0);
