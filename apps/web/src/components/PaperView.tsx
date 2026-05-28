"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, EyeOff, Loader2, Printer, RotateCw, Sparkles } from "lucide-react";
import type { GeneratedPaper, Question } from "@vedaai/shared";
import { useRetryAssignment } from "@/hooks/useAssignments";
import { Button } from "./ui/button";
import { cn } from "@/lib/cn";

function QuestionItem({ q, index }: { q: Question; index: number }) {
  return (
    <li className="py-3">
      <div className="flex items-start justify-between gap-4">
        <p className="flex-1 leading-relaxed">
          <span className="mr-2 font-semibold">{index}.</span>
          {q.text}
        </p>
        <span className="shrink-0 whitespace-nowrap text-sm text-muted-foreground font-medium">
          [{q.marks} {q.marks > 1 ? "marks" : "mark"}]
        </span>
      </div>

      {q.options && q.options.length > 0 && (
        <ol className="mt-2 grid gap-1 pl-6 text-sm sm:grid-cols-2">
          {q.options.map((opt, i) => (
            <li key={i}>
              <span className="mr-1.5 font-medium">({String.fromCharCode(97 + i)})</span>
              {opt}
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}

export function PaperView({ paper }: { paper: GeneratedPaper }) {
  const router = useRouter();
  const regenerate = useRetryAssignment();
  const [showAnswers, setShowAnswers] = useState(false);
  const [schoolName, setSchoolName] = useState("Delhi Public School");
  const [schoolCity, setSchoolCity] = useState("Bokaro Steel City");
  const [downloading, setDownloading] = useState(false);

  const [userName, setUserName] = useState("Lakshya");

  const handleRegenerate = () => {
    regenerate.mutate(paper.assignmentId, {
      onSuccess: () => router.push(`/assignments/${paper.assignmentId}`),
    });
  };

  async function handleDownloadPdf() {
    setDownloading(true);
    try {
      const { downloadPaperPdf } = await import("@/lib/paperPdf");
      await downloadPaperPdf(paper, { showAnswers, schoolName, schoolCity });
    } finally {
      setDownloading(false);
    }
  }

  useEffect(() => {
    const sn = localStorage.getItem("veda_school_name");
    const sc = localStorage.getItem("veda_school_city");
    if (sn) setSchoolName(sn);
    if (sc) setSchoolCity(sc);

    const storedUser = localStorage.getItem("veda_user_name");
    if (storedUser) setUserName(storedUser);
  }, []);
  let counter = 0;

  const chapterName = paper.title.includes(":")
    ? paper.title.split(":")[1]?.trim()
    : paper.title.includes("-")
      ? paper.title.split("-").pop()?.trim()
      : paper.title;

  return (
    <div>
      <div className="no-print mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold sm:text-xl">Generated Paper</h1>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => setShowAnswers((s) => !s)}>
            {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="hidden xs:inline">{showAnswers ? "Hide answer key" : "Show answer key"}</span>
            <span className="xs:hidden">{showAnswers ? "Hide key" : "Answer key"}</span>
          </Button>
          <Button variant="outline" size="sm" className="shrink-0" onClick={handleRegenerate} disabled={regenerate.isPending}>
            <RotateCw className={cn("h-4 w-4", regenerate.isPending && "animate-spin")} />
            {regenerate.isPending ? "Regenerating…" : "Regenerate"}
          </Button>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="primary" size="sm" className="shrink-0" onClick={handleDownloadPdf} disabled={downloading}>
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {downloading ? "Preparing…" : "Download PDF"}
          </Button>
        </div>
      </div>

      {}
      <div className="no-print mb-6 flex items-start gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-card">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
          <Sparkles className="h-4.5 w-4.5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium leading-relaxed">
            Certainly, {userName}! Here is your customized {paper.subject} question paper
            {chapterName ? <> on &quot;{chapterName}&quot;</> : null}, worth {paper.totalMarks} marks over {paper.duration}.
          </p>
          <p className="text-[11px] text-white/50">
            Generated with VedaAI Assistant · All constraints verified
          </p>
        </div>
      </div>

      <article className="rounded-2xl bg-card p-5 shadow-card sm:p-10">
        {}
        <header className="mb-6 text-center">
          <h2 className="text-base font-bold uppercase tracking-wide sm:text-lg">{schoolName}, {schoolCity}</h2>
          <p className="text-sm font-semibold sm:text-base">{paper.title}</p>
          <div className="mt-3 flex flex-col gap-1 text-sm sm:flex-row sm:justify-between sm:gap-2">
            <span>Subject: <strong>{paper.subject}</strong></span>
            <span>Time Allowed: <strong>{paper.duration}</strong></span>
            <span>Max Marks: <strong>{paper.totalMarks}</strong></span>
          </div>
          <div className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-2 border-y border-dashed border-border py-2 text-sm text-muted-foreground">
            <span>Name: ______________________</span>
            <span>Roll No: ____________</span>
            <span>Class &amp; Section: __________</span>
          </div>
          <p className="mt-3 text-xs italic text-muted-foreground">
            General Instructions: All questions are compulsory unless stated otherwise.
          </p>
        </header>

        {paper.sections.map((section) => (
          <section key={section.id} className="mb-7 last:mb-0">
            <div className="mb-1 border-b border-border pb-1">
              <h3 className="font-bold">{section.title}</h3>
              <p className="text-sm italic text-muted-foreground">{section.instruction}</p>
            </div>
            <ol className="divide-y divide-border/60">
              {section.questions.map((q) => {
                counter += 1;
                return <QuestionItem key={q.id} q={q} index={counter} />;
              })}
            </ol>
          </section>
        ))}

        {showAnswers && (
          <section className="mt-12 border-t-2 border-dashed border-border/80 pt-8 no-print-break-inside" style={{ breakBefore: "page" }}>
            <div className="mb-6 text-center">
              <h2 className="text-lg font-bold uppercase tracking-wide">Answer Key</h2>
              <p className="text-sm text-muted-foreground">{paper.title}</p>
            </div>
            
            {(() => {
              let answerCounter = 0;
              return paper.sections.map((section) => (
                <div key={`ans-sec-${section.id}`} className="mb-6 last:mb-0">
                  <h4 className="font-bold border-b border-border pb-1 mb-2 text-sm">{section.title}</h4>
                  <ul className="space-y-4">
                    {section.questions.map((q) => {
                      answerCounter += 1;
                      const optIdx = q.options && q.answer ? q.options.indexOf(q.answer) : -1;
                      const optLetter = optIdx !== -1 ? `(${String.fromCharCode(97 + optIdx)}) ` : "";
                      return (
                        <li key={`ans-${q.id}`} className="text-sm">
                          <p className="font-bold leading-relaxed text-foreground">
                            Q{answerCounter}.
                          </p>
                          <div className="mt-2 rounded-xl bg-success/5 px-4 py-3 border border-success/10">
                            {q.answer && (
                              <p className="leading-relaxed">
                                <span className="font-bold text-success">Answer: </span>
                                {optLetter}{q.answer}
                              </p>
                            )}
                            {q.explanation && (
                              <p className="mt-1.5 text-muted-foreground leading-relaxed">
                                <span className="font-bold text-foreground/80">Explanation: </span>
                                {q.explanation}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ));
            })()}
          </section>
        )}
      </article>
    </div>
  );
}
