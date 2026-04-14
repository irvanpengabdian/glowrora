import { getPublicCampaignBySlug } from "@/server/campaigns";

import { ThankYouCelebration } from "./thank-you-celebration";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ video?: string }>;
};

export default async function CollectThankYouPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { video } = await searchParams;
  const campaign = await getPublicCampaignBySlug(slug);
  const withVideo = video === "1" || video === "true";

  return (
    <ThankYouCelebration
      slug={slug}
      campaignName={campaign?.name ?? null}
      withVideo={withVideo}
    />
  );
}
