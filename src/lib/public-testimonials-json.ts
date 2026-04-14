/** Row shape produced by `getPublicWallBySlug` before JSON serialization. */
export type PublicJsonWallTestimonial = {
  id: string;
  authorName: string;
  authorTitle: string | null;
  rating: number;
  body: string;
  videoUrl: string | null;
  hasVideoWithoutPublicUrl: boolean;
  videoDurationSec: number | null;
};

export type PublicJsonWallPayload = {
  campaignName: string;
  campaignDescription: string | null;
  testimonials: PublicJsonWallTestimonial[];
};

/** Stable shape for `GET /api/public/campaigns/[slug]/testimonials`. */
export type PublicTestimonialsJsonV1 = {
  version: 1;
  campaign: {
    slug: string;
    name: string;
    description: string | null;
  };
  testimonials: Array<{
    id: string;
    authorName: string;
    authorTitle: string | null;
    rating: number;
    body: string;
    videoPlaybackUrl: string | null;
    videoDurationSec: number | null;
    hasVideoAsset: boolean;
  }>;
};

export function buildPublicTestimonialsJsonV1(
  slug: string,
  wall: PublicJsonWallPayload,
): PublicTestimonialsJsonV1 {
  return {
    version: 1,
    campaign: {
      slug,
      name: wall.campaignName,
      description: wall.campaignDescription,
    },
    testimonials: wall.testimonials.map((t) => ({
      id: t.id,
      authorName: t.authorName,
      authorTitle: t.authorTitle,
      rating: t.rating,
      body: t.body,
      videoPlaybackUrl: t.videoUrl,
      videoDurationSec: t.videoDurationSec,
      hasVideoAsset: Boolean(t.videoUrl) || t.hasVideoWithoutPublicUrl,
    })),
  };
}
