"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePaper } from "@/hooks/usePaper";
import { PaperView } from "@/components/PaperView";
import { Button } from "@/components/ui/button";
import { CardSkeleton, EmptyState } from "@/components/ui/empty";

export default function PaperPage() {
  const { id } = useParams<{ id: string }>();
  const { data: paper, isLoading, isError } = usePaper(id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="no-print mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>
      ) : isError || !paper ? (
        <EmptyState title="Paper not found" description="This paper may still be generating or no longer exists." />
      ) : (
        <PaperView paper={paper} />
      )}
    </div>
  );
}
