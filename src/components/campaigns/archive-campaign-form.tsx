"use client";

import { useFormStatus } from "react-dom";
import { Archive } from "lucide-react";

import { archiveCampaignAction } from "@/app/(dashboard)/campaigns/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-surface-container disabled:opacity-60"
    >
      <Archive className="size-3.5" strokeWidth={2} aria-hidden />
      {pending ? "Archiving…" : "Archive"}
    </button>
  );
}

type Props = {
  campaignId: string;
  campaignName: string;
};

export function ArchiveCampaignForm({ campaignId, campaignName }: Props) {
  return (
    <form
      action={archiveCampaignAction}
      onSubmit={(e) => {
        const msg = `Archive “${campaignName}”? The collection link will stop accepting new responses. You can restore the campaign from Archived anytime.`;
        if (!window.confirm(msg)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="campaignId" value={campaignId} />
      <SubmitButton />
    </form>
  );
}
