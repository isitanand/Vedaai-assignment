"use client";

import { Lightbulb } from "lucide-react";
import { ToolRunner } from "@/components/toolkit/ToolRunner";

export default function ConceptExplainerPage() {
  return (
    <ToolRunner
      config={{
        tool: "concept",
        title: "Concept Explainer",
        description: "Turn a tricky topic into a clear, grade-appropriate explanation.",
        icon: Lightbulb,
        inputLabel: "Concept to explain",
        placeholder: "e.g. Newton's third law of motion",
        cta: "Explain Concept",
      }}
    />
  );
}
