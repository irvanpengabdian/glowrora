export type TrustifyApiV1 = {
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
