




export const TOOL_TYPES = ["quiz", "concept", "doubt"] as const;
export type ToolType = (typeof TOOL_TYPES)[number];

export interface ToolGenerateResult {
  
  text: string;
  source: "gemini" | "mock";
}
