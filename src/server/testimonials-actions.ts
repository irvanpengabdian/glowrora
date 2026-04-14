"use server";

import { revalidatePath } from "next/cache";

import {
  adminEditTestimonialSchema,
  parseBulkTestimonialIds,
} from "@/lib/validations/testimonial-admin";
import {
  revalidateWallPathsForCampaignIds,
  revalidateWallPathsForTestimonialIds,
} from "@/server/public-wall";
import {
  bulkSetTestimonialStatus,
  filterBulkModeratableIds,
  getTestimonialForCampaignOwner,
  updateTestimonialContent,
  updateTestimonialModeration,
} from "@/server/testimonials";
import { ensureDbUserId } from "@/server/users";

function parseUuid(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  )
    ? v
    : null;
}

export async function approveTestimonialAction(
  formData: FormData,
): Promise<void> {
  const testimonialId = parseUuid(formData.get("testimonialId"));
  if (!testimonialId) return;

  const ownerUserId = await ensureDbUserId();
  const reviewerUserId = ownerUserId;

  const existing = await getTestimonialForCampaignOwner(
    ownerUserId,
    testimonialId,
  );
  if (!existing || existing.status !== "pending") return;

  await updateTestimonialModeration(testimonialId, {
    status: "approved",
    reviewedByUserId: reviewerUserId,
    moderationNote: null,
  });

  revalidatePath("/testimonials");
}

export async function rejectTestimonialAction(
  formData: FormData,
): Promise<void> {
  const testimonialId = parseUuid(formData.get("testimonialId"));
  if (!testimonialId) return;

  const noteRaw = formData.get("moderationNote");
  const moderationNote =
    typeof noteRaw === "string" ? noteRaw.slice(0, 2000) : "";

  const ownerUserId = await ensureDbUserId();
  const reviewerUserId = ownerUserId;

  const existing = await getTestimonialForCampaignOwner(
    ownerUserId,
    testimonialId,
  );
  if (!existing || existing.status !== "pending") return;

  await updateTestimonialModeration(testimonialId, {
    status: "rejected",
    reviewedByUserId: reviewerUserId,
    moderationNote: moderationNote.trim() || null,
  });

  revalidatePath("/testimonials");
  await revalidateWallPathsForCampaignIds([existing.campaignId]);
}

export async function updateTestimonialContentAction(
  formData: FormData,
): Promise<void> {
  const parsed = adminEditTestimonialSchema.safeParse({
    testimonialId: formData.get("testimonialId"),
    authorName: formData.get("authorName"),
    authorTitle: formData.get("authorTitle") ?? undefined,
    rating: formData.get("rating"),
    body: formData.get("body"),
  });
  if (!parsed.success) return;

  const ownerUserId = await ensureDbUserId();
  const existing = await getTestimonialForCampaignOwner(
    ownerUserId,
    parsed.data.testimonialId,
  );
  if (!existing) return;

  await updateTestimonialContent(parsed.data.testimonialId, {
    authorName: parsed.data.authorName,
    authorTitle: parsed.data.authorTitle ?? null,
    rating: parsed.data.rating,
    body: parsed.data.body,
  });

  revalidatePath("/testimonials");
  if (existing.status === "approved") {
    await revalidateWallPathsForCampaignIds([existing.campaignId]);
  }
}

export async function bulkApproveTestimonialsAction(
  formData: FormData,
): Promise<void> {
  const requested = parseBulkTestimonialIds(formData);
  if (requested.length === 0) return;

  const ownerUserId = await ensureDbUserId();
  const reviewerUserId = ownerUserId;
  const valid = await filterBulkModeratableIds(ownerUserId, requested);
  if (valid.length === 0) return;

  await bulkSetTestimonialStatus(valid, {
    status: "approved",
    reviewedByUserId: reviewerUserId,
    moderationNote: null,
  });

  revalidatePath("/testimonials");
}

export async function bulkRejectTestimonialsAction(
  formData: FormData,
): Promise<void> {
  const requested = parseBulkTestimonialIds(formData);
  if (requested.length === 0) return;

  const noteRaw = formData.get("bulkModerationNote");
  const bulkNote =
    typeof noteRaw === "string" ? noteRaw.slice(0, 2000).trim() : "";

  const ownerUserId = await ensureDbUserId();
  const reviewerUserId = ownerUserId;
  const valid = await filterBulkModeratableIds(ownerUserId, requested);
  if (valid.length === 0) return;

  await bulkSetTestimonialStatus(valid, {
    status: "rejected",
    reviewedByUserId: reviewerUserId,
    moderationNote: bulkNote || null,
  });

  revalidatePath("/testimonials");
  await revalidateWallPathsForTestimonialIds(valid);
}
