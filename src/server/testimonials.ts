import {
  type InferSelectModel,
  and,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  isNull,
  or,
  sql,
} from "drizzle-orm";

import { campaigns, getDb, testimonials } from "@/db";

export type TestimonialRow = InferSelectModel<typeof testimonials>;

export type TestimonialWithCampaign = TestimonialRow & {
  campaignName: string;
};

export type TestimonialModerationStatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "archived";

function escapeIlikePattern(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

function campaignOwnerFilter(
  userId: string,
  campaignId?: string,
) {
  const ownerScope = and(
    eq(campaigns.userId, userId),
    isNull(campaigns.deletedAt),
  );
  return campaignId
    ? and(ownerScope, eq(campaigns.id, campaignId))
    : ownerScope;
}

/**
 * Counts per moderation tab for the owner scope (optionally one campaign).
 */
export async function getTestimonialModerationCountsForUser(
  userId: string,
  options?: { campaignId?: string },
): Promise<{
  all: number;
  pending: number;
  approved: number;
  rejected: number;
  archived: number;
}> {
  const db = getDb();
  const campaignFilter = campaignOwnerFilter(userId, options?.campaignId);

  const [row] = await db
    .select({
      all: sql<number>`cast(count(*) as int)`,
      pending: sql<number>`cast(count(*) filter (where ${testimonials.status} = 'pending') as int)`,
      approved: sql<number>`cast(count(*) filter (where ${testimonials.status} = 'approved') as int)`,
      rejected: sql<number>`cast(count(*) filter (where ${testimonials.status} = 'rejected') as int)`,
      archived: sql<number>`cast(count(*) filter (where ${testimonials.status} = 'archived') as int)`,
    })
    .from(testimonials)
    .innerJoin(campaigns, eq(testimonials.campaignId, campaigns.id))
    .where(campaignFilter);

  return (
    row ?? {
      all: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      archived: 0,
    }
  );
}

/**
 * All testimonials for campaigns owned by `userId`, newest first.
 * Optional `search` matches author name or body (case-insensitive).
 * Optional `campaignId` must belong to the same user or no rows are returned.
 */
export async function listTestimonialsForUserAdmin(
  userId: string,
  options: {
    search?: string;
    campaignId?: string;
    status?: TestimonialModerationStatusFilter;
  },
): Promise<TestimonialWithCampaign[]> {
  const db = getDb();

  const campaignFilter = campaignOwnerFilter(userId, options.campaignId);

  const search = options.search?.trim();
  const searchClause =
    search && search.length > 0
      ? or(
          ilike(
            testimonials.authorName,
            `%${escapeIlikePattern(search)}%`,
          ),
          ilike(testimonials.body, `%${escapeIlikePattern(search)}%`),
        )
      : undefined;

  const status = options.status ?? "all";
  const statusClause =
    status !== "all" ? eq(testimonials.status, status) : undefined;

  const whereClause = and(campaignFilter, searchClause, statusClause);

  const rows = await db
    .select({
      id: testimonials.id,
      campaignId: testimonials.campaignId,
      status: testimonials.status,
      authorName: testimonials.authorName,
      authorTitle: testimonials.authorTitle,
      rating: testimonials.rating,
      body: testimonials.body,
      videoR2ObjectKey: testimonials.videoR2ObjectKey,
      videoDurationSec: testimonials.videoDurationSec,
      videoByteLength: testimonials.videoByteLength,
      videoContentType: testimonials.videoContentType,
      extraAnswers: testimonials.extraAnswers,
      displayOrder: testimonials.displayOrder,
      reviewedAt: testimonials.reviewedAt,
      reviewedByUserId: testimonials.reviewedByUserId,
      moderationNote: testimonials.moderationNote,
      createdAt: testimonials.createdAt,
      updatedAt: testimonials.updatedAt,
      campaignName: campaigns.name,
    })
    .from(testimonials)
    .innerJoin(campaigns, eq(testimonials.campaignId, campaigns.id))
    .where(whereClause)
    .orderBy(desc(testimonials.createdAt));

  return rows;
}

/** Returns testimonial row only if its campaign is owned by `userId`. */
export async function getTestimonialForCampaignOwner(
  userId: string,
  testimonialId: string,
): Promise<TestimonialRow | null> {
  const db = getDb();
  const rows = await db
    .select(getTableColumns(testimonials))
    .from(testimonials)
    .innerJoin(campaigns, eq(testimonials.campaignId, campaigns.id))
    .where(
      and(
        eq(testimonials.id, testimonialId),
        eq(campaigns.userId, userId),
        isNull(campaigns.deletedAt),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function updateTestimonialModeration(
  testimonialId: string,
  input: {
    status: "approved" | "rejected";
    reviewedByUserId: string;
    moderationNote?: string | null;
  },
): Promise<void> {
  const db = getDb();
  await db
    .update(testimonials)
    .set({
      status: input.status,
      reviewedAt: new Date(),
      reviewedByUserId: input.reviewedByUserId,
      moderationNote:
        input.status === "rejected"
          ? (input.moderationNote?.trim() || null)
          : null,
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, testimonialId));
}

export async function updateTestimonialContent(
  testimonialId: string,
  input: {
    authorName: string;
    authorTitle: string | null;
    rating: number;
    body: string;
  },
): Promise<void> {
  const db = getDb();
  await db
    .update(testimonials)
    .set({
      authorName: input.authorName,
      authorTitle: input.authorTitle,
      rating: input.rating,
      body: input.body,
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, testimonialId));
}

/**
 * IDs that are pending, owned by `ownerUserId`, and in `requestedIds`.
 */
export async function filterBulkModeratableIds(
  ownerUserId: string,
  requestedIds: string[],
): Promise<string[]> {
  if (requestedIds.length === 0) return [];
  const db = getDb();
  const rows = await db
    .select({ id: testimonials.id })
    .from(testimonials)
    .innerJoin(campaigns, eq(testimonials.campaignId, campaigns.id))
    .where(
      and(
        inArray(testimonials.id, requestedIds),
        eq(campaigns.userId, ownerUserId),
        eq(testimonials.status, "pending"),
        isNull(campaigns.deletedAt),
      ),
    );
  return rows.map((r) => r.id);
}

export async function bulkSetTestimonialStatus(
  testimonialIds: string[],
  input: {
    status: "approved" | "rejected";
    reviewedByUserId: string;
    moderationNote?: string | null;
  },
): Promise<void> {
  if (testimonialIds.length === 0) return;
  const db = getDb();
  const now = new Date();
  await db
    .update(testimonials)
    .set({
      status: input.status,
      reviewedAt: now,
      reviewedByUserId: input.reviewedByUserId,
      moderationNote:
        input.status === "rejected"
          ? (input.moderationNote?.trim() || null)
          : null,
      updatedAt: now,
    })
    .where(inArray(testimonials.id, testimonialIds));
}

export type TestimonialOverviewStats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
};

/**
 * Aggregate testimonial counts for all non-deleted campaigns owned by the user.
 */
export async function getTestimonialOverviewForUser(
  userId: string,
): Promise<TestimonialOverviewStats> {
  const db = getDb();
  const [row] = await db
    .select({
      total: sql<number>`cast(count(${testimonials.id}) as int)`,
      approved: sql<number>`cast(count(*) filter (where ${testimonials.status} = 'approved') as int)`,
      pending: sql<number>`cast(count(*) filter (where ${testimonials.status} = 'pending') as int)`,
      rejected: sql<number>`cast(count(*) filter (where ${testimonials.status} = 'rejected') as int)`,
    })
    .from(testimonials)
    .innerJoin(campaigns, eq(testimonials.campaignId, campaigns.id))
    .where(and(eq(campaigns.userId, userId), isNull(campaigns.deletedAt)));

  return {
    total: row?.total ?? 0,
    approved: row?.approved ?? 0,
    pending: row?.pending ?? 0,
    rejected: row?.rejected ?? 0,
  };
}

/** Count of campaigns (not soft-deleted) for the user. */
export async function countCampaignsForUser(userId: string): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({
      n: sql<number>`cast(count(*) as int)`,
    })
    .from(campaigns)
    .where(and(eq(campaigns.userId, userId), isNull(campaigns.deletedAt)));
  return row?.n ?? 0;
}
