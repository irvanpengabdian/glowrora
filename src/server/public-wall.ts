import { and, desc, eq } from "drizzle-orm";

import { getDb, testimonials } from "@/db";
import { publicUrlForR2ObjectKey } from "@/lib/r2/public-url";
import type {
  PublicJsonWallPayload,
  PublicJsonWallTestimonial,
} from "@/lib/public-testimonials-json";
import { resolveCampaignForPublicWallSlug } from "@/server/campaigns";

export type PublicWallTestimonial = PublicJsonWallTestimonial;
export type PublicWallPayload = PublicJsonWallPayload;

export type {
  PublicTestimonialsJsonV1,
} from "@/lib/public-testimonials-json";
export { buildPublicTestimonialsJsonV1 } from "@/lib/public-testimonials-json";

export {
  revalidateWallPathSlugsList,
  revalidateWallPathsForCampaignIds,
  revalidateWallPathsForTestimonialIds,
  urlSlugsForWallRoutes,
} from "@/server/wall-revalidate";

/**
 * Resolves Wall of Love by vanity `wall_public_slug` or by collection `public_slug`.
 */
export async function getPublicWallBySlug(
  slug: string,
): Promise<PublicWallPayload | null> {
  const campaign = await resolveCampaignForPublicWallSlug(slug);
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
    collectPublicSlug: campaign.publicSlug,
    testimonials: list,
  };
}
