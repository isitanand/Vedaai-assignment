"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

export function usePaper(id: string) {
  return useQuery({
    queryKey: qk.paper(id),
    queryFn: () => api.getPaper(id),
    enabled: !!id,
  });
}

export function usePaperByAssignment(assignmentId: string, enabled = true) {
  return useQuery({
    queryKey: qk.paperByAssignment(assignmentId),
    queryFn: () => api.getPaperByAssignment(assignmentId),
    enabled: enabled && !!assignmentId,
  });
}
