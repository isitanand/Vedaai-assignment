"use client";

import { ListChecks } from "lucide-react";
import { ToolRunner } from "@/components/toolkit/ToolRunner";

export default function QuizMakerPage() {
  return (
    <ToolRunner
      config={{
        tool: "quiz",
        title: "Quiz Maker",
        description: "Generate a quick multiple-choice quiz with an answer key.",
        icon: ListChecks,
        inputLabel: "Topic",
        placeholder: "e.g. Photosynthesis in green plants",
        showCount: true,
        cta: "Generate Quiz",
      }}
    />
  );
}
