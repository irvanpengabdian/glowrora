import Link from "next/link";
import { Search } from "lucide-react";

import { TestimonialsModerationList } from "@/components/testimonials/testimonials-moderation-list";
import type { TestimonialRowSerializable } from "@/components/testimonials/types";
import { publicUrlForR2ObjectKey } from "@/lib/r2/public-url";
import { listCampaignsForUser } from "@/server/campaigns";
import {
  getTestimonialModerationCountsForUser,
  listTestimonialsForUserAdmin,
  type TestimonialModerationStatusFilter,
  type TestimonialWithCampaign,
} from "@/server/testimonials";
import { ensureDbUserId } from "@/server/users";

export const dynamic = "force-dynamic";

const STATUS_TABS: {
  value: TestimonialModerationStatusFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

type Props = {
  searchParams: Promise<{
    q?: string;
    campaignId?: string;
    status?: string;
  }>;
};

function parseStatus(raw: string | undefined): TestimonialModerationStatusFilter {
  if (
    raw === "pending" ||
    raw === "approved" ||
    raw === "rejected" ||
    raw === "archived" ||
    raw === "all"
  ) {
    return raw;
  }
  return "all";
}

function testimonialsHref(opts: {
  q?: string;
  campaignId?: string;
  status?: TestimonialModerationStatusFilter;
}): string {
  const p = new URLSearchParams();
  if (opts.q?.trim()) p.set("q", opts.q.trim());
  if (opts.campaignId) p.set("campaignId", opts.campaignId);
  if (opts.status && opts.status !== "all") p.set("status", opts.status);
  const s = p.toString();
  return `/testimonials${s ? `?${s}` : ""}`;
}

function toSerializable(
  rows: TestimonialWithCampaign[],
): TestimonialRowSerializable[] {
  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    reviewedAt: r.reviewedAt?.toISOString() ?? null,
    videoPlaybackUrl: publicUrlForR2ObjectKey(r.videoR2ObjectKey),
  }));
}

export default async function TestimonialsPage({ searchParams }: Props) {
  const { q, campaignId, status: statusRaw } = await searchParams;
  const search = typeof q === "string" ? q : undefined;
  const filterCampaignId =
    typeof campaignId === "string" && campaignId.length > 0
      ? campaignId
      : undefined;
  const statusFilter = parseStatus(
    typeof statusRaw === "string" ? statusRaw : undefined,
  );

  let rows: TestimonialWithCampaign[] = [];
  let campaignOptions: Awaited<ReturnType<typeof listCampaignsForUser>> = [];
  let counts: Awaited<
    ReturnType<typeof getTestimonialModerationCountsForUser>
  > | null = null;
  let loadError: string | null = null;

  try {
    const userId = await ensureDbUserId();
    campaignOptions = await listCampaignsForUser(userId);
    counts = await getTestimonialModerationCountsForUser(userId, {
      campaignId: filterCampaignId,
    });
    rows = await listTestimonialsForUserAdmin(userId, {
      search,
      campaignId: filterCampaignId,
      status: statusFilter,
    });
  } catch {
    loadError = "Could not load testimonials.";
  }

  const tabCounts = counts ?? {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    archived: 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
            Inbox Moderation
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-on-surface-variant md:text-base">
            Review, approve, or decline testimonials across your campaigns. Only
            approved items appear on your Wall of Love and embed widgets.
          </p>
        </div>
      </div>

      {loadError ? (
        <p
          className="rounded-xl border border-error-container bg-error-container px-4 py-3 text-sm text-on-error-container"
          role="alert"
        >
          {loadError}
        </p>
      ) : null}

      {!loadError ? (
        <>
          <form
            method="get"
            action="/testimonials"
            className="flex flex-col gap-4 rounded-2xl border border-outline-variant/10 bg-surface-container-low/80 p-4 tf-editorial-shadow sm:flex-row sm:flex-wrap sm:items-end"
          >
            {statusFilter !== "all" ? (
              <input type="hidden" name="status" value={statusFilter} />
            ) : null}
            <div className="min-w-0 flex-1 space-y-1.5">
              <label
                htmlFor="q"
                className="text-xs font-semibold uppercase tracking-wider text-primary-container"
              >
                Search
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/60"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  id="q"
                  name="q"
                  type="search"
                  defaultValue={search ?? ""}
                  placeholder="Search testimonials…"
                  className="tf-input rounded-full pl-10"
                />
              </div>
            </div>
            <div className="w-full space-y-1.5 sm:w-56">
              <label
                htmlFor="campaignId"
                className="text-xs font-semibold uppercase tracking-wider text-primary-container"
              >
                Campaign
              </label>
              <select
                id="campaignId"
                name="campaignId"
                defaultValue={filterCampaignId ?? ""}
                className="tf-input rounded-xl"
              >
                <option value="">All campaigns</option>
                {campaignOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="tf-btn-primary rounded-xl">
                Apply filters
              </button>
              <Link href="/testimonials" className="tf-btn-outline rounded-xl">
                Reset
              </Link>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface-container-low p-1.5 md:w-fit">
            {STATUS_TABS.map(({ value, label }) => {
              const n =
                value === "all"
                  ? tabCounts.all
                  : value === "pending"
                    ? tabCounts.pending
                    : value === "approved"
                      ? tabCounts.approved
                      : value === "rejected"
                        ? tabCounts.rejected
                        : tabCounts.archived;
              const active = statusFilter === value;
              const activeClass =
                value === "archived"
                  ? active
                    ? "bg-surface-container-highest font-semibold text-on-surface"
                    : ""
                  : active
                    ? "bg-secondary/10 font-semibold text-secondary"
                    : "";
              return (
                <Link
                  key={value}
                  href={testimonialsHref({
                    q: search,
                    campaignId: filterCampaignId,
                    status: value,
                  })}
                  className={`rounded-xl px-4 py-2 text-sm transition-colors ${
                    activeClass ||
                    "font-medium text-on-surface-variant hover:bg-surface-container-lowest/80"
                  }`}
                >
                  {label} ({n})
                </Link>
              );
            })}
          </div>

          {!loadError && rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-outline-variant/35 bg-surface-container-lowest/70 px-6 py-14 text-center">
              <p className="font-headline text-lg font-semibold text-primary-container">
                Nothing here yet
              </p>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                No testimonials match these filters. Share a{" "}
                <Link
                  href="/campaigns"
                  className="font-medium text-secondary underline underline-offset-2"
                >
                  collection link
                </Link>{" "}
                to receive submissions.
              </p>
            </div>
          ) : null}

          {!loadError && rows.length > 0 ? (
            <TestimonialsModerationList rows={toSerializable(rows)} />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
