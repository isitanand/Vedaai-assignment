import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env, isMemoryMode } from "../config/env";

export const GENERATION_QUEUE = "generation";

export interface GenerationJobData {
  assignmentId: string;
}

let _connection: IORedis | null = null;
let _queue: Queue<GenerationJobData> | null = null;


export function getRedisConnection(): IORedis {
  if (!_connection) {
    _connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
  }
  return _connection;
}

export function getGenerationQueue(): Queue<GenerationJobData> {
  if (!_queue) {
    _queue = new Queue<GenerationJobData>(GENERATION_QUEUE, {
      connection: getRedisConnection(),
      defaultJobOptions: { attempts: 1, removeOnComplete: 100, removeOnFail: 200 },
    });
  }
  return _queue;
}

export function redisStatus(): string {
  if (isMemoryMode) return "inline";
  return _connection?.status === "ready" ? "up" : _connection?.status ?? "idle";
}
