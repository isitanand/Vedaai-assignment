import type { AssignmentStatus } from "@vedaai/shared";
import { Badge } from "./ui/badge";

const META: Record<AssignmentStatus, { label: string; tone: "neutral" | "info" | "success" | "danger" }> = {
  pending: { label: "Pending", tone: "neutral" },
  processing: { label: "Generating", tone: "info" },
  complete: { label: "Ready", tone: "success" },
  error: { label: "Failed", tone: "danger" },
};

export function StatusChip({ status }: { status: AssignmentStatus }) {
  const m = META[status];
  return (
    <Badge tone={m.tone}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </Badge>
  );
}
