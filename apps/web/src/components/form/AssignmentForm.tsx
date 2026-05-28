"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Sparkles } from "lucide-react";
import { CreateAssignmentSchema, type CreateAssignmentInput } from "@vedaai/shared";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { QuestionTypeBuilder } from "./QuestionTypeBuilder";
import { FileDropzone } from "./FileDropzone";
import { DifficultyDistribution } from "./DifficultyDistribution";
import { useCreateAssignment } from "@/hooks/useAssignments";
import { useAssignmentFormStore, selectTotalQuestions, selectTotalMarks } from "@/stores/assignmentForm";

export function AssignmentForm() {
  const router = useRouter();
  const create = useCreateAssignment();

  const subject = useAssignmentFormStore((s) => s.subject);
  const topic = useAssignmentFormStore((s) => s.topic);
  const dueDate = useAssignmentFormStore((s) => s.dueDate);
  const fileText = useAssignmentFormStore((s) => s.fileText);
  const additionalInstructions = useAssignmentFormStore((s) => s.additionalInstructions);
  const questionTypes = useAssignmentFormStore((s) => s.questionTypes);
  const difficultyDistribution = useAssignmentFormStore((s) => s.difficultyDistribution);
  const error = useAssignmentFormStore((s) => s.error);

  const setSubject = useAssignmentFormStore((s) => s.setSubject);
  const setTopic = useAssignmentFormStore((s) => s.setTopic);
  const setDueDate = useAssignmentFormStore((s) => s.setDueDate);
  const setFileText = useAssignmentFormStore((s) => s.setFileText);
  const setInstructions = useAssignmentFormStore((s) => s.setAdditionalInstructions);
  const appendInstructions = useAssignmentFormStore((s) => s.appendInstructions);
  const setQuestionTypes = useAssignmentFormStore((s) => s.setQuestionTypes);
  const setDifficultyDistribution = useAssignmentFormStore((s) => s.setDifficultyDistribution);
  const setError = useAssignmentFormStore((s) => s.setError);
  const reset = useAssignmentFormStore((s) => s.reset);

  const totalQuestions = useAssignmentFormStore(selectTotalQuestions);
  const totalMarks = useAssignmentFormStore(selectTotalMarks);

  const [isListening, setIsListening] = useState(false);

  
  function handleMic() {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      appendInstructions(transcript);
    };
    recognition.start();
  }

  async function submit() {
    setError(null);
    const extra = [additionalInstructions, fileText ? `Reference material:\n${fileText}` : ""]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 4500);

    let formattedDueDate = "";
    try {
      if (dueDate) {
        formattedDueDate = new Date(dueDate).toISOString();
      }
    } catch (err) {
      formattedDueDate = "invalid"; 
    }

    const payload: CreateAssignmentInput = {
      subject: subject.trim(),
      topic: topic.trim(),
      dueDate: formattedDueDate,
      questionTypes,
      totalQuestions,
      totalMarks,
      difficultyDistribution,
      additionalInstructions: extra || undefined,
    };

    const parsed = CreateAssignmentSchema.safeParse(payload);
    if (!parsed.success) {
      const f = parsed.error.errors[0];
      return setError(f ? `${f.path.join(".")}: ${f.message}` : "Please check the form.");
    }
    try {
      const created = await create.mutateAsync(payload);
      reset();
      router.push(`/assignments/${created._id}`);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? "Failed to create assignment.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8 animate-fade-in">
      {}
      <div className="rounded-[32px] border border-border/40 bg-white px-5 py-7 sm:px-8 sm:py-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">

        {}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Assignment Details</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Basic information about your assignment</p>
        </div>

        {}
        <FileDropzone onText={setFileText} />

        {}
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <div className="relative mt-1">
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-12 pr-12 text-[15px]"
              placeholder="DD-MM-YYYY"
            />
          </div>
        </div>

        {}
        <div>
          <QuestionTypeBuilder value={questionTypes} onChange={setQuestionTypes} />

          {}
          <div className="mt-4 flex justify-end gap-6 text-sm font-semibold text-foreground pr-1">
            <span>Total Questions : <span className="tabular-nums">{totalQuestions}</span></span>
            <span>Total Marks : <span className="tabular-nums">{totalMarks}</span></span>
          </div>
        </div>

        {}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Difficulty Distribution</h2>
          <p className="mt-0.5 text-sm text-muted-foreground mb-4">Define the percentage split for question difficulty</p>
          <DifficultyDistribution value={difficultyDistribution} onChange={setDifficultyDistribution} />
        </div>

        {}
        <div>
          <Label htmlFor="additionalInfo">
            Additional Information <span className="text-muted-foreground">(For better output)</span>
          </Label>
          <div className="relative mt-1">
            <textarea
              id="additionalInfo"
              rows={3}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              value={additionalInstructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full resize-none rounded-2xl border border-input bg-transparent px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            {}
            <button
              type="button"
              onClick={handleMic}
              title="Speak to fill"
              className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                isListening
                  ? "bg-danger text-white animate-pulse shadow-lg"
                  : "bg-brand-gradient text-white shadow-[0_2px_8px_rgba(249,115,22,0.35)] hover:scale-110 hover:shadow-[0_4px_12px_rgba(249,115,22,0.45)]"
              }`}
              aria-label="Voice input"
            >
              <Mic className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="e.g. Science" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="topic">Topic / Chapter</Label>
            <Input id="topic" placeholder="e.g. Electricity" value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-1" />
          </div>
        </div>

        {error && <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

        {}
        <div className="flex justify-end pt-1">
          <Button
            type="button"
            variant="ring"
            onClick={submit}
            disabled={
              create.isPending ||
              !subject.trim() ||
              !topic.trim() ||
              totalQuestions === 0 ||
              difficultyDistribution.easy + difficultyDistribution.medium + difficultyDistribution.hard !== 100
            }
            className="h-12 px-8 text-[15px]"
          >
            <Sparkles className="h-4 w-4" />
            {create.isPending ? "Generating…" : "Generate Paper"}
          </Button>
        </div>
      </div>
    </div>
  );
}
