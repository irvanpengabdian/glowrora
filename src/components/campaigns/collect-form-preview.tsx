import { Smartphone, Star, Video } from "lucide-react";

type Props = {
  campaignName: string;
  /** Optional line shown in the “custom question” serif block */
  highlightLine?: string | null;
};

export function CollectFormPreview({
  campaignName,
  highlightLine,
}: Props) {
  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-headline text-lg font-bold text-primary">
          Live preview
        </h3>
        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
          <Smartphone className="size-4" strokeWidth={1.75} aria-hidden />
          Client mobile view
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[320px]">
        <div className="relative h-[520px] overflow-hidden rounded-[2.5rem] border-[8px] border-primary bg-white shadow-2xl sm:h-[580px]">
          <div
            className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-primary"
            aria-hidden
          />
          <div className="custom-scrollbar h-full overflow-y-auto p-6 pt-10">
            <div className="mb-6">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-surface-container-low">
                <span className="font-headline text-xs font-bold text-primary">
                  TF
                </span>
              </div>
              <h4 className="font-headline text-xl font-bold leading-tight text-primary">
                Share your experience
              </h4>
              <p className="mt-2 text-xs text-on-surface-variant">
                Submitting to{" "}
                <span className="font-medium text-on-surface">{campaignName}</span>
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <span className="mb-2 block text-[10px] font-bold uppercase text-primary">
                  Full name
                </span>
                <div className="h-10 rounded-lg bg-surface-container-low" />
              </div>
              <div>
                <span className="mb-2 block text-[10px] font-bold uppercase text-primary">
                  Star rating
                </span>
                <div className="flex gap-0.5 text-secondary-fixed-dim">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`size-5 ${i <= 4 ? "fill-secondary-fixed-dim text-secondary-fixed-dim" : "text-secondary-fixed-dim/40"}`}
                      strokeWidth={1.25}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary-container/5 p-4">
                <p className="tf-quote text-[10px] leading-relaxed text-primary">
                  {highlightLine?.trim()
                    ? `"${highlightLine.trim()}"`
                    : `"Tell us what went well."`}
                </p>
                <div className="mt-3 h-16 rounded-lg border border-outline-variant/20 bg-white" />
              </div>
              <div>
                <span className="mb-2 block text-[10px] font-bold uppercase text-primary">
                  Your message
                </span>
                <div className="flex h-24 items-center justify-center rounded-lg bg-surface-container-low">
                  <Video
                    className="size-8 text-on-surface-variant/30"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                </div>
              </div>
              <div className="bg-gradient-to-br from-secondary to-secondary-fixed-dim py-3 text-center text-sm font-bold text-on-secondary shadow-md">
                Submit testimonial
              </div>
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute -bottom-4 -right-4 size-32 rounded-full bg-secondary-container/20 blur-3xl"
          aria-hidden
        />
      </div>
    </div>
  );
}
