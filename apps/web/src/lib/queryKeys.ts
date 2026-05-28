export const qk = {
  assignments: (params?: Record<string, unknown>) => ["assignments", params ?? {}] as const,
  assignment: (id: string) => ["assignment", id] as const,
  paper: (id: string) => ["paper", id] as const,
  paperByAssignment: (assignmentId: string) => ["paper-by-assignment", assignmentId] as const,
};
