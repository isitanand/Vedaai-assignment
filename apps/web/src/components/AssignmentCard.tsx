"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import type { Assignment } from "@vedaai/shared";
import { StatusChip } from "./status";
import { formatDate } from "@/lib/format";
import { useDeleteAssignment } from "@/hooks/useAssignments";

export function AssignmentCard({ a }: { a: Assignment }) {
  const router = useRouter();
  const del = useDeleteAssignment();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const href = a.status === "complete" && a.paperId ? `/papers/${a.paperId}` : `/assignments/${a._id}`;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div
      onClick={() => router.push(href)}
      className="group relative animate-fade-in cursor-pointer rounded-2xl border border-border/50 bg-card/80 p-5 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-brand">
            {a.subject}
          </span>
          <h3 className="mt-3 truncate text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand sm:text-xl">
            {a.topic}
          </h3>
        </div>
        <div className="flex items-center gap-2" ref={menuRef}>
          <StatusChip status={a.status} />
          <button
            onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {open && (
            <div className="absolute right-4 top-14 z-10 w-48 overflow-hidden rounded-xl border border-border/50 bg-card py-1.5 shadow-xl backdrop-blur-xl">
              <button
                onClick={(e) => { e.stopPropagation(); router.push(href); }}
                className="block w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-muted"
              >
                View Assignment
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  if (confirm("Delete this assignment?")) del.mutate(a._id);
                }}
                className="block w-full px-4 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-sm sm:mt-8">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assigned on</span>
          <span className="mt-0.5 font-medium text-foreground">{formatDate(a.createdAt)}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Due</span>
          <span className="mt-0.5 font-medium text-foreground">{formatDate(a.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}
