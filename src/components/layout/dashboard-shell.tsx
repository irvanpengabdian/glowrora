"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import {
  ChevronRight,
  Code,
  FolderOpen,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", Icon: FolderOpen },
  { href: "/testimonials", label: "Testimonials", Icon: MessageCircle },
  { href: "/wall-settings", label: "Wall", Icon: Heart },
  { href: "/embed", label: "Embed", Icon: Code },
  { href: "/settings", label: "Settings", Icon: Settings },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  Icon: LucideIcon;
}>;

const mobileNavItems = [
  { href: "/dashboard", label: "Home", Icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", Icon: FolderOpen },
  { href: "/testimonials", label: "Quotes", Icon: MessageCircle },
  { href: "/settings", label: "Config", Icon: Settings },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  Icon: LucideIcon;
}>;

function navActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function breadcrumbLabel(pathname: string) {
  if (pathname === "/dashboard") return "Overview";
  if (pathname.startsWith("/campaigns/new")) return "New campaign";
  if (pathname.match(/^\/campaigns\/[^/]+$/)) return "Campaign detail";
  if (pathname.startsWith("/campaigns")) return "Campaigns";
  if (pathname.startsWith("/testimonials")) return "Testimonials";
  if (pathname.startsWith("/wall-settings")) return "Wall of Love";
  if (pathname.startsWith("/embed")) return "Embed";
  if (pathname.startsWith("/settings/profile")) return "Profile";
  if (pathname.startsWith("/settings/account")) return "Avatar";
  if (pathname.startsWith("/settings/billing")) return "Billing";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Dashboard";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-full bg-background">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col bg-surface py-8 pl-4 pr-2 md:flex">
        <div className="mb-10 px-4">
          <Link
            href="/dashboard"
            className="font-headline text-xl font-bold tracking-tighter text-primary-container"
          >
            Glowrora
          </Link>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
            Real Stories. Beautiful Glow
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, Icon }) => {
            const active = navActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-headline text-sm tracking-tight transition-colors ${
                  active
                    ? "border-r-4 border-secondary bg-surface-container-low font-bold text-primary-container"
                    : "font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary-container"
                }`}
              >
                <Icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 px-4">
          <Link href="/campaigns/new" className="tf-btn-primary w-full">
            <Plus className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            New campaign
          </Link>
        </div>

        <div className="mt-auto border-t border-on-surface/5 pt-6">
          <div className="flex items-center gap-3 px-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-9 ring-1 ring-outline-variant/30",
                },
              }}
            />
            <div className="flex min-w-0 flex-col">
              <span className="font-headline text-sm font-medium tracking-tight text-primary-container">
                Account
              </span>
              <span className="text-[10px] text-on-surface-variant">
                Clerk profile
              </span>
            </div>
          </div>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-on-surface/5 bg-surface/80 px-4 backdrop-blur-xl md:left-64 md:px-6">
        <nav className="hidden items-center gap-2 font-headline text-sm md:flex">
          <span className="text-on-surface-variant">Home</span>
          <ChevronRight
            className="size-4 shrink-0 text-outline-variant"
            strokeWidth={2}
            aria-hidden
          />
          <span className="font-semibold text-secondary">
            {breadcrumbLabel(pathname)}
          </span>
        </nav>
        <Link
          href="/dashboard"
          className="font-headline text-lg font-bold text-primary-container md:hidden"
        >
          Glowrora
        </Link>
        <div className="flex flex-1 justify-end md:hidden">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-9 ring-1 ring-outline-variant/30",
              },
            }}
          />
        </div>

        <div className="hidden flex-1 justify-end md:flex">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest/60 px-3 py-2 text-xs font-semibold text-on-surface-variant shadow-sm shadow-black/[0.02] transition hover:bg-surface-container-low"
            aria-label="Go to dashboard home"
          >
            <span className="relative flex size-7 items-center justify-center overflow-hidden rounded-xl border border-outline-variant/25 bg-surface-container-low">
              <Image
                src="/brand/logo-mark.png"
                alt=""
                width={28}
                height={28}
                priority
                className="h-full w-full object-cover opacity-95 transition group-hover:opacity-100"
              />
            </span>
            <span className="hidden lg:inline">Glowrora</span>
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-background pb-24 pt-16 md:ml-64 md:pb-10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-14 lg:py-12">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex h-[4.5rem] w-full items-center justify-around rounded-t-3xl border-t border-on-surface/5 bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md md:hidden">
        {mobileNavItems.map(({ href, label, Icon }) => {
          const active = navActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 ${
                active
                  ? "bg-surface-container-low text-secondary"
                  : "text-on-surface-variant"
              }`}
            >
              <Icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-widest">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
