import { Worker, type Job } from "bullmq";
import { GENERATION_QUEUE, getRedisConnection, type GenerationJobData } from "./queue";
import { runGeneration } from "../jobs/runGeneration";
import { emitJobUpdate } from "../socket/socket";


export function startGenerationWorker(): Worker<GenerationJobData> {
  const worker = new Worker<GenerationJobData>(
    GENERATION_QUEUE,
    async (job: Job<GenerationJobData>) => {
      await runGeneration(job.data.assignmentId, job.id ?? "", emitJobUpdate);
    },
    { connection: getRedisConnection(), concurrency: 3 }
  );
  worker.on("failed", (job, err) =>
    console.error(`[worker] job ${job?.id} failed:`, err.message)
  );
  worker.on("completed", (job) => console.log(`[worker] job ${job.id} completed`));
  console.log("[worker] generation worker started (redis/bullmq)");
  return worker;
}
