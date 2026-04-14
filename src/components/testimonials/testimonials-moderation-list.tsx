"use client";

import { useCallback, useMemo, useState } from "react";

import {
  bulkApproveTestimonialsAction,
  bulkRejectTestimonialsAction,
} from "@/server/testimonials-actions";

import { PendingButton } from "./pending-button";
import { TestimonialRow } from "./testimonial-row";
import type { TestimonialRowSerializable } from "./types";

type Props = {
  rows: TestimonialRowSerializable[];
};

export function TestimonialsModerationList({ rows }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const pendingIds = useMemo(
    () => rows.filter((r) => r.status === "pending").map((r) => r.id),
    [rows],
  );

  const pendingSet = useMemo(() => new Set(pendingIds), [pendingIds]);

  const effectiveSelected = useMemo(
    () => new Set([...selected].filter((id) => pendingSet.has(id))),
    [selected, pendingSet],
  );

  const onBulkToggle = useCallback((id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const selectAllPending = useCallback(() => {
    setSelected(new Set(pendingIds));
  }, [pendingIds]);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
  }, []);

  const selectedList = [...effectiveSelected];

  return (
    <div className="space-y-6">
      {pendingIds.length > 0 ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-5 tf-editorial-shadow md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="text-sm text-on-surface">
            <span className="font-semibold text-primary-container">
              {effectiveSelected.size}
            </span>{" "}
            selected
            <span className="text-on-surface-variant">
              {" "}
              · {pendingIds.length} pending in view
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={selectAllPending}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-2 text-xs font-semibold text-primary-container transition hover:bg-surface-container-high"
            >
              Select all pending
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container-low"
            >
              Clear
            </button>
            <form
              action={bulkApproveTestimonialsAction}
              className="inline-flex"
            >
              {selectedList.map((id) => (
                <input key={id} type="hidden" name="ids" value={id} />
              ))}
              <PendingButton
                refreshAfterSubmit
                pendingLabel="Approving…"
                disabled={effectiveSelected.size === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batch approve
              </PendingButton>
            </form>
            <form
              action={bulkRejectTestimonialsAction}
              className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]"
            >
              {selectedList.map((id) => (
                <input key={id} type="hidden" name="ids" value={id} />
              ))}
              <label className="sr-only" htmlFor="bulk-moderation-note">
                Optional note for all rejected (internal)
              </label>
              <textarea
                id="bulk-moderation-note"
                name="bulkModerationNote"
                rows={2}
                maxLength={2000}
                placeholder="Optional note for rejected…"
                className="tf-input min-h-0 resize-none rounded-xl py-2 text-xs"
              />
              <PendingButton
                refreshAfterSubmit
                pendingLabel="Rejecting…"
                disabled={effectiveSelected.size === 0}
                className="w-full rounded-xl border border-error bg-surface-container-lowest px-4 py-2.5 text-sm font-semibold text-error transition hover:bg-error hover:text-on-error disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batch reject
              </PendingButton>
            </form>
          </div>
        </div>
      ) : null}

      <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
        {rows.map((row) => (
          <div
            key={`${row.id}-${row.updatedAt}`}
            className="mb-6 break-inside-avoid"
          >
            <TestimonialRow
              row={row}
              bulkSelected={effectiveSelected.has(row.id)}
              onBulkToggle={onBulkToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
