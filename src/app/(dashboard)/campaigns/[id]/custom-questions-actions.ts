"use server";

import { revalidatePath } from "next/cache";

import { updateCampaignCustomQuestionsForOwner } from "@/server/campaigns";
import { ensureDbUserId } from "@/server/users";

export type SaveQuestionsState =
  | null
  | { ok: true }
  | {
      ok: false;
      error: string;
    };

export async function saveCustomQuestionsAction(
  _prev: SaveQuestionsState,
  formData: FormData,
): Promise<SaveQuestionsState> {
  const campaignId = String(formData.get("campaignId") ?? "").trim();
  const customQuestionsJson = String(formData.get("customQuestionsJson") ?? "").trim();

  if (!campaignId) return { ok: false, error: "Missing campaign id." };
  if (!customQuestionsJson) return { ok: false, error: "Missing questions payload." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(customQuestionsJson);
  } catch {
    return { ok: false, error: "Invalid questions JSON." };
  }

  const userId = await ensureDbUserId();
  const res = await updateCampaignCustomQuestionsForOwner(userId, campaignId, {
    customQuestions: parsed,
  });
  if (!res.ok) return { ok: false, error: res.error };

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/collect`);
  return { ok: true };
}

