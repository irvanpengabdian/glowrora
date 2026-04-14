import {
  type InferSelectModel,
  and,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  sql,
} from "drizzle-orm";
import { customAlphabet } from "nanoid";

import { campaigns, getDb, testimonials } from "@/db";
import {
  customQuestionsSchema,
  normalizeQuestions,
  type CustomQuestion,
} from "@/lib/validations/custom-questions";
import { getUserPlanEntitlement } from "@/server/plan";

const publicSlugAlphabet = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  12,
);

export type CampaignRow = InferSelectModel<typeof campaigns>;

async function generateUniquePublicSlug(): Promise<string> {
  const db = getDb();
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const candidate = publicSlugAlphabet();
    const clash = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(eq(campaigns.publicSlug, candidate))
      .limit(1);
    if (clash.length === 0) {
      return candidate;
    }
  }
  throw new Error("Could not allocate a unique collection slug");
}

export async function listCampaignsForUser(
  userId: string,
): Promise<CampaignRow[]> {
  const db = getDb();
  return db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.userId, userId), isNull(campaigns.deletedAt)))
    .orderBy(desc(campaigns.createdAt));
}

export type CampaignWithStats = CampaignRow & {
  textReviewCount: number;
  videoClipCount: number;
};

export async function listCampaignsWithStatsForUser(
  userId: string,
  options?: { view?: "active" | "archived" },
): Promise<CampaignWithStats[]> {
  const view = options?.view ?? "active";
  const db = getDb();
  const list = await db
    .select()
    .from(campaigns)
    .where(
      and(
        eq(campaigns.userId, userId),
        isNull(campaigns.deletedAt),
        view === "archived"
          ? isNotNull(campaigns.archivedAt)
          : isNull(campaigns.archivedAt),
      ),
    )
    .orderBy(desc(campaigns.createdAt));
  if (list.length === 0) {
    return [];
  }
  const ids = list.map((c) => c.id);
  const statRows = await db
    .select({
      campaignId: testimonials.campaignId,
      textReviewCount: sql<number>`cast(count(*) filter (where ${testimonials.videoR2ObjectKey} is null) as int)`,
      videoClipCount: sql<number>`cast(count(*) filter (where ${testimonials.videoR2ObjectKey} is not null) as int)`,
    })
    .from(testimonials)
    .where(inArray(testimonials.campaignId, ids))
    .groupBy(testimonials.campaignId);

  const byCampaign = new Map(
    statRows.map((r) => [
      r.campaignId,
      { textReviewCount: r.textReviewCount, videoClipCount: r.videoClipCount },
    ]),
  );

  return list.map((c) => {
    const s = byCampaign.get(c.id);
    return {
      ...c,
      textReviewCount: s?.textReviewCount ?? 0,
      videoClipCount: s?.videoClipCount ?? 0,
    };
  });
}

export async function getOwnedCampaign(
  userId: string,
  campaignId: string,
): Promise<CampaignRow | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(campaigns)
    .where(
      and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, userId),
        isNull(campaigns.deletedAt),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

/** Public resolver: active, not soft-deleted. */
export async function getPublicCampaignBySlug(
  publicSlug: string,
): Promise<CampaignRow | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(campaigns)
    .where(
      and(eq(campaigns.publicSlug, publicSlug), isNull(campaigns.deletedAt)),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function createCampaignForUser(
  userId: string,
  input: { name: string; description?: string | null },
): Promise<CampaignRow> {
  const db = getDb();
  const publicSlug = await generateUniquePublicSlug();
  const entitlement = await getUserPlanEntitlement(userId);
  const collectionMode = entitlement.hasActivePro
    ? "text_and_video"
    : "text_only";
  const [row] = await db
    .insert(campaigns)
    .values({
      userId,
      name: input.name,
      description: input.description?.trim() || null,
      publicSlug,
      collectionMode,
    })
    .returning();
  return row;
}

export async function updateCampaignForOwner(
  userId: string,
  campaignId: string,
  input: { name: string; description: string | null },
): Promise<CampaignRow | null> {
  const db = getDb();
  const [row] = await db
    .update(campaigns)
    .set({
      name: input.name,
      description: input.description,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, userId),
        isNull(campaigns.deletedAt),
      ),
    )
    .returning();
  return row ?? null;
}

export async function updateCampaignCustomQuestionsForOwner(
  userId: string,
  campaignId: string,
  input: { customQuestions: unknown },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = customQuestionsSchema.safeParse(input.customQuestions);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join(" "),
    };
  }

  const normalized = normalizeQuestions(parsed.data as CustomQuestion[]);

  const db = getDb();
  const [row] = await db
    .update(campaigns)
    .set({ customQuestions: normalized, updatedAt: new Date() })
    .where(
      and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, userId),
        isNull(campaigns.deletedAt),
      ),
    )
    .returning({ id: campaigns.id });

  if (!row) return { ok: false, error: "Campaign not found." };
  return { ok: true };
}

/** Moves campaign to archived list and turns off collection (`is_active = false`). */
export async function archiveCampaignForOwner(
  userId: string,
  campaignId: string,
): Promise<boolean> {
  const db = getDb();
  const now = new Date();
  const result = await db
    .update(campaigns)
    .set({
      archivedAt: now,
      isActive: false,
      updatedAt: now,
    })
    .where(
      and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, userId),
        isNull(campaigns.deletedAt),
        isNull(campaigns.archivedAt),
      ),
    )
    .returning({ id: campaigns.id });
  return result.length > 0;
}

/** Restores an archived campaign and re-enables collection submissions. */
export async function restoreCampaignForOwner(
  userId: string,
  campaignId: string,
): Promise<boolean> {
  const db = getDb();
  const now = new Date();
  const result = await db
    .update(campaigns)
    .set({
      archivedAt: null,
      isActive: true,
      updatedAt: now,
    })
    .where(
      and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, userId),
        isNull(campaigns.deletedAt),
        isNotNull(campaigns.archivedAt),
      ),
    )
    .returning({ id: campaigns.id });
  return result.length > 0;
}

/** Sets `deleted_at` and `is_active = false`. Collection link stops resolving. */
export async function softDeleteCampaignForOwner(
  userId: string,
  campaignId: string,
): Promise<boolean> {
  const db = getDb();
  const now = new Date();
  const result = await db
    .update(campaigns)
    .set({
      deletedAt: now,
      isActive: false,
      updatedAt: now,
    })
    .where(
      and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, userId),
        isNull(campaigns.deletedAt),
      ),
    )
    .returning({ id: campaigns.id });
  return result.length > 0;
}
