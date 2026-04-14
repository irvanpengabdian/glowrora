"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  saveWallSlugAction,
  type WallSlugSaveState,
} from "./wall-slug-actions";

type Props = {
  campaignId: string;
  defaultWallSlug: string;
  collectSlug: string;
  canCustomizeWall: boolean;
};

const initial: WallSlugSaveState = null;

export function WallSlugForm({
  campaignId,
  defaultWallSlug,
  collectSlug,
  canCustomizeWall,
}: Props) {
  const [state, formAction, pending] = useActionState(
    saveWallSlugAction,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok === true) {
      formRef.current?.reset();
    }
  }, [state]);

  if (!canCustomizeWall) {
    return (
      <p className="text-sm text-on-surface-variant">
        Custom <code className="rounded bg-surface-container px-1 text-xs">/love/…</code>{" "}
        URLs are a <span className="font-semibold text-primary">Pro</span> feature.
        Your wall is available at{" "}
        <code className="rounded bg-surface-container px-1 text-xs">
          /love/{collectSlug}
        </code>{" "}
        (same as your collection slug).
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-on-surface-variant">
        Set a memorable path for your Wall of Love. Collection link stays{" "}
        <code className="rounded bg-surface-container px-1 text-xs">
          /collect/{collectSlug}
        </code>
        .
      </p>
      <form ref={formRef} action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="campaignId" value={campaignId} />
        <div className="min-w-0 flex-1">
          <label htmlFor="wallSlug" className="tf-label">
            Wall path (lowercase, letters, numbers, hyphens)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="shrink-0 text-sm text-on-surface-variant">/love/</span>
            <input
              id="wallSlug"
              name="wallSlug"
              type="text"
              defaultValue={defaultWallSlug}
              placeholder="e.g. acme-wall"
              autoComplete="off"
              spellCheck={false}
              className="tf-input min-w-0 flex-1 font-mono text-sm"
              disabled={pending}
            />
          </div>
        </div>
        <button
          type="submit"
          className="tf-btn-primary shrink-0 rounded-full px-6 py-2.5 text-sm font-bold disabled:opacity-60"
          disabled={pending}
        >
          {pending ? "Saving…" : "Save wall slug"}
        </button>
      </form>
      {state?.ok === false ? (
        <p className="text-sm font-medium text-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok === true ? (
        <p className="text-sm font-medium text-secondary" role="status">
          Wall URL saved. Use Wall settings or the link above to preview.
        </p>
      ) : null}
    </div>
  );
}
