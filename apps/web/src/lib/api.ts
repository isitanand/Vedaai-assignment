import axios from "axios";
import type {
  Assignment,
  CreateAssignmentInput,
  GeneratedPaper,
  ToolGenerateInput,
  ToolGenerateResult,
} from "@vedaai/shared";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const http = axios.create({ baseURL: `${baseURL}/api` });

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export const api = {
  createAssignment: (input: CreateAssignmentInput) =>
    http.post<Assignment>("/assignments", input).then((r) => r.data),

  listAssignments: (params?: { status?: string; page?: number; limit?: number }) =>
    http.get<Paginated<Assignment>>("/assignments", { params }).then((r) => r.data),

  getAssignment: (id: string) =>
    http.get<Assignment>(`/assignments/${id}`).then((r) => r.data),

  retryAssignment: (id: string) =>
    http.post<Assignment>(`/assignments/${id}/retry`).then((r) => r.data),

  deleteAssignment: (id: string) =>
    http.delete<{ ok: boolean }>(`/assignments/${id}`).then((r) => r.data),

  getPaper: (id: string) => http.get<GeneratedPaper>(`/papers/${id}`).then((r) => r.data),

  getPaperByAssignment: (assignmentId: string) =>
    http.get<GeneratedPaper>(`/papers/by-assignment/${assignmentId}`).then((r) => r.data),

  generateTool: (input: ToolGenerateInput) =>
    http.post<ToolGenerateResult>("/tools/generate", input).then((r) => r.data),
};
