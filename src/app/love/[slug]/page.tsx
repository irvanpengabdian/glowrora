import type { Metadata } from "next";

import { getPublicWallBySlug } from "@/server/public-wall";

import PublicWallPage from "../../wall/[slug]/page";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wall = await getPublicWallBySlug(slug);
  if (!wall) {
    return { title: "Love not found" };
  }
  return {
    title: `${wall.campaignName} — Wall of Love`,
    description:
      wall.campaignDescription ?? `Loved by customers — ${wall.campaignName}.`,
    robots: { index: true, follow: true },
  };
}

export default PublicWallPage;

