import { describe, expect, it } from "vitest";

import { buildPublicTestimonialsJsonV1 } from "./public-testimonials-json";

describe("buildPublicTestimonialsJsonV1", () => {
  it("builds v1 payload with empty testimonials", () => {
    const out = buildPublicTestimonialsJsonV1("vanity-wall", {
      campaignName: "Acme",
      campaignDescription: "Hello",
      collectPublicSlug: "collect-abc",
      testimonials: [],
    });
    expect(out).toEqual({
      version: 1,
      campaign: {
        slug: "collect-abc",
        name: "Acme",
        description: "Hello",
      },
      testimonials: [],
    });
  });

  it("maps video fields and hasVideoAsset", () => {
    const out = buildPublicTestimonialsJsonV1("s", {
      campaignName: "C",
      campaignDescription: null,
      collectPublicSlug: "s",
      testimonials: [
        {
          id: "t1",
          authorName: "A",
          authorTitle: null,
          rating: 5,
          body: "Great",
          videoUrl: "https://cdn.example/v.mp4",
          hasVideoWithoutPublicUrl: false,
          videoDurationSec: 45,
        },
        {
          id: "t2",
          authorName: "B",
          authorTitle: "CEO",
          rating: 4,
          body: "Good",
          videoUrl: null,
          hasVideoWithoutPublicUrl: true,
          videoDurationSec: 10,
        },
      ],
    });
    expect(out.testimonials[0]).toMatchObject({
      videoPlaybackUrl: "https://cdn.example/v.mp4",
      hasVideoAsset: true,
      videoDurationSec: 45,
    });
    expect(out.testimonials[1]).toMatchObject({
      videoPlaybackUrl: null,
      hasVideoAsset: true,
      videoDurationSec: 10,
    });
  });
});
