"use client";

import { useState } from "react";

import {
  approveTestimonialAction,
  rejectTestimonialAction,
  updateTestimonialContentAction,
} from "@/server/testimonials-actions";

import { PendingButton } from "./pending-button";
import type { TestimonialRowSerializable } from "./types";

function statusBadge(status: TestimonialRowSerializable["status"]) {
  switch (status) {
    case "pending":
      return {
        label: "New",
        className:
          "bg-surface-variant text-on-surface-variant ring-1 ring-outline-variant/20",
      };
    case "approved":
      return {
        label: "Approved",
        className: "bg-secondary-container/40 text-on-secondary-container",
      };
    case "rejected":
      return {
        label: "Rejected",
        className: "bg-error-container/90 text-on-error-container",
      };
    case "archived":
      return {
        label: "Archived",
        className: "bg-surface-container-high text-on-surface-variant",
      };
  }
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]![0]! : parts[0]?.[1] ?? "";
  return (a + b).toUpperCase() || "?";
}

function formatDurationSec(sec: number | null | undefined) {
  if (sec == null || !Number.isFinite(sec) || sec < 0) return null;
  const s = Math.min(3599, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

function StarRow({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(1, rating));
  return (
    <div className="flex gap-0.5 text-secondary" aria-label={`${n} of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < n ? "" : "text-outline-variant/40"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

type Props = {
  row: TestimonialRowSerializable;
  bulkSelected: boolean;
  onBulkToggle: (id: string, checked: boolean) => void;
};

export function TestimonialRow({ row, bulkSelected, onBulkToggle }: Props) {
  const [editing, setEditing] = useState(false);

  const created = new Date(row.createdAt);
  const dateStr = created.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const badge = statusBadge(row.status);
  const isVideo = Boolean(row.videoR2ObjectKey);
  const durationLabel = formatDurationSec(row.videoDurationSec);
  const quoteSizeClass =
    row.body.length > 220 ? "text-xl leading-snug" : "text-2xl leading-snug";

  const cardShell =
    "group flex flex-col rounded-xl border border-outline-variant/15 bg-surface-container-lowest shadow-[0_12px_40px_rgba(27,28,26,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(27,28,26,0.07)]";

  const editForm = editing ? (
    <form
      action={updateTestimonialContentAction}
      className="space-y-3 rounded-xl bg-surface-container-low/80 p-4"
    >
      <input type="hidden" name="testimonialId" value={row.id} />
      <div className="space-y-1">
        <label
          className="text-xs font-medium text-primary-container"
          htmlFor={`authorName-${row.id}`}
        >
          Name
        </label>
        <input
          id={`authorName-${row.id}`}
          name="authorName"
          required
          defaultValue={row.authorName}
          className="tf-input py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label
          className="text-xs font-medium text-primary-container"
          htmlFor={`authorTitle-${row.id}`}
        >
          Role / company
        </label>
        <input
          id={`authorTitle-${row.id}`}
          name="authorTitle"
          defaultValue={row.authorTitle ?? ""}
          className="tf-input py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-primary-container">
          Rating
        </span>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-transparent bg-surface-container-high px-2 py-1 text-xs has-[:checked]:border-secondary has-[:checked]:bg-secondary-container/25"
            >
              <input
                type="radio"
                name="rating"
                value={String(n)}
                required
                defaultChecked={n === row.rating}
              />
              {n}★
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <label
          className="text-xs font-medium text-primary-container"
          htmlFor={`body-${row.id}`}
        >
          Message
        </label>
        <textarea
          id={`body-${row.id}`}
          name="body"
          required
          minLength={10}
          rows={4}
          defaultValue={row.body}
          className="tf-input min-h-[5rem] resize-y text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <PendingButton
          refreshAfterSubmit
          pendingLabel="Saving…"
          className="rounded-lg border border-secondary bg-secondary px-4 py-2 text-sm font-semibold text-on-secondary transition hover:opacity-90"
        >
          Save changes
        </PendingButton>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg border border-outline-variant/30 px-4 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-container-high"
        >
          Cancel
        </button>
      </div>
    </form>
  ) : null;

  if (editing) {
    return (
      <article className={`${cardShell} overflow-hidden p-6`}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Edit testimonial
        </p>
        <p className="mt-1 text-xs text-on-surface-variant">{dateStr}</p>
        {editForm}
      </article>
    );
  }

  if (isVideo) {
    return (
      <article className={`${cardShell} overflow-hidden`}>
        <div className="relative aspect-video bg-surface-container-high">
          {row.videoPlaybackUrl ? (
            <video
              src={row.videoPlaybackUrl}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <p className="text-sm font-medium text-primary-container">
                Video attached
              </p>
              <p className="text-xs text-on-surface-variant">
                Set{" "}
                <code className="rounded bg-surface-container px-1 py-0.5 text-[10px]">
                  R2_PUBLIC_BASE_URL
                </code>{" "}
                to preview playback here.
              </p>
            </div>
          )}
          {durationLabel ? (
            <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              {durationLabel}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-on-surface">
                {row.authorName}
              </p>
              {row.authorTitle ? (
                <p className="text-xs text-on-surface-variant">
                  {row.authorTitle}
                </p>
              ) : null}
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-surface-variant px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Video
            </span>
            <span className="rounded-full bg-surface-variant px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              {row.campaignName}
            </span>
          </div>

          {row.body.trim() ? (
            <p className="tf-quote text-sm leading-relaxed text-on-surface/85">
              {row.body}
            </p>
          ) : null}

          <p className="text-[10px] text-on-surface-variant">{dateStr}</p>

          {row.status === "rejected" && row.moderationNote ? (
            <p className="text-xs text-on-surface-variant">
              Note: {row.moderationNote}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-semibold text-secondary underline-offset-2 hover:underline"
            >
              Edit details
            </button>
          </div>

          {row.status === "pending" ? (
            <div className="space-y-2 border-t border-outline-variant/10 pt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-on-surface-variant">
                  Bulk select
                </span>
                <input
                  type="checkbox"
                  checked={bulkSelected}
                  onChange={(e) => onBulkToggle(row.id, e.target.checked)}
                  className="size-4 rounded border-outline-variant text-secondary focus:ring-secondary"
                  aria-label={`Select testimonial from ${row.authorName}`}
                />
              </div>
              <label className="sr-only" htmlFor={`note-${row.id}`}>
                Rejection note (optional)
              </label>
              <textarea
                id={`note-${row.id}`}
                form={`reject-form-${row.id}`}
                name="moderationNote"
                rows={2}
                maxLength={2000}
                placeholder="Optional note (internal)"
                className="tf-input min-h-0 resize-none py-2 text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <form action={approveTestimonialAction}>
                  <input type="hidden" name="testimonialId" value={row.id} />
                  <PendingButton
                    refreshAfterSubmit
                    pendingLabel="Approving…"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-secondary py-2.5 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-on-secondary"
                  >
                    Approve
                  </PendingButton>
                </form>
                <form
                  id={`reject-form-${row.id}`}
                  action={rejectTestimonialAction}
                >
                  <input type="hidden" name="testimonialId" value={row.id} />
                  <PendingButton
                    refreshAfterSubmit
                    pendingLabel="Rejecting…"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-error py-2.5 text-sm font-semibold text-error transition hover:bg-error hover:text-on-error"
                  >
                    Reject
                  </PendingButton>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article className={`${cardShell} gap-6 p-8`}>
      <div className="flex items-start justify-between gap-3">
        <StarRow rating={row.rating} />
        <div className="flex items-center gap-2">
          {row.status === "pending" ? (
            <input
              type="checkbox"
              checked={bulkSelected}
              onChange={(e) => onBulkToggle(row.id, e.target.checked)}
              className="size-4 rounded border-outline-variant text-secondary focus:ring-secondary"
              aria-label={`Select testimonial from ${row.authorName}`}
            />
          ) : null}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
      </div>

      <blockquote
        className={`tf-quote text-on-surface ${quoteSizeClass}`}
      >
        <p className="whitespace-pre-wrap">{row.body}</p>
      </blockquote>

      <div className="flex items-center justify-between gap-3 border-t border-surface-container pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/35 text-xs font-bold text-on-secondary-container"
            aria-hidden
          >
            {initialsFromName(row.authorName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-on-surface">
              {row.authorName}
            </p>
            {row.authorTitle ? (
              <p className="truncate text-xs font-medium text-on-surface-variant">
                {row.authorTitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <p className="text-[10px] font-medium uppercase tracking-wider text-on-secondary-container">
        {row.campaignName}
      </p>
      <p className="text-[10px] text-on-surface-variant">{dateStr}</p>

      {row.status === "rejected" && row.moderationNote ? (
        <p className="text-xs text-on-surface-variant">
          Note: {row.moderationNote}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-left text-sm font-semibold text-secondary underline-offset-2 hover:underline"
      >
        Edit text
      </button>

      {row.status === "pending" ? (
        <div className="space-y-2 border-t border-outline-variant/10 pt-4">
          <label className="sr-only" htmlFor={`note-text-${row.id}`}>
            Rejection note (optional)
          </label>
          <textarea
            id={`note-text-${row.id}`}
            form={`reject-form-text-${row.id}`}
            name="moderationNote"
            rows={2}
            maxLength={2000}
            placeholder="Optional note (internal)"
            className="tf-input min-h-0 resize-none py-2 text-xs"
          />
          <div className="grid grid-cols-2 gap-3">
            <form action={approveTestimonialAction}>
              <input type="hidden" name="testimonialId" value={row.id} />
              <PendingButton
                refreshAfterSubmit
                pendingLabel="Approving…"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-secondary py-2.5 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-on-secondary"
              >
                Approve
              </PendingButton>
            </form>
            <form
              id={`reject-form-text-${row.id}`}
              action={rejectTestimonialAction}
            >
              <input type="hidden" name="testimonialId" value={row.id} />
              <PendingButton
                refreshAfterSubmit
                pendingLabel="Rejecting…"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-error py-2.5 text-sm font-semibold text-error transition hover:bg-error hover:text-on-error"
              >
                Reject
              </PendingButton>
            </form>
          </div>
        </div>
      ) : null}
    </article>
  );
}
