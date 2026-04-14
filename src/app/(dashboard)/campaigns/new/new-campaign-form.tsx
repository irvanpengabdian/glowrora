"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createCampaignAction,
  type CreateCampaignFormState,
} from "../actions";

const initialState: CreateCampaignFormState = null;

export function NewCampaignForm() {
  const [state, formAction, pending] = useActionState(
    createCampaignAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-8">
      {state?.ok === false && state.message ? (
        <p
          className="rounded-xl border border-error-container bg-error-container px-3 py-2 text-sm text-on-error-container"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow transition-shadow hover:shadow-md md:p-8">
        <h2 className="mb-6 font-headline text-lg font-bold text-primary">
          Campaign details
        </h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block">
              <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                Campaign name
              </span>
              <span className="text-error"> *</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="off"
              className="tf-input"
              placeholder="e.g. Summer launch 2024"
            />
            {state?.ok === false && state.fieldErrors?.name ? (
              <p className="text-sm text-on-error-container">
                {state.fieldErrors.name[0]}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block">
              <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                Internal description
              </span>{" "}
              <span className="text-on-surface-variant">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="tf-input min-h-[6rem] resize-y"
              placeholder="Notes for your team — not shown on the public form."
            />
            {state?.ok === false && state.fieldErrors?.description ? (
              <p className="text-sm text-on-error-container">
                {state.fieldErrors.description[0]}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-secondary to-secondary-fixed-dim px-8 py-3.5 text-sm font-bold text-on-secondary shadow-xl transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          {pending ? "Creating…" : "Create campaign"}
        </button>
        <Link
          href="/campaigns"
          className="inline-flex items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-lowest px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-surface-container-low"
        >
          Discard
        </Link>
      </div>
    </form>
  );
}
