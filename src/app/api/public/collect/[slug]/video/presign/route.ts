import { NextResponse } from "next/server";
import { z } from "zod";

import { rateLimitOrBypass } from "@/lib/abuse/rate-limit";
import { getRequestIpFromHeaders } from "@/lib/abuse/request-ip";
import {
  MAX_VIDEO_BYTES,
  VIDEO_CONTENT_TYPES,
  type VideoContentType,
} from "@/lib/r2/constants";
import { isR2Configured } from "@/lib/r2/env";
import { presignVideoPut } from "@/lib/r2/client";
import { buildVideoObjectKey } from "@/lib/r2/video-key";
import { getPublicCampaignBySlug } from "@/server/campaigns";

export const runtime = "nodejs";

const bodySchema = z.object({
  contentType: z.string().trim(),
  byteLength: z.number().int().positive().max(MAX_VIDEO_BYTES),
});

function normalizeContentType(raw: string): VideoContentType | null {
  const t = raw.trim().toLowerCase();
  return (VIDEO_CONTENT_TYPES as readonly string[]).includes(t)
    ? (t as VideoContentType)
    : null;
}

type RouteCtx = { params: Promise<{ slug: string }> };

export async function POST(req: Request, ctx: RouteCtx) {
  if (!isR2Configured()) {
    return NextResponse.json(
      { error: "Video uploads are not configured." },
      { status: 503 },
    );
  }

  const { slug } = await ctx.params;
  const slugTrim = slug.trim();
  if (!slugTrim) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedBody = bodySchema.safeParse(json);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.issues.map((i) => i.message).join(" ") },
      { status: 400 },
    );
  }

  const contentType = normalizeContentType(parsedBody.data.contentType);
  if (!contentType) {
    return NextResponse.json(
      { error: "Unsupported video type. Use WebM, MP4, or MOV." },
      { status: 400 },
    );
  }

  const campaign = await getPublicCampaignBySlug(slugTrim);
  if (!campaign) {
    return NextResponse.json({ error: "Unknown collection link." }, {
      status: 404,
    });
  }
  if (campaign.archivedAt) {
    return NextResponse.json({ error: "This campaign is archived." }, {
      status: 410,
    });
  }
  if (!campaign.isActive) {
    return NextResponse.json(
      { error: "This campaign is not accepting responses." },
      { status: 403 },
    );
  }
  if (campaign.collectionMode !== "text_and_video") {
    return NextResponse.json(
      { error: "This campaign does not accept video." },
      { status: 403 },
    );
  }

  const ip = getRequestIpFromHeaders(req.headers) ?? "unknown";
  const rl = await rateLimitOrBypass({
    name: "collect_presign",
    key: `ip:${ip}:campaign:${campaign.id}`,
    limit: 10,
    windowSeconds: 10 * 60,
  });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many upload attempts. Please wait a few minutes." },
      { status: 429 },
    );
  }

  const objectKey = buildVideoObjectKey(campaign.id, contentType);

  try {
    const uploadUrl = await presignVideoPut(
      objectKey,
      contentType,
      parsedBody.data.byteLength,
    );
    return NextResponse.json({
      uploadUrl,
      objectKey,
      contentType,
      expiresInSec: 15 * 60,
    });
  } catch (e) {
    console.error("[presign]", e);
    return NextResponse.json(
      { error: "Could not start upload. Try again shortly." },
      { status: 500 },
    );
  }
}
