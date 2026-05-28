import { cn } from "@/lib/cn";


export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="VedaAI Logo"
      className={cn("rounded-xl object-contain shadow-sm", className)}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9" />
      <span className="text-lg font-bold tracking-tight text-foreground">VedaAI</span>
    </span>
  );
}

