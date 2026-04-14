import { and, eq, ne, or } from "drizzle-orm";

import { campaigns, getDb } from "@/db";
import { wallPublicSlugSchema } from "@/lib/validations/wall-slug";
import { getOwnedCampaign } from "@/server/campaigns";
import { getUserPlanEntitlement } from "@/server/plan";
import {
  revalidateWallPathSlugsList,
  urlSlugsForWallRoutes,
} from "@/server/wall-revalidate";

/**
 * Pro: set or clear vanity `/love/[slug]`. Collect URL stays `/collect/[publicSlug]`.
 * Slug must be globally unique vs all `public_slug` and `wall_public_slug` values.
 */
export async function updateCampaignWallSlugForOwner(
  userId: string,
  campaignId: string,
  rawWallSlug: string | null | undefined,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const entitlement = await getUserPlanEntitlement(userId);
  if (!entitlement.hasActivePro) {
    return {
      ok: false,
      error: "Custom Wall of Love URLs are available on Pro.",
    };
  }

  const campaign = await getOwnedCampaign(userId, campaignId);
  if (!campaign) {
    return { ok: false, error: "Campaign not found." };
  }

  const prevSlugs = urlSlugsForWallRoutes({
    publicSlug: campaign.publicSlug,
    wallPublicSlug: campaign.wallPublicSlug,
  });

  const normalized =
    rawWallSlug === null || rawWallSlug === undefined || rawWallSlug === ""
      ? null
      : rawWallSlug.trim().toLowerCase();

  const db = getDb();

  if (normalized === null) {
    await db
      .update(campaigns)
      .set({ wallPublicSlug: null, updatedAt: new Date() })
      .where(eq(campaigns.id, campaignId));
    const nextSlugs = urlSlugsForWallRoutes({
      publicSlug: campaign.publicSlug,
      wallPublicSlug: null,
    });
    await revalidateWallPathSlugsList([
      ...new Set([...prevSlugs, ...nextSlugs]),
    ]);
    return { ok: true };
  }

  const parsed = wallPublicSlugSchema.safeParse(normalized);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid slug.";
    return { ok: false, error: msg };
  }

  const slug = parsed.data;

  if (slug === campaign.publicSlug) {
    return {
      ok: false,
      error: "Wall slug must differ from your collection link slug.",
    };
  }

  const clash = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(
      and(
        ne(campaigns.id, campaignId),
        or(eq(campaigns.publicSlug, slug), eq(campaigns.wallPublicSlug, slug)),
      ),
    )
    .limit(1);

  if (clash.length > 0) {
    return {
      ok: false,
      error: "That slug is already used by another campaign or wall.",
    };
  }

  await db
    .update(campaigns)
    .set({ wallPublicSlug: slug, updatedAt: new Date() })
    .where(eq(campaigns.id, campaignId));

  const nextSlugs = urlSlugsForWallRoutes({
    publicSlug: campaign.publicSlug,
    wallPublicSlug: slug,
  });
  await revalidateWallPathSlugsList([
    ...new Set([...prevSlugs, ...nextSlugs]),
  ]);
  return { ok: true };
}
