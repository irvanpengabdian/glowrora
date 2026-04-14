import type { PublicWallTestimonial } from "@/server/public-wall";

type Props = {
  item: PublicWallTestimonial;
};

function Stars({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(1, rating));
  return (
    <p
      className="text-xs tracking-tight text-secondary"
      aria-label={`${n} of 5 stars`}
    >
      {"★".repeat(n)}
      <span className="text-on-surface-variant/40">{"★".repeat(5 - n)}</span>
    </p>
  );
}

function QuoteIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="text-secondary-fixed-dim"
    >
      <path d="M9.5 6.5H6.75C5.23 6.5 4 7.73 4 9.25V14a3 3 0 0 0 3 3h2.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H7.5A1.5 1.5 0 0 1 6 12.5V12h3.5a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5Zm10 0h-2.75C15.23 6.5 14 7.73 14 9.25V14a3 3 0 0 0 3 3h2.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H17.5a1.5 1.5 0 0 1-1.5-1.5V12h3.5a.5.5 0 0 0 .5-.5V7a.5.5 0 0 0-.5-.5Z" />
    </svg>
  );
}

export function WallTestimonialCard({ item }: Props) {
  const showVideo = Boolean(item.videoUrl);

  return (
    <article className="overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(27,28,26,0.05)]">
      {showVideo ? (
        <div className="relative overflow-hidden bg-surface-container-high">
          <div className="absolute inset-0 bg-primary/10" />
          <video
            src={item.videoUrl!}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/70 to-transparent px-5 pb-5 pt-10">
            <p className="text-sm font-bold text-white">{item.authorName}</p>
            <p className="mt-0.5 text-xs text-white/70">
              {item.authorTitle ?? ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-7">
          <QuoteIcon />
          <blockquote className="mt-4 tf-quote text-xl leading-snug text-primary-container">
            <p className="whitespace-pre-wrap">{item.body}</p>
          </blockquote>

          <div className="mt-7 flex items-end justify-between gap-4 border-t border-surface-container pt-5">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-on-surface">
                {item.authorName}
              </p>
              {item.authorTitle ? (
                <p className="mt-0.5 truncate text-xs font-medium text-on-surface-variant">
                  {item.authorTitle}
                </p>
              ) : null}
            </div>
            <Stars rating={item.rating} />
          </div>
        </div>
      )}

      {!showVideo && item.hasVideoWithoutPublicUrl ? (
        <p className="px-7 pb-6 text-xs text-on-surface-variant">
          Includes a video clip (playback URL not configured for this site).
        </p>
      ) : null}
    </article>
  );
}
