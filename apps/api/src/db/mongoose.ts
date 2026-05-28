import mongoose from "mongoose";
import { env, isMemoryMode } from "../config/env";

let connected = false;

export async function connectMongo(): Promise<void> {
  if (connected) return;
  mongoose.set("strictQuery", true);

  if (isMemoryMode) {
    
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri());
    connected = true;
    console.log("[mongo] connected: in-memory (mongodb-memory-server)");
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
  connected = true;
  console.log("[mongo] connected:", env.MONGODB_URI);
}

export function mongoState(): string {
  return mongoose.connection.readyState === 1 ? "up" : "down";
}
