"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Loader2, Sparkles } from "lucide-react";
import type { ComponentType } from "react";
import type { ToolGenerateInput, ToolType } from "@vedaai/shared";
import { useToolGenerate } from "@/hooks/useToolGenerate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ToolConfig {
  tool: ToolType;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  inputLabel: string;
  placeholder: string;
  
  multiline?: boolean;
  
  showCount?: boolean;
  cta: string;
}

export function ToolRunner({ config }: { config: ToolConfig }) {
  const Icon = config.icon;
  const gen = useToolGenerate();

  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const canSubmit = input.trim().length >= 3 && !gen.isPending;

  function submit() {
    const payload: ToolGenerateInput = {
      tool: config.tool,
      input: input.trim(),
      subject: subject.trim() || undefined,
      gradeLevel: gradeLevel.trim() || undefined,
      count: config.showCount ? count : undefined,
    };
    gen.mutate(payload);
  }

  async function copyOutput() {
    if (!gen.data?.text) return;
    await navigator.clipboard.writeText(gen.data.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-8 sm:py-8">
      <div className="no-print mb-4">
        <Link href="/toolkit">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" /> Toolkit
          </Button>
        </Link>
      </div>

      {}
      <div className="mb-5 flex items-start gap-3 sm:gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl">{config.title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>

      {}
      <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm sm:p-6">
        <Label htmlFor="tool-input">{config.inputLabel}</Label>
        {config.multiline ? (
          <textarea
            id="tool-input"
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.placeholder}
            className="mt-1 w-full resize-none rounded-2xl border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        ) : (
          <Input
            id="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.placeholder}
            className="mt-1 h-12"
          />
        )}

        {}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="tool-subject">Subject <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="tool-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tool-grade">Grade / Level <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="tool-grade"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="e.g. Grade 8"
              className="mt-1"
            />
          </div>
        </div>

        {config.showCount && (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
            <Label className="mb-0">Number of questions</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Fewer questions"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold tabular-nums">{count}</span>
              <button
                type="button"
                onClick={() => setCount((c) => Math.min(20, c + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-colors hover:text-foreground"
                aria-label="More questions"
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <Button variant="ring" onClick={submit} disabled={!canSubmit} className="h-12 px-7 text-[15px]">
            {gen.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {gen.isPending ? "Generating…" : config.cta}
          </Button>
        </div>
      </div>

      {}
      {gen.isError && (
        <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          Couldn&apos;t generate that. Make sure the API is running, then try again.
        </p>
      )}

      {gen.data && (
        <div className="mt-5 animate-fade-in rounded-2xl border border-border/40 bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold">Result</span>
              {gen.data.source === "mock" && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  sample output
                </span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={copyOutput}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
            {gen.data.text}
          </pre>
        </div>
      )}
    </div>
  );
}
