"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import type {
  CustomQuestion,
  CustomQuestionType,
} from "@/lib/validations/custom-questions";

import {
  saveCustomQuestionsAction,
  type SaveQuestionsState,
} from "./custom-questions-actions";

type Props = {
  campaignId: string;
  campaignName: string;
  initialQuestions: CustomQuestion[];
};

type DraftQuestion = CustomQuestion & { _localId: string };

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `q_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function makeDraft(q?: Partial<CustomQuestion>): DraftQuestion {
  const id = q?.id?.trim() || uid();
  return {
    _localId: uid(),
    id,
    label: q?.label?.trim() || "",
    type: (q?.type as CustomQuestionType) || "long_text",
    required: Boolean(q?.required),
    options: q?.options ?? (q?.type === "multiple_choice" ? ["", ""] : undefined),
    order: q?.order ?? 0,
  };
}

export function CustomQuestionsEditor({
  campaignId,
  campaignName,
  initialQuestions,
}: Props) {
  const initialDraft = useMemo(
    () => initialQuestions.map((q) => makeDraft(q)),
    [initialQuestions],
  );
  const [draft, setDraft] = useState<DraftQuestion[]>(initialDraft);
  const [dirty, setDirty] = useState(false);
  const dragIdRef = useRef<string | null>(null);

  const [state, formAction, pending] = useActionState<SaveQuestionsState, FormData>(
    saveCustomQuestionsAction,
    null,
  );

  useEffect(() => {
    if (state?.ok) {
      setDirty(false);
    }
  }, [state]);

  const questionsPayload = useMemo(
    () =>
      draft.map((q, idx) => ({
        id: q.id.trim(),
        label: q.label.trim(),
        type: q.type,
        required: q.required,
        options:
          q.type === "multiple_choice"
            ? (q.options ?? [])
                .map((o) => o.trim())
                .filter(Boolean)
            : undefined,
        order: idx,
      })),
    [draft],
  );

  const setQuestion = (localId: string, patch: Partial<DraftQuestion>) => {
    setDraft((prev) =>
      prev.map((q) => (q._localId === localId ? { ...q, ...patch } : q)),
    );
    setDirty(true);
  };

  const move = (localId: string, dir: -1 | 1) => {
    setDraft((prev) => {
      const i = prev.findIndex((q) => q._localId === localId);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(i, 1);
      copy.splice(j, 0, item);
      return copy;
    });
    setDirty(true);
  };

  const moveTo = (fromLocalId: string, toLocalId: string) => {
    if (fromLocalId === toLocalId) return;
    setDraft((prev) => {
      const from = prev.findIndex((q) => q._localId === fromLocalId);
      const to = prev.findIndex((q) => q._localId === toLocalId);
      if (from < 0 || to < 0) return prev;
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
    setDirty(true);
  };

  const remove = (localId: string) => {
    setDraft((prev) => prev.filter((q) => q._localId !== localId));
    setDirty(true);
  };

  const add = () => {
    setDraft((prev) => [...prev, makeDraft({ type: "long_text", required: false })]);
    setDirty(true);
  };

  const discard = () => {
    setDraft(initialDraft);
    setDirty(false);
  };

  return (
    <section className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 tf-editorial-shadow md:p-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-headline text-lg font-bold text-primary">
            Form configuration
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Add campaign-specific prompts to collect richer stories. Drag to
            reorder questions.
          </p>
        </div>
        <button
          type="button"
          className="tf-btn-outline rounded-xl"
          onClick={add}
          disabled={pending}
        >
          Add question
        </button>
      </div>

      {state && state.ok === false ? (
        <p
          className="mt-4 rounded-xl border border-error-container bg-error-container/80 px-4 py-3 text-sm text-on-error-container"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state && state.ok === true ? (
        <p className="mt-4 rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3 text-sm text-secondary">
          Saved.
        </p>
      ) : null}

      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <form action={formAction} className="space-y-4 lg:col-span-7">
          <input type="hidden" name="campaignId" value={campaignId} />
          <input
            type="hidden"
            name="customQuestionsJson"
            value={JSON.stringify(questionsPayload)}
          />

          {draft.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/35 bg-surface-container-lowest/60 px-6 py-12 text-center">
            <p className="font-headline text-lg font-semibold text-primary-container">No custom questions yet</p>
            <p className="mt-2 text-sm text-on-surface-variant">
              Add one to guide your customers. Default fields (name, rating, message, video) are always included.
            </p>
          </div>
        ) : (
          draft.map((q, idx) => (
            <div
              key={q._localId}
              className="rounded-xl border border-outline-variant/15 bg-surface-container-low/30 p-5"
              draggable={!pending}
              onDragStart={(e) => {
                dragIdRef.current = q._localId;
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", q._localId);
              }}
              onDragEnd={() => {
                dragIdRef.current = null;
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                const from = e.dataTransfer.getData("text/plain") || dragIdRef.current;
                if (!from) return;
                moveTo(from, q._localId);
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                        Question text
                      </label>
                      <input
                        value={q.label}
                        onChange={(e) => setQuestion(q._localId, { label: e.target.value })}
                        className="tf-input"
                        placeholder="e.g. What changed after using our product?"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                        Type
                      </label>
                      <select
                        value={q.type}
                        onChange={(e) => {
                          const type = e.target.value as CustomQuestionType;
                          setQuestion(q._localId, {
                            type,
                            options:
                              type === "multiple_choice"
                                ? q.options && q.options.length >= 2
                                  ? q.options
                                  : ["", ""]
                                : undefined,
                          });
                        }}
                        className="tf-input"
                      >
                        <option value="short_text">Short text</option>
                        <option value="long_text">Long text</option>
                        <option value="multiple_choice">Multiple choice</option>
                      </select>
                    </div>
                  </div>

                  {q.type === "multiple_choice" ? (
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                        Options
                      </p>
                      <div className="space-y-2">
                        {(q.options ?? []).map((opt, oi) => (
                          <div key={`${q._localId}_${oi}`} className="flex gap-2">
                            <input
                              value={opt}
                              onChange={(e) => {
                                const next = [...(q.options ?? [])];
                                next[oi] = e.target.value;
                                setQuestion(q._localId, { options: next });
                              }}
                              className="tf-input"
                              placeholder={`Option ${oi + 1}`}
                            />
                            <button
                              type="button"
                              className="tf-btn-outline shrink-0 rounded-xl px-3"
                              onClick={() => {
                                const next = (q.options ?? []).filter((_, i) => i !== oi);
                                setQuestion(q._localId, { options: next.length >= 2 ? next : ["", ""] });
                              }}
                              disabled={pending}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="tf-btn-outline rounded-xl"
                        onClick={() => setQuestion(q._localId, { options: [...(q.options ?? []), ""] })}
                        disabled={pending}
                      >
                        Add option
                      </button>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/10 pt-3">
                    <label className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) => setQuestion(q._localId, { required: e.target.checked })}
                        className="size-4 rounded border-outline-variant text-secondary focus:ring-secondary"
                      />
                      Required
                    </label>
                    <button
                      type="button"
                      className="text-sm font-medium text-error-container underline underline-offset-4 hover:no-underline"
                      onClick={() => remove(q._localId)}
                      disabled={pending}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Drag
                  </div>
                  <button
                    type="button"
                    className="tf-btn-outline rounded-xl px-3 py-2 text-xs"
                    onClick={() => move(q._localId, -1)}
                    disabled={pending || idx === 0}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="tf-btn-outline rounded-xl px-3 py-2 text-xs"
                    onClick={() => move(q._localId, 1)}
                    disabled={pending || idx === draft.length - 1}
                  >
                    Down
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="tf-btn-outline rounded-full px-6"
            onClick={discard}
            disabled={!dirty || pending}
          >
            Discard changes
          </button>
          <button
            type="submit"
            className="tf-btn-primary rounded-full px-8"
            disabled={pending || !dirty}
          >
            {pending ? "Saving…" : "Save configuration"}
          </button>
        </div>
        </form>

        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold text-primary">
                Live preview
              </h3>
              <p className="text-xs font-medium text-on-surface-variant">
                Client mobile view
              </p>
            </div>

            <div className="relative mx-auto w-[320px] overflow-hidden rounded-[2.75rem] border-8 border-primary bg-primary shadow-2xl">
              <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-primary" />
              <div className="max-h-[640px] overflow-y-auto bg-white p-6 pt-10">
                <div className="mb-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-surface-container-low text-[10px] font-bold text-primary">
                    LOG
                  </div>
                  <h4 className="font-headline text-xl font-bold text-primary">
                    Share your experience
                  </h4>
                  <p className="mt-2 text-xs text-on-surface-variant">
                    Submitting to{" "}
                    <span className="font-medium text-on-surface">
                      {campaignName}
                    </span>
                    .
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-primary">
                      Full name
                    </p>
                    <div className="mt-2 h-10 w-full rounded-lg bg-surface-container-low" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-primary">
                      Star rating
                    </p>
                    <div className="mt-2 flex gap-1 text-secondary-fixed-dim">
                      {"★★★★★".split("").map((s, i) => (
                        <span key={i} className="text-base">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {draft.map((q) => (
                    <div
                      key={q._localId}
                      className="rounded-xl border border-primary/10 bg-primary-container/5 p-4"
                    >
                      <p className="text-[10px] italic text-primary">
                        “{q.label.trim() || "Untitled question"}”
                      </p>
                      <div className="mt-3">
                        {q.type === "long_text" ? (
                          <div className="h-20 w-full rounded-lg border border-outline-variant/20 bg-white" />
                        ) : q.type === "multiple_choice" ? (
                          <div className="h-10 w-full rounded-lg border border-outline-variant/20 bg-white" />
                        ) : (
                          <div className="h-10 w-full rounded-lg border border-outline-variant/20 bg-white" />
                        )}
                      </div>
                    </div>
                  ))}

                  <div>
                    <p className="text-[10px] font-bold uppercase text-primary">
                      Tell us more
                    </p>
                    <div className="mt-2 flex h-24 w-full items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant/30">
                      Video / message
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-lg bg-gradient-to-br from-secondary to-secondary-fixed-dim py-3 text-sm font-bold text-white shadow-md"
                  >
                    Submit feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

