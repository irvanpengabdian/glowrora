import Link from "next/link";

export const dynamic = "force-dynamic";

export default function SettingsBillingPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
        <h2 className="font-headline text-lg font-bold text-primary">
          Plan & Billing
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Upgrade when you are ready. Billing is coming next — for now this page
          explains what Pro will include.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low/40 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Current plan
            </p>
            <p className="mt-2 font-headline text-2xl font-extrabold text-primary">
              Free
            </p>
            <p className="mt-3 text-sm text-on-surface-variant">
              Great for trying Glowrora on one campaign.
            </p>
          </div>

          <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
              Upgrade
            </p>
            <p className="mt-2 font-headline text-2xl font-extrabold text-secondary">
              Pro (coming soon)
            </p>
            <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
              <li>Higher submission limits</li>
              <li>Custom branding and advanced widgets</li>
              <li>Custom domain (Wall of Love)</li>
              <li>Priority support</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="tf-btn-primary rounded-full px-8" disabled>
                Upgrade to Pro
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

        <p className="mt-6 text-xs text-on-surface-variant">
          We will add Stripe/Midtrans checkout and invoices in a follow-up
          sprint.
        </p>
      </section>
    </div>
  );
}

