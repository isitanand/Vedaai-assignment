import type { Assignment, JobUpdatePayload } from "@vedaai/shared";
import { AssignmentModel } from "../models/assignment.model";
import { PaperModel } from "../models/paper.model";
import { generatePaper } from "../services/gemini.service";

export type EmitFn = (update: JobUpdatePayload) => void;


export async function runGeneration(
  assignmentId: string,
  jobId: string,
  emit: EmitFn
): Promise<void> {
  const update = (status: JobUpdatePayload["status"], progress: number, message?: string) =>
    emit({ jobId, assignmentId, status, progress, message });

  const doc = await AssignmentModel.findById(assignmentId);
  if (!doc) throw new Error(`Assignment ${assignmentId} not found`);

  try {
    update("processing", 10, "Preparing your assignment…");
    doc.status = "processing";
    await doc.save();

    const assignment = { ...doc.toObject(), _id: doc.id } as unknown as Assignment;

    update("generating", 40, "Generating questions with AI…");
    const { paper, source, rawPrompt } = await generatePaper(assignment);

    update("parsing", 75, "Validating and assembling the paper…");
    const saved = await PaperModel.create({
      ...paper,
      assignmentId,
      rawPrompt,
      generatedAt: new Date().toISOString(),
    });

    doc.status = "complete";
    doc.paperId = saved.id;
    doc.errorMessage = undefined;
    await doc.save();

    update("complete", 100, `Paper ready (${source}).`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    doc.status = "error";
    doc.errorMessage = message;
    await doc.save();
    update("error", 100, message);
    throw err;
  }
}
