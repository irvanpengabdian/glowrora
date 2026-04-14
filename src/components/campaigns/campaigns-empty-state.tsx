import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export function CampaignsEmptyState() {
  return (
    <div className="flex flex-col items-center px-4 py-6 text-center md:py-10">
      <div className="relative mb-10 md:mb-12">
        <div className="relative flex size-64 items-center justify-center overflow-hidden rounded-full bg-surface-container-low md:size-80">
          <div className="absolute inset-0 opacity-20" aria-hidden>
            <div className="absolute left-10 top-10 size-32 rounded-full border border-secondary" />
            <div className="absolute bottom-10 right-10 size-48 rounded-full border border-primary" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 flex size-24 items-center justify-center rounded-2xl bg-surface-container-lowest tf-editorial-shadow">
              <Sparkles
                className="size-12 text-secondary"
                strokeWidth={1.25}
                aria-hidden
              />
            </div>
            <div className="flex gap-2" aria-hidden>
              <div className="h-2 w-8 rounded-full bg-secondary/20" />
              <div className="h-2 w-12 rounded-full bg-secondary" />
              <div className="h-2 w-8 rounded-full bg-secondary/20" />
            </div>
          </div>
        </div>

        <div
          className="absolute -right-8 -top-4 hidden w-32 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-3 tf-editorial-shadow md:block"
          aria-hidden
        >
          <div className="mb-2 h-2 w-8 rounded-full bg-surface-container-highest" />
          <div className="mb-1 h-1 w-full rounded-full bg-surface-container-low" />
          <div className="h-1 w-3/4 rounded-full bg-surface-container-low" />
        </div>
        <div
          className="absolute -bottom-6 -left-12 hidden w-40 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 tf-editorial-shadow md:block"
          aria-hidden
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="size-4 rounded-full bg-secondary-container" />
            <div className="h-2 w-12 rounded-full bg-surface-container-highest" />
          </div>
          <div className="mb-1 h-1 w-full rounded-full bg-surface-container-low" />
          <div className="mb-1 h-1 w-full rounded-full bg-surface-container-low" />
          <div className="h-1 w-2/3 rounded-full bg-surface-container-low" />
        </div>
      </div>

      <div className="max-w-xl">
        <h2 className="mb-4 font-headline text-3xl font-bold tracking-tight text-primary md:text-4xl">
          No campaigns yet.
        </h2>
        <p className="mb-10 text-lg leading-relaxed text-on-surface-variant">
          Start collecting testimonials by creating your first project. Build
          trust with your audience through curated, high-impact evidence.
        </p>
        <Link
          href="/campaigns/new"
          className="tf-signature-gradient inline-flex items-center gap-3 rounded-xl px-10 py-4 text-lg font-bold text-white tf-editorial-shadow transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-xl leading-none" aria-hidden>
            +
          </span>
          Create your first campaign
        </Link>
      </div>

      <div className="mt-16 grid w-full max-w-4xl grid-cols-1 gap-6 text-left md:mt-20 md:grid-cols-3">
        <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low/50 p-6 transition-colors hover:bg-surface-container-low">
          <BookOpen
            className="mb-3 size-6 text-secondary"
            strokeWidth={1.75}
            aria-hidden
          />
          <h3 className="mb-1 font-headline font-bold text-primary">
            Strategy guide
          </h3>
          <p className="text-sm text-on-surface-variant">
            Learn how to craft the perfect testimonial request.
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low/50 p-6 transition-colors hover:bg-surface-container-low">
          <PlayCircle
            className="mb-3 size-6 text-secondary"
            strokeWidth={1.75}
            aria-hidden
          />
          <h3 className="mb-1 font-headline font-bold text-primary">
            Quick demo
          </h3>
          <p className="text-sm text-on-surface-variant">
            Watch a short walkthrough on setting up your first flow.
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low/50 p-6 transition-colors hover:bg-surface-container-low">
          <HelpCircle
            className="mb-3 size-6 text-secondary"
            strokeWidth={1.75}
            aria-hidden
          />
          <h3 className="mb-1 font-headline font-bold text-primary">
            Help center
          </h3>
          <p className="text-sm text-on-surface-variant">
            Documentation on integrations and widgets is coming soon.
          </p>
        </div>
      </div>

      <p className="tf-quote mt-16 max-w-lg text-sm text-on-surface-variant/70 md:mt-20">
        “Transparency is the new currency of trust.”
      </p>
    </div>
  );
}
