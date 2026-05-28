"use client";

import { MessageCircleQuestion } from "lucide-react";
import { ToolRunner } from "@/components/toolkit/ToolRunner";

export default function DoubtSolverPage() {
  return (
    <ToolRunner
      config={{
        tool: "doubt",
        title: "Doubt Solver",
        description: "Get a clear, step-by-step solution to any student question.",
        icon: MessageCircleQuestion,
        inputLabel: "Student's question",
        placeholder: "e.g. A train travels 240 km in 3 hours. What is its average speed?",
        multiline: true,
        cta: "Solve Doubt",
      }}
    />
  );
}
