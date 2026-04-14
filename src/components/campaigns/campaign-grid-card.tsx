"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Link2, Pencil, Video } from "lucide-react";

import { ArchiveCampaignForm } from "./archive-campaign-form";
import { RestoreCampaignForm } from "./restore-campaign-form";
import { ShareCampaignModal } from "./share-campaign-modal";

type Props = {
  id: string;
  name: string;
  publicSlug: string;
  isActive: boolean;
  textReviewCount: number;
  videoClipCount: number;
  collectionUrl: string;
  variant: "active" | "archived";
};

function shortId(id: string) {
  return id.replace(/-/g, "").slice(0, 9).toUpperCase();
}

export function CampaignGridCard({
  id,
  name,
  publicSlug,
  isActive,
  textReviewCount,
  videoClipCount,
  collectionUrl,
  variant,
}: Props) {
  const [shareOpen, setShareOpen] = useState(false);
  const archived = variant === "archived";

  return (
    <>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-outline-variant/10 bg-surface-container-lowest p-8 transition-all hover:tf-editorial-shadow">
        <div className="absolute right-0 top-0 p-4">
          {archived ? (
            <span className="flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span className="size-1.5 rounded-full bg-on-surface-variant/50" aria-hidden />
              Archived
            </span>
          ) : isActive ? (
            <span className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary">
              <span className="size-1.5 rounded-full bg-secondary" aria-hidden />
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              <span className="size-1.5 rounded-full bg-on-surface-variant/50" aria-hidden />
              Paused
            </span>
          )}
        </div>

        <div className="mb-8">
          <h3 className="mb-1 font-headline text-xl font-bold text-primary transition-colors group-hover:text-secondary">
            {name}
          </h3>
          <p className="font-mono text-xs text-on-surface-variant/60">
            ID: {shortId(id)} · /{publicSlug}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-surface-container-low p-4 text-center">
            <FileText
              className="mx-auto mb-2 size-5 text-primary/40"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="font-headline text-2xl font-bold text-primary">
              {textReviewCount}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
              Text reviews
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-4 text-center">
            <Video
              className="mx-auto mb-2 size-5 text-primary/40"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="font-headline text-2xl font-bold text-primary">
              {videoClipCount}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
              Video clips
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-4 border-t border-surface-container-low pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/campaigns/${id}`}
              className="flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary"
            >
              <Pencil className="size-4" strokeWidth={2} aria-hidden />
              Settings
            </Link>
            {!archived ? (
              <ArchiveCampaignForm campaignId={id} campaignName={name} />
            ) : null}
          </div>
          {archived ? (
            <RestoreCampaignForm campaignId={id} campaignName={name} />
          ) : (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-xs font-bold text-on-secondary shadow-md shadow-secondary/10 transition hover:bg-secondary/90"
            >
              <Link2 className="size-3.5" strokeWidth={2} aria-hidden />
              Generate link
            </button>
          )}
        </div>
      </div>

      {!archived ? (
        <ShareCampaignModal
          collectionUrl={collectionUrl}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          campaignName={name}
        />
      ) : null}
    </>
  );
}
