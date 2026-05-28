"use client";

import Link from "next/link";
import { Plus, Search, SlidersHorizontal, Check } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useAssignments } from "@/hooks/useAssignments";
import { AssignmentCard } from "@/components/AssignmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardSkeleton } from "@/components/ui/empty";
import { EmptyIllustration } from "@/components/brand/EmptyIllustration";
import { cn } from "@/lib/cn";
import type { Assignment } from "@vedaai/shared";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16 text-center">
      <EmptyIllustration className="w-[220px] sm:w-[300px] max-w-full mb-6 sm:mb-8 animate-fade-in" />
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2 sm:mb-3">
        No assignments yet
      </h2>
      <p className="max-w-[340px] sm:max-w-[460px] text-sm sm:text-[15px] leading-relaxed text-muted-foreground mb-6 sm:mb-8">
        Create your first assignment to start collecting and grading student submissions. You can
        set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      <Link href="/create">
        <Button
          size="lg"
          className="px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-[15px] bg-black hover:bg-zinc-900 text-white font-medium shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="h-[16px] w-[16px] stroke-[2.5]" /> Create Your First Assignment
        </Button>
      </Link>
    </div>
  );
}

export function DashboardView({ title = "Assignments", subtitle = "Manage and create assignments for your classes." }) {
  const { data, isLoading, isError } = useAssignments({ limit: 50 });
  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filterRef = useRef<HTMLDivElement>(null);
  const items: Assignment[] = data?.items ?? [];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const uniqueSubjects = useMemo(() => {
    const subs = new Set<string>();
    items.forEach((a) => {
      if (a.subject) subs.add(a.subject.toUpperCase());
    });
    return ["ALL", ...Array.from(subs)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const matchQuery =
        !q.trim() ||
        a.subject.toLowerCase().includes(q.toLowerCase()) ||
        a.topic.toLowerCase().includes(q.toLowerCase());
      const matchSubject = selectedSubject === "ALL" || a.subject.toUpperCase() === selectedSubject;
      const matchStatus = selectedStatus === "ALL" || a.status === selectedStatus;
      return matchQuery && matchSubject && matchStatus;
    });
  }, [items, q, selectedSubject, selectedStatus]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-8 sm:py-8">
      {}
      {items.length > 0 && (
        <div className="relative mb-4 sm:mb-5 w-full sm:max-w-md flex gap-2 z-10" ref={filterRef}>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 sm:h-12 rounded-full pl-11 pr-4 w-full"
              placeholder="Search Assignment"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
              filterOpen || selectedSubject !== "ALL" || selectedStatus !== "ALL"
                ? "border-brand/30 bg-brand/5 text-brand shadow-sm font-semibold"
                : "border-border/40 bg-white text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
            aria-label="Filter assignments"
          >
            <SlidersHorizontal className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-12 sm:top-13 z-30 w-64 rounded-2xl border border-border/50 bg-card p-4 shadow-xl backdrop-blur-xl">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Subject</h4>
                  <div className="flex flex-col gap-1">
                    {uniqueSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          setSelectedSubject(subject);
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                          selectedSubject === subject
                            ? "bg-brand/10 text-brand font-semibold"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <span className="capitalize">{subject.toLowerCase()}</span>
                        {selectedSubject === subject && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/60 pt-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Status</h4>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: "ALL", label: "All Statuses" },
                      { key: "complete", label: "Complete" },
                      { key: "pending", label: "Pending" },
                      { key: "failed", label: "Failed" },
                    ].map((status) => (
                      <button
                        key={status.key}
                        onClick={() => {
                          setSelectedStatus(status.key);
                        }}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                          selectedStatus === status.key
                            ? "bg-brand/10 text-brand font-semibold"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <span>{status.label}</span>
                        {selectedStatus === status.key && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                {(selectedSubject !== "ALL" || selectedStatus !== "ALL") && (
                  <button
                    onClick={() => {
                      setSelectedSubject("ALL");
                      setSelectedStatus("ALL");
                    }}
                    className="w-full text-center text-xs font-semibold text-brand hover:text-brand-dark pt-2 border-t border-border/40 mt-1"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-card p-6 sm:p-10 text-center text-sm text-muted-foreground shadow-card">
          Couldn&apos;t reach the API. Make sure it&apos;s running on the configured URL.
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {filtered.map((a) => <AssignmentCard key={a._id} a={a} />)}
        </div>
      )}

      {}
      {items.length > 0 && (
        <Link
          href="/create"
          className="no-print fixed bottom-24 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-pop md:hidden"
          aria-label="Create assignment"
        >
          <Plus className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
}
