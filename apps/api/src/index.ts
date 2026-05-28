import http from "http";
import express from "express";
import cors from "cors";
import { env, isMemoryMode, hasGemini } from "./config/env";
import { connectMongo } from "./db/mongoose";
import { initSocket } from "./socket/socket";
import { startGenerationWorker } from "./queue/generation.worker";
import { router } from "./routes";
import { errorHandler, notFound } from "./middleware/error";

async function main() {
  await connectMongo();

  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", router);
  app.use(notFound);
  app.use(errorHandler);

  const server = http.createServer(app);
  initSocket(server);

  if (isMemoryMode) {
    console.log("[api] INFRA_MODE=memory — inline queue, no Redis/BullMQ worker");
  } else {
    startGenerationWorker();
  }

  server.listen(env.PORT, () => {
    console.log(`[api] listening on http://localhost:${env.PORT}`);
    console.log(`[api] CORS origin: ${env.CORS_ORIGIN}`);
    if (hasGemini) {
      console.log(`[api] Gemini Mode ACTIVE (Model: ${process.env.GEMINI_MODEL || "gemini-3.5-flash"})`);
    } else {
      console.log(`[api] Gemini Mode INACTIVE (Using mock generator)`);
    }
  });
}

main().catch((err) => {
  console.error("[api] fatal startup error:", err);
  process.exit(1);
});
