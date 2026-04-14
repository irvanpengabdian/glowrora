import { z } from "zod";

export const adminEditTestimonialSchema = z.object({
  testimonialId: z.string().uuid(),
  authorName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name is too long"),
  authorTitle: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      return val;
    },
    z.string().trim().max(120).optional(),
  ),
  rating: z.coerce.number().int().min(1).max(5),
  body: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

export type AdminEditTestimonialInput = z.infer<
  typeof adminEditTestimonialSchema
>;

function parseUuidList(raw: FormDataEntryValue[]): string[] {
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const out: string[] = [];
  for (const v of raw) {
    if (typeof v !== "string") continue;
    const t = v.trim();
    if (uuidRe.test(t)) out.push(t);
  }
  return [...new Set(out)];
}

/** Reads repeated `ids` fields from FormData (bulk forms). */
export function parseBulkTestimonialIds(formData: FormData): string[] {
  return parseUuidList(formData.getAll("ids"));
}
