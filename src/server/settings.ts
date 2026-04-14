import { eq } from "drizzle-orm";

import { getDb, users } from "@/db";

export async function getUserSettings(userId: string): Promise<{
  email: string;
  displayName: string | null;
  businessName: string | null;
}> {
  const db = getDb();
  const rows = await db
    .select({
      email: users.email,
      displayName: users.displayName,
      businessName: users.businessName,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    throw new Error("USER_NOT_FOUND");
  }
  return row;
}

export async function updateUserProfile(
  userId: string,
  input: { businessName: string | null },
): Promise<void> {
  const db = getDb();
  await db
    .update(users)
    .set({
      businessName: input.businessName?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

