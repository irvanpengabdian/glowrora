"use client";

import { useFormStatus } from "react-dom";
import { ArchiveRestore } from "lucide-react";

import { restoreCampaignAction } from "@/app/(dashboard)/campaigns/actions";

function SubmitButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-xs font-bold text-on-secondary shadow-md shadow-secondary/10 transition hover:bg-secondary/90 disabled:opacity-60"
      }
    >
      <ArchiveRestore className="size-3.5" strokeWidth={2} aria-hidden />
      {pending ? "Restoring…" : "Restore"}
    </button>
  );
}

type Props = {
  campaignId: string;
  campaignName: string;
  /** Larger button for detail page banner */
  variant?: "default" | "emphasized";
};

export function RestoreCampaignForm({
  campaignId,
  campaignName,
  variant = "default",
}: Props) {
  const btnClass =
    variant === "emphasized"
      ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-on-secondary shadow-lg shadow-secondary/20 transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
      : undefined;

  return (
    <form
      action={restoreCampaignAction}
      onSubmit={(e) => {
        const msg = `Restore “${campaignName}”? The collection link will accept submissions again.`;
        if (!window.confirm(msg)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="campaignId" value={campaignId} />
      <SubmitButton className={btnClass} />
    </form>
  );
}
