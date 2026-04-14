import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { CampaignGridCard } from "@/components/campaigns/campaign-grid-card";
import { CampaignsEmptyState } from "@/components/campaigns/campaigns-empty-state";
import { getAppOrigin } from "@/lib/site-url";
import { listCampaignsWithStatsForUser } from "@/server/campaigns";
import { ensureDbUserId } from "@/server/users";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ view?: string }>;
};

export default async function CampaignsPage({ searchParams }: Props) {
  const { view } = await searchParams;
  const archivedView = view === "archived";

  let campaigns: Awaited<ReturnType<typeof listCampaignsWithStatsForUser>> = [];
  let loadError: string | null = null;

  try {
    const userId = await ensureDbUserId();
    campaigns = await listCampaignsWithStatsForUser(userId, {
      view: archivedView ? "archived" : "active",
    });
  } catch {
    loadError = "Could not load campaigns. Check that you are signed in.";
  }

  const origin = await getAppOrigin();

  return (
    <div className="space-y-10">
      {loadError ? (
        <p
          className="rounded-xl border border-error-container bg-error-container px-4 py-3 text-sm text-on-error-container"
          role="alert"
        >
          {loadError}
        </p>
      ) : null}

      {!loadError && !archivedView && campaigns.length === 0 ? (
        <CampaignsEmptyState />
      ) : null}

      {!loadError && (archivedView || campaigns.length > 0) ? (
        <>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary">
                {archivedView ? "Archived campaigns" : "Campaigns"}
              </h1>
              <p className="mt-2 max-w-lg leading-relaxed text-on-surface-variant">
                {archivedView
                  ? "Restored campaigns return to your active pipelines and can accept submissions again."
                  : "Manage your evidence collection pipelines. High-conversion links for every touchpoint."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {archivedView ? (
                <Link
                  href="/campaigns"
                  className="rounded-full bg-surface-container-high px-6 py-3 text-sm font-bold text-primary transition hover:bg-surface-container-highest"
                >
                  Active campaigns
                </Link>
              ) : (
                <Link
                  href="/campaigns?view=archived"
                  className="rounded-full bg-surface-container-high px-6 py-3 text-sm font-bold text-primary transition hover:bg-surface-container-highest"
                >
                  View archived
                </Link>
              )}
              {!archivedView ? (
                <Link
                  href="/campaigns/new"
                  className="rounded-full bg-gradient-to-br from-secondary to-secondary-fixed-dim px-6 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/20 transition hover:opacity-90"
                >
                  New campaign
                </Link>
              ) : null}
            </div>
          </div>

          {archivedView && campaigns.length === 0 ? (
            <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low/50 px-6 py-16 text-center">
              <p className="font-headline text-lg font-semibold text-primary">
                No archived campaigns
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Archive a campaign from the active list to park it here without
                deleting data.
              </p>
              <Link
                href="/campaigns"
                className="tf-btn-primary mt-6 inline-flex"
              >
                Back to active
              </Link>
            </div>
          ) : null}

          {!archivedView && campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c) => {
                const collectionUrl = origin
                  ? `${origin}/collect/${c.publicSlug}`
                  : `/collect/${c.publicSlug}`;
                return (
                  <CampaignGridCard
                    key={c.id}
                    variant="active"
                    id={c.id}
                    name={c.name}
                    publicSlug={c.publicSlug}
                    isActive={c.isActive}
                    textReviewCount={c.textReviewCount}
                    videoClipCount={c.videoClipCount}
                    collectionUrl={collectionUrl}
                  />
                );
              })}

              <Link
                href="/campaigns/new"
                className="flex min-h-[280px] flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-outline-variant/30 bg-surface-container-low/30 p-8 text-center opacity-80 transition-opacity hover:opacity-100"
              >
                <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-surface-container-high">
                  <PlusCircle
                    className="size-8 text-on-surface-variant"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
                <h3 className="mb-2 font-headline text-lg font-bold text-primary">
                  New pipeline
                </h3>
                <p className="mb-6 max-w-xs text-sm text-on-surface-variant">
                  Start collecting testimonials for your next launch or client.
                </p>
                <span className="rounded-full border border-primary px-6 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white">
                  Create campaign
                </span>
              </Link>
            </div>
          ) : null}

          {archivedView && campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((c) => {
                const collectionUrl = origin
                  ? `${origin}/collect/${c.publicSlug}`
                  : `/collect/${c.publicSlug}`;
                return (
                  <CampaignGridCard
                    key={c.id}
                    variant="archived"
                    id={c.id}
                    name={c.name}
                    publicSlug={c.publicSlug}
                    isActive={c.isActive}
                    textReviewCount={c.textReviewCount}
                    videoClipCount={c.videoClipCount}
                    collectionUrl={collectionUrl}
                  />
                );
              })}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
