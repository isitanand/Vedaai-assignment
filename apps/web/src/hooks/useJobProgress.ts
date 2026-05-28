"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { JobUpdatePayload } from "@vedaai/shared";
import { getSocket } from "@/lib/socket";
import { qk } from "@/lib/queryKeys";


export function useJobProgress(assignmentId: string) {
  const qc = useQueryClient();
  const [update, setUpdate] = useState<JobUpdatePayload | null>(null);

  useEffect(() => {
    if (!assignmentId) return;
    const socket = getSocket();

    const onUpdate = (payload: JobUpdatePayload) => {
      if (payload.assignmentId !== assignmentId) return;
      setUpdate(payload);
      if (payload.status === "complete" || payload.status === "error") {
        qc.invalidateQueries({ queryKey: qk.assignment(assignmentId) });
        qc.invalidateQueries({ queryKey: qk.paperByAssignment(assignmentId) });
      }
    };

    socket.emit("join", { assignmentId });
    socket.on("job:update", onUpdate);

    return () => {
      socket.emit("leave", { assignmentId });
      socket.off("job:update", onUpdate);
    };
  }, [assignmentId, qc]);

  return update;
}
