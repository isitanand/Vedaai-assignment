"use client";

import type { DifficultyDistribution as Dist } from "@vedaai/shared";
import { cn } from "@/lib/cn";
import { Label } from "../ui/label";

const ROWS: { key: keyof Dist; label: string; bar: string }[] = [
  { key: "easy", label: "Easy", bar: "bg-success" },
  { key: "medium", label: "Medium", bar: "bg-warning" },
  { key: "hard", label: "Hard", bar: "bg-danger" },
];

export function DifficultyDistribution({
  value,
  onChange,
}: {
  value: Dist;
  onChange: (next: Dist) => void;
}) {
  const total = value.easy + value.medium + value.hard;
  const valid = total === 100;

  return (
    <div className="space-y-4">
      {}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {ROWS.map((r) => (
          <div key={r.key} className={cn(r.bar)} style={{ width: `${value[r.key]}%` }} />
        ))}
      </div>

      <div className="space-y-3">
        {ROWS.map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <Label className="mb-0 w-16 shrink-0">{r.label}</Label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={value[r.key]}
              onChange={(e) => onChange({ ...value, [r.key]: Number(e.target.value) })}
              className="h-2 flex-1 cursor-pointer accent-[hsl(var(--primary))]"
            />
            <span className="w-12 text-right text-sm tabular-nums">{value[r.key]}%</span>
          </div>
        ))}
      </div>

      <p className={cn("text-xs", valid ? "text-muted-foreground" : "text-danger")}>
        {valid ? "Difficulty split totals 100%." : `Must total 100% (currently ${total}%).`}
      </p>
    </div>
  );
}
