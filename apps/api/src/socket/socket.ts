import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import type { JobUpdatePayload } from "@vedaai/shared";
import { env } from "../config/env";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: env.CORS_ORIGIN, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ assignmentId }: { assignmentId: string }) => {
      if (assignmentId) socket.join(`assignment:${assignmentId}`);
    });
    socket.on("leave", ({ assignmentId }: { assignmentId: string }) => {
      if (assignmentId) socket.leave(`assignment:${assignmentId}`);
    });
  });

  return io;
}


export function emitJobUpdate(payload: JobUpdatePayload): void {
  if (!io) return;
  io.to(`assignment:${payload.assignmentId}`).emit("job:update", payload);
}
