"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { JobUpdatePayload } from "@vedaai/shared";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/cn";

const STAGES: { key: JobUpdatePayload["status"]; label: string }[] = [
  { key: "pending", label: "Queued" },
  { key: "processing", label: "Preparing" },
  { key: "generating", label: "Generating" },
  { key: "parsing", label: "Assembling" },
  { key: "complete", label: "Ready" },
];

const ORDER = STAGES.map((s) => s.key);

export function JobProgress({
  status,
  progress,
  message,
}: {
  status: JobUpdatePayload["status"];
  progress: number;
  message?: string;
}) {
  const isError = status === "error";
  const isDone = status === "complete";
  const activeIdx = ORDER.indexOf(status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {isError ? (
          <AlertCircle className="h-6 w-6 text-danger" />
        ) : isDone ? (
          <CheckCircle2 className="h-6 w-6 text-success" />
        ) : (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        )}
        <div>
          <p className="font-medium">
            {isError ? "Generation failed" : isDone ? "Your paper is ready" : "Generating your paper…"}
          </p>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </div>

      <Progress value={progress} tone={isError ? "danger" : isDone ? "success" : "primary"} />

      {!isError && (
        <ol className="grid grid-cols-5 gap-2">
          {STAGES.map((s, i) => {
            const done = isDone || i < activeIdx;
            const active = i === activeIdx && !isDone;
            return (
              <li key={s.key} className="flex flex-col items-center gap-1.5 text-center">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                    done && "bg-success text-white",
                    active && "bg-primary text-primary-foreground",
                    !done && !active && "bg-muted text-muted-foreground"
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={cn("text-[11px]", active ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
