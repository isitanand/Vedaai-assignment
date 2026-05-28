import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-input/50 bg-card/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm transition-colors",
        "placeholder:text-muted-foreground",
        "focus-visible:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
