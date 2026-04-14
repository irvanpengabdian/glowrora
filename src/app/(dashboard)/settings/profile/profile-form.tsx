"use client";

import { useActionState, useEffect, useState } from "react";

import { saveProfileAction, type ProfileSaveState } from "./actions";

type Props = {
  defaultBusinessName: string;
};

const initialState: ProfileSaveState = null;

export function ProfileForm({ defaultBusinessName }: Props) {
  const [state, formAction, pending] = useActionState(saveProfileAction, initialState);
  const [businessName, setBusinessName] = useState(defaultBusinessName);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (state && state.ok === true) {
      setDirty(false);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {state && state.ok === false ? (
        <p
          className="rounded-xl border border-error-container bg-error-container/80 px-4 py-3 text-sm text-on-error-container"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state && state.ok === true ? (
        <p className="rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3 text-sm text-secondary">
          Saved.
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="businessName" className="tf-label">
          Business name <span className="text-on-surface-variant">(optional)</span>
        </label>
        <input
          id="businessName"
          name="businessName"
          className="tf-input"
          value={businessName}
          onChange={(e) => {
            setBusinessName(e.target.value);
            setDirty(true);
          }}
          placeholder="e.g. Dear John Studio"
          maxLength={120}
        />
        <p className="text-xs text-on-surface-variant">Max 120 characters.</p>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="tf-btn-primary rounded-full px-8" disabled={pending || !dirty}>
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}

