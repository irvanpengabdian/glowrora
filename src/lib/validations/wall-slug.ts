import { z } from "zod";

/** Paths that must not be claimed as a public wall slug. */
const RESERVED = new Set(
  [
    "_next",
    "api",
    "admin",
    "collect",
    "love",
    "wall",
    "embed",
    "sign-in",
    "sign-up",
    "dashboard",
    "settings",
    "campaigns",
    "testimonials",
    "static",
    "public",
    "www",
    "favicon",
    "itrustify",
  ].map((s) => s.toLowerCase()),
);

const wallSlugPattern = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export const wallPublicSlugSchema = z.preprocess((v) => {
  if (typeof v !== "string") return v;
  return v.trim().toLowerCase();
}, z
  .string()
  .min(3, "Use at least 3 characters.")
  .max(32, "Use at most 32 characters.")
  .regex(
    wallSlugPattern,
    "Use lowercase letters, numbers, and single hyphens only (no spaces).",
  )
  .refine((s) => !RESERVED.has(s), "That slug is reserved."));
