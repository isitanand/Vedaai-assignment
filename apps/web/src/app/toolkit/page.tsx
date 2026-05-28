"use client";

import Link from "next/link";
import {
  FileText,
  ListChecks,
  ClipboardCheck,
  BookOpen,
  Lightbulb,
  PencilRuler,
  MessageCircleQuestion,
  Presentation,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";

type Tool = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  available?: boolean;
};

const TOOLS: Tool[] = [
  {
    title: "Question Paper Generator",
    description: "Generate full exam papers with answer keys from your topics and constraints.",
    icon: FileText,
    href: "/create",
    available: true,
  },
  {
    title: "Quiz Maker",
    description: "Spin up quick MCQ quizzes for in-class practice and revision.",
    icon: ListChecks,
    href: "/toolkit/quiz-maker",
    available: true,
  },
  {
    title: "Concept Explainer",
    description: "Turn tricky topics into clear, grade-appropriate explanations.",
    icon: Lightbulb,
    href: "/toolkit/concept-explainer",
    available: true,
  },
  {
    title: "Doubt Solver",
    description: "Get step-by-step solutions to student questions instantly.",
    icon: MessageCircleQuestion,
    href: "/toolkit/doubt-solver",
    available: true,
  },
  {
    title: "Rubric Builder",
    description: "Define marking criteria and scoring bands for consistent grading.",
    icon: ClipboardCheck,
  },
  {
    title: "Lesson Plan Assistant",
    description: "Draft structured, curriculum-aligned lesson plans in minutes.",
    icon: BookOpen,
  },
  {
    title: "Worksheet Generator",
    description: "Create printable practice worksheets tailored to any chapter.",
    icon: PencilRuler,
  },
  {
    title: "Slide Outline Builder",
    description: "Generate slide-by-slide outlines for your next class presentation.",
    icon: Presentation,
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  const inner = (
    <div
      className={cnCard(tool.available)}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={
            tool.available
              ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
              : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
          }
        >
          <Icon className="h-5 w-5" />
        </span>
        {tool.available ? (
          <Badge tone="success">Available</Badge>
        ) : (
          <Badge tone="neutral">Soon</Badge>
        )}
      </div>

      <div className="mt-4 flex-1">
        <h3 className="text-base font-bold tracking-tight text-foreground">{tool.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
      </div>

      {tool.available && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Open tool <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </div>
  );

  if (tool.available && tool.href) {
    return (
      <Link href={tool.href} className="group block h-full">
        {inner}
      </Link>
    );
  }
  return <div className="h-full">{inner}</div>;
}

function cnCard(available?: boolean) {
  return [
    "flex h-full flex-col rounded-2xl border bg-card p-5 shadow-sm transition-all animate-fade-in",
    available
      ? "border-border/50 cursor-pointer group-hover:-translate-y-1 group-hover:border-brand/40 group-hover:shadow-lg"
      : "border-border/40 opacity-90",
  ].join(" ");
}

export default function ToolkitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-8 sm:py-8">
      {}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-primary p-5 text-primary-foreground shadow-card sm:flex-row sm:items-center sm:gap-4 sm:p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-bold sm:text-xl">AI Teacher&apos;s Toolkit</h1>
          <p className="mt-0.5 text-sm text-white/70">
            A growing set of AI helpers for planning, assessing, and teaching. More tools arriving soon.
          </p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.title} tool={tool} />
        ))}
      </div>
    </div>
  );
}
