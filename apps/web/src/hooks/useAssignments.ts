"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateAssignmentInput } from "@vedaai/shared";
import { api } from "@/lib/api";
import { qk } from "@/lib/queryKeys";

export function useAssignments(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: qk.assignments(params),
    queryFn: () => api.listAssignments(params),
  });
}

export function useAssignment(id: string, opts?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: qk.assignment(id),
    queryFn: () => api.getAssignment(id),
    enabled: !!id,
    refetchInterval: opts?.refetchInterval,
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAssignmentInput) => api.createAssignment(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assignments"] }),
  });
}

export function useDeleteAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteAssignment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assignments"] }),
  });
}

export function useRetryAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.retryAssignment(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.assignment(data._id) });
      qc.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}
