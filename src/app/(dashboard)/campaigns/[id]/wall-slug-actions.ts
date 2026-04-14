"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateCampaignWallSlugForOwner } from "@/server/campaign-wall-slug";
import { ensureDbUserId } from "@/server/users";

export type WallSlugSaveState =
  | null
  | { ok: true }
  | { ok: false; error: string };

export async function saveWallSlugAction(
  _prev: WallSlugSaveState,
  formData: FormData,
): Promise<WallSlugSaveState> {
  const rawId = formData.get("campaignId");
  const idParsed = z.string().uuid().safeParse(
    typeof rawId === "string" ? rawId.trim() : "",
  );
  if (!idParsed.success) {
    return { ok: false, error: "Invalid campaign." };
  }

  const rawSlug = formData.get("wallSlug");
  const wallInput =
    typeof rawSlug !== "string"
      ? null
      : rawSlug.trim() === ""
        ? null
        : rawSlug.trim();

  try {
    const userId = await ensureDbUserId();
    const result = await updateCampaignWallSlugForOwner(
      userId,
      idParsed.data,
      wallInput,
    );
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
  } catch {
    return { ok: false, error: "Could not save. Try again." };
  }

  revalidatePath(`/campaigns/${idParsed.data}`);
  revalidatePath("/wall-settings");
  return { ok: true };
}
