import { Router } from "express";
import { CreateAssignmentSchema, ToolGenerateSchema } from "@vedaai/shared";
import { validateBody } from "../middleware/validate";
import { asyncHandler } from "../middleware/async";
import { generateTool } from "../controllers/tools.controller";
import {
  createAssignment,
  deleteAssignment,
  getAssignment,
  listAssignments,
  retryAssignment,
} from "../controllers/assignment.controller";
import { getPaper, getPaperByAssignment } from "../controllers/paper.controller";
import { mongoState } from "../db/mongoose";
import { redisStatus } from "../queue/queue";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, mongo: mongoState(), redis: redisStatus() });
});


router.post("/assignments", validateBody(CreateAssignmentSchema), asyncHandler(createAssignment));
router.get("/assignments", asyncHandler(listAssignments));
router.get("/assignments/:id", asyncHandler(getAssignment));
router.delete("/assignments/:id", asyncHandler(deleteAssignment));
router.post("/assignments/:id/retry", asyncHandler(retryAssignment));


router.get("/papers/by-assignment/:assignmentId", asyncHandler(getPaperByAssignment));
router.get("/papers/:id", asyncHandler(getPaper));


router.post("/tools/generate", validateBody(ToolGenerateSchema), asyncHandler(generateTool));
