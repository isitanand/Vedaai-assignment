"use client";

import { Minus, Plus } from "lucide-react";

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, v)));
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
      <div className="flex items-center gap-3 rounded-full bg-muted/70 px-2 py-1.5">
        <button
          type="button"
          onClick={() => set(value - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition hover:bg-card/80"
          aria-label={`Decrease ${label ?? ""}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          value={value}
          onChange={(e) => set(Number(e.target.value.replace(/\D/g, "")) || min)}
          className="w-8 bg-transparent text-center text-base font-semibold tabular-nums focus:outline-none"
          inputMode="numeric"
        />
        <button
          type="button"
          onClick={() => set(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition hover:bg-card/80"
          aria-label={`Increase ${label ?? ""}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
