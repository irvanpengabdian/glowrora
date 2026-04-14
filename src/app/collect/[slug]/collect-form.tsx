"use client";

import { useActionState, useMemo, useRef, useState } from "react";

import type { CustomQuestion } from "@/lib/validations/custom-questions";

import {
  submitPublicTestimonialAction,
  type CollectSubmitState,
} from "./actions";
import { CollectVideoSection } from "./collect-video-section";

type CollectionMode = "text_only" | "text_and_video";

type Props = {
  slug: string;
  campaignName: string;
  collectionMode: CollectionMode;
  customQuestions: CustomQuestion[];
  uploadsReady: boolean;
};

const initialState: CollectSubmitState = null;

export function CollectForm({
  slug,
  campaignName,
  collectionMode,
  customQuestions,
  uploadsReady,
}: Props) {
  const [state, formAction, pending] = useActionState(
    submitPublicTestimonialAction,
    initialState,
  );
  const [videoBlocking, setVideoBlocking] = useState(false);
  const [step, setStep] = useState<"edit" | "preview">("edit");
  const formRef = useRef<HTMLFormElement | null>(null);

  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [rating, setRating] = useState("5");
  const [body, setBody] = useState("");
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const q of customQuestions ?? []) init[q.id] = "";
    return init;
  });

  const stars = useMemo(() => {
    const r = Number(rating || "0");
    if (!Number.isFinite(r) || r < 1) return "";
    return "★★★★★".slice(0, Math.min(5, Math.max(1, Math.floor(r))));
  }, [rating]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5"
      onSubmit={(e) => {
        if (videoBlocking) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <input
        type="hidden"
        name="customAnswersJson"
        value={JSON.stringify(customAnswers)}
      />

      {/* Honeypot (bots tend to fill hidden fields). Keep empty. */}
      <div className="sr-only" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="tf-card-soft mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-secondary-container">
          You are submitting to
        </p>
        <p className="mt-1 font-headline text-lg font-bold text-primary-container">
          {campaignName}
        </p>
      </div>

      {state?.error ? (
        <p
          className="rounded-xl border border-error-container bg-error-container px-3 py-2 text-sm text-on-error-container"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      {/* Preview unmounts visible fields; server action reads FormData — mirror state here */}
      {step === "preview" ? (
        <>
          <input type="hidden" name="authorName" value={authorName} />
          <input type="hidden" name="authorTitle" value={authorTitle} />
          <input type="hidden" name="rating" value={rating} />
          <input type="hidden" name="body" value={body} />
        </>
      ) : null}

      {step === "edit" ? (
        <>
          <div className="space-y-2">
            <label htmlFor="authorName" className="tf-label">
              Your name <span className="text-error">*</span>
            </label>
            <input
              id="authorName"
              name="authorName"
              type="text"
              required
              autoComplete="name"
              className="tf-input"
              placeholder="Jane Doe"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="authorTitle" className="tf-label">
              Role or company{" "}
              <span className="text-on-surface-variant">(optional)</span>
            </label>
            <input
              id="authorTitle"
              name="authorTitle"
              type="text"
              autoComplete="organization-title"
              className="tf-input"
              placeholder="Founder, Acme Co."
              value={authorTitle}
              onChange={(e) => setAuthorTitle(e.target.value)}
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="tf-label">
              Rating <span className="text-error">*</span>
            </legend>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <label
                  key={n}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-transparent bg-surface-container-high px-3 py-1.5 text-sm has-[:checked]:border-secondary has-[:checked]:bg-secondary-container/25"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={String(n)}
                    required
                    checked={rating === String(n)}
                    onChange={(e) => setRating(e.target.value)}
                    className="text-secondary focus:ring-secondary"
                  />
                  {n}★
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="body" className="tf-label">
              Your message <span className="text-error">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              rows={5}
              required
              minLength={10}
              className="tf-input min-h-[8rem] resize-y"
              placeholder="Share what went well (at least 10 characters)."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <p className="text-xs text-on-surface-variant">
              Minimum 10 characters.
            </p>
          </div>

          {(customQuestions ?? []).length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Extra questions
              </p>
              {customQuestions.map((q) => {
                const id = `q_${q.id}`;
                const value = customAnswers[q.id] ?? "";
                const required = Boolean(q.required);
                return (
                  <div
                    key={q.id}
                    className="space-y-2 rounded-2xl border border-outline-variant/25 bg-surface-container-low/30 p-4"
                  >
                    <label htmlFor={id} className="tf-label">
                      {q.label}{" "}
                      {required ? <span className="text-error">*</span> : null}
                    </label>
                    {q.type === "long_text" ? (
                      <textarea
                        id={id}
                        rows={4}
                        className="tf-input min-h-[6rem] resize-y"
                        value={value}
                        onChange={(e) =>
                          setCustomAnswers((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        required={required}
                      />
                    ) : q.type === "multiple_choice" ? (
                      <select
                        id={id}
                        className="tf-input"
                        value={value}
                        onChange={(e) =>
                          setCustomAnswers((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        required={required}
                      >
                        <option value="">Select…</option>
                        {(q.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={id}
                        className="tf-input"
                        value={value}
                        onChange={(e) =>
                          setCustomAnswers((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        required={required}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      ) : (
        <div className="tf-card">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-secondary-container">
            Preview
          </p>
          <h2 className="mt-2 text-xl font-bold text-primary-container">
            Please review before submitting
          </h2>

          <div className="mt-5 space-y-4 text-left">
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-sm font-semibold text-on-surface">
                {authorName || "—"}
              </p>
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {authorTitle?.trim() ? authorTitle.trim() : "No role/company"}
              </p>
              <p className="mt-2 text-sm text-secondary">
                {stars ? `${stars} (${rating}/5)` : `${rating}/5`}
              </p>
            </div>

            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Your message
              </p>
              <p className="tf-quote mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-on-surface">
                {body || "—"}
              </p>
            </div>

            {(customQuestions ?? []).length > 0 ? (
              <div className="rounded-xl bg-surface-container-low p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Extra answers
                </p>
                <div className="mt-3 space-y-2">
                  {customQuestions.map((q) => (
                    <div key={q.id} className="text-sm">
                      <p className="font-medium text-on-surface">{q.label}</p>
                      <p className="mt-0.5 whitespace-pre-wrap text-on-surface-variant">
                        {(customAnswers[q.id] ?? "").trim() || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="tf-btn-outline w-full"
              onClick={() => setStep("edit")}
              disabled={pending}
            >
              Edit
            </button>
            <button
              type="submit"
              disabled={pending || videoBlocking}
              className="tf-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending
                ? "Submitting…"
                : videoBlocking
                  ? "Finish your video first…"
                  : "Confirm & submit"}
            </button>
          </div>
        </div>
      )}

      <CollectVideoSection
        slug={slug}
        allowVideo={collectionMode === "text_and_video"}
        uploadsReady={uploadsReady}
        onBlockSubmitChange={setVideoBlocking}
      />

      {step === "edit" ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="tf-btn-outline w-full"
            disabled={pending || videoBlocking}
            onClick={() => {
              const ok = formRef.current?.reportValidity?.() ?? true;
              if (!ok) return;
              setStep("preview");
            }}
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={pending || videoBlocking}
            className="tf-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? "Submitting…"
              : videoBlocking
                ? "Finish your video first…"
                : "Submit testimonial"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
