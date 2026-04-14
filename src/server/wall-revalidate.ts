import { revalidatePath } from "next/cache";
import { inArray } from "drizzle-orm";

import { campaigns, getDb, testimonials } from "@/db";

/** Every URL segment that resolves this campaign's public wall or JSON API. */
export function urlSlugsForWallRoutes(row: {
  publicSlug: string;
  wallPublicSlug: string | null;
}): string[] {
  const s = new Set<string>([row.publicSlug]);
  if (row.wallPublicSlug && row.wallPublicSlug !== row.publicSlug) {
    s.add(row.wallPublicSlug);
  }
  return [...s];
}

export async function revalidateWallPathSlugsList(
  slugs: string[],
): Promise<void> {
  for (const slug of [...new Set(slugs.filter(Boolean))]) {
    revalidatePath(`/wall/${slug}`);
    revalidatePath(`/love/${slug}`);
    revalidatePath(`/api/public/campaigns/${slug}/testimonials`);
  }
}

export async function revalidateWallPathsForCampaignIds(
  campaignIds: string[],
): Promise<void> {
  const unique = [...new Set(campaignIds)].filter(Boolean);
  if (unique.length === 0) return;
  const db = getDb();
  const rows = await db
    .select({
      publicSlug: campaigns.publicSlug,
      wallPublicSlug: campaigns.wallPublicSlug,
    })
    .from(campaigns)
    .where(inArray(campaigns.id, unique));
  const slugSet = new Set<string>();
  for (const r of rows) {
    for (const s of urlSlugsForWallRoutes({
      publicSlug: r.publicSlug,
      wallPublicSlug: r.wallPublicSlug,
    })) {
      slugSet.add(s);
    }
  }
  await revalidateWallPathSlugsList([...slugSet]);
}

export async function revalidateWallPathsForTestimonialIds(
  testimonialIds: string[],
): Promise<void> {
  if (testimonialIds.length === 0) return;
  const db = getDb();
  const rows = await db
    .select({ campaignId: testimonials.campaignId })
    .from(testimonials)
    .where(inArray(testimonials.id, testimonialIds))
    .groupBy(testimonials.campaignId);
  await revalidateWallPathsForCampaignIds(rows.map((r) => r.campaignId));
}
