import type { Request, Response } from "express";
import { PaperModel } from "../models/paper.model";
import { HttpError } from "../middleware/error";

function serialize(doc: any) {
  const o = doc.toObject ? doc.toObject() : doc;
  return { ...o, _id: String(o._id) };
}

export async function getPaper(req: Request, res: Response) {
  const doc = await PaperModel.findById(req.params.id);
  if (!doc) throw new HttpError(404, "Paper not found");
  res.json(serialize(doc));
}

export async function getPaperByAssignment(req: Request, res: Response) {
  const doc = await PaperModel.findOne({ assignmentId: req.params.assignmentId }).sort({
    createdAt: -1,
  });
  if (!doc) throw new HttpError(404, "Paper not found for this assignment");
  res.json(serialize(doc));
}
