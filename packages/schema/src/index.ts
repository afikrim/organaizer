import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const GoalSchema = z.enum([
  "cleaner",
  "safer",
  "storage",
  "work",
  "aesthetics",
]);
export type Goal = z.infer<typeof GoalSchema>;

export const IssueTypeSchema = z.enum([
  "clutter",
  "cable_mess",
  "unsafe_placement",
  "wasted_space",
  "poor_accessibility",
  "storage_opportunity",
  "aesthetic_improvement",
]);
export type IssueType = z.infer<typeof IssueTypeSchema>;

export const PrioritySchema = z.enum(["high", "medium", "low"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const AnalysisStatusSchema = z.literal("complete");
export type AnalysisStatus = z.infer<typeof AnalysisStatusSchema>;

// ---------------------------------------------------------------------------
// Priority helpers
// ---------------------------------------------------------------------------

/** Numeric weight for ordering (higher = more urgent). */
export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/** Sort zones by descending priority. */
export function sortByPriority<T extends { priority: Priority }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
  );
}

// ---------------------------------------------------------------------------
// Box
// ---------------------------------------------------------------------------

/** Bounding box in percentage coordinates (0–100). Nullable on the wire. */
export const BoxSchema = z
  .object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
    width: z.number().min(0).max(100),
    height: z.number().min(0).max(100),
  })
  .nullable();
export type Box = z.infer<typeof BoxSchema>;

// ---------------------------------------------------------------------------
// Zone
// ---------------------------------------------------------------------------

export const ZoneSchema = z.object({
  id: z.string().uuid(),
  number: z.number().int().min(1),
  label: z.string().min(1),
  type: IssueTypeSchema.optional(),
  priority: PrioritySchema,
  box: BoxSchema,
  issue: z.string().min(1),
  suggestion: z.string().min(1),
});
export type Zone = z.infer<typeof ZoneSchema>;

// ---------------------------------------------------------------------------
// FollowUpTurn
// ---------------------------------------------------------------------------

export const FollowUpTurnSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1),
  answer: z.string().min(1),
  safetyNote: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});
export type FollowUpTurn = z.infer<typeof FollowUpTurnSchema>;

// ---------------------------------------------------------------------------
// Analysis
// ---------------------------------------------------------------------------

export const AnalysisSchema = z.object({
  id: z.string().uuid(),
  goal: GoalSchema,
  status: AnalysisStatusSchema,
  summary: z.string().min(1),
  imageUrl: z.string().url(),
  model: z.string().optional(),
  zones: z.array(ZoneSchema),
  checklist: z.array(z.string().min(1)).min(3).max(6),
  followUps: z.array(FollowUpTurnSchema),
  createdAt: z.string().datetime(),
});
export type Analysis = z.infer<typeof AnalysisSchema>;

// ---------------------------------------------------------------------------
// Request payloads
// ---------------------------------------------------------------------------

export const CreateSessionResponseSchema = z.object({
  sessionId: z.string().uuid(),
  token: z.string().min(1),
  createdAt: z.string().datetime(),
});
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

export const CreateAnalysisRequestSchema = z.object({
  goal: GoalSchema,
  // `image` is a multipart file field — validated at the transport layer.
});
export type CreateAnalysisRequest = z.infer<typeof CreateAnalysisRequestSchema>;

export const FollowUpRequestSchema = z.object({
  question: z.string().min(3).max(500),
});
export type FollowUpRequest = z.infer<typeof FollowUpRequestSchema>;

// ---------------------------------------------------------------------------
// FollowUpAnswer (response body for follow-up endpoint)
// ---------------------------------------------------------------------------

export const FollowUpAnswerSchema = z.object({
  analysisId: z.string().uuid(),
  question: z.string().min(1),
  answer: z.string().min(1),
  safetyNote: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
});
export type FollowUpAnswer = z.infer<typeof FollowUpAnswerSchema>;

// ---------------------------------------------------------------------------
// Error shapes
// ---------------------------------------------------------------------------

export const ErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.record(z.string(), z.unknown()).optional(),
});
export type ApiError = z.infer<typeof ErrorSchema>;

export const LowConfidenceErrorSchema = ErrorSchema.extend({
  code: z.literal("low_confidence"),
});
export type LowConfidenceError = z.infer<typeof LowConfidenceErrorSchema>;
