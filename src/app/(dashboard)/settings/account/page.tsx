"use client";

import { UserProfile } from "@clerk/nextjs";

export default function SettingsAccountPage() {
  return (
    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
      <h2 className="font-headline text-lg font-bold text-primary">Account</h2>
      <p className="mt-2 text-sm text-on-surface-variant">
        Update your profile picture (avatar), email settings, and security.
      </p>

      <div className="mt-6">
        <UserProfile routing="path" path="/settings/account" />
      </div>
    </section>
  );
}

