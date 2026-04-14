import { revalidatePath } from "next/cache";
import { and, desc, eq, inArray } from "drizzle-orm";

import { campaigns, getDb, testimonials } from "@/db";
import { publicUrlForR2ObjectKey } from "@/lib/r2/public-url";
import type {
  PublicJsonWallPayload,
  PublicJsonWallTestimonial,
} from "@/lib/public-testimonials-json";
import { getPublicCampaignBySlug } from "@/server/campaigns";

export type PublicWallTestimonial = PublicJsonWallTestimonial;
export type PublicWallPayload = PublicJsonWallPayload;

export type {
  PublicTestimonialsJsonV1,
} from "@/lib/public-testimonials-json";
export { buildPublicTestimonialsJsonV1 } from "@/lib/public-testimonials-json";

/**
 * Resolves a campaign by `public_slug` and returns approved testimonials only.
 * Returns `null` if the campaign does not exist or is soft-deleted.
 */
export async function getPublicWallBySlug(
  publicSlug: string,
): Promise<PublicWallPayload | null> {
  const campaign = await getPublicCampaignBySlug(publicSlug.trim());
  if (!campaign) return null;

  const db = getDb();
  const rows = await db
    .select({
      id: testimonials.id,
      authorName: testimonials.authorName,
      authorTitle: testimonials.authorTitle,
      rating: testimonials.rating,
      body: testimonials.body,
      videoR2ObjectKey: testimonials.videoR2ObjectKey,
      videoDurationSec: testimonials.videoDurationSec,
    })
    .from(testimonials)
    .where(
      and(
        eq(testimonials.campaignId, campaign.id),
        eq(testimonials.status, "approved"),
      ),
    )
    .orderBy(desc(testimonials.createdAt));

  const list: PublicWallTestimonial[] = rows.map((r) => {
    const videoUrl = publicUrlForR2ObjectKey(r.videoR2ObjectKey);
    const hasKey = Boolean(r.videoR2ObjectKey);
    return {
      id: r.id,
      authorName: r.authorName,
      authorTitle: r.authorTitle,
      rating: r.rating,
      body: r.body,
      videoUrl,
      hasVideoWithoutPublicUrl: hasKey && !videoUrl,
      videoDurationSec: r.videoDurationSec,
    };
  });

  return {
    campaignName: campaign.name,
    campaignDescription: campaign.description,
    testimonials: list,
  };
}

/** Busts the cache for every `/wall/[slug]` and `/love/[slug]` tied to the given campaigns. */
export async function revalidateWallPathsForCampaignIds(
  campaignIds: string[],
): Promise<void> {
  const unique = [...new Set(campaignIds)].filter(Boolean);
  if (unique.length === 0) return;
  const db = getDb();
  const rows = await db
    .select({ publicSlug: campaigns.publicSlug })
    .from(campaigns)
    .where(inArray(campaigns.id, unique));
  for (const { publicSlug } of rows) {
    revalidatePath(`/wall/${publicSlug}`);
    revalidatePath(`/love/${publicSlug}`);
    revalidatePath(`/api/public/campaigns/${publicSlug}/testimonials`);
  }
}

export async function revalidateWallPathsForTestimonialIds(
  testimonialIds: string[],
): Promise<void> {
  if (testimonialIds.length === 0) return;
  const db = getDb();
  const rows = await db
    .select({ campaignId: testimonials.campaignId })
    .from(testimonials)
    .where(inArray(testimonials.id, testimonialIds))
    .groupBy(testimonials.campaignId);
  await revalidateWallPathsForCampaignIds(rows.map((r) => r.campaignId));
}
