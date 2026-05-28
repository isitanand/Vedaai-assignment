import { cn } from "@/lib/cn";

export function EmptyIllustration({ className }: { className?: string }) {
  return (
    <img
      src="/empty-state-illustration.png"
      alt="No assignments yet"
      className={cn("object-contain", className)}
    />
  );
}

