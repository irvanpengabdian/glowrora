import Link from "next/link";

const tabs = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/account", label: "Avatar" },
  { href: "/settings/billing", label: "Plan & Billing" },
] as const;

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="tf-page-title">Settings</h1>
        <p className="tf-page-lead max-w-2xl">
          Manage your workspace identity and subscription.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2 rounded-2xl bg-surface-container-low p-1.5 md:w-fit">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-xl px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-lowest/80"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div>{children}</div>
    </div>
  );
}

