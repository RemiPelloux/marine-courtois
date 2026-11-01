import { researchQuestionSchema, type ResearchQuestion } from "@/types/portfolio";
import type { z } from "zod";

/**
 * Emerging questions (axis D). Add an entry only once the question is
 * documented by Marine Courtois; draft entries stay out of the site.
 *   { id, axisId: "emergentes", question, context, status: "exploration",
 *     visibility: "public", sources: ["owner"] }
 */
const RAW: z.input<typeof researchQuestionSchema>[] = [];

export const QUESTIONS: ResearchQuestion[] = RAW.map((q) => researchQuestionSchema.parse(q));
export const publicQuestions = (axisId?: string) =>
  QUESTIONS.filter((q) => q.visibility === "public" && (!axisId || q.axisId === axisId));
