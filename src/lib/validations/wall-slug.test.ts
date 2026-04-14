import { describe, expect, it } from "vitest";

import { wallPublicSlugSchema } from "./wall-slug";

describe("wallPublicSlugSchema", () => {
  it("accepts valid slugs", () => {
    expect(wallPublicSlugSchema.safeParse("acme-wall").success).toBe(true);
    expect(wallPublicSlugSchema.safeParse("  TeSt-12  ").data).toBe("test-12");
  });

  it("rejects reserved", () => {
    expect(wallPublicSlugSchema.safeParse("collect").success).toBe(false);
    expect(wallPublicSlugSchema.safeParse("api").success).toBe(false);
  });

  it("rejects invalid pattern", () => {
    expect(wallPublicSlugSchema.safeParse("ab").success).toBe(false);
    expect(wallPublicSlugSchema.safeParse("no spaces").success).toBe(false);
    expect(wallPublicSlugSchema.safeParse("-bad").success).toBe(false);
  });
});
