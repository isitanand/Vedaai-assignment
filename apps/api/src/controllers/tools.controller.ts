import type { Request, Response } from "express";
import type { ToolGenerateInput } from "@vedaai/shared";
import { runTool } from "../services/tools.service";

export async function generateTool(req: Request, res: Response) {
  
  const result = await runTool(req.body as ToolGenerateInput);
  res.json(result);
}
