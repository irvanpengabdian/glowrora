"use client";

import { useFormStatus } from "react-dom";

import { softDeleteCampaignAction } from "../actions";

function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl border border-error bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-error-container transition hover:bg-error-container/30 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete campaign"}
    </button>
  );
}

type Props = {
  campaignId: string;
  campaignName: string;
};

export function DeleteCampaignForm({ campaignId, campaignName }: Props) {
  return (
    <form
      action={softDeleteCampaignAction}
      onSubmit={(e) => {
        const msg = `Delete “${campaignName}”? The collection link will stop working. Testimonials stay in the database but hidden from new submissions.`;
        if (!window.confirm(msg)) {
          e.preventDefault();
        }
      }}
      className="space-y-2"
    >
      <input type="hidden" name="campaignId" value={campaignId} />
      <DeleteSubmitButton />
      <p className="text-xs text-on-surface-variant">
        Soft delete: link becomes invalid; you can still see past testimonials
        in the database if needed later.
      </p>
    </form>
  );
}
