"use client";

import { ChevronDown, Minus, Plus, X } from "lucide-react";
import type { QuestionType, QuestionTypeConfig } from "@vedaai/shared";

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: "MCQ", label: "Multiple Choice Questions" },
  { value: "ShortAnswer", label: "Short Questions" },
  { value: "LongAnswer", label: "Long Questions" },
  { value: "TrueFalse", label: "True / False" },
  { value: "FillInTheBlanks", label: "Fill in the Blanks" },
  { value: "DiagramGraph", label: "Diagram/Graph-Based Questions" },
  { value: "NumericalProblem", label: "Numerical Problems" },
];

function InlineStepper({
  value,
  onChange,
  min = 0,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, v)));
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-white px-2 py-1">
      <button
        type="button"
        onClick={() => set(value - 1)}
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label="Decrease"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="min-w-[20px] text-center text-sm font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <button
        type="button"
        onClick={() => set(value + 1)}
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label="Increase"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export function QuestionTypeBuilder({
  value,
  onChange,
}: {
  value: QuestionTypeConfig[];
  onChange: (next: QuestionTypeConfig[]) => void;
}) {
  const update = (i: number, patch: Partial<QuestionTypeConfig>) =>
    onChange(value.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => onChange([...value, { type: "MCQ", count: 4, marksEach: 1 }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {}
      <div className="hidden sm:grid items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        style={{ gridTemplateColumns: "1fr auto auto auto" }}
      >
        <span>Question Type</span>
        <span className="text-center w-28">No. of Questions</span>
        <span className="text-center w-20">Marks</span>
        <span className="w-6" />
      </div>

      {}
      {value.map((row, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-[#F8F9FA] px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-2"
        >
          {}
          <div className="flex items-center justify-between gap-3 sm:block">
            <div className="relative min-w-0 flex-1">
              <select
                value={row.type}
                onChange={(e) => update(i, { type: e.target.value as QuestionType })}
                className="w-full appearance-none bg-transparent pr-6 text-sm font-semibold text-foreground focus:outline-none truncate"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {}
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={value.length === 1}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-30 transition-colors sm:hidden"
              aria-label="Remove question type"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {}
          <div className="flex flex-col gap-2 border-t border-border/40 pt-2.5 sm:contents sm:border-0 sm:pt-0">
            {}
            <div className="flex items-center justify-between gap-2 sm:justify-center sm:w-28">
              <span className="text-xs font-semibold text-muted-foreground sm:hidden">No. of Questions:</span>
              <InlineStepper value={row.count} onChange={(v) => update(i, { count: v })} min={0} max={50} />
            </div>

            {}
            <div className="flex items-center justify-between gap-2 sm:justify-center sm:w-20">
              <span className="text-xs font-semibold text-muted-foreground sm:hidden">Marks Each:</span>
              <InlineStepper value={row.marksEach} onChange={(v) => update(i, { marksEach: v })} min={1} max={20} />
            </div>

            {}
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={value.length === 1}
              className="hidden sm:flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              aria-label="Remove question type"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2.5 text-sm font-semibold text-foreground mt-1"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-sm">
          <Plus className="h-4 w-4" />
        </span>
        Add Question Type
      </button>
    </div>
  );
}
