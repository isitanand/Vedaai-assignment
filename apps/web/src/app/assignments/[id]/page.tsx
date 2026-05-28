"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { useAssignment, useRetryAssignment } from "@/hooks/useAssignments";
import { useJobProgress } from "@/hooks/useJobProgress";
import { JobProgress } from "@/components/JobProgress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/status";
import type { JobUpdatePayload } from "@vedaai/shared";

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const retry = useRetryAssignment();

  
  const { data: assignment, isLoading, isError } = useAssignment(id, { refetchInterval: 4000 });
  const live = useJobProgress(id);

  
  const statusMap: Record<string, JobUpdatePayload["status"]> = {
    pending: "pending",
    processing: "processing",
    complete: "complete",
    error: "error",
  };
  const status: JobUpdatePayload["status"] =
    live?.status ?? (assignment ? statusMap[assignment.status] : "pending");
  const progress = live?.progress ?? (status === "complete" ? 100 : status === "pending" ? 5 : 30);
  const message = live?.message ?? assignment?.errorMessage ?? undefined;

  
  useEffect(() => {
    if (assignment?.status === "complete" && assignment.paperId) {
      const t = setTimeout(() => router.push(`/papers/${assignment.paperId}`), 900);
      return () => clearTimeout(t);
    }
  }, [assignment?.status, assignment?.paperId, router]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12">
      <Card>
        <CardContent className="py-6 sm:py-8">
          {isLoading && !assignment ? (
            <div className="space-y-4">
              <div className="h-6 w-2/3 animate-pulse rounded-lg bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
            </div>
          ) : isError || !assignment ? (
            <div className="text-center">
              <p className="font-medium">Assignment not found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                It may have been deleted, or the link is incorrect.
              </p>
              <Link href="/" className="mt-5 inline-block">
                <Button variant="outline">Back to dashboard</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <h2 className="min-w-0 break-words text-lg font-bold sm:text-xl">
                  {assignment.subject}: {assignment.topic}
                </h2>
                <StatusChip status={assignment.status} />
              </div>
              <JobProgress status={status} progress={progress} message={message} />

              {status === "error" && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={() => retry.mutate(id)} disabled={retry.isPending}>
                    <RotateCw className="h-4 w-4" /> {retry.isPending ? "Retrying…" : "Retry"}
                  </Button>
                  <Link href="/"><Button variant="outline" className="w-full sm:w-auto">Back to dashboard</Button></Link>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
