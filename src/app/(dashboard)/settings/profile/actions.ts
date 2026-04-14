"use server";

import { revalidatePath } from "next/cache";

import { updateUserProfile } from "@/server/settings";
import { ensureDbUserId } from "@/server/users";

export type ProfileSaveState =
  | null
  | { ok: true }
  | {
      ok: false;
      error: string;
    };

export async function saveProfileAction(
  _prev: ProfileSaveState,
  formData: FormData,
): Promise<ProfileSaveState> {
  const businessName = String(formData.get("businessName") ?? "").trim();
  if (businessName.length > 120) {
    return { ok: false, error: "Business name is too long." };
  }

  const userId = await ensureDbUserId();
  await updateUserProfile(userId, { businessName: businessName || null });
  revalidatePath("/settings/profile");
  return { ok: true };
}

