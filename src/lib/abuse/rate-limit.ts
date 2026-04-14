import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function env(name: string): string | null {
  const v = process.env[name];
  return v && v.trim().length > 0 ? v.trim() : null;
}

export function isRateLimitConfigured(): boolean {
  return Boolean(env("UPSTASH_REDIS_REST_URL") && env("UPSTASH_REDIS_REST_TOKEN"));
}

function getLimiter(prefix: string, limit: number, windowSeconds: number) {
  if (!isRateLimitConfigured()) return null;
  const redis = new Redis({
    url: env("UPSTASH_REDIS_REST_URL")!,
    token: env("UPSTASH_REDIS_REST_TOKEN")!,
  });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    prefix,
  });
}

export async function rateLimitOrBypass(opts: {
  /**
   * Unique key for the actor making the request. Recommend using
   * `ip + campaignSlug` so multiple campaigns don't share the same bucket.
   */
  key: string;
  /** Logical limiter name, e.g. "collect_submit" */
  name: string;
  /** Max number of events in the window. */
  limit: number;
  /** Window length (seconds). */
  windowSeconds: number;
}): Promise<
  | { ok: true }
  | { ok: false; retryAfterSec: number | null; remaining: number | null }
> {
  const rl = getLimiter(`trustify:${opts.name}`, opts.limit, opts.windowSeconds);
  if (!rl) return { ok: true };

  const res = await rl.limit(opts.key);
  if (res.success) return { ok: true };
  return {
    ok: false,
    retryAfterSec: res.reset ? Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)) : null,
    remaining: typeof res.remaining === "number" ? res.remaining : null,
  };
}

