import { Building2, Lock, Star, User, Video } from "lucide-react";

const fields = [
  { label: "Full name", Icon: User },
  { label: "Job title / company", Icon: Building2 },
  { label: "Star rating", Icon: Star },
  { label: "Review text / video", Icon: Video },
] as const;

export function CampaignDefaultQuestions() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-headline text-lg font-bold text-primary">
          <Lock className="size-5 text-secondary" strokeWidth={1.75} aria-hidden />
          Default questions
        </h3>
        <span className="rounded bg-surface-container-high px-2 py-1 text-xs text-on-surface-variant">
          Read-only
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {fields.map(({ label, Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-4"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-container-low">
              <Icon
                className="size-4 text-on-surface-variant"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
            <span className="text-sm font-medium text-on-surface">{label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-on-surface-variant">
        These fields are included on every collection form. Campaign-specific
        copy lives in your description and thank-you settings (coming soon).
      </p>
    </section>
  );
}
