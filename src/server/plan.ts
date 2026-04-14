import { and, eq, ne, sql } from "drizzle-orm";

import { campaigns, getDb, testimonials, users } from "@/db";
import { hasActiveProPlan } from "@/lib/plan";

export type UserPlanEntitlement = {
  planTier: "free" | "pro";
  planExpiresAt: Date | null;
  hasActivePro: boolean;
};

export class ProRequiredError extends Error {
  constructor() {
    super("PRO_REQUIRED");
    this.name = "ProRequiredError";
  }
}

/**
 * Load plan columns for dashboard / billing. Use `hasActivePro` for feature gates.
 */
export async function getUserPlanEntitlement(
  userId: string,
): Promise<UserPlanEntitlement> {
  const db = getDb();
  const rows = await db
    .select({
      planTier: users.planTier,
      planExpiresAt: users.planExpiresAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    throw new Error("USER_NOT_FOUND");
  }
  const planTier = row.planTier;
  const planExpiresAt = row.planExpiresAt;
  return {
    planTier,
    planExpiresAt,
    hasActivePro: hasActiveProPlan({ planTier, planExpiresAt }),
  };
}

/** Call at the start of server actions or routes that require an active Pro entitlement. */
export async function requireActiveProPlan(userId: string): Promise<void> {
  const e = await getUserPlanEntitlement(userId);
  if (!e.hasActivePro) {
    throw new ProRequiredError();
  }
}

/**
 * Counts testimonials that consume the Free plan cap (rejected submissions do not).
 * Includes all campaigns owned by the user (active, archived, or soft-deleted).
 */
export async function countNonRejectedTestimonialsForUser(
  userId: string,
): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({
      n: sql<number>`cast(count(*) as int)`,
    })
    .from(testimonials)
    .innerJoin(campaigns, eq(testimonials.campaignId, campaigns.id))
    .where(
      and(eq(campaigns.userId, userId), ne(testimonials.status, "rejected")),
    );
  return rows[0]?.n ?? 0;
}
