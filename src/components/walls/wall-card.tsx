"use client";

import Link from "next/link";
import { BarChart3, CheckCircle2, Copy, ExternalLink, Settings2 } from "lucide-react";

import { CopyCollectionLink } from "@/components/campaigns/copy-collection-link";

export type WallCardModel = {
  id: string;
  name: string;
  publicSlug: string;
  isLive: boolean;
  approvedCount: number;
  views: number;
  updatedAtIso: string;
  previewQuotes: string[];
  wallUrl: string;
};

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatusBadge({ live }: { live: boolean }) {
  return (
    <span
      className={
        live
          ? "inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold text-secondary"
          : "inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant"
      }
    >
      {live ? <CheckCircle2 className="size-3.5" /> : <BarChart3 className="size-3.5 opacity-60" />}
      {live ? "Live" : "Draft"}
    </span>
  );
}

function QuotePreview({ quotes }: { quotes: string[] }) {
  const list = quotes.filter(Boolean).slice(0, 3);
  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
          Preview
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">
          Approve testimonials to make this wall feel alive.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low/35 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
        Preview
      </p>
      <div className="mt-3 space-y-2">
        {list.map((q, idx) => (
          <p
            key={idx}
            className="line-clamp-2 text-sm leading-relaxed text-primary-container"
          >
            “{q}”
          </p>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 font-headline text-xl font-extrabold tracking-tight text-primary">
        {value}
      </p>
    </div>
  );
}

export function WallCard({ model }: { model: WallCardModel }) {
  return (
    <section className="group relative overflow-hidden rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(27,28,26,0.08)] md:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-secondary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="min-w-0 truncate font-headline text-xl font-extrabold tracking-tight text-primary">
              {model.name}
            </h2>
            <StatusBadge live={model.isLive} />
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">
            Wall slug{" "}
            <code className="rounded bg-surface-container px-1.5 py-0.5 text-[11px] text-primary-container">
              {model.publicSlug}
            </code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/love/${model.publicSlug}`}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-on-secondary shadow-sm transition hover:opacity-90"
          >
            <ExternalLink className="size-4" />
            Preview
          </Link>
          <Link
            href={`/campaigns/${model.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant/25 bg-surface px-4 py-2 text-xs font-bold text-primary-container transition hover:bg-surface-container-low"
          >
            <Settings2 className="size-4" />
            Manage
          </Link>
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <QuotePreview quotes={model.previewQuotes} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
          <Metric label="Approved" value={model.approvedCount.toLocaleString()} />
          <Metric label="Views" value={model.views.toLocaleString()} />
          <Metric label="Updated" value={formatRelative(model.updatedAtIso)} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-outline-variant/15 bg-surface-container-low/30 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-primary-container">
            Copy wall link
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant">
            <Copy className="size-3.5" />
            Share anywhere
          </span>
        </div>
        <CopyCollectionLink collectionUrl={model.wallUrl} />
      </div>
    </section>
  );
}

