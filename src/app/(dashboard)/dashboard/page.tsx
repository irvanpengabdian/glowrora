import Link from "next/link";

import {
  countCampaignsForUser,
  getTestimonialOverviewForUser,
} from "@/server/testimonials";
import { ensureDbUserId } from "@/server/users";

export const dynamic = "force-dynamic";

type StatCardProps = {
  label: string;
  value: number;
  hint?: string;
  href?: string;
};

function StatCard({ label, value, hint, href }: StatCardProps) {
  const inner = (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 font-headline text-3xl font-bold tabular-nums tracking-tight text-primary-container">
        {value.toLocaleString()}
      </p>
      {hint ? (
        <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
          {hint}
        </p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="tf-card block transition hover:border-secondary/30 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        {inner}
      </Link>
    );
  }

  return <div className="tf-card">{inner}</div>;
}

export default async function DashboardOverviewPage() {
  const userId = await ensureDbUserId();
  const stats = await getTestimonialOverviewForUser(userId);
  const campaignCount = await countCampaignsForUser(userId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="tf-page-title">Overview</h1>
        <p className="tf-page-lead max-w-2xl">
          Snapshot of your campaigns and testimonials. Approve submissions to
          power your Wall of Love and embed widgets.
        </p>
      </div>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Testimonial statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total testimonials"
            value={stats.total}
            hint="Across all active campaigns (not deleted)."
            href="/testimonials"
          />
          <StatCard
            label="Approved"
            value={stats.approved}
            hint="Shown on your public wall and embed."
            href="/testimonials"
          />
          <StatCard
            label="Pending review"
            value={stats.pending}
            hint="Waiting for approve or reject."
            href="/testimonials"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            hint="Not shown publicly."
          />
          <StatCard
            label="Campaigns"
            value={campaignCount}
            hint="Collection links you manage."
            href="/campaigns"
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/campaigns" className="tf-btn-primary text-sm">
          Manage campaigns
        </Link>
        <Link href="/testimonials" className="tf-btn-outline text-sm">
          Review testimonials
        </Link>
        <Link href="/embed" className="tf-btn-outline text-sm">
          Embed widget
        </Link>
      </div>
    </div>
  );
}
