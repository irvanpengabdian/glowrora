"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import {
  updateCampaignAction,
  type UpdateCampaignFormState,
} from "../actions";

const initialState: UpdateCampaignFormState = null;

type Props = {
  campaignId: string;
  defaultName: string;
  defaultDescription: string | null;
};

export function CampaignEditForm({
  campaignId,
  defaultName,
  defaultDescription,
}: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateCampaignAction,
    initialState,
  );

  useEffect(() => {
    if (state?.ok === true) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="campaignId" value={campaignId} />

      {state?.ok === false && state.message ? (
        <p
          className="rounded-xl border border-error-container bg-error-container px-3 py-2 text-sm text-on-error-container"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="edit-name" className="block">
          <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
            Campaign name
          </span>
          <span className="text-error"> *</span>
        </label>
        <input
          id="edit-name"
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          className="tf-input"
        />
        {state?.ok === false && state.fieldErrors?.name ? (
          <p className="text-sm text-on-error-container">
            {state.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-description" className="block">
          <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
            Internal description
          </span>{" "}
          <span className="text-on-surface-variant">(optional)</span>
        </label>
        <textarea
          id="edit-description"
          name="description"
          rows={3}
          defaultValue={defaultDescription ?? ""}
          className="tf-input min-h-[5rem] resize-y"
        />
        {state?.ok === false && state.fieldErrors?.description ? (
          <p className="text-sm text-on-error-container">
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-secondary to-secondary-fixed-dim px-8 py-3 text-sm font-bold text-on-secondary shadow-lg shadow-secondary/20 transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
