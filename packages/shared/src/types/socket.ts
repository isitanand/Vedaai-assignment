export interface JobUpdatePayload {
  jobId: string;
  status: "pending" | "processing" | "generating" | "parsing" | "complete" | "error";
  progress: number;
  assignmentId: string;
  message?: string;
}
