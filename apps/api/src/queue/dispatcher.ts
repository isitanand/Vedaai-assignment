import { isMemoryMode } from "../config/env";
import { getGenerationQueue } from "./queue";
import { runGeneration } from "../jobs/runGeneration";
import { emitJobUpdate } from "../socket/socket";


export async function dispatchGeneration(assignmentId: string): Promise<string> {
  if (isMemoryMode) {
    const jobId = `inline-${assignmentId}-${Date.now()}`;
    
    setImmediate(() => {
      runGeneration(assignmentId, jobId, emitJobUpdate).catch((err) =>
        console.error("[inline-queue] generation failed:", err)
      );
    });
    return jobId;
  }

  const job = await getGenerationQueue().add("generate", { assignmentId });
  return job.id ?? "";
}
