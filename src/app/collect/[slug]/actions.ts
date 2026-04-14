"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { testimonials, getDb } from "@/db";
import { rateLimitOrBypass } from "@/lib/abuse/rate-limit";
import { getRequestIpFromHeaders } from "@/lib/abuse/request-ip";
import { isR2Configured } from "@/lib/r2/env";
import { headVideoObject } from "@/lib/r2/client";
import { isVideoObjectKeyForCampaign } from "@/lib/r2/video-key";
import { publicTestimonialSubmitSchema } from "@/lib/validations/testimonial-public";
import {
  customQuestionsSchema,
  validateAnswersForQuestions,
} from "@/lib/validations/custom-questions";
import { getPublicCampaignBySlug } from "@/server/campaigns";

export type CollectSubmitState =
  | null
  | {
      error: string;
    };

export async function submitPublicTestimonialAction(
  _prev: CollectSubmitState,
  formData: FormData,
): Promise<CollectSubmitState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    return { error: "Missing collection link." };
  }

  // Honeypot: if filled, silently treat as success to avoid training bots.
  const website = String(formData.get("website") ?? "").trim();
  if (website) {
    redirect(`/collect/${slug}/thank-you`);
  }

  const parsed = publicTestimonialSubmitSchema.safeParse({
    authorName: formData.get("authorName"),
    authorTitle: formData.get("authorTitle") ?? undefined,
    rating: formData.get("rating"),
    body: formData.get("body"),
    videoObjectKey: formData.get("videoObjectKey") ?? undefined,
    videoContentType: formData.get("videoContentType") ?? undefined,
    videoByteLength: formData.get("videoByteLength") ?? undefined,
    videoDurationSec: formData.get("videoDurationSec") ?? undefined,
    customAnswersJson: formData.get("customAnswersJson") ?? undefined,
  });

  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(" ");
    return { error: msg || "Invalid submission." };
  }

  const campaign = await getPublicCampaignBySlug(slug);
  if (!campaign) {
    return {
      error: "This collection link is invalid or has been removed.",
    };
  }
  if (!campaign.isActive) {
    return {
      error: "This campaign is not accepting responses right now.",
    };
  }

  const h = await headers();
  const ip = getRequestIpFromHeaders(h) ?? "unknown";
  const rl = await rateLimitOrBypass({
    name: "collect_submit",
    key: `ip:${ip}:campaign:${campaign.id}`,
    limit: 5,
    windowSeconds: 10 * 60,
  });
  if (!rl.ok) {
    return {
      error:
        "Too many submissions. Please wait a few minutes and try again.",
    };
  }

  const hasVideo = Boolean(parsed.data.videoObjectKey);
  const questionsParsed = customQuestionsSchema.safeParse(
    (campaign.customQuestions ?? []) as unknown,
  );
  const customQuestions = questionsParsed.success ? questionsParsed.data : [];

  let extraAnswers: Record<string, string> = {};
  if (parsed.data.customAnswersJson) {
    try {
      const raw = JSON.parse(parsed.data.customAnswersJson);
      const validated = validateAnswersForQuestions({
        questions: customQuestions,
        answers: raw,
      });
      if (!validated.ok) return { error: validated.error };
      extraAnswers = validated.value;
    } catch {
      return { error: "Invalid custom answers." };
    }
  } else {
    // Still enforce required questions.
    const validated = validateAnswersForQuestions({
      questions: customQuestions,
      answers: {},
    });
    if (!validated.ok) return { error: validated.error };
  }

  if (hasVideo && campaign.collectionMode !== "text_and_video") {
    return { error: "This campaign does not accept video testimonials." };
  }

  if (hasVideo && !isR2Configured()) {
    return {
      error: "Video uploads are not available. Submit text only or try later.",
    };
  }

  if (hasVideo && parsed.data.videoObjectKey) {
    if (
      !isVideoObjectKeyForCampaign(
        parsed.data.videoObjectKey,
        campaign.id,
      )
    ) {
      return { error: "Invalid video reference." };
    }
    const head = await headVideoObject(parsed.data.videoObjectKey);
    if (!head) {
      return {
        error:
          "We could not verify your video upload. Please upload the video again.",
      };
    }
    if (head.contentLength !== parsed.data.videoByteLength) {
      return {
        error:
          "The uploaded video does not match the expected size. Please try again.",
      };
    }
  }

  const db = getDb();
  try {
    await db.insert(testimonials).values({
      campaignId: campaign.id,
      authorName: parsed.data.authorName,
      authorTitle: parsed.data.authorTitle ?? null,
      rating: parsed.data.rating,
      body: parsed.data.body,
      videoR2ObjectKey: hasVideo ? parsed.data.videoObjectKey! : null,
      videoContentType: hasVideo ? parsed.data.videoContentType! : null,
      videoByteLength: hasVideo ? parsed.data.videoByteLength! : null,
      videoDurationSec: hasVideo ? parsed.data.videoDurationSec! : null,
      extraAnswers,
    });
  } catch {
    return {
      error:
        "We could not save your testimonial. Please try again in a moment.",
    };
  }

  revalidatePath(`/collect/${slug}`);
  const thankYou = hasVideo
    ? `/collect/${slug}/thank-you?video=1`
    : `/collect/${slug}/thank-you`;
  redirect(thankYou);
}
