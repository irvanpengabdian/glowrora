import type { TestimonialWithCampaign } from "@/server/testimonials";

export type TestimonialRowSerializable = Omit<
  TestimonialWithCampaign,
  "createdAt" | "updatedAt" | "reviewedAt"
> & {
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  /** Public R2 playback URL when `R2_PUBLIC_BASE_URL` is set. */
  videoPlaybackUrl: string | null;
};
