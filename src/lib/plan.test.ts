import { describe, expect, it } from "vitest";

import {
  FREE_PLAN_TESTIMONIAL_LIMIT,
  effectiveCollectionModeForCollect,
  hasActiveProPlan,
} from "./plan";

describe("hasActiveProPlan", () => {
  it("returns false for free tier", () => {
    expect(hasActiveProPlan({ planTier: "free", planExpiresAt: null })).toBe(
      false,
    );
  });

  it("returns true for pro without expiry", () => {
    expect(hasActiveProPlan({ planTier: "pro", planExpiresAt: null })).toBe(
      true,
    );
  });

  it("returns true when pro and expiry is in the future", () => {
    const future = new Date(Date.now() + 60_000);
    expect(hasActiveProPlan({ planTier: "pro", planExpiresAt: future })).toBe(
      true,
    );
  });

  it("returns false when pro but expiry has passed", () => {
    const past = new Date(Date.now() - 60_000);
    expect(hasActiveProPlan({ planTier: "pro", planExpiresAt: past })).toBe(
      false,
    );
  });
});

describe("effectiveCollectionModeForCollect", () => {
  it("forces text_only when not Pro", () => {
    expect(
      effectiveCollectionModeForCollect("text_and_video", false),
    ).toBe("text_only");
    expect(effectiveCollectionModeForCollect("text_only", false)).toBe(
      "text_only",
    );
  });

  it("preserves stored mode when Pro", () => {
    expect(
      effectiveCollectionModeForCollect("text_and_video", true),
    ).toBe("text_and_video");
    expect(effectiveCollectionModeForCollect("text_only", true)).toBe(
      "text_only",
    );
  });
});

describe("FREE_PLAN_TESTIMONIAL_LIMIT", () => {
  it("is 25", () => {
    expect(FREE_PLAN_TESTIMONIAL_LIMIT).toBe(25);
  });
});
