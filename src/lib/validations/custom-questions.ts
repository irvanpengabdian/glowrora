import { z } from "zod";

export const customQuestionTypeSchema = z.enum([
  "short_text",
  "long_text",
  "multiple_choice",
]);

export type CustomQuestionType = z.infer<typeof customQuestionTypeSchema>;

export const customQuestionSchema = z
  .object({
    id: z.string().trim().min(1).max(64),
    label: z.string().trim().min(1).max(240),
    type: customQuestionTypeSchema,
    required: z.boolean().default(false),
    options: z.array(z.string().trim().min(1).max(120)).optional(),
    order: z.number().int().min(0).optional(),
  })
  .superRefine((q, ctx) => {
    if (q.type === "multiple_choice") {
      if (!q.options || q.options.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message: "Multiple choice questions need at least 2 options.",
        });
      }
      if (q.options) {
        const uniq = new Set(q.options.map((o) => o.trim().toLowerCase()));
        if (uniq.size !== q.options.length) {
          ctx.addIssue({
            code: "custom",
            path: ["options"],
            message: "Options must be unique.",
          });
        }
      }
    } else if (q.options && q.options.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: "Only multiple choice questions can have options.",
      });
    }
  });

export const customQuestionsSchema = z
  .array(customQuestionSchema)
  .max(20, "Too many custom questions (max 20).")
  .superRefine((qs, ctx) => {
    const ids = new Set<string>();
    for (let i = 0; i < qs.length; i += 1) {
      const id = qs[i]?.id;
      if (ids.has(id)) {
        ctx.addIssue({
          code: "custom",
          path: [i, "id"],
          message: "Duplicate question id.",
        });
      }
      ids.add(id);
    }
  });

export type CustomQuestion = z.infer<typeof customQuestionSchema>;

export function normalizeQuestions(input: CustomQuestion[]): CustomQuestion[] {
  // Ensure deterministic order and consecutive `order` values.
  const sorted = [...input].sort((a, b) => {
    const ao = a.order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.order ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return a.id.localeCompare(b.id);
  });
  return sorted.map((q, idx) => ({
    ...q,
    order: idx,
    options:
      q.type === "multiple_choice"
        ? (q.options ?? []).map((o) => o.trim()).filter(Boolean)
        : undefined,
  }));
}

type AnswerValue = string;

export type CustomAnswers = Record<string, AnswerValue>;

export function validateAnswersForQuestions(opts: {
  questions: CustomQuestion[];
  answers: unknown;
}): { ok: true; value: CustomAnswers } | { ok: false; error: string } {
  const answersSchema = z.record(z.string(), z.string());
  const parsed = answersSchema.safeParse(opts.answers);
  if (!parsed.success) {
    return { ok: false, error: "Invalid custom answers." };
  }

  const answers = parsed.data;
  const allowedIds = new Set(opts.questions.map((q) => q.id));
  for (const key of Object.keys(answers)) {
    if (!allowedIds.has(key)) {
      return { ok: false, error: "Custom answers do not match this campaign." };
    }
  }

  for (const q of opts.questions) {
    const raw = (answers[q.id] ?? "").trim();
    if (q.required && raw.length === 0) {
      return { ok: false, error: `Please answer: ${q.label}` };
    }
    if (raw.length === 0) continue;

    if (q.type === "short_text") {
      if (raw.length > 240) {
        return { ok: false, error: `Answer too long: ${q.label}` };
      }
    }
    if (q.type === "long_text") {
      if (raw.length > 2000) {
        return { ok: false, error: `Answer too long: ${q.label}` };
      }
    }
    if (q.type === "multiple_choice") {
      const optsList = q.options ?? [];
      if (!optsList.includes(raw)) {
        return { ok: false, error: `Invalid choice: ${q.label}` };
      }
    }
  }

  // Only keep non-empty strings.
  const cleaned: CustomAnswers = {};
  for (const q of opts.questions) {
    const v = (answers[q.id] ?? "").trim();
    if (v) cleaned[q.id] = v;
  }
  return { ok: true, value: cleaned };
}

