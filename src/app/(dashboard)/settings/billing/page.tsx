import Link from "next/link";

import { FREE_PLAN_TESTIMONIAL_LIMIT } from "@/lib/plan";
import { getUserPlanEntitlement } from "@/server/plan";
import { ensureDbUserId } from "@/server/users";

export const dynamic = "force-dynamic";

function formatExpiry(d: Date) {
  return d.toLocaleDateString("en-US", {
    dateStyle: "long",
  });
}

export default async function SettingsBillingPage() {
  const userId = await ensureDbUserId();
  const plan = await getUserPlanEntitlement(userId);

  const isPro = plan.hasActivePro;
  const hadProButExpired =
    plan.planTier === "pro" && !plan.hasActivePro && plan.planExpiresAt !== null;

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
        <h2 className="font-headline text-lg font-bold text-primary">
          Plan & Billing
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          {isPro
            ? "You have active Pro access. Payment integration is coming next."
            : "Upgrade when you are ready. Billing is coming next — for now this page shows your plan and what Pro will include."}
        </p>

        {hadProButExpired && plan.planExpiresAt ? (
          <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-950">
            Your Pro access ended on {formatExpiry(plan.planExpiresAt)}. You are
            on the Free plan until you upgrade.
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low/40 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Current plan
            </p>
            <p className="mt-2 font-headline text-2xl font-extrabold text-primary">
              {isPro ? "Pro" : "Free"}
            </p>
            {isPro && plan.planExpiresAt ? (
              <p className="mt-3 text-sm text-on-surface-variant">
                Pro access through{" "}
                <span className="font-medium text-primary">
                  {formatExpiry(plan.planExpiresAt)}
                </span>
                .
              </p>
            ) : null}
            {isPro && !plan.planExpiresAt ? (
              <p className="mt-3 text-sm text-on-surface-variant">
                Full Pro feature access with no scheduled end date.
              </p>
            ) : null}
            {!isPro ? (
              <p className="mt-3 text-sm text-on-surface-variant">
                Up to {FREE_PLAN_TESTIMONIAL_LIMIT} text testimonials across your
                workspace, no video collection — upgrade to Pro for unlimited
                stories and video.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              {isPro ? "Pro" : "Upgrade"}
            </p>
            <p className="mt-2 font-headline text-2xl font-extrabold text-secondary">
              {isPro ? "Pro (active)" : "Pro (coming soon)"}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
              <li>Unlimited testimonials, including video</li>
              <li>Custom branding and advanced widgets</li>
              <li>Custom domain (Wall of Love)</li>
              <li>Priority support</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="tf-btn-primary rounded-full px-8 disabled:opacity-50"
                type="button"
                disabled
                title={
                  isPro
                    ? "You already have Pro"
                    : "Checkout will be available when billing launches"
                }
              >
                {isPro ? "Current plan" : "Upgrade to Pro"}
              </button>
              <Link
                href="/embed"
                className="tf-btn-outline rounded-full px-6"
              >
                Explore widgets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
