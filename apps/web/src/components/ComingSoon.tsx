import { Sparkles } from "lucide-react";

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white">
        <Sparkles className="h-7 w-7" />
      </span>
      <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This area is part of the VedaAI product vision and isn&apos;t wired up in this assignment build.
      </p>
    </div>
  );
}
