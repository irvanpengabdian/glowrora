import { describe, expect, it } from "vitest";

import { publicTestimonialSubmitSchema } from "./testimonial-public";

describe("publicTestimonialSubmitSchema", () => {
  it("accepts valid text-only submission", () => {
    const r = publicTestimonialSubmitSchema.safeParse({
      authorName: "Jane",
      authorTitle: "",
      rating: "5",
      body: "1234567890 ok",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.authorTitle).toBeUndefined();
      expect(r.data.rating).toBe(5);
    }
  });

  it("rejects short body", () => {
    const r = publicTestimonialSubmitSchema.safeParse({
      authorName: "Jane",
      rating: 3,
      body: "short",
    });
    expect(r.success).toBe(false);
  });

  it("requires all video fields when object key present", () => {
    const r = publicTestimonialSubmitSchema.safeParse({
      authorName: "Jane",
      rating: 5,
      body: "1234567890 enough",
      videoObjectKey: "videos/camp/abc.webm",
    });
    expect(r.success).toBe(false);
  });
});
