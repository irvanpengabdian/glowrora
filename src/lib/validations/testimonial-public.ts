import { z } from "zod";

import {
  MAX_VIDEO_BYTES,
  MAX_VIDEO_DURATION_SEC,
  VIDEO_CONTENT_TYPES,
} from "@/lib/r2/constants";

const videoContentTypeSchema = z.enum(VIDEO_CONTENT_TYPES);

function emptyToUndefined(v: unknown) {
  if (v === undefined || v === null || v === "") return undefined;
  return v;
}

export const publicTestimonialSubmitSchema = z
  .object({
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
    videoObjectKey: z.preprocess(
      emptyToUndefined,
      z.string().trim().min(1).optional(),
    ),
    videoContentType: z.preprocess(
      emptyToUndefined,
      z.string().trim().optional(),
    ),
    videoByteLength: z.preprocess((v) => {
      if (v === undefined || v === null || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? Math.trunc(n) : undefined;
    }, z.number().int().optional()),
    videoDurationSec: z.preprocess((v) => {
      if (v === undefined || v === null || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? Math.trunc(n) : undefined;
    }, z.number().int().optional()),
    customAnswersJson: z.preprocess(
      emptyToUndefined,
      z.string().trim().min(1).optional(),
    ),
  })
  .superRefine((data, ctx) => {
    const hasKey = Boolean(data.videoObjectKey);
    const hasMeta =
      data.videoContentType != null ||
      data.videoByteLength != null ||
      data.videoDurationSec != null;

    if (!hasKey && !hasMeta) return;

    if (!hasKey) {
      ctx.addIssue({
        code: "custom",
        path: ["videoObjectKey"],
        message: "Video upload is incomplete.",
      });
      return;
    }

    if (!data.videoContentType) {
      ctx.addIssue({
        code: "custom",
        path: ["videoContentType"],
        message: "Video type is missing.",
      });
      return;
    }

    const ct = videoContentTypeSchema.safeParse(data.videoContentType);
    if (!ct.success) {
      ctx.addIssue({
        code: "custom",
        path: ["videoContentType"],
        message: "Unsupported video type.",
      });
      return;
    }

    if (data.videoByteLength == null || Number.isNaN(data.videoByteLength)) {
      ctx.addIssue({
        code: "custom",
        path: ["videoByteLength"],
        message: "Video size is missing.",
      });
      return;
    }
    if (data.videoByteLength <= 0 || data.videoByteLength > MAX_VIDEO_BYTES) {
      ctx.addIssue({
        code: "custom",
        path: ["videoByteLength"],
        message: "Video file is too large.",
      });
      return;
    }

    if (data.videoDurationSec == null || Number.isNaN(data.videoDurationSec)) {
      ctx.addIssue({
        code: "custom",
        path: ["videoDurationSec"],
        message: "Video duration is missing.",
      });
      return;
    }
    if (
      data.videoDurationSec < 1 ||
      data.videoDurationSec > MAX_VIDEO_DURATION_SEC
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["videoDurationSec"],
        message: `Video must be between 1 and ${MAX_VIDEO_DURATION_SEC} seconds.`,
      });
    }
  });

export type PublicTestimonialSubmitInput = z.infer<
  typeof publicTestimonialSubmitSchema
>;
