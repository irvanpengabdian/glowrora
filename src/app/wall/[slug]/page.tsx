import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicWallBySlug } from "@/server/public-wall";

import { WallTestimonialCard } from "./wall-testimonial-card";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wall = await getPublicWallBySlug(slug);
  if (!wall) {
    return { title: "Wall not found" };
  }
  return {
    title: `${wall.campaignName} — Wall of Love`,
    description: wall.campaignDescription ?? `Loved by customers — ${wall.campaignName}.`,
    robots: { index: true, follow: true },
  };
}

export default async function PublicWallPage({ params }: Props) {
  const { slug } = await params;
  const wall = await getPublicWallBySlug(slug);
  if (!wall) notFound();

  const hasVideos = wall.testimonials.some((t) => t.videoUrl);
  const showVideoHint = wall.testimonials.some((t) => t.hasVideoWithoutPublicUrl);
  const countLabel = `${wall.testimonials.length.toLocaleString()} Authentic ${
    wall.testimonials.length === 1 ? "Story" : "Stories"
  }`;

  return (
    <div className="min-h-full bg-background text-on-surface">
      <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-headline text-lg font-bold tracking-tight text-primary-container"
          >
            Glowrora
          </Link>
          <Link
            href={`/collect/${wall.collectPublicSlug}`}
            className="tf-btn-secondary text-sm"
          >
            Submit a testimonial
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28 sm:pt-32">
        <header className="mx-auto mb-16 max-w-2xl text-center sm:mb-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-secondary-container">
            <span aria-hidden className="text-sm">
              ★
            </span>
            {countLabel}
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-on-secondary-container">
            Wall of Love
          </p>
          <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            {wall.campaignName}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-on-surface-variant sm:text-lg">
            {wall.campaignDescription?.trim()
              ? wall.campaignDescription
              : "A curated collection of success and partnership."}
          </p>

          {hasVideos ? (
            <p className="mt-4 text-xs font-medium text-on-surface-variant">
              Includes video testimonials
            </p>
          ) : null}
        </header>

        {showVideoHint ? (
          <p className="mx-auto mb-10 max-w-2xl rounded-xl border border-outline-variant/30 bg-surface-container-high/40 px-4 py-3 text-center text-xs text-on-surface-variant">
            Some clips are stored without a public playback URL. Set{" "}
            <code className="rounded bg-surface-container px-1 py-0.5 text-[11px]">
              R2_PUBLIC_BASE_URL
            </code>{" "}
            on the project to enable in-browser video on this wall.
          </p>
        ) : null}

        {wall.testimonials.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-lowest/60 px-6 py-16 text-center">
            <p className="font-headline text-lg font-semibold text-primary-container">
              No public stories yet
            </p>
            <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
              Approved testimonials will appear here. Check back soon, or share
              the collection link so more people can contribute.
            </p>
            <Link
              href={`/collect/${wall.collectPublicSlug}`}
              className="mt-6 inline-flex text-sm font-semibold text-secondary underline-offset-4 hover:underline"
            >
              Submit the first testimonial →
            </Link>
          </div>
        ) : (
          <div className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
            {wall.testimonials.map((item) => (
              <div key={item.id} className="break-inside-avoid">
                <WallTestimonialCard item={item} />
              </div>
            ))}
          </div>
        )}

        <section className="mt-24 text-center sm:mt-32">
          <h2 className="font-headline text-2xl font-bold text-primary sm:text-3xl">
            Want to share your own story?
          </h2>
          <Link
            href={`/collect/${wall.collectPublicSlug}`}
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-4 font-headline text-base font-bold text-on-secondary shadow-sm transition hover:opacity-90"
          >
            Submit a Testimonial
            <span aria-hidden className="ml-3">
              →
            </span>
          </Link>
        </section>
      </main>

      <footer className="border-t border-outline-variant/10 bg-surface-container-low/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
          <div>
            <p className="font-headline text-sm font-semibold text-primary-container">
              Glowrora
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              © {new Date().getFullYear()} Real Stories. Beautiful Glow
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-secondary underline-offset-4 hover:underline"
          >
            Powered by Glowrora
          </Link>
        </div>
      </footer>
    </div>
  );
}
