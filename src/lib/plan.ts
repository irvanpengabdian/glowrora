/**
 * Entitlement rules for `users.plan_tier` + `users.plan_expires_at`.
 * Use this everywhere feature gates depend on Pro (limits, branding, etc.).
 */

/** Max testimonials (non-rejected) across all campaigns for Free plan. */
export const FREE_PLAN_TESTIMONIAL_LIMIT = 25;

export type PlanEntitlementRow = {
  planTier: "free" | "pro";
  planExpiresAt: Date | null;
};

export type CollectionMode = "text_only" | "text_and_video";

export function hasActiveProPlan(row: PlanEntitlementRow): boolean {
  if (row.planTier !== "pro") return false;
  if (row.planExpiresAt == null) return true;
  return row.planExpiresAt.getTime() > Date.now();
}

/**
 * Free accounts never collect video on the public form, even if an old row
 * still says `text_and_video`. Pro uses the campaign's stored mode.
 */
export function effectiveCollectionModeForCollect(
  stored: CollectionMode,
  hasActivePro: boolean,
): CollectionMode {
  if (!hasActivePro) return "text_only";
  return stored;
}
