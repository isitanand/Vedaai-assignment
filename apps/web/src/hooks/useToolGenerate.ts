"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ToolGenerateInput } from "@vedaai/shared";

export function useToolGenerate() {
  return useMutation({
    mutationFn: (input: ToolGenerateInput) => api.generateTool(input),
  });
}
