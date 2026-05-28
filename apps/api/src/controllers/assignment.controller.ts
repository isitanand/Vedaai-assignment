import type { Request, Response } from "express";
import { CreateAssignmentSchema } from "@vedaai/shared";
import { AssignmentModel } from "../models/assignment.model";
import { PaperModel } from "../models/paper.model";
import { dispatchGeneration } from "../queue/dispatcher";
import { HttpError } from "../middleware/error";

function serialize(doc: any) {
  const o = doc.toObject ? doc.toObject() : doc;
  return { ...o, _id: String(o._id) };
}

export async function createAssignment(req: Request, res: Response) {
  const input = req.body as ReturnType<typeof CreateAssignmentSchema.parse>;

  const doc = await AssignmentModel.create({ ...input, status: "pending" });
  const jobId = await dispatchGeneration(doc.id);
  doc.jobId = jobId;
  await doc.save();

  res.status(201).json(serialize(doc));
}

export async function listAssignments(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    AssignmentModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    AssignmentModel.countDocuments(filter),
  ]);

  res.json({ items: items.map(serialize), total, page, limit });
}

export async function getAssignment(req: Request, res: Response) {
  const doc = await AssignmentModel.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Assignment not found");
  res.json(serialize(doc));
}

export async function deleteAssignment(req: Request, res: Response) {
  const doc = await AssignmentModel.findByIdAndDelete(req.params.id);
  if (!doc) throw new HttpError(404, "Assignment not found");
  if (doc.paperId) await PaperModel.findByIdAndDelete(doc.paperId).catch(() => undefined);
  res.json({ ok: true });
}

export async function retryAssignment(req: Request, res: Response) {
  const doc = await AssignmentModel.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Assignment not found");

  
  if (doc.paperId) {
    await PaperModel.findByIdAndDelete(doc.paperId).catch(() => undefined);
    doc.paperId = undefined;
  }

  doc.status = "pending";
  doc.errorMessage = undefined;
  const jobId = await dispatchGeneration(doc.id);
  doc.jobId = jobId;
  await doc.save();

  res.json(serialize(doc));
}
