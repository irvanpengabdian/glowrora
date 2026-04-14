import { getUserSettings } from "@/server/settings";
import { ensureDbUserId } from "@/server/users";
import Link from "next/link";

import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function SettingsProfilePage() {
  const userId = await ensureDbUserId();
  const settings = await getUserSettings(userId);

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
        <h2 className="font-headline text-lg font-bold text-primary">Profile</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          This information appears in your dashboard and future customer-facing
          exports.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className="tf-label">Email</p>
            <p className="tf-input flex items-center">{settings.email}</p>
          </div>
          <div className="space-y-2">
            <p className="tf-label">Name</p>
            <p className="tf-input flex items-center">
              {settings.displayName ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-outline-variant/15 bg-surface-container-low/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
            Profile picture
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Upload a photo or pick an avatar from your account settings.
          </p>
          <Link
            href="/settings/account"
            className="mt-3 inline-flex text-sm font-semibold text-secondary underline-offset-4 hover:underline"
          >
            Manage avatar →
          </Link>
        </div>

        <div className="mt-8">
          <ProfileForm defaultBusinessName={settings.businessName ?? ""} />
        </div>
      </section>
    </div>
  );
}

