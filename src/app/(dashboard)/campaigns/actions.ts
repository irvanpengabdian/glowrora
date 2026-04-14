"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createCampaignSchema,
  updateCampaignSchema,
} from "@/lib/validations/campaign";
import {
  archiveCampaignForOwner,
  createCampaignForUser,
  restoreCampaignForOwner,
  softDeleteCampaignForOwner,
  updateCampaignForOwner,
} from "@/server/campaigns";
import { ensureDbUserId } from "@/server/users";

export type CreateCampaignFormState =
  | null
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function createCampaignAction(
  _prev: CreateCampaignFormState,
  formData: FormData,
): Promise<CreateCampaignFormState> {
  const parsed = createCampaignSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: flat.fieldErrors as Record<string, string[] | undefined>,
    };
  }

  let row: Awaited<ReturnType<typeof createCampaignForUser>>;
  try {
    const userId = await ensureDbUserId();
    row = await createCampaignForUser(userId, {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    });
  } catch (e) {
    const message =
      e instanceof Error && e.message === "NO_EMAIL"
        ? "Your account does not have an email yet. Try again after completing Clerk profile."
        : "We could not create the campaign. Please try again.";
    return { ok: false, message };
  }

  revalidatePath("/campaigns");
  redirect(`/campaigns/${row.id}`);
}

export type UpdateCampaignFormState =
  | null
  | { ok: true }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

export async function updateCampaignAction(
  _prev: UpdateCampaignFormState,
  formData: FormData,
): Promise<UpdateCampaignFormState> {
  const parsed = updateCampaignSchema.safeParse({
    campaignId: formData.get("campaignId"),
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: flat.fieldErrors as Record<string, string[] | undefined>,
    };
  }

  try {
    const userId = await ensureDbUserId();
    const updated = await updateCampaignForOwner(
      userId,
      parsed.data.campaignId,
      {
        name: parsed.data.name,
        description: parsed.data.description ?? null,
      },
    );
    if (!updated) {
      return {
        ok: false,
        message: "Campaign not found or already removed.",
      };
    }
  } catch {
    return { ok: false, message: "Could not update the campaign." };
  }

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${parsed.data.campaignId}`);
  revalidatePath("/testimonials");
  return { ok: true as const };
}

export async function archiveCampaignAction(formData: FormData): Promise<void> {
  const raw = formData.get("campaignId");
  const idParsed = z.string().uuid().safeParse(
    typeof raw === "string" ? raw.trim() : "",
  );
  if (!idParsed.success) return;

  let userId: string;
  try {
    userId = await ensureDbUserId();
  } catch {
    return;
  }

  const ok = await archiveCampaignForOwner(userId, idParsed.data);
  if (!ok) return;

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${idParsed.data}`);
  revalidatePath("/testimonials");
}

export async function restoreCampaignAction(formData: FormData): Promise<void> {
  const raw = formData.get("campaignId");
  const idParsed = z.string().uuid().safeParse(
    typeof raw === "string" ? raw.trim() : "",
  );
  if (!idParsed.success) return;

  let userId: string;
  try {
    userId = await ensureDbUserId();
  } catch {
    return;
  }

  const ok = await restoreCampaignForOwner(userId, idParsed.data);
  if (!ok) return;

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${idParsed.data}`);
  revalidatePath("/testimonials");
}

export async function softDeleteCampaignAction(
  formData: FormData,
): Promise<void> {
  const raw = formData.get("campaignId");
  const idParsed = z.string().uuid().safeParse(
    typeof raw === "string" ? raw.trim() : "",
  );
  if (!idParsed.success) return;

  let userId: string;
  try {
    userId = await ensureDbUserId();
  } catch {
    return;
  }

  const ok = await softDeleteCampaignForOwner(userId, idParsed.data);
  if (!ok) return;

  revalidatePath("/campaigns");
  revalidatePath("/testimonials");
  redirect("/campaigns");
}
