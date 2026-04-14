import { notFound } from "next/navigation";

import { isR2Configured } from "@/lib/r2/env";
import { getPublicCampaignBySlug } from "@/server/campaigns";

import { CollectForm } from "./collect-form";

type Props = { params: Promise<{ slug: string }> };

export default async function CollectPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await getPublicCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  if (campaign.archivedAt) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-sm font-medium text-on-surface-variant">
          Campaign archived
        </p>
        <h1 className="mt-2 font-headline text-2xl font-bold text-primary-container">
          This collection is no longer active
        </h1>
        <p className="mt-4 text-sm text-on-surface-variant">
          The owner has archived{" "}
          <span className="font-medium text-on-surface">{campaign.name}</span>.
          Please contact them if you still need to submit feedback.
        </p>
      </div>
    );
  }

  if (!campaign.isActive) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-sm font-medium text-on-secondary-container">
          Campaign paused
        </p>
        <h1 className="mt-2 font-headline text-2xl font-bold text-primary-container">
          Not accepting responses
        </h1>
        <p className="mt-4 text-sm text-on-surface-variant">
          The owner has temporarily disabled new submissions for{" "}
          <span className="font-medium text-on-surface">{campaign.name}</span>.
          Please contact them if you need access.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-on-secondary-container">
        Share your experience
      </p>
      <CollectForm
        slug={slug}
        campaignName={campaign.name}
        collectionMode={campaign.collectionMode}
        customQuestions={(campaign.customQuestions ?? []) as any}
        uploadsReady={isR2Configured()}
      />
    </div>
  );
}
