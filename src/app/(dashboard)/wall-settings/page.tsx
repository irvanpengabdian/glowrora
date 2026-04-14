import Link from "next/link";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

import { WallCard, type WallCardModel } from "@/components/walls/wall-card";
import { WallStatsBar } from "@/components/walls/wall-stats-bar";
import { campaigns, getDb, testimonials } from "@/db";
import { getAppOrigin } from "@/lib/site-url";
import { listCampaignsForUser } from "@/server/campaigns";
import { ensureDbUserId } from "@/server/users";

export const dynamic = "force-dynamic";

export default async function WallSettingsPage() {
  const userId = await ensureDbUserId();
  const campaigns = await listCampaignsForUser(userId);
  const origin = await getAppOrigin();

  const db = getDb();
  const ids = campaigns.map((c) => c.id);
  const approvedByCampaign = ids.length
    ? await db
        .select({
          campaignId: testimonials.campaignId,
          approvedCount: sql<number>`cast(count(*) as int)`,
          lastApprovedAt: sql<Date | null>`max(${testimonials.createdAt})`,
        })
        .from(testimonials)
        .where(and(inArray(testimonials.campaignId, ids), eq(testimonials.status, "approved")))
        .groupBy(testimonials.campaignId)
    : [];

  const approvedMap = new Map(
    approvedByCampaign.map((r) => [r.campaignId, { n: r.approvedCount, last: r.lastApprovedAt }]),
  );

  const previewRows = ids.length
    ? await db
        .select({
          campaignId: testimonials.campaignId,
          body: testimonials.body,
          createdAt: testimonials.createdAt,
        })
        .from(testimonials)
        .where(and(inArray(testimonials.campaignId, ids), eq(testimonials.status, "approved")))
        .orderBy(desc(testimonials.createdAt))
        .limit(120)
    : [];

  const previews = new Map<string, string[]>();
  for (const r of previewRows) {
    const list = previews.get(r.campaignId) ?? [];
    if (list.length < 3) {
      list.push(r.body.trim().slice(0, 180));
      previews.set(r.campaignId, list);
    }
  }

  const totalWalls = campaigns.length;
  const totalApproved = approvedByCampaign.reduce((acc, r) => acc + (r.approvedCount ?? 0), 0);
  const totalViews = 0; // MVP: view tracking coming soon

  const wallCards: WallCardModel[] = campaigns.map((c) => {
    const wallUrl = origin ? `${origin}/love/${c.publicSlug}` : `/love/${c.publicSlug}`;
    const approved = approvedMap.get(c.id)?.n ?? 0;
    const isLive = Boolean(c.isActive) && approved > 0;
    return {
      id: c.id,
      name: c.name,
      publicSlug: c.publicSlug,
      isLive,
      approvedCount: approved,
      views: 0,
      updatedAtIso: c.updatedAt.toISOString(),
      previewQuotes: previews.get(c.id) ?? [],
      wallUrl,
    };
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">
            Your Wall of Love
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            Real stories from real clients. Ready to be shared.
          </p>
        </div>
        <Link
          href="/campaigns/new"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary-fixed-dim px-6 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/20 transition hover:opacity-90"
        >
          + Create New Wall of Love
        </Link>
      </header>

      <WallStatsBar
        totalWalls={totalWalls}
        totalTestimonials={totalApproved}
        totalViews={totalViews}
      />

      {wallCards.length === 0 ? (
        <section className="relative overflow-hidden rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-10 text-center tf-editorial-shadow">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-on-secondary-container">
            Start sharing proof
          </p>
          <h2 className="mt-3 font-headline text-2xl font-extrabold tracking-tight text-primary">
            Create your first Wall of Love
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-on-surface-variant">
            Walls are generated per campaign. Create a campaign, collect
            testimonials, then approve the best stories to go live.
          </p>
          <div className="mt-7 flex justify-center">
            <Link href="/campaigns/new" className="tf-btn-primary rounded-full px-8">
              Create campaign
            </Link>
          </div>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {wallCards.map((w) => (
            <WallCard key={w.id} model={w} />
          ))}
        </div>
      )}
    </div>
  );
}
