import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import { getDb, users } from "@/db";

export const dynamic = "force-dynamic";

function primaryEmailFromClerkUser(data: {
  primary_email_address_id?: string | null;
  email_addresses?: { id: string; email_address: string }[];
}): string | undefined {
  const list = data.email_addresses ?? [];
  if (list.length === 0) return undefined;
  const primaryId = data.primary_email_address_id;
  const match = primaryId
    ? list.find((e) => e.id === primaryId)
    : undefined;
  return (match ?? list[0])?.email_address;
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const db = getDb();

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const u = evt.data;
        const email = primaryEmailFromClerkUser(u);
        if (!email) {
          console.warn("Clerk webhook: no email for user", u.id);
          return NextResponse.json({ ok: true });
        }
        const displayName =
          [u.first_name, u.last_name].filter(Boolean).join(" ").trim() ||
          u.username ||
          null;

        await db
          .insert(users)
          .values({
            clerkUserId: u.id,
            email,
            displayName,
            avatarUrl: u.image_url || null,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: users.clerkUserId,
            set: {
              email,
              displayName,
              avatarUrl: u.image_url || null,
              updatedAt: new Date(),
            },
          });
        break;
      }
      case "user.deleted": {
        await db.delete(users).where(eq(users.clerkUserId, evt.data.id!));
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
