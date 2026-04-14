import { notFound } from "next/navigation";

import {
  FREE_PLAN_TESTIMONIAL_LIMIT,
  effectiveCollectionModeForCollect,
} from "@/lib/plan";
import { isR2Configured } from "@/lib/r2/env";
import type { CustomQuestion } from "@/lib/validations/custom-questions";
import { getPublicCampaignBySlug } from "@/server/campaigns";
import {
  countNonRejectedTestimonialsForUser,
  getUserPlanEntitlement,
} from "@/server/plan";

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

  const ownerPlan = await getUserPlanEntitlement(campaign.userId);
  const collectionMode = effectiveCollectionModeForCollect(
    campaign.collectionMode,
    ownerPlan.hasActivePro,
  );
  const testimonialCount = await countNonRejectedTestimonialsForUser(
    campaign.userId,
  );
  const atCapacity =
    !ownerPlan.hasActivePro &&
    testimonialCount >= FREE_PLAN_TESTIMONIAL_LIMIT;

  if (atCapacity) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-sm font-medium text-on-surface-variant">
          Collection full
        </p>
        <h1 className="mt-2 font-headline text-2xl font-bold text-primary-container">
          No new testimonials right now
        </h1>
        <p className="mt-4 text-sm text-on-surface-variant">
          This workspace has reached the Free plan limit (
          {FREE_PLAN_TESTIMONIAL_LIMIT} stories). Please contact the owner of{" "}
          <span className="font-medium text-on-surface">{campaign.name}</span>{" "}
          if you still want to share feedback.
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
        collectionMode={collectionMode}
        customQuestions={(campaign.customQuestions ?? []) as CustomQuestion[]}
        uploadsReady={isR2Configured()}
      />
    </div>
  );
}
