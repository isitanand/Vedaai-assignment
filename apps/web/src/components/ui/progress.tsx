import { cn } from "@/lib/cn";

export function Progress({
  value,
  className,
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "danger" | "success";
}) {
  const color =
    tone === "danger" ? "bg-danger" : tone === "success" ? "bg-success" : "bg-primary";
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
