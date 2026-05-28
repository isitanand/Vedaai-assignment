"use client";

import { useMemo, useState } from "react";
import { Library as LibraryIcon, Search } from "lucide-react";
import { useAssignments } from "@/hooks/useAssignments";
import { AssignmentCard } from "@/components/AssignmentCard";
import { Input } from "@/components/ui/input";
import { CardSkeleton, EmptyState } from "@/components/ui/empty";

export default function LibraryPage() {
  const { data, isLoading } = useAssignments({ status: "complete", limit: 100 });
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const all = data?.items ?? [];
    if (!q.trim()) return all;
    const needle = q.toLowerCase();
    return all.filter(
      (a) => a.subject.toLowerCase().includes(needle) || a.topic.toLowerCase().includes(needle)
    );
  }, [data, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-8 sm:py-8">
      <div className="relative mb-5 w-full sm:mb-6 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by subject or topic…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={<LibraryIcon className="h-10 w-10" />} title="No papers yet" description="Completed papers will appear here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => <AssignmentCard key={a._id} a={a} />)}
        </div>
      )}
    </div>
  );
}
