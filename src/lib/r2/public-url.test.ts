import { afterEach, describe, expect, it, vi } from "vitest";

import { publicUrlForR2ObjectKey } from "./public-url";

describe("publicUrlForR2ObjectKey", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when key missing", () => {
    vi.stubEnv("R2_PUBLIC_BASE_URL", "https://cdn.example.com");
    expect(publicUrlForR2ObjectKey(null)).toBeNull();
    expect(publicUrlForR2ObjectKey("")).toBeNull();
  });

  it("returns null when R2_PUBLIC_BASE_URL unset", () => {
    vi.stubEnv("R2_PUBLIC_BASE_URL", "");
    expect(publicUrlForR2ObjectKey("videos/x/file.webm")).toBeNull();
  });

  it("joins base and key", () => {
    vi.stubEnv("R2_PUBLIC_BASE_URL", "https://cdn.example.com/");
    expect(publicUrlForR2ObjectKey("videos/x/file.webm")).toBe(
      "https://cdn.example.com/videos/x/file.webm",
    );
  });

  it("strips duplicate slashes", () => {
    vi.stubEnv("R2_PUBLIC_BASE_URL", "https://cdn.example.com///");
    expect(publicUrlForR2ObjectKey("/videos/a")).toBe(
      "https://cdn.example.com/videos/a",
    );
  });
});
