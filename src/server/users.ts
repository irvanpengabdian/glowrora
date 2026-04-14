import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { getDb, users } from "@/db";

/**
 * Resolves the internal `users.id` for the signed-in Clerk user.
 * Upserts from Clerk session if the webhook has not run yet.
 */
export async function ensureDbUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  const db = getDb();
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .limit(1);

  if (existing[0]) {
    return existing[0].id;
  }

  const cu = await currentUser();
  if (!cu) {
    throw new Error("UNAUTHORIZED");
  }

  const email =
    cu.primaryEmailAddress?.emailAddress ??
    cu.emailAddresses[0]?.emailAddress ??
    "";

  if (!email) {
    throw new Error("NO_EMAIL");
  }

  const displayName =
    [cu.firstName, cu.lastName].filter(Boolean).join(" ").trim() || null;

  const [row] = await db
    .insert(users)
    .values({
      clerkUserId: userId,
      email,
      displayName,
      avatarUrl: cu.imageUrl || null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: {
        email,
        displayName,
        avatarUrl: cu.imageUrl || null,
        updatedAt: new Date(),
      },
    })
    .returning({ id: users.id });

  return row.id;
}
